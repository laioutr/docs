import { withLeadingSlash } from 'ufo';
import { stringify } from 'minimark/stringify';
import { queryCollection } from '@nuxt/content/server';
import type { Collections } from '@nuxt/content';
import { transformMdcBody } from '../../utils/llms/transform-mdc';
import { injectPlaygroundSection } from '../../utils/llms/inject-playground';

// Custom pre handler that fixes minimark bug: missing space between language and meta
// Without this, "```ts twoslash" becomes "```tstwoslash"
function pre(node: any, state: any) {
  const [_, attributes, ...children] = node;
  const language = attributes.language || '';
  const filename = attributes.filename ? ' [' + attributes.filename + ']' : '';
  const meta = attributes.meta ? ' ' + attributes.meta : '';
  const result = '```' + language + filename + meta + '\n' + String(node[1]?.code || children.join('')).trim() + '\n```';
  return result + state.context.blockSeparator;
}

export default eventHandler(async (event) => {
  const slug = getRouterParams(event).slug;
  if (!slug) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
  }

  const path = withLeadingSlash(slug.replace(/\.md$/, '')).replace(/\/index$/, '') || '/';

  const page = await queryCollection(event, 'docs' as keyof Collections).path(path).first();
  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
  }

  // Transform MDC component nodes before stringification
  await transformMdcBody(page.body);

  // Surface playground frontmatter (Storybook story) — it only renders client-side otherwise
  injectPlaygroundSection(page.body, (page as any).playground);

  // Add title and description to the top if missing
  if (page.body.value[0]?.[0] !== 'h1') {
    page.body.value.unshift(['blockquote', {}, page.description]);
    page.body.value.unshift(['h1', {}, page.title]);
  }

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8');
  return stringify({ ...page.body, type: 'minimark' }, { format: 'markdown/html', handlers: { pre } });
});
