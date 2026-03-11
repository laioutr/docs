<script setup lang="ts">
import { findPageBreadcrumb } from '@nuxt/content/utils'
import type { ContentNavigationItem } from '@nuxt/content'
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const items = computed<BreadcrumbItem[]>(() => {
  const nav = navigation?.value
  if (!nav) {
    return [
      {
        label: 'Home',
        to: '/',
      },
    ]
  }

  const breadcrumbNav = findPageBreadcrumb(nav, route.path, {
    current: true,
    indexAsChild: true,
  })

  const items: BreadcrumbItem[] = [
    {
      label: 'Home',
      to: '/',
    },
  ]

  for (const item of breadcrumbNav) {
    items.push({
      label: item.title || item.path || '',
      to: item.path || undefined,
    })
  }

  return items
})
</script>

<template>
  <UBreadcrumb :items="items">
    <template #separator>
      <span class="mx-2 text-muted">/</span>
    </template>
  </UBreadcrumb>
</template>

