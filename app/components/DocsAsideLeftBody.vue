<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation');

function sortByTitle(items: ContentNavigationItem[]): ContentNavigationItem[] {
  return [...items]
    .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '', undefined, { sensitivity: 'base' }))
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
