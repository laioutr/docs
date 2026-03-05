/**
 * Converts a JSON Schema description (which may contain JSDoc patterns) into inline HTML.
 *
 * Handles:
 * - {@link https://url | Display Text} → <a> link
 * - {@link https://url} → <a> link
 * - {@link TypeName} → <code> (non-URL references)
 * - `code` → <code>
 * - [text](url) → <a> link
 */
export function renderDescription(text: string): string {
  if (!text) return '';

  // Escape HTML entities in raw text
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // {@link target | label} or {@link target}
  html = html.replace(/\{@link\s+([^}|]+?)(?:\s*\|\s*([^}]+?))?\s*\}/g, (_, target: string, label?: string) => {
    const t = target.trim();
    if (/^https?:\/\//.test(t)) {
      const linkText = label?.trim() || t;
      return `<a href="${t}" target="_blank" rel="noopener" class="text-primary underline underline-offset-2 hover:text-primary/80">${linkText}</a>`;
    }
    return `<code class="rounded-sm bg-elevated text-toned px-1.5 py-0.5">${label?.trim() || t}</code>`;
  });

  // `inline code`
  html = html.replace(/`([^`]+)`/g, '<code class="rounded-sm bg-elevated text-toned px-1.5 py-0.5">$1</code>');

  // [text](url) markdown links
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener" class="text-primary underline underline-offset-2 hover:text-primary/80">$1</a>'
  );

  return html;
}
