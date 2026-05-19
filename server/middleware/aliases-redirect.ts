// Resolves the `aliases: ['/old/path', ...]` frontmatter field. When a request
// comes in for a path that no page owns directly but is listed as an alias of
// another page, 301-redirect to the canonical path.
//
// Runs before `section-redirect.ts` (alphabetical order). Both middlewares
// no-op when the path resolves directly, so the duplicate `exact` lookup is
// cheap enough.
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

  // If the path resolves directly, leave it alone.
  const exact = await queryCollection(event, 'docs').path(path).first();
  if (exact) return;

  // Look up any page that lists `path` in its aliases. Arrays are stored as
  // JSON text, so a string-quoted LIKE match is sufficient. We don't escape
  // `%`/`_` because alias paths shouldn't contain them; if one slips in, the
  // worst case is a too-loose match across pages.
  const aliased = await queryCollection(event, 'docs')
    .where('aliases', 'LIKE', `%"${path}"%`)
    .first();

  if (aliased?.path) {
    return sendRedirect(event, aliased.path + url.search, 301);
  }
});
