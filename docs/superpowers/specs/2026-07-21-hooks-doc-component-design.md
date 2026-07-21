# Hooks documentation component — design

**Date:** 2026-07-21
**Status:** Design approved, spec under review
**Target page:** `content/1.frontend/2.features/hooks.md`

## Problem

The Hooks page documents 20 runtime hooks across three surfaces (Frontend Core client, Orchestr client, Orchestr server) using six hand-maintained markdown tables plus prose. The format has three weaknesses:

1. **No structural consistency.** Each hook's payload, firing time, and semantics are described ad hoc — some in tables, some in prose, some only in a code comment.
2. **Semantics are implicit.** Whether a hook is a *filter* (runs after the default, `result.value` pre-seeded), an *override* (runs before, empty), a *lifecycle* phase, or a synchronous *modify* hook is buried in prose, not surfaced at a glance.
3. **Lifecycle relationships are invisible.** `fetch`, `mutation`, `client-env`, and the server `handler` hooks are one temporal chain crossing the client→server→client boundary, but the tables present them as four unrelated lists.

## Goal

Replace the tables with a structured, consistent component so every hook is documented the same way — token, surface, registration site, kind, payload, firing time, and example — and so lifecycle families read as ordered sequences. Interactive lifecycle flowcharts follow as an explicit second phase.

## Decisions (settled)

| # | Decision | Resolution |
|---|---|---|
| 1 | Granularity | **Both** — a `::hook-meta` atom (one hook, one card) and a `::hook-lifecycle` group (an ordered before/success/error/finally family). Non-lifecycle hooks use the atom. |
| 2 | Data source & LLM output | **Inline YAML** props on the page, made LLM-readable by an **allowlisted generic renderer** that YAML-dumps the props into `llms-full.txt`. No central data module, no bespoke per-component formatter. |
| 3 | Scope of pass 1 | Components + inline data + the generic llms renderer + rewrite of `hooks.md`. Lifecycle **flowcharts are phase 2**. |

### Why inline YAML + a generic renderer (decision 2 rationale)

A renderer is unavoidable. Verified empirically: an MDC component that is not in `KNOWN_COMPONENTS` is stringified for `llms-full.txt` by `minimark/stringify`, which collapses nested props to `[object Object]` — e.g. `payload="[object Object],[object Object]"`. The structured data is destroyed, violating the project's LLM-readable rule.

Given a renderer is required either way, the generic YAML-dump approach wins over a bespoke formatter or a central typed module:

- **Inline YAML** keeps each hook's data next to its prose; no separate module to keep in sync.
- **Generic renderer** is reusable for any future inline-data component; nothing bespoke to maintain.
- **Guaranteed readable** llms output as a fenced YAML block, symmetric with how the hook was authored.

**Guardrail (critical):** the generic renderer must be **allowlisted per component**, never a blanket fallback for all unknown components. ~350 slot-based container usages in `content/` (`::features` ×176, `::card-group`, `::tip`, `::note`, `::warning`, `::field-group`, `::tabs`, `::steps`, …) rely on pass-through so their slotted markdown survives to `llms-full.txt`. A blanket JSON/YAML dump would replace all that prose with a props dump and lose it. Only pure inline-data components opt in — `hook-meta`, `hook-lifecycle`, and `cockpit-mcp-workflow` (none has a meaningful default slot to lose).

## Architecture

Four units, each with a single responsibility:

### 1. `HookMeta.vue` — the atom (`::hook-meta`)

Renders one hook as a card: header (human title + token badge + kind/surface pills), payload table, optional `result.value` callout (filter/override only), "when it fires", related links, and an optional collapsed code example.

- **Location:** `app/components/HookMeta.vue` (alongside `ActionMeta.vue`, so it is globally available as MDC).
- **Card shell:** reuse `MetaCard` + `MetaCardSection`. `MetaCard` currently requires an `importLine`; hooks have no import (they register via `nuxtApp.hook(name, …)`). **Change:** make `MetaCard`'s `importLine` prop optional and skip the snippet when absent. Backward-compatible — the four existing consumers (ActionMeta, QueryMeta, EntityComponentMeta, PageTypeMeta) all pass it. Pills go in `MetaCard`'s existing `after-header` slot.
- **Payload table:** a small field/type/description table (not `JsonSchemaFields`, which expects a JSON-schema object; hook payloads are authored inline).
- **Example:** authored as a markdown code fence in the component's **default slot** so it gets Shiki highlighting in the browser (a prop string would not).

