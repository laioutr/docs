---
name: populating-changelog-yml
description: Use when adding or editing entries in the Laioutr docs content/changelog.yml from upstream package CHANGELOG.md files, or when a UI/frontend/orchestr release needs its per-component change history surfaced at the bottom of a doc page.
---

# Populating content/changelog.yml

## Overview

`content/changelog.yml` feeds the `<ApiChangelog>` block at the bottom of a doc
page. It is **keyed by public API identifier** (component / composable / helper /
action name) and **curated for the reader of that API** — it is NOT a mechanical
copy of the changeset-generated `packages/*/CHANGELOG.md`.

**Core principle:** one upstream changeset fans out into entries on the
documented APIs it touches, each rewritten to say — in the plainest accurate
terms — what changed for someone using that API.

## The one test that matters

Before writing any note, ask: **"In the plainest terms, what does a reader of
*this page* need to know — and does this entry actually help them?"**

A rename is a rename. A removal is a removal. If the entry re-describes what the
component *is*, or dresses a simple change in "generic / powerful / flexible"
prose, delete and rewrite it. See `changelog-writing-best-practices.md` for the
full sourced rules (style, type mapping, breaking/migration). Read it before
writing entries.

## Data model (quick reference)

Key = the documenting page's `playground.name` (its `changelogKeys` identifier).

| field       | required | notes |
| ----------- | -------- | ----- |
| `version`   | yes      | **Must match an existing `## [x.y.z]` anchor in the central changelog page** (see step 3). Deep-links to `#_<version>`. |
| `note`      | yes      | markdown; reader-facing; plain. |
| `type`      | no       | `added` / `changed` / `fixed` / `removed` / `deprecated` — from the change itself, see "Classify by the change". |
| `breaking`  | no       | `true` when the change *is* breaking, see "Classify by the change". |
| `migration` | no       | markdown; breaking changes only; before/after + exact action. |
| `changelog` | no       | central short-name in `VALID_CHANGELOGS` (`ui`, `frontend`, `orchestr`, …). |

## Workflow

1. **Read the source.** Open the relevant `packages/*/CHANGELOG.md` for the
   release. **De-duplicate across packages by changeset hash** (the same hash,
   e.g. `7bb97dd`, appears in ui / ui-kit / ui-app). **Drop** `Updated
   dependencies …` lines, version-bump-only sections, and the 7-char hash prefix.

2. **Choose the central changelog short-name.** Package scope collapses: ui /
   ui-kit / ui-app → `ui`. Confirm it is in `VALID_CHANGELOGS` (`app/utils/changelog.ts`).

3. **Pick `version` against the central changelog page, NOT the package.** The
   docs changelog (`content/0.getting-started/5.Changelogs/<name>-changelog.md`)
   is curated independently and its versions can differ from the package version
   (e.g. packages are at `2.2.1` while the page already documents `2.3.0`). The
   `version` you write must resolve to an existing `## [x.y.z]` section on that
   page — otherwise the deep-link 404s. **If that section doesn't exist yet, add
   it to the central changelog page first** (Keep-a-Changelog format).

4. **Map each change to a documenting page.** For each notable PUBLIC API change,
   find the doc page whose `playground.name` is the API. **No doc page → no
   entry** — it would never render. Removed components have no page; their removal
   lives only in the central changelog.

5. **Fan out.** One changeset touching N documented APIs → N keyed entries. One
   change type per entry; split mixed changes.

6. **Classify `type` / `breaking` from the change, not the bump heading** (see
   the dedicated section below — this is the easiest thing to get wrong for `0.x`
   packages).

7. **Write the entry.** Apply the helpfulness test and the best-practices file.
   `migration` only for breaking changes, with a before/after block and the exact
   action ("rename `brands` → `items`"). Put silent-data-loss warnings in
   `migration`.

8. **Wire the page.** Add the key to that page's frontmatter:
   `changelogKeys: [TheIdentifier]`. Without this the entry never appears.

9. **Verify** (see below).

## Classify by the change, not the bump type

