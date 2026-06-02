import { queryCollection } from '@nuxt/content/server';
import { stringifyYAML } from 'confbox';
import type { Collections } from '@nuxt/content';
import type { H3Event } from 'h3';

type MinimarkNode = [string, Record<string, unknown>, ...any[]] | string;

// The whole `{ [key]: ChangelogEntry[] }` map lives in one data document.
// Memoize it: the LLM document hook fires once per page during generation.
let cached: Record<string, unknown> | null | undefined;

export async function getChangelogData(event: H3Event): Promise<Record<string, unknown> | null> {
  if (cached !== undefined) return cached ?? null;
  const doc = await queryCollection(event, 'changelog' as keyof Collections).first();
  // Undeclared top-level YAML keys land under `meta` (the collection schema is open).
  cached = (doc as { meta?: Record<string, unknown> } | null)?.meta ?? null;
  return cached;
}

/**
 * Append a `## Changelog` section to the minimark body as a fenced YAML block
 * holding the raw entries for the page's `changelogKeys`. Used by both the
 * `llms-full.txt` document hook and the `/raw/*.md` route, mirroring
 * `injectPlaygroundSection`. The YAML is the source data verbatim — an LLM
 * reads the markdown inside `note` / `migration` natively.
 */
export function injectChangelogSection(
  body: { value: MinimarkNode[] },
  changelogKeys: unknown,
  data: Record<string, unknown> | null,
): void {
  if (!data || !Array.isArray(changelogKeys) || !changelogKeys.length) return;

  const picked: Record<string, unknown> = {};
  for (const key of changelogKeys) {
    if (typeof key === 'string' && Array.isArray(data[key])) picked[key] = data[key];
  }
  if (!Object.keys(picked).length) return;

  const code = stringifyYAML(picked).trimEnd();

  body.value.push(
    ['h2', { id: 'changelog' }, 'Changelog'],
    ['pre', { language: 'yaml', code }, ['code', {}, code]],
  );
}
