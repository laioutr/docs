<script lang="ts" setup>
import { parseOrchestrUrlGrouped } from '~/utils/orchestr-url-parser';
import type { ParsedParam } from '~/utils/orchestr-url-parser';

const props = defineProps<{ url: string }>();

const parsed = computed(() => parseOrchestrUrlGrouped(props.url));

// Which param indices to highlight (set from summary hover)
const highlighted = ref<Set<number> | null>(null);

// Build wire-request summary grouped by prefix
interface SummaryRow { label: string; value: string; paramIndices: number[] }
interface SummaryGroup { prefix: string; rows: SummaryRow[]; paramIndices: number[] }

function buildSummary(params: ParsedParam[]): SummaryGroup[] {
  const map = new Map<string, {
    paramIndices: number[]
    page?: { value: string; indices: number[] }
    limit?: { value: string; indices: number[] }
    sort?: { value: string; indices: number[] }
    filters: Map<string, {
      type: 'list'; values: string[]; indices: number[]
    } | {
      type: 'range'; min?: string; max?: string; indices: number[]
    }>
  }>();

  for (let pi = 0; pi < params.length; pi++) {
    const p = params[pi]!;
    const d = p.info.details;
    const prefix = d.find(x => x.label === 'prefix')?.value ?? '(root)';
    const link = d.find(x => x.label === 'link')?.value;
    const key = link ? `${prefix}[${link}]` : prefix;

    if (!map.has(key)) map.set(key, { paramIndices: [], filters: new Map() });
    const q = map.get(key)!;
    q.paramIndices.push(pi);
    const kind = p.info.kind.replace(/^Linked query · /, '');
    const val = (label: string) => d.find(x => x.label === label)?.value;

    switch (kind) {
      case 'Page': q.page = { value: val('page') ?? '', indices: [pi] }; break;
      case 'Sort': q.sort = { value: val('sort') ?? '', indices: [pi] }; break;
      case 'Limit': q.limit = { value: val('limit') ?? '', indices: [pi] }; break;
      case 'Filter': {
        const f = val('filter'), v = val('value');
        if (f && v) {
          const existing = q.filters.get(f);
          if (existing?.type === 'list') {
            existing.values.push(v);
            existing.indices.push(pi);
          } else {
            q.filters.set(f, { type: 'list', values: [v], indices: [pi] });
          }
        }
        break;
      }
      case 'Range filter': {
        const f = val('filter'), bound = val('bound'), v = val('value');
        if (f && bound && v) {
          const existing = q.filters.get(f);
          if (existing?.type === 'range') {
            (existing as Record<string, string>)[bound] = v;
            existing.indices.push(pi);
          } else {
            q.filters.set(f, { type: 'range', [bound]: v, indices: [pi] });
          }
        }
        break;
      }
    }
  }

  const groups: SummaryGroup[] = [];
  for (const [prefix, q] of map) {
    const rows: SummaryRow[] = [];
    if (q.page) rows.push({ label: 'page', value: q.page.value, paramIndices: q.page.indices });
    if (q.limit) rows.push({ label: 'limit', value: q.limit.value, paramIndices: q.limit.indices });
    if (q.sort) rows.push({ label: 'sort', value: q.sort.value, paramIndices: q.sort.indices });
    for (const [name, filter] of q.filters) {
      if (filter.type === 'list') {
        rows.push({ label: name, value: filter.values.join(', '), paramIndices: filter.indices });
      } else {
        const parts: string[] = [];
        if (filter.min) parts.push(filter.min);
        if (filter.max) parts.push(filter.max);
        rows.push({ label: name, value: parts.join('–'), paramIndices: filter.indices });
      }
    }
    groups.push({ prefix, rows, paramIndices: q.paramIndices });
  }
  return groups;
}

const summary = computed(() => buildSummary(parsed.value.params));
const showPrefix = computed(() => summary.value.length > 1 || summary.value[0]?.prefix !== '(root)');

function isHighlighted(paramIndex: number): boolean {
  return highlighted.value?.has(paramIndex) ?? false;
}

function isDimmed(paramIndex: number): boolean {
  return highlighted.value !== null && !highlighted.value.has(paramIndex);
}
</script>

<template>
  <div class="not-prose my-4 rounded-lg border border-default bg-elevated/50 px-4 py-3" @mouseleave="highlighted = null">
    <!-- URL -->
    <code class="block font-mono text-sm leading-relaxed"><span class="text-muted">{{ parsed.path }}</span><template
        v-for="(param, i) in parsed.params"
        :key="i"
      ><span class="text-muted">{{ i === 0 ? '?' : '&' }}</span><span
          class="rounded-sm transition-all duration-150"
          :class="{
            'bg-primary/10 px-0.5 -mx-0.5': isHighlighted(i),
            'opacity-30': isDimmed(i),
          }"
        ><span
            v-for="(seg, si) in param.segments"
            :key="si"
            :class="seg.role === 'value' ? 'text-primary font-semibold' : 'text-default font-semibold'"
          >{{ seg.text }}</span></span></template></code>

    <!-- Wire request summary -->
    <div class="mt-2.5 border-t border-dashed border-default pt-2.5 flex flex-col gap-2">
      <div v-for="(g, gi) in summary" :key="gi">
        <span
          v-if="showPrefix"
          class="mb-1 block font-mono text-xs font-semibold text-default cursor-default"
          @mouseenter="highlighted = new Set(g.paramIndices)"
        >{{ g.prefix }}</span>
        <dl class="grid gap-x-4 gap-y-0.5 text-xs" style="grid-template-columns: auto 1fr">
          <template v-for="(r, ri) in g.rows" :key="ri">
            <dt
              class="font-mono text-muted cursor-default"
              @mouseenter="highlighted = new Set(r.paramIndices)"
            >{{ r.label }}</dt>
            <dd
              class="font-mono font-semibold text-primary cursor-default"
              @mouseenter="highlighted = new Set(r.paramIndices)"
            >{{ r.value }}</dd>
          </template>
        </dl>
      </div>
    </div>
  </div>
</template>
