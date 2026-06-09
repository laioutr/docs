/**
 * Changelog types and presentation helpers for `ApiChangelog.vue`.
 *
 * The data lives in `content/changelog.yml` as a map keyed by API identifier
 * (component / composable / helper / action name), each holding an array of
 * entries authored newest-first. These helpers are auto-imported (app/utils).
 */

export type ChangelogEntryType = 'added' | 'changed' | 'fixed' | 'removed' | 'deprecated';

export interface ChangelogEntry {
  /** e.g. `2.3.0`. Required. Deep-links to the central changelog when `changelog` is set. */
  version: string;
  /** Markdown. Required. */
  note: string;
  /** Keep-a-Changelog change type → colored badge. */
  type?: ChangelogEntryType;
  /** Marks a breaking change → "Breaking" badge. */
  breaking?: boolean;
  /** Markdown migration guidance (Before/After blocks, prose). */
  migration?: string;
  /** Central changelog short-name (`ui`, `frontend`, …) → deep-links the version. */
  changelog?: string;
}

/** One resolved entry, tagged with the key it came from. */
export interface ResolvedChangelogEntry extends ChangelogEntry {
  key: string;
}

/** The known central changelog short-names with a page under /getting-started/changelogs/. */
export const VALID_CHANGELOGS = new Set(['frontend', 'cockpit', 'core-types', 'canonical-types', 'kit', 'ui', 'ui-kit', 'ui-app', 'cli', 'orchestr', 'orchestr-devtools', 'figma-kit']);

/** Compare two semver-ish strings descending (newest first). Non-numeric segments sort last. */
export function compareVersionsDesc(a: string, b: string): number {
  const pa = a.replace(/^v/, '').split('.').map((n) => parseInt(n, 10));
  const pb = b.replace(/^v/, '').split('.').map((n) => parseInt(n, 10));
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = Number.isNaN(pa[i] ?? NaN) ? -1 : pa[i] ?? 0;
    const nb = Number.isNaN(pb[i] ?? NaN) ? -1 : pb[i] ?? 0;
    if (na !== nb) return nb - na;
  }
  return 0;
}

/** Build the `#_{anchor}` fragment used by the changelog pages (e.g. `2.3.0` → `_230`). */
export function changelogAnchor(version: string): string {
  return `_${version.replace(/^v/, '').replace(/\./g, '')}`;
}

/** Resolve the deep-link href for an entry, or null when no/unknown changelog is set. */
export function changelogHref(entry: ChangelogEntry): string | null {
  if (!entry.changelog || !VALID_CHANGELOGS.has(entry.changelog)) return null;
  return `/getting-started/changelogs/${entry.changelog}-changelog#${changelogAnchor(entry.version)}`;
}

/**
 * Pull the entries for the given keys out of the raw changelog document
 * (the `{ [key]: ChangelogEntry[] }` map), flatten, tag with their key, and
 * sort newest-version-first across all keys.
 */
export function resolveChangelogEntries(
  data: Record<string, unknown> | null | undefined,
  keys: string[],
): ResolvedChangelogEntry[] {
  if (!data) return [];
  const resolved: ResolvedChangelogEntry[] = [];
  for (const key of keys) {
    const entries = data[key];
    if (!Array.isArray(entries)) continue;
    for (const entry of entries as ChangelogEntry[]) {
      if (entry?.version && entry?.note) resolved.push({ ...entry, key });
    }
  }
  return resolved.sort((a, b) => compareVersionsDesc(a.version, b.version));
}