### 2. `HookLifecycle.vue` — the group (`::hook-lifecycle`)

Renders an ordered lifecycle family (before → success/error → finally) as a color-coded rail; each phase shows its token, firing time, and payload. In phase 2 it also embeds the round-trip Mermaid diagram behind a disclosure.

- **Location:** `app/components/HookLifecycle.vue`.
- Used for the three lifecycle families: fetch, mutation, server handler.

### 3. `render-inline-data.ts` — the general-purpose llms renderer

A single, component-agnostic helper, `renderInlineDataComponent(props, children, opts?)`, that emits:

- an optional `h3` from a per-component title key (`opts.titleKey`) where one exists — `name` for `hook-meta`, `family` for `hook-lifecycle`; omitted when there is no natural title (e.g. `cockpit-mcp-workflow`),
- a fenced `yaml` block of the props, via `stringifyYAML` from `confbox` (already a dependency — `inject-changelog.ts` uses it),
- passthrough of slotted `children` (so e.g. a `hook-meta` example code fence survives to `llms-full.txt`).

This is deliberately generic so any allowlisted inline-data component reuses it — nothing bespoke per component beyond the one-line `titleKey`.

- **Location:** `server/utils/llms/render-inline-data.ts`.

### 4. `transform-mdc.ts` wiring

- Add `'hook-meta'`, `'hook-lifecycle'`, and **`'cockpit-mcp-workflow'`** to `KNOWN_COMPONENTS`.
- Add cases in `resolveComponent` that delegate to `renderInlineDataComponent` (`hook-meta` → `titleKey: 'name'`, `hook-lifecycle` → `titleKey: 'family'`, `cockpit-mcp-workflow` → no title key).
- No change to the unknown-component pass-through path — the ~350 prose/slot components keep their current behavior.

#### Bonus: fixes a live `::cockpit-mcp-workflow` bug

`CockpitMcpWorkflow` is pure props (`prompt`, `steps[]`, `handoff`, `review`; no default slot) and is **not** currently in `KNOWN_COMPONENTS`, so its nested `steps` array garbles to `steps="[object Object],[object Object],…"` in `llms-full.txt` today — all four workflow examples on `content/8.Cockpit/1.Features/mcp.md` are effectively invisible to LLMs. Allowlisting it here routes it through the generic renderer, so the full YAML (prompt, steps, tools, review) lands in `llms-full.txt`. No slotted prose to lose, so the guardrail does not apply.

## Data model (inline YAML)

### `::hook-meta`

```yaml
name: orchestr:action:fetch:before   # hook token (required)
title: fetch · before                # human label (required)
surface: client                      # client | server
register: nuxt-plugin                # nuxt-plugin | nitro-plugin
kind: lifecycle                       # lifecycle | filter | override | modify
phase: before                         # before | success | error | finally (lifecycle only)
payload:
  - { field: token, type: string, description: Identifies the action, e.g. ecommerce/cart/add-items }
  - { field: input, type: ActionInput, description: The input passed to the action }
result:                               # filter | override only
  seed: pre-seeded                    # pre-seeded (filter) | empty (override)
  type: string
  description: Starts with the resolved URL or path; transform, replace, or leave it.
whenItFires: Immediately before the request is sent.
firedBy: [fetchAction, useFetchAction, useQueryAction, useMutationAction]
related:
  - { label: Fetch lifecycle, to: '#fetch-action-lifecycle' }
```

Plus an optional default slot holding the example code fence.

### `::hook-lifecycle`

```yaml
family: Fetch action lifecycle
description: Four hooks fire around every fetchAction request. finally always runs.
surface: client
register: nuxt-plugin
firedBy: [fetchAction, useFetchAction, useQueryAction, useMutationAction]
diagram: fetch                        # phase 2 — which round-trip diagram to embed
phases:
  - { phase: before,  name: 'orchestr:action:fetch:before',  when: Before the request is sent.,   payload: '{ token, input }' }
  - { phase: success, name: 'orchestr:action:fetch:success', when: After the action resolves.,      payload: '{ token, output }' }
  - { phase: error,   name: 'orchestr:action:fetch:error',   when: After the action rejects.,        payload: '{ token, error }' }
  - { phase: finally, name: 'orchestr:action:fetch:finally', when: Always, after success or error., payload: '{ token, output?, error?, input }' }
```

