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

const desktopLinks: NavigationMenuItem[] = [
  { label: 'Developer Guide', to: '/developer-guide/overview' },
  {
    label: 'Orchestr',
    to: '/orchestr/introduction',
    children: [
      {
        label: 'Introduction',
        to: '/orchestr/introduction',
        description: "Learn about Laioutr's data api",
      },
      {
        label: 'Actions',
        to: '/orchestr/actions',
        description: 'Learn about orchestr actions and how to use them',
      },
      {
        label: 'Middleware',
        to: '/orchestr/middleware',
        description: 'Learn about the orchestr middleware',
      },
    ],
  },
  {
    label: 'Canonical Types',
    children: [
      {
        label: 'Ecommerce Actions',
        to: '/canonical-types/ecommerce/canonical-actions',
        description: 'Canonical actions',
      },
      {
        label: 'Ecommerce Queries',
        to: '/canonical-types/ecommerce/canonical-queries',
        description: 'Canonical queries',
      },
      {
        label: 'Canonical Actions',
        to: '/canonical-types/newsletter/canonical-actions',
        description: 'Newsletter actions',
      },
    ],
  },
  {
    label: 'API Reference',
    to: '/api-reference/readme',
    children: [
      {
        label: 'Common',
        to: '/api-reference/common/readme',
        description: 'Common types, shared across all modules.',
      },
      {
        label: 'Ecommerce',
        to: '/api-reference/ecommerce/readme',
        description: 'Ecommerce queries and actions.',
      },
      {
        label: 'Newsletter',
        to: '/api-reference/newsletter/readme',
        description: 'Newsletter queries and actions.',
      },
      {
        label: 'Orchestr',
        to: '/api-reference/orchestr/readme',
        description: 'Orchestr types, shared across all modules.',
      },
    ],
  },
];
</script>

<template>
  <UNavigationMenu :items="navigationItems" variant="link" />
</template>
