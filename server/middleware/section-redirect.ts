// Normalizes trailing slashes and redirects section URLs that lack an
// index.md to the first child page.
// Example: /frontend/api-reference/entities -> /frontend/api-reference/entities/product
import { queryCollection } from '@nuxt/content/server';

const SKIP_PREFIXES = ['/_', '/api/', '/raw/', '/__'];

const hasTrailingSlash = (s: string) => s.length > 1 && s.endsWith('/');
const withoutTrailingSlash = (s: string) => (hasTrailingSlash(s) ? s.slice(0, -1) : s);

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') return;

  const url = getRequestURL(event);
  const rawPath = url.pathname;
  if (rawPath === '/' || /\.[a-z0-9]+$/i.test(rawPath)) return;
  if (SKIP_PREFIXES.some((p) => rawPath.startsWith(p))) return;

  const path = withoutTrailingSlash(rawPath);

  const exact = await queryCollection(event, 'docs').path(path).first();
  if (exact) {
    if (hasTrailingSlash(rawPath)) {
      return sendRedirect(event, path + url.search, 301);
    }
    return;
  }

  const firstChild = await queryCollection(event, 'docs')
    .where('path', 'LIKE', `${path}/%`)
    .order('stem', 'ASC')
    .limit(1)
    .first();

  if (!firstChild) return;

  return sendRedirect(event, firstChild.path, 302);
});
