<script setup lang="ts">
import { kebabCase } from 'scule';
import type { ComponentData } from 'nuxt-component-meta';

const props = defineProps<{
  component: ComponentData;
  prose?: boolean;
  slug?: string;
}>();

const route = useRoute();
</script>

<template>
  <ProseTable v-if="component?.meta?.slots?.length">
    <ProseThead>
      <ProseTr>
        <ProseTh> Slot </ProseTh>
        <ProseTh> Type </ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="slot in component?.meta?.slots || []" :key="slot.name">
        <ProseTd>
          <ProseCode>
            {{ slot.name }}
          </ProseCode>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="slot.type" :type="slot.type" />

          <MDC
            v-if="slot.description"
            :value="slot.description"
            class="text-toned mt-1"
            :cache-key="`${kebabCase(route.path)}-${slot.name}-description`"
          />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
