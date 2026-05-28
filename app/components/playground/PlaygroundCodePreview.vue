<script setup lang="ts">
import type { StorybookArgTypes, StorybookArgs } from '~/composables/useStorybookChannel';

const props = defineProps<{
  name: string;
  argTypes: StorybookArgTypes;
  args: StorybookArgs;
}>();

function isRequired(name: string): boolean {
  return props.argTypes[name]?.type?.required === true;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Each token writes its colour via `--shiki-light` / `--shiki-default` /
// `--shiki-dark` CSS variables. The docs' own global `.shiki span` rule
// (see assets/css/twoslash.css and Nuxt Content's shiki transformer output)
// then picks the right variable based on the active color mode — same path
// every other code block on the site uses.
//
// Hex values lifted from the Material Theme Lighter / Palenight palette
// that's already in use across the docs.
const TOKEN = {
  tag:    'style="--shiki-light:#E53935;--shiki-default:#F07178;--shiki-dark:#F07178"',
  attr:   'style="--shiki-light:#6182B8;--shiki-default:#82AAFF;--shiki-dark:#82AAFF"',
  string: 'style="--shiki-light:#91B859;--shiki-default:#C3E88D;--shiki-dark:#C3E88D"',
  punct:  'style="--shiki-light:#39ADB5;--shiki-default:#89DDFF;--shiki-dark:#89DDFF"',
} as const;

const tagName = computed(() => `L${props.name.replace(/^L/, '')}`);

const html = computed(() => {
  const out: string[] = [];
  out.push(`<span ${TOKEN.tag}>&lt;${tagName.value}</span>`);

  const entries = Object.entries(props.args)
    .filter(([, v]) => v !== null && v !== undefined)
    .sort(([a], [b]) => {
      const ra = isRequired(a) ? 0 : 1;
      const rb = isRequired(b) ? 0 : 1;
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    });

  for (const [k, v] of entries) {
    if (typeof v === 'string') {
      out.push(`  <span ${TOKEN.attr}>${k}</span><span ${TOKEN.punct}>=</span><span ${TOKEN.string}>"${escapeHtml(v)}"</span>`);
    } else if (typeof v === 'number') {
      out.push(`  <span ${TOKEN.punct}>:</span><span ${TOKEN.attr}>${k}</span><span ${TOKEN.punct}>=</span><span ${TOKEN.string}>"${v}"</span>`);
    } else if (typeof v === 'boolean') {
      if (v) {
        out.push(`  <span ${TOKEN.attr}>${k}</span>`);
      } else {
        out.push(`  <span ${TOKEN.punct}>:</span><span ${TOKEN.attr}>${k}</span><span ${TOKEN.punct}>=</span><span ${TOKEN.string}>"false"</span>`);
      }
    } else {
      const json = JSON.stringify(v);
      out.push(`  <span ${TOKEN.punct}>:</span><span ${TOKEN.attr}>${k}</span><span ${TOKEN.punct}>=</span><span ${TOKEN.string}>'${escapeHtml(json)}'</span>`);
    }
  }
  out.push(`<span ${TOKEN.tag}>/&gt;</span>`);
  return out.join('\n');
});

const plain = computed(() => {
  const entries = Object.entries(props.args)
    .filter(([, v]) => v !== null && v !== undefined)
    .sort(([a], [b]) => {
      const ra = isRequired(a) ? 0 : 1;
      const rb = isRequired(b) ? 0 : 1;
      if (ra !== rb) return ra - rb;
      return a.localeCompare(b);
    });
  const lines: string[] = [`<${tagName.value}`];
  for (const [k, v] of entries) {
    if (typeof v === 'string') lines.push(`  ${k}="${v}"`);
    else if (typeof v === 'number') lines.push(`  :${k}="${v}"`);
    else if (typeof v === 'boolean') lines.push(v ? `  ${k}` : `  :${k}="false"`);
    else lines.push(`  :${k}='${JSON.stringify(v)}'`);
  }
  lines.push('/>');
  return lines.join('\n');
});

const copyState = ref<'idle' | 'copied'>('idle');
async function copy() {
  try {
    await navigator.clipboard.writeText(plain.value);
    copyState.value = 'copied';
    setTimeout(() => (copyState.value = 'idle'), 1500);
  } catch {
    /* clipboard unavailable */
  }
}
</script>

<template>
  <!-- Class chain mirrors Nuxt Content's Shiki output verbatim — the docs'
       existing `.shiki span { color: var(--shiki-…) }` rules then drive
       token colors and the light/dark swap, and the Tailwind utilities
       give the same border/padding/typography as every other code block. -->
  <pre class="playground-code group font-mono text-sm/6 bg-muted px-4 py-3 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none **:[.line]:block **:[.line.highlight]:-mx-4 **:[.line.highlight]:px-4 **:[.line.highlight]:bg-accented/50! language-vue shiki shiki-themes material-theme-lighter material-theme material-theme-palenight"><button
    type="button"
    aria-label="Copy code to clipboard"
    tabindex="-1"
    class="rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 text-xs gap-1.5 ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted p-1.5 absolute top-[11px] right-[11px] lg:opacity-0 lg:group-hover:opacity-100 transition"
    @click="copy"
  ><UIcon :name="copyState === 'copied' ? 'i-lucide:check' : 'i-lucide:copy'" class="shrink-0 size-4" /></button><code v-html="html" /></pre>
</template>

<style scoped>
.playground-code {
  position: relative;
  border: none;
  border-radius: 0;
  height: 100%;
  max-height: 100%;
  margin: 0;
  overflow: auto;
}
</style>

<!-- Global, unscoped: Nuxt Content's Shiki transformer normally emits these
     `.shiki span { color: var(--shiki-…) }` rules alongside MDC code blocks,
     but on pages whose MDC body has no fenced code block (like our playground
     pages, which only render `::component-meta` etc.) the rules aren't
     injected. Mirroring them here lets the hand-rolled pre pick the right
     light/default/dark color out of the per-span CSS variables. -->
<style>
html .light .shiki span,
html.light .shiki span {
  color: var(--shiki-light);
  background: var(--shiki-light-bg);
  font-style: var(--shiki-light-font-style);
  font-weight: var(--shiki-light-font-weight);
  text-decoration: var(--shiki-light-text-decoration);
}
html .shiki span {
  color: var(--shiki-default);
  background: var(--shiki-default-bg);
  font-style: var(--shiki-default-font-style);
  font-weight: var(--shiki-default-font-weight);
  text-decoration: var(--shiki-default-text-decoration);
}
html .dark .shiki span,
html.dark .shiki span {
  color: var(--shiki-dark);
  background: var(--shiki-dark-bg);
  font-style: var(--shiki-dark-font-style);
  font-weight: var(--shiki-dark-font-weight);
  text-decoration: var(--shiki-dark-text-decoration);
}
</style>
