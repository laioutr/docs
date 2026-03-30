type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

/**
 * Walk the minimark AST and apply twoslash cut directives to code blocks,
 * matching what shiki/twoslash does at render time:
 *
 * - `// ---cut---` / `// ---cut-before---`  — remove everything before (inclusive)
 * - `// ---cut-after---`                    — remove everything after (inclusive)
 * - `// ---cut-start---` / `// ---cut-end---` — remove the enclosed region (inclusive)
 *
 * Also strips the `twoslash` keyword from meta so the output reads as a
 * normal fenced code block.
 */
export function stripTwoslashCuts(body: { value: MinimarkNode[] }): void {
  walk(body.value);
}

function applyCuts(code: string): string {
  const lines = code.split('\n');
  const keep: boolean[] = new Array(lines.length).fill(true);

  let cutStartIndex: number | null = null;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].replace(/^\s+/, '');

    // ---cut--- or ---cut-before---: remove everything up to and including this line
    if (/^\/\/\s?---cut(-before)?---\s*$/.test(trimmed)) {
      for (let j = 0; j <= i; j++) keep[j] = false;
      continue;
    }

    // ---cut-after---: remove this line and everything after it
    if (/^\/\/\s?---cut-after---\s*$/.test(trimmed)) {
      for (let j = i; j < lines.length; j++) keep[j] = false;
      break;
    }

    // ---cut-start---: mark the beginning of a cut region
    if (/^\/\/\s?---cut-start---\s*$/.test(trimmed)) {
      cutStartIndex = i;
      continue;
    }

    // ---cut-end---: close the region opened by cut-start
    if (/^\/\/\s?---cut-end---\s*$/.test(trimmed)) {
      if (cutStartIndex !== null) {
        for (let j = cutStartIndex; j <= i; j++) keep[j] = false;
        cutStartIndex = null;
      }
      continue;
    }
  }

  return lines.filter((_, i) => keep[i]).join('\n');
}

function walk(nodes: MinimarkNode[]): void {
  for (const node of nodes) {
    if (typeof node === 'string') continue;

    const [tag, attrs] = node;

    if (tag === 'pre' && typeof attrs.meta === 'string' && attrs.meta.includes('twoslash')) {
      const code = typeof attrs.code === 'string' ? attrs.code : '';
      attrs.code = applyCuts(code);
      attrs.meta = attrs.meta.replace(/\s*twoslash\s*/, ' ').trim() || undefined;
    }

    // Recurse into children
    for (let i = 2; i < node.length; i++) {
      if (Array.isArray(node[i])) {
        walk([node[i]]);
      }
    }
  }
}
