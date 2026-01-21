<script setup lang="ts">
import type { ComponentData } from 'nuxt-component-meta';

const props = defineProps<{
  component: ComponentData;
  prose?: boolean;
}>();
</script>

<template>
  <ProseTable v-if="component?.meta?.events?.length">
    <ProseThead>
      <ProseTr>
        <ProseTh> Event </ProseTh>
        <ProseTh> Type </ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="event in component?.meta?.events || []" :key="event.name">
        <ProseTd>
          <ProseCode>
            {{ event.name }}
          </ProseCode>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="event.type" :type="event.type" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
