# API Changelog Component — Design

**Date:** 2026-06-02
**Status:** Validated, ready for implementation
**Driving case:** `BrandList` → `AlphabeticalIndex` rename in Laioutr UI 2.3.0

## Problem

Component/API doc pages have no way to surface what changed in a given release.
The repo already has a central `ui-changelog.md` (Keep-a-Changelog) and a
`SinceVersion` component that links *into* it, but nothing shows the
per-component change history at the bottom of a component's own page.

We want a changelog block, rendered at the bottom of a doc page, fed from a
single structured data file that is keyed by API identifier — reusable for Vue
components, composables, helpers, actions, etc. (not Vue-specific).

## Decisions

- **Data source:** one global structured file, keyed by API identifier.
- **Page linkage:** a `changelogKeys` frontmatter array on the page; the theme
  auto-renders the block at the bottom. Keys stay in frontmatter (not the body).
- **Entry shape:** `version` and `note` required; everything else optional;
  `note` and `migration` are markdown.
- **LLM output:** expose the raw entries as a fenced YAML block in `/raw/*.md`
  and `llms-full.txt` — no prose conversion, zero fidelity loss.

## Section 1 — Data file & schema

A single Nuxt Content **data collection** named `changelog`, sourced from
`content/changelog.yml`, keyed by API identifier. Modelling it as a Content
collection (rather than a loose import) gives zod validation *and* makes it
queryable from both the page component and the server-side LLM utils with no
extra plumbing.

```yaml
# content/changelog.yml
AlphabeticalIndex:
  - version: 2.3.0
    type: changed
    breaking: true
    changelog: ui
    note: Replaces `BrandList` with the generic `AlphabeticalIndex` — an A–Z grouped link list with a configurable `heading` and optional per-item `count`.
    migration: |
      Import from the new component, rename `brands` → `items`, pass `heading` explicitly.
  - version: 2.2.0
    type: added
    note: Optional per-item **count pills** via `items[].count`.
```

Per-entry schema:

| field       | required | notes                                                              |
| ----------- | -------- | ------------------------------------------------------------------ |
| `version`   | yes      | e.g. `2.3.0`; links to the central changelog anchor when `changelog` set |
| `note`      | yes      | markdown, rendered via `<MDC>`                                     |
| `type`      | no       | `added` / `changed` / `fixed` / `removed` / `deprecated` → badge   |
| `breaking`  | no       | boolean → "Breaking" badge                                         |
| `migration` | no       | markdown (Before/After blocks, prose) → distinct callout          |
| `changelog` | no       | central changelog name (`ui`, `frontend`, …) → deep-links version |

Entries authored newest-first; rendered newest-first. **Multiple entries per
version per key are allowed** — one upstream changeset routinely fans out to
many components and mixes change types, so authors split rather than cram.

### Mapping verification (against real changesets/CHANGELOGs)

- Maps cleanly: `version` (CHANGELOG groups by it), `breaking` (`**Breaking:**`
  inline marker), `changelog: ui` (the docs UI changelog merges `ui` / `ui-kit`
  / `ui-app`, so package scope collapses to one name).
- Adjusted: `migration` is **markdown**, not a constrained `diff` string — real
  migrations are labelled Before/After blocks with prose, sometimes several.
- `type` stays a single optional value per entry; mixed/fan-out changes are
  modelled as multiple entries, not a multi-type field.

## Section 2 — Component & page injection

**Component:** `app/components/content/ApiChangelog.vue`, props `keys: string[]`.
Queries the `changelog` collection, merges entries for those keys, sorts
semver-descending (each tagged with its source key), renders:

- **Header row:** `version` (deep-linked to
  `/getting-started/changelogs/{changelog}-changelog#_{anchor}` when `changelog`
  set — same anchor scheme as `SinceVersion`), a colored `type` badge
  (Added=green, Changed=blue, Fixed=amber, Removed=red, Deprecated=neutral), and
  a red **Breaking** badge when `breaking`.
- **Note:** `<MDC :value="entry.note" :cache-key="…" />` (pattern from
  `JsonSchemaPropTable.vue:107`).
- **Migration:** when present, a bordered "Migration" callout with
  `<MDC :value="entry.migration" />`.

The component renders its own heading as `<ProseH2 id="changelog">Changelog</ProseH2>`
so it matches native heading styling and the scrollspy can track it.

**Page injection** — in `app/pages/[[lang]]/[...slug].vue`, right after
`<ContentRenderer>` (≈ line 153), before the edit-link `<USeparator>`:

