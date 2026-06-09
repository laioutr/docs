type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

const VALID_CHANGELOGS = new Set(['frontend', 'cockpit', 'core-types', 'canonical-types', 'kit', 'ui', 'ui-kit', 'ui-app', 'cli', 'orchestr', 'orchestr-devtools', 'figma-kit']);

/**
 * Render a `::since-version` MDC node as plain markdown suitable for the
 * LLM-consumable raw-markdown route.
 *
 * Output shape (single paragraph):
 *
 *   **Since v0.30.0** in `@laioutr-core/frontend-core`.
 *
 * With `changelog`, the version becomes a link:
 *
 *   **Since [v0.30.0](/getting-started/changelogs/frontend-changelog#_0300)** in `@laioutr-core/frontend-core`.
 *
 * Single-package case omits the list. Missing version returns null so the
 * transformer drops the node rather than emit nonsense. An unknown changelog
 * short-name falls back to no-link rather than emitting a broken URL.
 */
export function renderSinceVersion(props: Record<string, unknown>): MinimarkNode[] | null {
  const version = typeof props.version === 'string' ? props.version.trim() : '';
  const packagesProp = typeof props.packages === 'string' ? props.packages : '';
  const changelogProp = typeof props.changelog === 'string' ? props.changelog.trim() : '';

  if (!version) return null;

  const cleanVersion = version.replace(/^v/, '');
  const displayVersion = `v${cleanVersion}`;
  const versionAnchor = `_${cleanVersion.replace(/\./g, '')}`;

  const versionNode: MinimarkNode =
    changelogProp && VALID_CHANGELOGS.has(changelogProp)
      ? ['a', { href: `/getting-started/changelogs/${changelogProp}-changelog#${versionAnchor}` }, displayVersion]
      : displayVersion;

  const packageList = packagesProp
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  const inlineNodes: MinimarkNode[] = [['strong', {}, 'Since ', versionNode]];

  if (packageList.length > 0) {
    inlineNodes.push(' in ');
    packageList.forEach((pkg, index) => {
      if (index > 0) inlineNodes.push(index === packageList.length - 1 ? ' and ' : ', ');
      inlineNodes.push(['code', {}, pkg]);
    });
  }

  inlineNodes.push('.');

  return [['p', {}, ...inlineNodes]];
}
