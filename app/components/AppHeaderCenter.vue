<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types';
import type { ContentNavigationItem } from '@nuxt/content';

const findFirstPagePath = (item: ContentNavigationItem): string | undefined => {
  if (item.page === false) return item.children?.map(findFirstPagePath).find(Boolean);
  return item.path;
};

const route = useRoute();
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation');
const navigationItems = computed((): NavigationMenuItem[] => {
  const firstRoutePart = route.path.replace(/^\//, '').split('/')[0];
  return (
    navigation?.value.map((item) => ({
      label: item.title,
      to: findFirstPagePath(item),
      active: item.path.replaceAll('/', '') === firstRoutePart,
    })) ?? []
  );
});

</script>

<template>
  <UNavigationMenu :items="navigationItems" variant="link" />
</template>
