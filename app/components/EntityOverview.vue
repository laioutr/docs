<script lang="ts" setup>
import { VueFlow, Handle, Position, useVueFlow } from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import reflected from '@laioutr-core/canonical-types/reflection';

const props = defineProps<{
  entity: string;
}>();

const flowId = `entity-${props.entity}`;

let fitView: (opts?: any) => void = () => {};
if (import.meta.client) {
  ({ fitView } = useVueFlow(flowId));
}

function onNodesInitialized() {
  setTimeout(() => fitView({ padding: 0.15, maxZoom: 1 }), 50);
}

function shortLinkName(name: string) {
  const parts = name.split('/');
  return parts[parts.length - 1];
}

const entityComponents = computed(() =>
  reflected.components
    .filter((c) => c.entityType === props.entity)
    .map((c) => c.name)
);

const links = computed(() =>
  reflected.links.filter((link) => link.source === props.entity)
);

const COL_GAP = 220;
const TARGET_ROW_H = 64;
const TARGET_NODE_H = 49;
const COMP_LINE_H = 21;
const SOURCE_HEADER_H = 42;
const SECTION_LABEL_H = 23;
const SOURCE_PAD = 13;

const nodes = computed(() => {
  const targets = links.value;
  const n = targets.length;
  const comps = entityComponents.value;

  const sourceH = SOURCE_HEADER_H + SECTION_LABEL_H + comps.length * COMP_LINE_H + SOURCE_PAD;
  const targetSpan = Math.max(0, (n - 1) * TARGET_ROW_H);
  const targetStart = Math.max(0, (sourceH - targetSpan - TARGET_NODE_H) / 2);

  return [
    {
      id: props.entity,
      type: 'source-entity',
      position: { x: 0, y: 0 },
      data: { label: props.entity, components: comps },
    },
    ...targets.map((link, i) => ({
      id: link.name,
      type: 'target-entity',
      position: { x: COL_GAP, y: targetStart + i * TARGET_ROW_H },
      data: { label: link.target, cardinality: link.type, linkName: shortLinkName(link.name) },
    })),
  ];
});

const edges = computed(() =>
  links.value.map((link) => ({
    id: link.name,
    source: props.entity,
    target: link.name,
    type: 'smoothstep',
    animated: false,
    label: link.type,
    style: { stroke: 'var(--color-gray-300)' },
    labelStyle: {
      fontSize: '11px',
      fontWeight: '500',
      fill: 'var(--color-gray-500)',
    },
    labelBgStyle: { fill: 'transparent' },
  }))
);

const wrapHeight = computed(() => {
  const sh = SOURCE_HEADER_H + SECTION_LABEL_H + entityComponents.value.length * COMP_LINE_H + SOURCE_PAD + 60;
  const th = links.value.length * TARGET_ROW_H + 60;
  return Math.max(220, sh, th);
});
</script>

<template>
  <ClientOnly>
    <div class="entity-flow-wrap" :style="{ height: `${wrapHeight}px` }">
      <VueFlow
        :id="flowId"
        :nodes="nodes"
        :edges="edges"
        :fit-view-on-init="false"
        @nodes-initialized="onNodesInitialized"
        :nodes-draggable="false"
        :nodes-connectable="false"
        :elements-selectable="false"
        :zoom-on-scroll="false"
        :zoom-on-pinch="false"
        :zoom-on-double-click="false"
        :pan-on-drag="false"
        :pan-on-scroll="false"
        :prevent-scrolling="false"
        :max-zoom="1.5"
        :min-zoom="0.3"
      >
        <template #node-source-entity="{ data }">
          <div class="entity-flow-node entity-flow-node--source">
            <div class="entity-flow-node__header">{{ data.label }}</div>
            <div class="entity-flow-node__divider" />
            <div class="entity-flow-node__section-label">Components</div>
            <div class="entity-flow-node__components">
              <a
                v-for="comp in data.components"
                :key="comp"
                :href="`#${comp}`"
                class="entity-flow-node__comp-link"
                @click.stop
              >
                {{ comp }}
              </a>
            </div>
            <Handle type="source" :position="Position.Right" />
          </div>
        </template>

        <template #node-target-entity="{ data }">
          <div class="entity-flow-node entity-flow-node--target">
            <div class="entity-flow-node__link-name">{{ data.linkName }}</div>
            <div class="entity-flow-node__entity-name">{{ data.label }}</div>
            <Handle type="target" :position="Position.Left" />
          </div>
        </template>
      </VueFlow>
    </div>
  </ClientOnly>
</template>

<style scoped>
.entity-flow-wrap {
  --mermaid-pre-bg-color: #f4f0f4;

  margin-block: 1.5rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  background: radial-gradient(var(--mermaid-pre-bg-color) 1px, transparent 1px);
  background-size: 16px 16px;
  overflow: hidden;

  .dark & {
    --mermaid-pre-bg-color: #393439;
    border-color: var(--color-gray-800);
  }
}

.entity-flow-node {
  border-radius: 0.375rem;
  border: 1px solid var(--color-gray-200);
  background: white;
  font-family: var(--font-sans);

  .dark & {
    border-color: var(--color-gray-700);
    background: var(--color-gray-950);
    color: var(--color-gray-100);
  }
}

.entity-flow-node--source {
  border-left: 3px solid var(--color-purple-500);
  min-width: 140px;

  .dark & {
    border-left-color: var(--color-purple-400);
  }
}

.entity-flow-node__header {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.entity-flow-node__divider {
  height: 1px;
  background: var(--color-gray-200);

  .dark & {
    background: var(--color-gray-700);
  }
}

.entity-flow-node__section-label {
  padding: 0.375rem 1rem 0;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-gray-400);

  .dark & {
    color: var(--color-gray-500);
  }
}

.entity-flow-node__components {
  display: flex;
  flex-direction: column;
  padding: 0.25rem 1rem 0.5rem;
}

.entity-flow-node__comp-link {
  font-size: 0.8125rem;
  line-height: 1.625;
  color: var(--color-gray-600);
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: var(--color-purple-500);
  }

  .dark & {
    color: var(--color-gray-400);

    &:hover {
      color: var(--color-purple-400);
    }
  }
}

.entity-flow-node--target {
  padding: 0.375rem 0.75rem;
  min-width: 100px;
}

.entity-flow-node__link-name {
  font-size: 0.6875rem;
  line-height: 1.3;
  color: var(--color-gray-400);

  .dark & {
    color: var(--color-gray-500);
  }
}

.entity-flow-node__entity-name {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>

<style>
.entity-flow-wrap .vue-flow__node {
  pointer-events: all !important;
}

.entity-flow-wrap .vue-flow__handle {
  opacity: 0;
  width: 1px;
  height: 1px;
  min-width: 0;
  min-height: 0;
  border: none;
}

.entity-flow-wrap .vue-flow__edge-text {
  font-family: var(--font-sans);
}

.dark .entity-flow-wrap .vue-flow__edge path {
  stroke: var(--color-gray-700);
}

.dark .entity-flow-wrap .vue-flow__edge-text {
  fill: var(--color-gray-400);
}
</style>
