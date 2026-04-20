// Redirects section URLs that lack an index.md to the first child page.
// Example: /frontend/api-reference/entities -> /frontend/api-reference/entities/product
import { queryCollection } from '@nuxt/content/server';

const SKIP_PREFIXES = ['/_', '/api/', '/raw/', '/__'];

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') return;

  const path = getRequestURL(event).pathname;
  if (path === '/' || /\.[a-z0-9]+$/i.test(path)) return;
  if (SKIP_PREFIXES.some((p) => path.startsWith(p))) return;

  const exact = await queryCollection(event, 'docs').path(path).first();
  if (exact) return;

  const firstChild = await queryCollection(event, 'docs')
    .where('path', 'LIKE', `${path}/%`)
    .order('stem', 'ASC')
    .limit(1)
    .first();

  if (!firstChild) return;

  return sendRedirect(event, firstChild.path, 302);
});
