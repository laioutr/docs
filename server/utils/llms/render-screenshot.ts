type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

/**
 * Render a `::screenshot` MDC node as a plain markdown image for the
 * LLM-consumable raw-markdown route.
 *
 * Output shape:
 *
 *   ![<alt>](<src>)
 *
 * With a caption, an italic line is appended:
 *
 *   ![<alt>](<src>)
 *   _<caption>_
 *
 * A missing `src` returns null so the transformer drops the node rather than
 * emit a broken image.
 */
export function renderScreenshot(props: Record<string, unknown>): MinimarkNode[] | null {
  const src = typeof props.src === 'string' ? props.src.trim() : '';
  if (!src) return null;

  const alt = typeof props.alt === 'string' ? props.alt.trim() : '';
  const caption = typeof props.caption === 'string' ? props.caption.trim() : '';

  const nodes: MinimarkNode[] = [['p', {}, ['img', { src, alt }]]];

  if (caption) {
    nodes.push(['p', {}, ['em', {}, caption]]);
  }

  return nodes;
}
