---
description: "Scaffolds documentation for genuinely-new APIs introduced by the latest changelog sync, as a pull request. Loads the docs-api-page-scaffold skill. Opens a PR — never pushes to the default branch."
argument-hint: "[base-rev]"
---

# /docs-api-scaffold

Ad-hoc trigger for the daily docs API-page scaffold. Identical to the scheduled run.
Runs **after** the changelog sync has updated the product changelog pages, reads what that
sync just added, and opens a PR scaffolding doc pages for the new APIs.

## Trigger

`/docs-api-scaffold` — or `/docs-api-scaffold <base-rev>` to diff against a specific revision
instead of auto-detecting the sync commit.

## Workflow

1. **Load the skill** `docs-api-page-scaffold` and follow it exactly. It owns all judgment
   (net-new vs change-to-existing, recency guard, home resolution, fidelity) and delegates
   writing to `technical-writing*` and `changelog.yml` to `populating-changelog-yml`.
2. **Find the change set.** `git -C "$DOCS" pull` first. Then, unless a `<base-rev>` arg was
   given, locate the most recent changelog-sync commit:
   ```bash
   SYNC=$(git -C "$DOCS" log -1 --format=%H --grep '^update changelogs:')
   BASE="${1:-$SYNC^}"
   git -C "$DOCS" diff "$BASE..$SYNC" -- content/0.getting-started/5.Changelogs/{frontend,ui,orchestr,cli}-changelog.md
   ```
   No sync commit (empty diff) → emit "nothing to scaffold" and stop. No branch, no PR.
3. **Per the skill**, classify the added `### Added` bullets, drop everything ≤ the per-product
   pre-run high-water-mark, scaffold the net-new APIs with a confident home, append grouped
   stubs, add their `changelog.yml` entries + `changelogKeys`, and collect the flagged
   candidates and suggested `::since-version` markers.
4. **Open a PR** on branch `docs/api-scaffold-$(date +%Y-%m-%d)` (`gh pr create`). PR body =
   the two sections from the skill (Scaffolded / Candidates needing human placement). **Never
   push to the default branch** — these are drafts for human review.
5. **Exit report**: branch + PR URL, count scaffolded, count flagged, or the "nothing to
   scaffold" note.

## Idempotency & safety nets

- Re-running on the same sync commit is safe: the skill's existence check skips any API that
  already has a page / `changelog.yml` key, so no duplicate pages or PRs of empty diffs.
- Merge conflict on `git pull` → abort, Slack-note Marcel, do not open a PR.
- Empty change set or only changes-to-existing APIs → no PR; report the flagged items.

## When NOT this command

- Updating the product changelog text itself → `/changelog-sync` (the upstream sync).
- Adding `changelog.yml` entries for already-documented APIs → `populating-changelog-yml`.
