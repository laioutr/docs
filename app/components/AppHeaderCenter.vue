<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types';

const desktopLinks: NavigationMenuItem[] = [
  { label: 'Laioutr UI', to: '/developer-guide/overview' },
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
  <UNavigationMenu :items="desktopLinks" variant="link" />
</template>
