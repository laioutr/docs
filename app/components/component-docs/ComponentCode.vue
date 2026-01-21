<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/types';

const props = defineProps<{
  title?: string;
  name: string;
  storyId: string;
  storyHeight?: string;
}>();

const storybookIframe = ref<HTMLIFrameElement | null>(null);

const storybookPostMessage = (message: any) => {
  storybookIframe.value?.contentWindow?.postMessage(
    JSON.stringify({
      key: 'storybook-channel',
      event: message,
      refId: null,
    }),
    '*'
  );
};

const storybookUpdateGlobal = (global: any) => {
  storybookPostMessage({
    type: 'updateGlobals',
    args: [{ globals: global, options: { target: 'storybook-preview-iframe' } }],
    from: '7f6440b5d80b8',
  });
};

type AvailableTheme = DropdownMenuItem & { value: string };

const availableThemes: AvailableTheme[] = [
  {
    label: 'Laioutr',
    value: 'laioutr',
  },
  {
    label: 'Classic',
    value: 'classic',
  },
  {
    label: 'Tech',
    value: 'tech',
  },
  {
    label: 'Sunny',
    value: 'sunny',
  },
];

const selectedThemeKey = useCookie<string>('component-preview-theme', {
  default: () => availableThemes[0]!.value,
});
const selectedTheme = computed(() => availableThemes.find((theme) => theme.value === selectedThemeKey.value)!);

// This should not change when the theme is changed, as that would cause a iframe-navigation
const storybookUrl = `https://storybook.laioutr.cloud/iframe.html?globals=theme:${selectedThemeKey.value}&id=${props.storyId}`;

const themeDropdownItems = computed(() =>
  availableThemes.map((theme) => ({
    label: theme.label,
    icon: selectedThemeKey.value === theme.value ? 'i-lucide-check' : undefined,
    onSelect: () => (selectedThemeKey.value = theme.value),
  }))
);

watch(selectedThemeKey, (newValue) => {
  storybookUpdateGlobal({ theme: newValue });
});
</script>

<template>
  <div class="component-code mb-6">
    <div class="component-code__title border-muted bg-default relative flex items-center gap-1.5 rounded-t-md border-b-1 px-4 py-3">
      <span class="text-default text-sm/6">{{ title ?? name }}</span>

      <UDropdownMenu :items="themeDropdownItems">
        <UButton class="ml-auto" color="neutral" variant="soft">
          <UIcon :name="'i-lucide-swatch-book'" class="size-4" /> {{ selectedTheme.label }} Theme
          <UIcon name="i-heroicons-chevron-down-20-solid" />
        </UButton>
      </UDropdownMenu>
    </div>
    <iframe
      ref="storybookIframe"
      :src="storybookUrl"
      class="component-code__preview"
      :style="{ height: storyHeight || '400px' }"
      loading="lazy"
    />
    <div class="component-code__code">
      <slot />
    </div>
  </div>
</template>

<style>
.component-code {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
}

.component-code__preview {
  width: 100%;

  &:focus {
    outline: none;
  }
}

.component-code__code {
  > .group {
    margin: 0 !important;
  }
  .shiki {
    border-right: none !important;
    border-left: none !important;
    border-bottom: none !important;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
  }
}
</style>
