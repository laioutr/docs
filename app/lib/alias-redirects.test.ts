import { describe, expect, it } from 'vitest';
import { buildAliasRedirects } from './alias-redirects';

const page = (fm: string) => `---\n${fm}\n---\n\nbody\n`;

describe('buildAliasRedirects', () => {
  it('maps each alias to the page canonical path (sitemap.loc) as a 301', () => {
    const rules = buildAliasRedirects([
      {
        id: 'input-radio.md',
        raw: page(['sitemap:', '  loc: /laioutr-ui/ui-kit/form/input-radio', 'aliases:', '  - /laioutr-ui/ui-kit/form/radioselect'].join('\n')),
      },
    ]);

    expect(rules).toEqual({
      '/laioutr-ui/ui-kit/form/radioselect': { redirect: { to: '/laioutr-ui/ui-kit/form/input-radio', statusCode: 301 } },
    });
  });

  it('handles multiple aliases on one page', () => {
    const rules = buildAliasRedirects([
      {
        id: 'link-tile.md',
        raw: page(
          [
            'sitemap:',
            '  loc: /laioutr-ui/ui-kit/content/link-tile',
            'aliases:',
            '  - /laioutr-ui/ui-kit/content/linktilebasic',
            '  - /laioutr-ui/ui-kit/content/linktilebig',
          ].join('\n')
        ),
      },
    ]);

    expect(Object.keys(rules)).toEqual([
      '/laioutr-ui/ui-kit/content/linktilebasic',
      '/laioutr-ui/ui-kit/content/linktilebig',
    ]);
    expect(rules['/laioutr-ui/ui-kit/content/linktilebig'].redirect.to).toBe('/laioutr-ui/ui-kit/content/link-tile');
  });

  it('ignores pages without aliases, with empty aliases, or without a canonical loc', () => {
    const rules = buildAliasRedirects([
      { id: 'no-aliases.md', raw: page('sitemap:\n  loc: /a') },
      { id: 'empty-aliases.md', raw: page('aliases: []\nsitemap:\n  loc: /b') },
      { id: 'no-loc.md', raw: page('aliases:\n  - /old-c') },
      { id: 'no-frontmatter.md', raw: 'just body, no frontmatter' },
    ]);

    expect(rules).toEqual({});
  });

  it('never produces a self-redirect (alias equal to canonical path)', () => {
    const rules = buildAliasRedirects([
      { id: 'self.md', raw: page('sitemap:\n  loc: /x\naliases:\n  - /x') },
    ]);

    expect(rules).toEqual({});
  });

  it('skips malformed frontmatter instead of throwing', () => {
    expect(() =>
      buildAliasRedirects([{ id: 'bad.md', raw: page('aliases: [unterminated\nsitemap:\n  loc: /y') }])
    ).not.toThrow();
  });
});
