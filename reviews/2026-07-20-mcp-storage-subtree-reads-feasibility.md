# Feasibility: sub-tree reads for the Studio MCP read tools

Status: investigation only, no code changed.
Scope: `apps/cockpit` in the `laioutr` monorepo (path prefix below is relative to that repo unless stated otherwise).

## 1. Question

The Studio MCP server's read tools — `getPageTree`, `getSection`, `listPages`, `getProp`, `loadGlobalSections` — each call `StorageProjectRepository.readProject()`, which fetches and deserializes the **entire** project's Liveblocks Storage document on every call, with no caching (`apps/cockpit/src/lib/liveblocks/storage/StorageProjectRepository.ts:52-60`, `:82-89`). For one project with a very large Storage doc, this takes a p50 of ~19s and often times out near the route's 60s `maxDuration` (`apps/cockpit/src/app/api/mcp/[transport]/route.ts:26`). An agent tree-walk (hundreds of `studio_get_section` calls) turns into hundreds of independent full-doc fetches, which is the amplifier behind the failure storm.

Can the read tools fetch only the sub-tree they need — one page variant, one section, one prop path — instead of the whole document each time?

## 2. Liveblocks API findings

Installed version: `@liveblocks/node@3.19.0` (`node_modules/.pnpm/@liveblocks+node@3.19.0.../node_modules/@liveblocks/node/dist/index.d.ts`).

### 2.1 `getStorageDocument` — no subset/path parameter

```ts
// dist/index.d.ts:723-725
getStorageDocument(roomId: string, format: "plain-lson", options?: RequestOptions): Promise<PlainLsonObject>;
getStorageDocument(roomId: string): Promise<PlainLsonObject>;
getStorageDocument(roomId: string, format: "json", options?: RequestOptions): Promise<ToJson<S>>;
```

The only two format options are `"plain-lson"` (default — includes `{ liveblocksType, data }` framing for every `LiveObject`/`LiveList`/`LiveMap` node) and `"json"` (flattened plain JSON, what this codebase uses). Neither overload accepts a path, a node id, a depth limit, or a streaming option. Per Context7 (`/liveblocks/liveblocks`, source `docs/pages/api-reference/liveblocks-node.mdx`): *"Returns the contents of a room's Storage tree… This is a wrapper around the [Get Storage Document API](.../rest-api-endpoints#get-rooms-roomId-storage) and returns the same response."* The underlying REST endpoint (`GET /v2/rooms/{roomId}/storage`) is the same full-document-only contract — `getStorageDocument` is a thin wrapper, not a client-side filter.

### 2.2 No sibling "get one node" REST endpoint

Searched Context7's indexed Liveblocks REST/webhooks/guides corpus for any GET-by-path or GET-by-node-id storage endpoint. None exists. The only **path-scoped** Storage endpoint in the whole API surface is a **write**:

```bash
# Storage JSON Patch endpoint (PATCH only — RFC 6902 / JSON Pointer paths)
curl -X PATCH "https://api.liveblocks.io/v2/rooms/my-room-id/storage/json-patch" \
  -H "Authorization: Bearer {{SECRET_KEY}}" \
  -d '[{ "op": "replace", "path": "/formData/email", "value": "verified@example.com" }]'
```

Its own docs page states the architectural reason there's no cheap partial path: *"Applying a patch requires the server to reconstruct the full Storage state for the room, which can be resource-intensive for large documents… the JSON Patch endpoint may not be ideal for very large or frequently changing data."* (Context7, `guides/pages/modifying-storage-via-rest-api-with-json-patch.mdx`.) Liveblocks Storage is a CRDT: even a targeted mutation needs the full document state server-side to resolve conflicts. There is no indication a targeted **read** would be architecturally cheaper — if anything the reconstruction cost the write endpoint calls out is evidence the server has no lazy/partial materialization of a room's Storage.

### 2.3 `mutateStorage` — a write API, not a lighter read path

