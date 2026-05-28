<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/types';
import PlaygroundControls from '~/components/playground/PlaygroundControls.vue';
import PlaygroundCodePreview from '~/components/playground/PlaygroundCodePreview.vue';

const props = defineProps<{
  name: string;
  base: string;
  defaultStory: string;
  height?: string;
}>();

const host = 'https://storybook.laioutr.cloud';

type AvailableTheme = DropdownMenuItem & { value: string };
const availableThemes: AvailableTheme[] = [
  { label: 'Laioutr', value: 'laioutr' },
  { label: 'Classic', value: 'classic' },
  { label: 'Tech', value: 'tech' },
  { label: 'Sunny', value: 'sunny' },
];

const selectedThemeKey = useCookie<string>('component-preview-theme', {
  default: () => availableThemes[0]!.value,
});
const selectedTheme = computed(
  () => availableThemes.find((t) => t.value === selectedThemeKey.value) ?? availableThemes[0]!
);

const iframeRef = ref<HTMLIFrameElement | null>(null);
const channel = useStorybookChannel(iframeRef, {
  base: props.base,
  defaultStory: props.defaultStory,
  theme: selectedThemeKey,
});

const fullSrc = `${host}/iframe.html?id=${props.base}--${props.defaultStory}&globals=theme:${selectedThemeKey.value}`;
// Defer setting the iframe src until after the client-side message listener
// is attached, otherwise Storybook fires storyPrepared during SSR/hydration
// and the listener misses it (cached iframes load almost instantly).
const initialSrc = ref('');
onMounted(() => {
  initialSrc.value = fullSrc;
});

const activeTab = ref<'preview' | 'code'>('preview');

// Device viewport switcher. `auto` is the natural pane-width preview.
// The other three render the iframe at its real device width and scale
// the visible area down to fit the pane — Cockpit-studio style — so the
// rendered layout is the actual breakpoint, not just a cropped viewport.
const DEVICES = [
  { key: 'auto',    label: 'Fit',     icon: 'i-lucide:maximize-2', width: null },
  { key: 'mobile',  label: 'Mobile',  icon: 'i-lucide:smartphone', width: 375 },
  { key: 'tablet',  label: 'Tablet',  icon: 'i-lucide:tablet',     width: 768 },
  { key: 'desktop', label: 'Desktop', icon: 'i-lucide:monitor',    width: 1440 },
] as const;
type DeviceKey = typeof DEVICES[number]['key'];
const device = ref<DeviceKey>('auto');
const currentDevice = computed(() => DEVICES.find((d) => d.key === device.value)!);

const paneRef = ref<HTMLElement | null>(null);
const paneWidth = ref(0);

onMounted(() => {
  if (!paneRef.value) return;
  const ro = new ResizeObserver((entries) => {
    paneWidth.value = entries[0].contentRect.width;
  });
  ro.observe(paneRef.value);
  onBeforeUnmount(() => ro.disconnect());
});

// Scaler wraps the iframe so width/transform apply to a normal <div>
// (avoids browser quirks scaling iframes via inline CSS). `right`/`bottom`
// are explicitly nulled because some layered Tailwind rule observed in the
// page sets them to non-auto values on absolute children of `.preview-pane`.
const scalerStyle = computed(() => {
  const d = currentDevice.value;
  if (!d.width) {
    return {
      width: '100%',
      height: '100%',
      left: '0',
      right: 'auto',
      bottom: 'auto',
      transform: 'none',
    };
  }
  const scale = paneWidth.value > 0 ? Math.min(1, paneWidth.value / d.width) : 1;
  return {
    width: `${d.width}px`,
    height: `${100 / scale}%`,
    transform: `translateX(-50%) scale(${scale})`,
    transformOrigin: 'top center',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
  };
});

const themeDropdownItems = computed<DropdownMenuItem[]>(() =>
  availableThemes.map((t) => ({
    label: t.label,
    icon: selectedThemeKey.value === t.value ? 'i-lucide-check' : undefined,
    onSelect: () => (selectedThemeKey.value = t.value),
  }))
);

const heroHeight = computed(() => props.height ?? '460px');

// Lazily fetch the list of stories under `base` from Storybook's index.json.
// Hidden when only the default story exists.
interface SbIndexEntry { id: string; name: string; parameters?: { docsOnly?: boolean } }
interface SbIndex { entries: Record<string, SbIndexEntry> }

const { data: storyIndex } = useAsyncData(
  `sb-stories-${props.base}`,
  async () => {
    const json = await $fetch<SbIndex>(`${host}/index.json`, { responseType: 'json' });
    return json;
  },
  { server: false }
);

const stories = computed(() => {
  if (!storyIndex.value) return [];
  const prefix = `${props.base}--`;
  return Object.values(storyIndex.value.entries)
    .filter((e) => e.id.startsWith(prefix) && !e.parameters?.docsOnly)
    .map((e) => ({ id: e.id.slice(prefix.length), name: e.name }));
});