Changeset `CHANGELOG.md` files group entries under `### Major Changes` /
`### Minor Changes` / `### Patch Changes`. **Never derive `type` or `breaking`
from that heading.** The heading is the SemVer *bump*, which only matches the
change's nature for stable (`1.0.0`+) packages — and even then loosely. Read what
the entry actually describes: a new prop/component is `added`; a behavior change
is `changed`; a genuine bug fix is `fixed`; a deletion is `removed`; a
still-works-but-going-away is `deprecated`.

**`0.x` packages decouple bump from semantics entirely.** Under
[SemVer §4](https://semver.org/#spec-item-4), `0.x` makes no stability promise,
so by changesets convention a `0.x` package puts:

- **features under `### Patch Changes`** — e.g. frontend-core `0.30.1` ships
  "Add `laioutr:beforeModuleRegister` Nuxt hook" as a *patch*. That entry is
  `type: added`, NOT `fixed`.
- **breaking changes under `### Minor Changes`** — a `0.x` minor bump is the
  breaking signal, and these packages (frontend-core, orchestr, kit) often carry
  **no `**Breaking:**` marker at all**.

So for `0.x` packages (frontend-core, orchestr, core-types, kit, …): treat a
`### Minor Changes` entry as a candidate breaking change and read it to decide —
does it remove/rename/retype a public export, change a required signature, or
demand consumer action? Then set `breaking: true` and write a `migration`, even
with no explicit marker. Don't wait for `**Breaking:**`; for stable packages
trust the marker, for `0.x` trust the bump + the prose.

## Worked example

The `BrandList` → `AlphabeticalIndex` rename, done well:

```yaml
AlphabeticalIndex:
  - version: 2.3.0
    type: changed
    breaking: true
    changelog: ui
    note: Renamed from `BrandList` and generalized beyond brands — pass any `items` and a `heading` instead of `brands`.
    migration: |
      Import `AlphabeticalIndex`, rename the `brands` prop to `items`, and pass
      `heading` explicitly — the old built-in `"Brands"` label no longer renders.

      ```vue
      <!-- Before -->
      <BrandList :brands="brands" />
      <!-- After -->
      <AlphabeticalIndex :items="brands" heading="Brands" />
      ```
```

`note` leads with the fact (it was renamed); it does NOT re-describe what an A–Z
index is — the reader is already on that page.

## Common mistakes

| Mistake | Fix |
| ------- | --- |
| Re-describing the component instead of the change ("the generic A–Z link list…") | Lead with the plain change: renamed / removed / added prop. |
| Typing by bump heading — a "Patch Changes" feature → `fixed`, or missing a `0.x` "Minor Changes" breaking change | Classify from the change itself; for `0.x`, treat minor as a breaking candidate even with no `**Breaking:**` marker. |
| Using the **package** version as `version` | Match an existing anchor in the central changelog page; add the section there first if missing. |
| Adding an entry under a key that didn't actually change (a cross-reference) | Only log real changes to *that* API. No invented "informational" entries. |
| Adding an entry for an API with no doc page (or a removed component) | Skip it — it can never render. |
| Copying `Updated dependencies` / hash-prefixed / dependency-bump lines | Drop them. |
| Forgetting `changelogKeys` on the page | The entry is invisible until the key is wired into frontmatter. |
| Cramming multiple change types into one note | Split into one entry per type. |
| `migration` on a non-breaking change, or a breaking change with no before/after | Migration = breaking only, always with before/after + exact action. |
| Re-explaining how the change works, duplicating a section the page already has | State the change in one line; link to the section for the mechanics. "Renders standalone" means link correctly, not inline the prose. |
| Linking with a bare `#anchor` | Entries render off-page (`llms-full.txt`, `/raw`, central changelog) — use an absolute `/path#anchor` matching the page's `sitemap.loc`. |

## Verify

- Every key resolves to a page with a matching `playground.name` and that page
  lists the key in `changelogKeys`.
- Every `version` + `changelog` pair resolves to a real `## [x.y.z]` section on
  the central changelog page (anchor `#_<digits>`).
- YAML parses (`yq '.' content/changelog.yml`).
- No bare-fragment links: `grep -n '](#' content/changelog.yml` returns nothing —
  every link is an absolute `/path#anchor`.
- Re-read each note against the helpfulness test: would this help the reader, or
  is it a complicated way of saying something simple? If it re-explains what the
  page already documents, cut it to one line + a link.
