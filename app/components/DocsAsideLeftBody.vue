<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation');

const route = useRoute();
const currentTopLevel = computed(() => {
  const firstRoutePart = route.path.replace(/^\//, '').split('/')[0];
  return navigation?.value.find((item) => item.path.replaceAll('/', '') === firstRoutePart)?.children ?? navigation?.value;
});
</script>

<template>
  <UContentNavigation highlight :navigation="currentTopLevel" />
</template>
