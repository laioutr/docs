<script lang="ts" setup>
type ChangelogName = 'frontend' | 'cockpit' | 'ui' | 'cli' | 'orchestr' | 'orchestr-devtools' | 'figma-kit';

const props = defineProps<{
  version: string;
  packages: string;
  changelog?: ChangelogName;
}>();

const cleanVersion = computed(() => props.version.replace(/^v/, ''));
const displayVersion = computed(() => `v${cleanVersion.value}`);
const versionAnchor = computed(() => `_${cleanVersion.value.replace(/\./g, '')}`);

const changelogHref = computed(() => {
  if (!props.changelog) return null;
  return `/getting-started/changelogs/${props.changelog}-changelog#${versionAnchor.value}`;
});

const packageList = computed(() =>
  props.packages
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
);
</script>

<template>
  <div
    class="my-4 flex items-center gap-3 rounded-md border border-default bg-elevated/40 px-4 py-3 text-sm"
    role="note"
    aria-label="Version availability"
  >
    <UIcon name="i-lucide-tag" class="h-4 w-4 flex-shrink-0 text-primary" />
    <span>
      <strong>
        Available since
        <NuxtLink v-if="changelogHref" :to="changelogHref" class="underline decoration-dotted underline-offset-2">
          {{ displayVersion }}
        </NuxtLink>
        <template v-else>{{ displayVersion }}</template>
      </strong>
      <template v-if="packageList.length > 0">
        in
        <template v-for="(pkg, i) in packageList" :key="pkg"
          ><template v-if="i > 0">{{
            i === packageList.length - 1 ? ' and ' : ', '
          }}</template
          ><code>{{ pkg }}</code></template
        >
      </template>
    </span>
  </div>
</template>