## Kind taxonomy (verified against source)

| Kind | Meaning | Hooks |
|---|---|---|
| **lifecycle** | before/success/error/finally notification; has `phase` | `fetch:*`, `mutation:*`, `handler:*` |
| **filter** | `result.value` pre-seeded with the default, runs *after*; handlers transform it and thread across plugins (`SyncWaterfallHook`) | `link-resolver:resolve`, `page-head:resolve` |
| **override** | `result.value` empty, runs *before* the default; first handler to set wins (`SyncBailHook`) | `link-resolver:switch-locale-path`, `link-resolver:switch-market-url`, `page-renderer:select-page-variant` |
| **modify** | synchronous; mutate the payload object directly, no result slot | `client-env:modify`, `query-params:parsed`, `navigate-query:build` |

## The 20 hooks

**Frontend Core — client, Nuxt plugin** (atoms; the three link-resolver hooks stay grouped by prose section):
- `frontend-core:link-resolver:resolve` — filter
- `frontend-core:link-resolver:switch-locale-path` — override
- `frontend-core:link-resolver:switch-market-url` — override
- `frontend-core:page-renderer:select-page-variant` — override
- `frontend-core:page-head:resolve` — filter

**Orchestr — client, Nuxt plugin:**
- `orchestr:action:fetch:{before,success,error,finally}` — lifecycle → `::hook-lifecycle`
- `orchestr:action:mutation:{before,success,error,finally}` — lifecycle → `::hook-lifecycle`
- `orchestr:client-env:modify` — modify (atom)
- `orchestr:query-params:parsed` — modify (atom)
- `orchestr:navigate-query:build` — modify (atom)

**Orchestr — server, Nitro plugin:**
- `orchestr:action:handler:{before,success,error,finally}` — lifecycle → `::hook-lifecycle`

## Page rewrite (`hooks.md`)

Replace the six tables with:
- `::hook-lifecycle` for the fetch, mutation, and handler families.
- `::hook-meta` atoms for the nine non-lifecycle hooks.
- Keep the existing intro prose, the filter-vs-override explanation, and the `::note` on `client-env:modify` synchrony.
- The mutation-action `context` note and Pinia Colada link stay as prose alongside the mutation group.

## Phasing

- **Phase 1 (this spec):** `HookMeta`, `HookLifecycle`, `render-hooks.ts`, `transform-mdc` wiring, optional `MetaCard.importLine`, and the `hooks.md` rewrite. Lifecycle groups render the phase rail but no diagram yet.
- **Phase 2:** the round-trip Mermaid diagram embedded in `::hook-lifecycle` (candidates already prototyped), driven by the `diagram` key.

## Testing

- **Component render:** the existing meta components have no unit tests, but `CockpitMcpWorkflow.test.ts` sets a precedent — add a light mount test for `HookMeta` covering each kind (lifecycle, filter, override, modify) and the presence/absence of the result callout.
- **LLM output:** unit-test `renderInlineDataComponent` — assert (a) `hook-meta` emits an `h3` with the token and a `yaml` `pre` node whose code contains the payload fields, and (b) `cockpit-mcp-workflow` emits a `yaml` block whose code contains the `steps` phases/tools (both guard against the `[object Object]` regression). Mirror the style of existing `server/utils/llms` code.
- **Manual:** `pnpm dev`, confirm the page renders; fetch the llms raw route for both `hooks` and `cockpit/features/mcp` and confirm the YAML blocks are present and complete.

## Non-goals (YAGNI)

- **No source reflection.** Extracting hook signatures from `globalExtensions.ts` is not worth it for 20 stable hooks; inline YAML is the source of truth.
- **No central data module.** Superseded by inline YAML (decision 2).
- **No generic blanket unknown-component renderer.** Explicitly rejected — allowlist only (guardrail above).
- **No changes to the hooks themselves** in `frontend-core`/`orchestr`. Docs only.

## Risks

- **`MetaCard` change** touches a shared component. Mitigation: making `importLine` optional is additive; verify the four existing consumers still render.
- **Inline YAML verbosity** on `hooks.md`. Accepted: in practice each hook appears in either a group or an atom, so there is little duplication, and the data lives where it is read.
- **`::hook-lifecycle` payload authored as strings** (`'{ token, input }'`) rather than structured rows, to keep the group compact. Accepted for the group; atoms carry the full structured `payload` table.
