<script setup lang="ts">
import HighlightInlineType from './HighlightInlineType.vue';
import type { ComponentData } from 'nuxt-component-meta';
import type { ComponentMeta, PropertyMeta } from 'vue-component-meta';
import { UIcon } from '#components';

const props = withDefaults(
  defineProps<{
    component: ComponentData;
    ignore?: string[];
    pro?: boolean;
    prose?: boolean;
  }>(),
  {
    ignore: () => [
      'activeClass',
      'inactiveClass',
      'exactActiveClass',
      'ariaCurrentValue',
      'rel',
      'noRel',
      'prefetch',
      'prefetchOn',
      'noPrefetch',
      'prefetchedClass',
      'replace',
      'exact',
      'exactQuery',
      'exactHash',
      'external',
      'onClick',
      'viewTransition',
    ],
  }
);

const name = computed(() => props.component.pascalName);

const route = useRoute();

const getPropType = (prop: ComponentMeta['props'][number]) => {
  if (typeof prop.schema === 'string') {
    return prop.type;
  }

  if (prop.schema.type) {
    return prop.schema.type;
  }

  const schemaSchema = prop.schema.schema as any as Record<string, PropertyMeta>;
  if (prop.schema?.kind === 'enum' && Object.keys(schemaSchema)?.length) {
    return Object.values(schemaSchema)
      .map((schema) => (schema?.type ? schema.type : schema))
      .join(' | ');
  }

  return prop.type;
};

const metaProps: ComputedRef<ComponentMeta['props']> = computed(() => {
  if (!props.component?.meta?.props?.length) {
    return [];
  }

  return props.component.meta.props
    .filter((prop) => !props.ignore?.includes(prop.name))
    .map((prop) => {
      if (prop.default) {
        prop.default = prop.default.replace(' as never', '').replace(/^"(.*)"$/, "'$1'");
      } else {
        const tag = prop.tags?.find((tag) => tag.name === 'defaultValue')?.text;
        if (tag) {
          prop.default = tag;
        }
      }

      prop.type = getPropType(prop);
      return prop;
    })
    .sort((a, b) => {
      if (a.name === 'as') {
        return -1;
      }

      if (b.name === 'as') {
        return 1;
      }

      if (a.name === 'ui') {
        return 1;
      }

      if (b.name === 'ui') {
        return -1;
      }

      return 0;
    });
});
</script>

<template>
  <ProseTable v-if="metaProps.length">
    <ProseThead>
      <ProseTr>
        <ProseTh>Prop</ProseTh>
        <ProseTh>Default</ProseTh>
        <ProseTh>Type</ProseTh>
      </ProseTr>
    </ProseThead>
    <ProseTbody>
      <ProseTr v-for="prop in metaProps" :key="prop.name">
        <ProseTd>
          <ProseCode>
            {{ prop.name }}
          </ProseCode>
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="prop.default && prop.default !== 'undefined' && prop.default !== 'void 0'" :type="prop.default" />
          <UIcon v-else name="lucide:minus" class="text-gray-400" />
        </ProseTd>
        <ProseTd>
          <HighlightInlineType v-if="prop.type" :type="prop.type" />

          <MDC
            v-if="prop.description"
            :value="prop.description"
            class="text-toned mt-1"
            :cache-key="`${route.path}-${name}-${prop.name}-description`"
          />

          <ComponentPropsLinks v-if="prop.tags?.length" :prop="prop" />
          <ComponentPropsSchema v-if="prop.schema" :prop="prop" :ignore="ignore" />
        </ProseTd>
      </ProseTr>
    </ProseTbody>
  </ProseTable>
</template>
