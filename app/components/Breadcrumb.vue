<script setup lang="ts">
import { findPageBreadcrumb } from '@nuxt/content/utils'
import type { ContentNavigationItem } from '@nuxt/content'
import type { BreadcrumbItem } from '@nuxt/ui'

const route = useRoute()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const normalizedPath = computed(() => {
  const p = route.path
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p
})

// Nav nodes for folders without an index.md are synthetic and carry `page: false`.
// Linking the breadcrumb at that path would 404 (or cause an extra redirect),
// so descend into children and use the first real page instead.
function resolveTarget(item: ContentNavigationItem): string | undefined {
  if ((item as { page?: false }).page !== false) return item.path
  for (const child of item.children ?? []) {
    const target = resolveTarget(child)
    if (target) return target
  }
  return item.path
}

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

  const breadcrumbNav = findPageBreadcrumb(nav, normalizedPath.value, {
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
      to: resolveTarget(item),
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

