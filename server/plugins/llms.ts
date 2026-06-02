import { getChangelogData, injectChangelogSection } from '../utils/llms/inject-changelog';
import { injectPlaygroundSection } from '../utils/llms/inject-playground';
import { stripTwoslashCuts } from '../utils/llms/strip-twoslash-cuts';
import { transformMdcBody } from '../utils/llms/transform-mdc';

export default defineNitroPlugin((nitroApp) => {
  // Transform MDC component nodes in doc.body before llms-full.txt stringification
  nitroApp.hooks.hook('content:llms:generate:document', async (event, doc, _options) => {
    await transformMdcBody(doc.body);
    injectPlaygroundSection(doc.body, (doc as any).playground);
    injectChangelogSection(doc.body, (doc as any).changelogKeys, await getChangelogData(event));
    stripTwoslashCuts(doc.body);
  });

  // Rewrite llms.txt links to point to /raw/*.md instead of HTML pages
  nitroApp.hooks.hook('llms:generate', async (_event, options) => {
    const domain = options.domain?.replace(/\/$/, '') || '';
    for (const section of options.sections) {
      if (!section.links) continue;
      for (const link of section.links) {
        if (!link.href) continue;
        // Only rewrite links under our own domain
        if (domain && !link.href.startsWith(domain)) continue;
        const path = link.href.slice(domain.length);
        // Skip root and non-content links (e.g. / or /llms-full.txt)
        if (path === '/' || !path || path.includes('.')) continue;
        link.href = `${domain}/raw${path}.md`;
      }
    }
  });
});
