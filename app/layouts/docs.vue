<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <DocsAsideLeftTop />
            <DocsAsideLeftBody />
          </UPageAside>
        </template>
        <Breadcrumb v-if="route.path !== '/'" class="pt-8" />
        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