```vue
<ApiChangelog v-if="changelogKeys.length" :keys="changelogKeys" />
```

with `const changelogKeys = computed(() => page.value?.changelogKeys ?? [])`.
It renders inside `UPageBody`, so it sits at the bottom for both the normal and
the playground-hero layouts.

**Schema:** add `changelogKeys: z.array(z.string()).optional()` to the `docs`
collection schema in `content.config.ts`.

### Programmatic TOC entry

Both TOC render paths read the same array, `page.body.toc.links` (the inline
`tocLinks` computed for playground pages, and `DocsAsideRight` via `:page`). So
append one entry, idempotently:

```ts
watchEffect(() => {
  const toc = page.value?.body?.toc;
  if (!toc || !changelogKeys.value.length) return;
  if (toc.links.at(-1)?.id === 'changelog') return; // guard re-runs
  toc.links.push({ id: 'changelog', text: 'Changelog', depth: 2 });
});
```

Link shape `{ id, text, depth }` (depth 2 = `h2`) matches real headings. The
matching DOM `id="changelog"` on the `ProseH2` makes the scrollspy highlight
correctly.

## Section 3 — Raw YAML in the LLM outputs

Both LLM outputs operate on the same minimark `body` and both already call
`injectPlaygroundSection`: the `content:llms:generate:document` hook in
`server/plugins/llms.ts` (→ `llms-full.txt`) and `server/routes/raw/[...slug].ts`
(→ `/raw/*.md`).

A new shared util `server/utils/llms/inject-changelog.ts`, wired into both
spots, filters the changelog data to the page's `changelogKeys`, serializes that
subset with `confbox`'s `stringifyYAML`, and appends a fenced `yaml` code block
as a minimark `pre` node — the exact shape the route's custom `pre` handler
renders:

```ts
['pre', { language: 'yaml', code }, ['code', {}, code]]
```

Result in both outputs:

````markdown
## Changelog

```yaml
AlphabeticalIndex:
  - version: 2.3.0
    type: changed
    breaking: true
    changelog: ui
    note: Replaces `BrandList` …
    migration: |
      Import from the new component …
```
````

No `parseMarkdown`, no badge-to-text mapping — the source data verbatim. Markdown
inside `note`/`migration` rides along as YAML block scalars, which LLMs read
natively. Satisfies the project's LLM-readable rule (frontmatter-injected content
becomes real markdown, not invisible MDC syntax).

Data plumbing: the util fetches entries server-side via
`queryCollection(event, 'changelog')`, memoized in module scope.

**Three render targets, one data file:** HTML (`ApiChangelog.vue`, rich
badges + MDC), `llms-full.txt`, and `/raw` (both the YAML block).

## Section 4 — Applying to the 2.3.0 rename

The file move (`brand-list.md` → `alphabetical-index.md`) and its
`aliases: [/laioutr-ui/cms/brand-list]` are already landed (content-move-aliases
rule satisfied; old URL 301s). Remaining work is purely additive:

1. **Create `content/changelog.yml`** with the `AlphabeticalIndex` 2.3.0 entry
   (from the `warm-rivers-dance` changeset — see Section 1 example).
2. **Add `changelogKeys: [AlphabeticalIndex]`** to `alphabetical-index.md`
   frontmatter.
3. **Companion:** add a `## [2.3.0]` → Changed section to the central
   `ui-changelog.md` (its top is currently `2.2.2`) so the entry's
   `changelog: ui` deep-link to `#_230` resolves.

## Files touched

- `content/changelog.yml` — new data file
- `content.config.ts` — `changelog` data collection + `changelogKeys` on `docs`
- `app/components/content/ApiChangelog.vue` — new component
- `app/pages/[[lang]]/[...slug].vue` — render + TOC injection
- `server/utils/llms/inject-changelog.ts` — new shared util
- `server/plugins/llms.ts` — wire util into the document hook
- `server/routes/raw/[...slug].ts` — wire util into the raw route
- `content/3.laioutr-ui/cms/alphabetical-index.md` — `changelogKeys` frontmatter
- `content/0.getting-started/5.Changelogs/ui-changelog.md` — `## [2.3.0]` entry

## Open items to verify during implementation

- `stringifyYAML` from `confbox` resolves at server build time (it's in the dep
  tree; confirm import path).
- The `changelog` data collection is queryable from the generate hook context
  (the docs collection already is, via the same `queryCollection(event, …)`).
