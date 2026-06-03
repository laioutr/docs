// Generates Nuxt `routeRules` that 301-redirect each page's `aliases` (its old
// URLs) to its canonical path (`sitemap.loc`). These are resolved at build time
// so the redirects are emitted into the platform/edge config and handled there,
// instead of by a per-request Nitro function.
//
// This replaces the runtime `server/middleware/aliases-redirect.ts`, which ran
// two content-DB queries on every non-prerendered request and returned an
// uncacheable 301 — old indexed URLs missing the static layer kept Vercel Fluid
// instances provisioned around the clock.
import { readFileSync } from 'node:fs';
import { sync as globSync } from 'fast-glob';
import { parse as parseYaml } from 'yaml';

export type RedirectRule = { redirect: { to: string; statusCode: number } };

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * Pure transform: given markdown file contents, build the alias → canonical
 * 301 route rules. Kept IO-free so it can be unit tested.
 */
export function buildAliasRedirects(files: Array<{ id: string; raw: string }>): Record<string, RedirectRule> {
  const rules: Record<string, RedirectRule> = {};

  for (const { id, raw } of files) {
    const match = FRONTMATTER_RE.exec(raw);
    if (!match) continue;

    let fm: Record<string, any> | undefined;
    try {
      fm = parseYaml(match[1] ?? '');
    } catch {
      // Malformed frontmatter — skip rather than fail the whole build.
      continue;
    }

    const aliases = fm?.aliases;
    const to = fm?.sitemap?.loc;
    if (!Array.isArray(aliases) || aliases.length === 0 || typeof to !== 'string') continue;

    for (const alias of aliases) {
      if (typeof alias !== 'string' || !alias.startsWith('/')) continue;
      if (alias === to) continue;

      const existing: RedirectRule | undefined = rules[alias];
      if (existing && existing.redirect.to !== to) {
        console.warn(`[alias-redirects] alias "${alias}" claimed by multiple pages; keeping ${existing.redirect.to}, ignoring ${to} (${id})`);
        continue;
      }

      rules[alias] = { redirect: { to, statusCode: 301 } };
    }
  }

  return rules;
}

/**
 * Scans `contentDir` for markdown pages and returns the alias → canonical 301
 * `routeRules`. Call from `nuxt.config.ts` and spread into `routeRules`.
 */
export function aliasRouteRules(contentDir: string): Record<string, RedirectRule> {
  const paths = globSync('**/*.md', { cwd: contentDir, absolute: true });
  const files = paths.map((path) => ({ id: path, raw: readFileSync(path, 'utf8') }));
  return buildAliasRedirects(files);
}
