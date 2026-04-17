const FONT_REPLACEMENTS: Record<string, string> = {
  Cascadia: 'monospace',
  Virgil: 'cursive',
  Helvetica: 'sans-serif',
  Nunito: 'sans-serif',
};

/** Remove @font-face blocks and replace Excalidraw fonts with CSS generic families. */
export function stripEmbeddedFonts(svg: string): string {
  svg = svg.replace(/@font-face\s*\{[^}]*\}/g, '');
  svg = svg.replace(/<style[^>]*>\s*<\/style>/g, '');
  for (const [name, generic] of Object.entries(FONT_REPLACEMENTS)) {
    svg = svg.replaceAll(name, generic);
  }
  svg = svg.replace(/(\b(?:monospace|cursive|sans-serif)\b)(?:,\s*\1)+/g, '$1');
  return svg;
}
