# Since-Version Component for New Features

When asked to document a **new feature, mechanic, or capability**, ask the user whether they want to add a `::since-version` component to the page so readers can see when it became available.

Ask before finishing the doc work — don't silently add or omit it. If the user says yes (or already told you the version), place it near the top of the relevant section.

## Component

The component lives at `app/components/content/SinceVersion.vue` and is used as MDC:

```md
::since-version{version="0.30.0" packages="@laioutr-core/frontend-core" changelog="frontend"}
::
```

Props:

- `version` (required) — the release the feature shipped in (with or without a leading `v`).
- `packages` (required) — comma-separated list of packages the feature lives in, e.g. `"@laioutr-core/frontend-core, @laioutr-core/orchestr"`.
- `changelog` (optional) — links the version to the matching changelog page anchor. One of: `frontend`, `cockpit`, `ui`, `cli`, `orchestr`, `figma-kit`. (Devtools folds into `orchestr` since the `@laioutr-core/orchestr-devtools` → `@laioutr-core/devtools` rename; there is no separate `orchestr-devtools` value.)

## Why

Readers need to know whether a documented feature exists in the version they're running. Surfacing the introducing version (and linking it to the changelog) saves them from discovering at runtime that a mechanic isn't available yet.

## Notes

- Only relevant for genuinely new features. Don't prompt for it when editing existing prose, fixing typos, or restructuring already-documented behavior.
- If the user doesn't know the version, check the relevant package `CHANGELOG.md` in the linked source directory before asking again.