```ts
await liveblocks.mutateStorage(roomId, async ({ root }) => { root.get('list').push('item3'); });
```

`root` is a live `LiveObject` proxy — `.get('pages').get(pageId)…` reads through it without materializing plain JSON, which looks superficially like a subtree read. This is already the write mechanism the codebase uses for **all** server-side mutations (`ProjectStorageMutator.run()`, `apps/cockpit/src/lib/project-state/business/ProjectStorageMutator.ts:91-100`, wraps every MCP mutation per `apps/cockpit/.claude/rules/mcp-server.md` §Mutations: *"Every server-side write goes through `ProjectStorageMutator`."*). But it is a **write** API: it opens a session against the room, is documented and used exclusively for mutation, and nothing in the Liveblocks docs claims it lazily loads only the accessed subtree — it is the standard CRDT client-connect model (the same model as `mutateStorage`'s sibling, the JSON Patch endpoint, which explicitly reconstructs the full state). Repurposing a write API as a read path would also route reads through the write/session-connect code path unnecessarily, and offers no documented cost advantage. Not a viable lever.

### 2.4 `getYjsDocument` — not applicable to this project

```ts
// dist/index.d.ts:751-755
getYjsDocument(roomId: string, params?: { format?: boolean; key?: string; type?: string }, ...): Promise<JsonObject>;
```

This **does** support a `key` param for a partial read (`doc.get(key).toJSON()`), but it operates on a room's **Yjs** document. Per `apps/cockpit/.claude/CLAUDE.md`: *"Liveblocks Storage (the native `LiveObject`/`LiveList`/`LiveMap` conflict-free tree) is the CRDT layer… Migrated from Yjs + `valtio-yjs`."* This project no longer stores `RcProject` in a Yjs doc — it's on native Storage. `getYjsDocument` is irrelevant here (confirmed also by `readStorageProject` reading via `getStorageDocument`, not `getYjsDocument`).

### 2.5 Conclusion for §2

**Sub-tree reads are not supported by the Liveblocks Node SDK or REST API for native Storage.** Every read of a room's Storage document — via `getStorageDocument`, and implicitly via any client/`mutateStorage` connection — pulls the entire document. There is no path, node-id, or depth-limited GET; the only path-scoped endpoint that exists at all is a write, and its own docs disclaim cheap partial handling. This closes off the sub-tree-read path entirely, independent of effort — it isn't a "hard but possible" option, it's not exposed by the API.

## 3. Storage tree shape (for context — path *would* have been addressable)

Worth noting since it shapes the caching design below: if a partial-read API existed, the tree is fully path-addressable by stable id, so "just fetch section X" would have been a clean JSON-Pointer path, not a design problem.

`readStorageProject` (`StorageProjectRepository.ts:52-60`) unwraps the room's root `LiveObject` — today the root directly **is** the `RcProject` shape (the `root.projectStore ?? root` unwrap is a legacy-shape fallback, per the function's docstring). `RcProject` (`packages/core-types/src/rc/RcProject.ts:14-38`):

```ts
interface RcProject {
  laioutr: { projectSecretKey; projectSlug?; environmentName? };
  config?: RcCoreConfig;
  pages: RcDictionary<RcPage>;               // keyed by page id
  globalSections: RcDictionary<RcGlobalSection>; // keyed by global section id
  apps: RcApp[];
  languages: RcDictionary<RcLanguage>;
  markets: RcDictionary<RcMarket>;
  redirects: RcRedirect[];
}
```

`RcDictionary<T> = { [id: string]: T }` (`packages/core-types/src/rc/RcDictionary.ts:7`) — a plain object keyed by the entity's own id (stored as a `LiveObject` with dynamic keys, not a `LiveList`). Descending:

