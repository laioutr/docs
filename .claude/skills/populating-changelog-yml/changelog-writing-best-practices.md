# Changelog Writing Best-Practices (Research Reference)

Distilled from canonical standards and good docs-changelog implementations.
These are the rules that change how a `content/changelog.yml` entry is written.
Each rule cites its source.

## Curate — never dump

- **Write for humans, not machines.** An entry describes the noteworthy
  difference for a reader, not a commit subject or diff line.
  — https://keepachangelog.com/en/1.1.0/
- **Never copy git/changeset output verbatim.** Changeset-generated
  `CHANGELOG.md` is per-package, hash-prefixed (`- 7bb97dd: …`), and full of
  `Updated dependencies [hash]` blocks — exactly the "commit-log dump" the
  standard warns against. Strip the 7-char hash, drop dependency-bump and
  version-bump-only lines, and de-duplicate the same changeset across packages.
  — https://keepachangelog.com/en/1.1.0/ and
  https://raw.githubusercontent.com/changesets/changesets/main/packages/changelog-git/src/index.ts
- **If a change has no public-API impact, leave it out.** Exclude internal
  refactors, dev-only deps, code-style, doc formatting. **But include refactors
  with observable side effects** (e.g. a notable performance or behavior change).
  — https://workos.com/blog/what-makes-a-good-changelog and https://common-changelog.org/
- **Be complete on the high-signal stuff.** Never omit breaking changes,
  removals, or deprecations — a changelog that hides some changes "can be as
  dangerous as not having a changelog." — https://keepachangelog.com/en/1.1.0/

## Say what actually happened (the helpfulness test)

The single most important rule, and the easiest to fail. Before writing a note,
ask: **"In the plainest terms, what is the one thing a reader of *this page*
needs to know?"** Then lead with that — don't dress it up.

- **Name the change for what it is.** A rename is a rename. A removal is a
  removal. A new prop is a new prop. If you can't say the change-type in three
  words, you don't understand it yet. The reader scanning a component's history
  wants to know *"does this affect me, and what do I do"* — answer that first.
- **Don't re-describe the component.** The reader is already on the component's
  doc page; they know what it does. A changelog note that explains *what the
  component is* (instead of *what changed*) is noise.
- **Cut "generic", "powerful", "flexible", "robust"** and similar filler — they
  describe nothing a reader can act on.

> ❌ "Replaces `BrandList` with the generic `AlphabeticalIndex` — an A–Z grouped
>    link list with a configurable `heading` and an optional per-item `count`,
>    usable for brands, glossaries, and similar indexes."
>    *(A complicated way of saying it was renamed. Re-describes the component.)*
>
> ✅ "Renamed from `BrandList` and generalized beyond brands: pass any `items`
>    and a `heading` instead of `brands`."
>    *(Leads with the fact that matters; the "what to do" lives in `migration`.)*

## Phrasing each `note`

- **Benefit-first / public-API-first, not commit-first.** Say what the reader
  can now do or must now account for, not what the team did internally. Bad:
  "Refactored caption handling." Good: "`BannerBasic` captions now expose the
  full `CaptionFlag` styling surface (variant, colour scheme, text-shadow)."
  — https://workos.com/blog/what-makes-a-good-changelog
- **Self-describing — don't lean on the `type` badge for meaning.** The note
  must read correctly when quoted alone (it is, in `llms-full.txt` and `/raw`).
  That same out-of-context rendering means any link must be an absolute internal
  path, not a bare `#anchor` — see "Link out, don't duplicate the page" below.
  — https://common-changelog.org/
- **One to two sentences. Link out for depth.** Migration detail goes in
  `migration`; deep rationale links to a guide — don't inline a wall of prose.
  — https://common-changelog.org/ and https://tailwindcss.com/blog
- **Plain language, active voice, no marketing.** Drop jargon, filler, and
  adjectives. Strip internal package names (`@laioutr-app/ui`) from reader-facing
  notes — name the component, not the package it ships from.
  — https://workos.com/blog/what-makes-a-good-changelog

## Link out, don't duplicate the page

The entry renders at the *bottom* of the page whose API it documents, with the
full explanation right above it. So the note states *what changed and in which
version*, then points to the page's existing prose for the mechanics. Two
failure modes, both observed in practice:

- **Duplication.** A note can be correctly change-focused yet still reproduce a
  section the page already contains. If you're re-explaining *how the feature
  works* — its rules, caveats, or example — stop: state the change in one line
  and link to the section instead. (Distinct from "don't re-describe the
  component": that's about restating *what it is*; this is about restating *how
  the change works* in the page's own words.)

  > ❌ "Field and fieldset definitions accept an optional `if` expression that
  >    hides the control in the Studio sidebar when it evaluates falsy. The
  >    stored value is kept and still passed to your component at render time —
  >    only the sidebar control is hidden."
  >    *(Re-states the page's "Conditional visibility" section almost verbatim.)*
  >
  > ✅ "Field and fieldset definitions gained an optional `if` expression that
  >    hides a control in the Studio sidebar — see
  >    [Conditional visibility](/apps/app-development/schema-fields#conditional-visibility)."

- **Bare anchors break off-page.** The entry is *also* emitted as raw YAML into
  `llms-full.txt`, the `/raw/<path>.md` route, and the central-changelog deep
  link — none of which share the documenting page's anchor space. A `#fragment`
  resolves only on the page itself. **Always link with an absolute internal
  path** (`/section/page#anchor`, matching the page's `sitemap.loc`), never a
  bare `#anchor`.

  > ❌ `[audio](#mediaaudio)` — resolves only on the media page itself
  > ✅ `[audio](/frontend/api-reference/common-types/media#mediaaudio)`

The one fact behind both rules: entries render **out of context**. That is never
a reason to inline the page's prose — it's the reason to link to it, absolutely.

## `type` mapping (classify by the change)

Use exactly one category per entry; split mixed changes into multiple entries.
Decide the category from **what the entry describes**, not from the changeset
`### Major/Minor/Patch Changes` heading. — https://keepachangelog.com/en/1.1.0/

| `type`       | The change is…                            |
| ------------ | ----------------------------------------- |
| `added`      | a new feature / prop / component / export |
| `changed`    | a change to existing behavior or a signature |
| `fixed`      | a genuine bug fix (incorrect behavior)    |
| `deprecated` | still works, slated for removal           |
| `removed`    | gone                                      |

- A breaking change must spell out what broke and the migration path.
- **Deprecation is a two-step contract:** ship it deprecated-but-working first,
  name the replacement, remove later. — https://semver.org/

### The bump heading lies — especially on `0.x`

The changeset bump (Major/Minor/Patch) only loosely tracks the change's nature,
and under [SemVer §4](https://semver.org/#spec-item-4) a `0.x` package makes no
stability promise at all. By changesets convention, `0.x` packages
(frontend-core, orchestr, core-types, kit, …) routinely ship:

- **features under `### Patch Changes`** — classify as `added`, not `fixed`.
  (e.g. frontend-core `0.30.1` "Add `laioutr:beforeModuleRegister` Nuxt hook".)
- **breaking changes under `### Minor Changes`** — the minor bump *is* the
  breaking signal, frequently with **no `**Breaking:**` marker**. Read the prose:
  removed/renamed/retyped export, changed required signature, or "consumers must
  update" → `breaking: true` + a `migration`.

For stable (`1.0.0`+) packages, trust the explicit `**Breaking:**` marker; for
`0.x`, trust the bump level plus the description.

## Breaking changes & `migration`

- **Always pair a breaking change with before/after code**, not a prose
  explanation. Show the old call and the new call.
  — https://doc.holiday/blog/how-to-document-breaking-api-changes-without-breaking-trust
- **Tell the reader the exact action to take** (imperative): rename the prop,
  wrap in `<Sizer>`, re-author in Studio.
  — https://doc.holiday/blog/how-to-document-breaking-api-changes-without-breaking-trust
- **Flag silent data loss / silent behavior changes explicitly.** "Stored values
  under `captionStyle` silently drop on next save" is the load-bearing sentence —
  it belongs in `migration`, not buried in `note`.
  — https://doc.holiday/blog/how-to-document-breaking-api-changes-without-breaking-trust
- **Name the replacement** for anything deprecated or removed ("use `items`
  instead of `brands`"). — https://zuplo.com/learning-center/deprecating-rest-apis
- **Distinguish "deprecated (still works)" from "removed."**
  — https://zuplo.com/learning-center/deprecating-rest-apis

## Structure & ordering (already handled by the component)

- Entries authored newest-first; `resolveChangelogEntries` re-sorts by version
  descending at render, so cross-key ordering is automatic.
- Within a version, breaking changes are the highest-signal — lead with them.
  — https://common-changelog.org/
- Component libraries group change history **by component**, with version + a
  breaking-severity marker per entry — which is exactly the keyed-by-API shape of
  `changelog.yml`. — https://design.gitlab.com/get-started/uik-release-notes/
  and https://docs.stripe.com/changelog (Title / Affected Products / Breaking? / Category)

## Sources

- Keep a Changelog 1.1.0 — https://keepachangelog.com/en/1.1.0/
- Common Changelog — https://common-changelog.org/
- Semantic Versioning — https://semver.org/
- Changesets generator — https://raw.githubusercontent.com/changesets/changesets/main/packages/changelog-git/src/index.ts
- WorkOS, "What makes a good changelog" — https://workos.com/blog/what-makes-a-good-changelog
- doc.holiday, documenting breaking API changes — https://doc.holiday/blog/how-to-document-breaking-api-changes-without-breaking-trust
- Zuplo, deprecating REST APIs — https://zuplo.com/learning-center/deprecating-rest-apis
- Flutter breaking changes — https://docs.flutter.dev/release/breaking-changes
- Google developer style, timeless documentation — https://developers.google.com/style/timeless-documentation
- Stripe changelog — https://docs.stripe.com/changelog
- Tailwind blog — https://tailwindcss.com/blog
- GitLab Pajamas release notes — https://design.gitlab.com/get-started/uik-release-notes/
