<script setup lang="ts">
import { findPageHeadline } from '@nuxt/content/utils';
import { kebabCase } from 'scule';
import type { Collections, ContentNavigationItem, DocsCollectionItem } from '@nuxt/content';

definePageMeta({
  layout: 'docs',
});

const route = useRoute();
const { locale, isEnabled, t } = useDocusI18n();
const appConfig = useAppConfig();
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation');
const { shouldPushContent: shouldHideToc } = useAssistant();

const collectionName = computed(() => isEnabled.value ? `docs_${locale.value}` : 'docs');

const [{ data: page }, { data: surround }] = await Promise.all([
  useAsyncData(kebabCase(route.path), () => queryCollection(collectionName.value as keyof Collections).path(route.path).first() as Promise<DocsCollectionItem>),
  useAsyncData(`${kebabCase(route.path)}-surround`, () => queryCollectionItemSurroundings(collectionName.value as keyof Collections, route.path, {
      fields: ['description'],
    })),
]);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const title = page.value.seo?.title || page.value.title;
const description = page.value.seo?.description || page.value.description;

const headline = ref(findPageHeadline(navigation?.value, page.value?.path));
const breadcrumbs = computed(() => findPageBreadcrumbs(navigation?.value, page.value?.path || ''));

useSeo({
  title,
  description,
  type: 'article',
  modifiedAt: (page.value as unknown as Record<string, unknown>).modifiedAt as string | undefined,
  breadcrumbs,
});
watch(() => navigation?.value, () => {
  headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value;
});

defineOgImage('Docs', {
  headline: headline.value,
  title: title?.slice(0, 60),
  description: formatOgDescription(title, description),
});

const github = computed(() => appConfig.github ? appConfig.github : null);

const editLink = computed(() => {
  if (!github.value) {
    return;
  }
  return [
    github.value.url,
    'edit',
    github.value.branch,
    github.value.rootDir,
    'content',
    `${page.value?.stem}.${page.value?.extension}`,
  ].filter(Boolean).join('/');
});

addPrerenderPath(`/raw${route.path}.md`);

// Page playground frontmatter: hero block above content + TOC.
// When present, the inner UPage skips the right TOC slot and we render an inline
// sticky TOC inside UPageBody so it sits *below* the hero, not beside it.
type PlaygroundFrontmatter = {
  name: string;
  base: string;
  defaultStory: string;
  height?: string;
};
const playground = computed<PlaygroundFrontmatter | null>(() => {
  const raw = (page.value as any)?.playground;
  if (!raw || typeof raw !== 'object') return null;
  if (!raw.name || !raw.base || !raw.defaultStory) return null;
  return raw as PlaygroundFrontmatter;
});

const tocLinks = computed(() => page.value?.body?.toc?.links || []);
const contentTocVariants = useUIConfig('contentToc');

// Changelog block (rendered at the bottom of the content from the `changelogKeys`
// frontmatter). Push a matching entry into the page TOC so it shows up alongside
// the real headings — both TOC render paths read `page.body.toc.links`.
const changelogKeys = computed<string[]>(() => (page.value as any)?.changelogKeys ?? []);
watchEffect(() => {
  const toc = page.value?.body?.toc;
  if (!toc?.links || !changelogKeys.value.length) return;
  if (toc.links.at(-1)?.id === 'changelog') return;
  toc.links.push({ id: 'changelog', text: 'Changelog', depth: 2 });
});
</script>

<template>
  <UPage
    v-if="page"
    :key="`page-${shouldHideToc}-${playground ? 'hero' : 'no-hero'}`"
  >
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
      :ui="{
        wrapper: 'flex-row items-center flex-wrap justify-between',
      }"
    >
      <template #links>
        <UButton
          v-for="(link, index) in (page as DocsCollectionItem).links"
          :key="index"
          size="sm"
          v-bind="link"
        />
        <UButton
          v-if="playground"
          size="sm"
          label="Storybook"
          icon="i-simple-icons-storybook"
          :to="`https://storybook.laioutr.cloud/?path=/story/${playground.base}`"
          target="_blank"
        />
        <DocsPageHeaderLinks />
      </template>
    </UPageHeader>

    <!-- Hero block, full content+toc width. Rendered before UPageBody so it
         sits above the content/TOC grid. -->
    <!-- Lazy-loaded: the playground pulls in Shiki, color/date pickers, and
         the postMessage channel — none of which are needed on docs pages
         without a `playground:` frontmatter. The `Lazy` prefix moves the
         component (and its imports) into a chunk fetched on first render. -->
    <LazyComponentPlayground
      v-if="playground"
      :name="playground.name"
      :base="playground.base"
      :default-story="playground.defaultStory"
      :height="playground.height"
    />

    <UPageBody>
      <div :class="playground ? 'playground-page-body' : ''">
        <UContentToc
          v-if="playground && tocLinks.length && !shouldHideToc"
          class="inline-toc"
          :highlight="contentTocVariants.highlight ?? true"
          :highlight-color="contentTocVariants.highlightColor"
          :highlight-variant="contentTocVariants.highlightVariant"
          :color="contentTocVariants.color"
          :title="appConfig.toc?.title || t('docs.toc')"
          :links="tocLinks"
        />
        <ContentRenderer
          v-if="page"
          :value="page"
        />
        <ApiChangelog
          v-if="changelogKeys.length"
          :keys="changelogKeys"
        />
      </div>

      <USeparator v-if="github">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UButton
            variant="link"
            color="neutral"
            :to="editLink"
            target="_blank"
            icon="i-lucide-pen"
            :ui="{ leadingIcon: 'size-4' }"
          >
            {{ t('docs.edit') }}
          </UButton>
          <template v-if="github?.url">
            <span>{{ t('common.or') }}</span>
            <UButton
              variant="link"
              color="neutral"
              :to="`${github.url}/issues/new/choose`"
              target="_blank"
              icon="i-lucide-alert-circle"
              :ui="{ leadingIcon: 'size-4' }"
            >
              {{ t('docs.report') }}
            </UButton>
          </template>
        </div>
      </USeparator>
      <UContentSurround :surround="surround" />
    </UPageBody>

    <!-- When a playground hero is present, suppress the page-top TOC; an
         inline TOC is rendered inside UPageBody instead, so it appears below
         the hero rather than alongside it. -->
    <template v-if="!playground" #right>
      <DocsAsideRight
        :page="page"
      />
    </template>
  </UPage>
</template>

<style>
.playground-page-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
}
@media (min-width: 1024px) {
  .playground-page-body {
    grid-template-columns: minmax(0, 1fr) 220px;
  }
  .playground-page-body > .inline-toc {
    grid-column: 2;
    grid-row: 1;
    position: sticky;
    top: calc(var(--ui-header-height, 64px) + 1.5rem);
    align-self: start;
  }
  .playground-page-body > *:not(.inline-toc) {
    grid-column: 1;
    grid-row: 1;
    min-width: 0;
  }
  /* The changelog block follows the content in column 1 rather than stacking
     into the same cell (which would overlap the rendered content). */
  .playground-page-body > .api-changelog {
    grid-row: 2;
  }
}
</style>
