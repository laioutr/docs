<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation');

function hasNumericPrefix(item: ContentNavigationItem): boolean {
  const lastSegment = item.stem?.split('/').pop() ?? '';
  return /^\d+\./.test(lastSegment);
}

function sortByTitle(items: ContentNavigationItem[]): ContentNavigationItem[] {
  return [...items]
    .sort((a, b) => {
      const aManual = hasNumericPrefix(a);
      const bManual = hasNumericPrefix(b);
      // Both have numeric prefix → keep original stem order
      if (aManual && bManual) return (a.stem ?? '').localeCompare(b.stem ?? '');
      // Manual items come before auto-sorted ones
      if (aManual) return -1;
      if (bManual) return 1;
      // Neither has prefix → sort alphabetically by title
      return (a.title ?? '').localeCompare(b.title ?? '', undefined, { sensitivity: 'base' });
    })
    .map(item => item.children ? { ...item, children: sortByTitle(item.children) } : item);
}

const route = useRoute();
const currentTopLevel = computed(() => {
  const firstRoutePart = route.path.replace(/^\//, '').split('/')[0];
  const items = navigation?.value.find((item) => item.path.replaceAll('/', '') === firstRoutePart)?.children ?? navigation?.value;
  return items ? sortByTitle(items) : items;
});
</script>

<template>
  <UContentNavigation highlight :navigation="currentTopLevel" />
</template>