- `RcPage.variants: RcDictionary<RcPageVariant>` (`RcPage.ts:17`) — page variant by id.
- `RcPageVariant.sections: Record<'header'|'body'|'footer', RcDictionary<RcPageAnySection>>` (consumed in `getPageTree.ts:96`, `getSection.ts:87-89`) — section by id, scoped to a location.
- `RcSection.slots?: Record<string, RcDictionary<RcBlock>>` (`RcSection.ts:16`) — block by id, scoped to a slot name.
- `RcProject.globalSections[id]` — global sections live at the project root, independent of any page (`RcSection.ts:44-56`).

So a stable path **would** look like `pages.<pageId>.variants.<variantId>.sections.body.<sectionId>` or `globalSections.<globalSectionId>.slots.<slotName>.<blockId>` — exactly the JSON-Pointer shape the (write-only) JSON Patch endpoint uses. All 5 read tools already walk this tree linearly in-process after the full fetch (`getSection.ts:80-101` `findSection`, `getProp.ts:111-181` `findSectionWithProps`/`findBlockById`, `getPageTree.ts:115-124` `findVariant`) — this walk is cheap (in-memory object traversal); the cost is 100% in the network fetch + deserialize of the whole doc, not in locating the node afterward. `scripts/storage-treemap.ts:118-129` confirms the same full-doc-only fetch pattern server-tooling already uses for size profiling, and its comments call out real "LSON framing overhead" on top of content bytes — the raw document is measurably bigger than its JSON content, compounding the fetch cost.

## 4. Options, ranked

### Option A — Sub-tree reads via a different Liveblocks API
**Not available.** See §2.5. Rejected outright, not a spectrum-of-effort choice.

### Option B — Short-TTL cross-request cache of the parsed doc, keyed by roomId (recommended)

**Feasibility: high — this is an already-proven pattern in this exact codebase**, not a new architecture:

- `FrontendContextCache` (`apps/cockpit/src/lib/studio-schema/FrontendContextCache.ts`) — `@singleton()` + `lru-cache`, 15 min TTL, 200 entries, keyed by `${projectId}:${envName}`, with a `peekStale()` fallback for outage resilience.
- `McpProjectScopeCache` (`apps/cockpit/src/lib/mcp/business/McpProjectScopeCache.ts`) — same pattern, 30s TTL, keyed by `${userId}:${projectId}`.
- The prior MCP performance pass (`docs/plans/2026-06-19-cockpit-mcp-improvements-design.md:134-141`) solved the *exact same shape of problem* one layer over: `FrontendContextLoader.reflect` (a network round trip dominating p95) got a process-level LRU with a **fast/cached read path** (`reflectFast`, 2s timeout, serves stale on failure) split from a **strict/uncached path** (`reflectStrict`, 10s, no fallback) reserved for mutations. That design explicitly reuses `EventBus` domain events (`deployment.created`, `hosting.updated`) for invalidation.