const currentStoryName = computed(() => {
  const match = stories.value.find((s) => s.id === channel.storyId.value);
  return match?.name ?? channel.storyId.value;
});

const storyDropdownItems = computed<DropdownMenuItem[]>(() =>
  stories.value.map((s) => ({
    label: s.name,
    icon: s.id === channel.storyId.value ? 'i-lucide-check' : undefined,
    onSelect: () => channel.switchStory(s.id),
  }))
);
</script>

<template>
  <div class="component-playground">
    <div class="hero">
      <!-- Fixed height across both tabs: iframes need an explicit size, and
           keeping the same height for the code view prevents the hero from
           jumping when switching tabs. The code view scrolls internally. -->
      <div
        ref="paneRef"
        class="preview-pane"
        :style="{ height: heroHeight }"
      >
        <div
          v-show="activeTab === 'preview'"
          class="iframe-scaler"
          :style="scalerStyle"
        >
          <iframe
            ref="iframeRef"
            :src="initialSrc || undefined"
            name="storybook-preview-iframe"
            allow="fullscreen"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        <PlaygroundCodePreview
          v-if="activeTab === 'code'"
          :name="name"
          :arg-types="channel.argTypes.value"
          :args="channel.args.value"
        />
      </div>
      <PlaygroundControls
        class="controls-pane"
        :style="{ maxHeight: heroHeight }"
        :arg-types="channel.argTypes.value"
        :args="channel.args.value"
        :initial-args="channel.initialArgs.value"
        :ready="channel.ready.value"
        @set-arg="channel.setArg"
        @clear-arg="channel.clearArg"
        @reset="channel.resetArgs"
        @reload="channel.reloadIframe"
      />

      <div class="hero-footer">
        <button type="button" class="tab" :class="{ active: activeTab === 'preview' }" @click="activeTab = 'preview'">
          Preview
        </button>
        <button type="button" class="tab" :class="{ active: activeTab === 'code' }" @click="activeTab = 'code'">
          Code
        </button>
        <div v-show="activeTab === 'preview'" class="device-switch" role="radiogroup" aria-label="Preview viewport">
          <button
            v-for="d in DEVICES"
            :key="d.key"
            type="button"
            class="device-btn"
            :class="{ active: device === d.key }"
            :title="d.label"
            :aria-label="d.label"
            :aria-pressed="device === d.key"
            @click="device = d.key"
          >
            <UIcon :name="d.icon" class="size-3.5" />
          </button>
        </div>
        <div class="spacer" />
        <UDropdownMenu v-if="stories.length > 1" :items="storyDropdownItems">
          <UButton color="neutral" variant="soft" size="xs">
            <UIcon name="i-lucide-layers" class="size-3.5" />
            {{ currentStoryName }}
            <UIcon name="i-heroicons-chevron-down-20-solid" />
          </UButton>
        </UDropdownMenu>
        <UDropdownMenu :items="themeDropdownItems">
          <UButton color="neutral" variant="soft" size="xs">
            <UIcon name="i-lucide-swatch-book" class="size-3.5" />
            {{ selectedTheme.label }}
            <UIcon name="i-heroicons-chevron-down-20-solid" />
          </UButton>
        </UDropdownMenu>
      </div>
    </div>
  </div>
</template>

<style scoped>
.component-playground {
  margin: 16px 0 24px;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 340px;
  border: 1px solid var(--ui-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--ui-bg);
}
.preview-pane {
  background: linear-gradient(180deg, var(--ui-bg-muted), var(--ui-bg-elevated));
  position: relative;
  overflow: hidden;
}
.iframe-scaler {
  position: absolute;
  top: 0;
  transition: transform 0.2s ease, width 0.2s ease, height 0.2s ease;
}
.preview-pane iframe {
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
}
.controls-pane { grid-column: 2; grid-row: 1; }
.hero-footer {
  grid-column: 1 / -1;
  padding: 8px 12px;
  border-top: 1px solid var(--ui-border);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  background: var(--ui-bg);
}
.hero-footer .tab {
  padding: 5px 12px;
  border-radius: 4px;
  color: var(--ui-text-muted);
  cursor: pointer;
  font-size: 11.5px;
  background: none;
  border: none;
  font-family: inherit;
}
.hero-footer .spacer { flex: 1; }
.device-switch {
  display: inline-flex;
  gap: 2px;
  margin-left: 6px;
  padding: 2px;
  background: var(--ui-bg-muted);
  border-radius: 6px;
}
.device-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: var(--ui-text-muted);
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  line-height: 0;
}
.device-btn:hover { color: var(--ui-text); }
.device-btn.active {
  background: var(--ui-bg);
  color: var(--ui-text);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.hero-footer .tab.active {
  background: var(--ui-bg-muted);
  color: var(--ui-text);
  font-weight: 500;
}
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .controls-pane {
    grid-column: 1;
    grid-row: 2;
    border-left: none;
    border-top: 1px solid var(--ui-border);
    max-height: 400px;
  }
}
</style>