Proposed shape, mirroring that precedent exactly: add a `readProjectFast(...)` alongside the existing `readProject` (used today by the 5 read tools with no caching) and `readProjectStrict` (used by deploy, retried, no cache — correctness there is non-negotiable, see §4's hazards). Cache entry keyed by `roomId` (`RoomIdEncoder.stringifyProjectRoomId`), value = the parsed+`stripNullsDeep`'d `RcProject`. This is a code change to one file (`StorageProjectRepository.ts`) plus updating the 5 read tools' `deps.storage.readProject` call to the new cached method — small, contained blast radius.

**Correctness hazards (the reason this must be an explicit design decision, not a drop-in):**

1. **Studio's human edits bypass the server entirely.** Per `apps/cockpit/.claude/CLAUDE.md`: *"the studio no longer mirrors config into Supabase — on edit it writes Storage (the bound valtio proxy)."* Human collaborators in the browser write **directly** to Liveblocks Storage over their own WebSocket connection — never through `ProjectStorageMutator`. That means a server-side cache **cannot** be invalidated by hooking the one write chokepoint the mcp-server rules describe (`mcp-server.md` §Mutations: *"Every server-side write goes through `ProjectStorageMutator`"* — true for **MCP-originated** writes only, not client-originated ones). A cache invalidated only on MCP writes would still serve stale data against concurrent human edits for up to the TTL.
2. **Liveblocks does offer a `storageUpdated` webhook** that fires on *any* write to the room regardless of origin (`StorageUpdatedEvent`, Context7 `docs/pages/platform/webhooks.mdx`: `{ type: 'storageUpdated', data: { roomId, projectId, updatedAt } }`), which would close hazard #1 — but it is **throttled to once every 60 seconds** ("Storage can update up to 60 times per second, and frequent webhook calls would be impractical" — Context7). So even with webhook-driven invalidation, staleness up to ~60s vs. the live document is structurally unavoidable, not an implementation gap. No Liveblocks webhook route exists in cockpit today (`src/app/api/webhook/` has `vercel`, `stripe`, `hosting/[deploymentId]` — no `liveblocks`); wiring one is net-new infra (register in the Liveblocks dashboard/API, add a route, verify with `WebhookHandler`, dispatch to the cache).
3. **`stripNullsDeep` mutates in place** (`StorageProjectRepository.ts:27-40`, docstring: *"Mutates in place… this avoids copying a multi-MB config"*) — deliberately, because today's caller owns a freshly-deserialized, unshared object. A cache **must** store the post-strip result and treat it as immutable/shared thereafter (readers must not further mutate it), or callers sharing one cached object could corrupt each other's view. This is a one-line discipline change but must be called out — it's exactly the kind of bug a "just cache the return value" patch would introduce silently.
4. **Vercel Lambda instance lifetime bounds the in-memory-LRU hit rate.** `lru-cache` is process-scoped; it only helps repeat requests landing on the **same warm Lambda instance**. The incident's access pattern (an agent doing a sequential tree-walk over one MCP session) plausibly hits the same warm instance repeatedly for a burst of near-immediate calls — this is the same assumption `McpProjectScopeCache`'s 30s TTL already relies on for `McpProjectScope.resolve()`. But it is not guaranteed: Vercel can spin up additional concurrent instances under scaling, and any idle gap kills warmth. For a **guaranteed** cross-instance hit, the codebase already has `@upstash/redis` in production use for exactly this kind of shared cache (`IdempotencyCache`, `apps/cockpit/src/lib/shared/idempotency/IdempotencyCache.ts:8-38` — HTTP REST API, no connection-pool issues on serverless, graceful no-op when unconfigured). Redis is the natural upgrade path if LRU hit rate proves insufficient in practice, but it adds a new open question: Upstash's per-value payload ceiling (varies by plan) needs to be checked against this project's actual Storage doc size before committing to it — the doc big enough to cause a 19s p50 fetch may be multiple MB, and `scripts/storage-treemap.ts`'s LSON-framing-overhead note suggests the raw payload is larger than its JSON content. Start with in-memory LRU (zero new infra, matches existing precedent); only reach for Redis if measurement shows cross-instance misses dominate.

**Effort:** small-to-medium. One new cache class (near-identical to `FrontendContextCache`), one new method on `StorageProjectRepository`, 5 one-line call-site swaps, plus (if pursuing hazard #2's mitigation) a new webhook route — that piece is the bulk of the effort. A TTL-only version (no webhook) is a half-day change; TTL + webhook invalidation is more like the `FrontendContextLoader` wave, a small multi-day design+impl slice.

**Recommendation on TTL:** short — 10-20s, not 15 minutes like `FrontendContextCache`. The read tools' correctness expectation is "recent," not "cacheable for a session"; a human could be actively co-editing. A short TTL bounds staleness to roughly the same order as the webhook throttle without depending on the webhook being wired up at all, and is cheap to reason about (`McpProjectScopeCache`'s 30s TTL is the closest existing precedent for a similarly staleness-sensitive value).

### Option C — Request-scoped memoization (one read reused within a single MCP tool call)

**Confirmed: this does not help the described incident, and is close to a non-option as currently scoped.** `McpProjectScope.resolve()` already does exactly this — a `WeakMap<RequestContext, Map<string, ResolvedMcpProjectScope>>` (`apps/cockpit/src/lib/mcp/business/McpProjectScope.ts:45`, `:53-67`) reused across calls **within** one Lambda invocation — but each MCP tool call (`getPageTree`, `getSection`, …) is dispatched as its own independent HTTP POST / Lambda invocation (`route.ts` — `dynamic = 'force-dynamic'`, stateless transport per the design doc's "All ship inside the existing stateless transport"). An agent's tree-walk of hundreds of `studio_get_section` calls is hundreds of separate requests, not one request making hundreds of internal reads. Request-scoped memoization can only amortize repeat reads **inside** one invocation — and every one of the 5 read tools calls `storage.readProject`/`readStorageProject` exactly once (verified: `getPageTree.ts:73`, `getSection.ts:51`, `getProp.ts:63`, `listPages.ts:51`, `loadGlobalSections.ts:72` — each a single call, no loop). There is nothing to memoize within a call today.

The only way this option gains relevance is a **different tool design**: a batched read tool (e.g., "get N sections in one call") that internally loops and would benefit from memoizing the one Storage fetch across that loop. That's a legitimate complementary lever (fewer round trips of any latency amortizes better than more round trips of any latency), but it's an API-surface redesign question or the `mcp-add-tool` skill's territory, not a fix to the existing 5 tools, and out of scope for "make the existing reads cheaper."

**Effort:** N/A for the current tool set (nothing to build). Would only become relevant alongside a batched-read tool proposal.

## 5. Recommendation

1. **Sub-tree reads are not an option** — Liveblocks' Node SDK and REST API expose `getStorageDocument` as full-document-only (`plain-lson` or `json`), with no path/node/depth parameter anywhere in the surface, and the one path-scoped endpoint that exists (JSON Patch) is write-only and explicitly reconstructs full state server-side. Stop evaluating this path; it isn't blocked by effort, it's blocked by the vendor API.
2. **Adopt Option B — a short-TTL (~10-20s), in-memory, process-scoped LRU cache of the parsed `RcProject`, keyed by `roomId`.** This directly mirrors two patterns already shipped in this codebase (`FrontendContextCache`, `McpProjectScopeCache`) and the prior MCP-performance wave's `reflectFast`/`reflectStrict` split (`docs/plans/2026-06-19-cockpit-mcp-improvements-design.md:136`) — same shape, same team precedent, low architectural risk. Concretely: add `StorageProjectRepository.readProjectFast()` (cached) for the 5 read tools; **do not** touch `readProjectStrict()` (deploy path — correctness there is non-negotiable, keep it uncached/retried as-is).
3. **Do not treat this as fully solving staleness** — document explicitly (in the code, mirroring `McpProjectScopeCache`'s own docstring candor about its staleness bound) that cached reads can lag concurrent human Studio edits by up to the TTL, since Studio's client writes bypass the server and thus any server-side invalidation hook entirely. If/when staleness in practice proves unacceptable, the next increment is Liveblocks' `storageUpdated` webhook (60s-throttled — bounds staleness, doesn't eliminate it) wired to evict the cache entry; that is strictly more infra (a new webhook route) and should be a follow-up, not bundled into the first cut.
4. **Watch Lambda-instance cross-request hit rate after shipping.** The in-memory LRU only helps when Vercel reuses a warm instance across an agent's sequential tool calls — plausible for this access pattern but not guaranteed. If telemetry shows low hit rates from instance churn, the upgrade path is Upstash Redis (`@upstash/redis` is already a production dependency via `IdempotencyCache`), gated on confirming the cached payload fits Upstash's per-value size limit for this project's (large) Storage document — verify before committing, don't assume.
5. **Request-scoped memoization (Option C) is not useful for the current 5 tools** — none of them reads Storage more than once per call. It only becomes relevant if a future batched-read tool is added; treat that as a separate proposal, not part of this fix.
