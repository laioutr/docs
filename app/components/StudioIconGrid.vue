<script lang="ts" setup>
const copiedName = ref<string | null>(null);
let copyTimeout: ReturnType<typeof setTimeout>;

function copy(name: string) {
  navigator.clipboard.writeText(name);
  copiedName.value = name;
  clearTimeout(copyTimeout);
  copyTimeout = setTimeout(() => (copiedName.value = null), 1500);
}

const sections = [
  {
    label: 'Pages & Content',
    icons: [
      { name: 'house', icon: 'lucide:house' },
      { name: 'file', icon: 'lucide:file' },
      { name: 'page', icon: 'lucide:file', hint: 'Alias of file' },
      { name: 'milestone', icon: 'lucide:milestone', hint: 'Landing pages' },
      { name: 'feather', icon: 'lucide:feather', hint: 'Blog posts' },
      { name: 'ghost', icon: 'lucide:ghost', hint: '404 / not-found' },
      { name: 'tag', icon: 'lucide:tag', hint: 'Product pages' },
      { name: 'tags', icon: 'lucide:tags', hint: 'Categories, collections' },
      { name: 'store', icon: 'lucide:store' },
      { name: 'search', icon: 'lucide:search' },
      { name: 'bookmark', icon: 'lucide:bookmark' },
      { name: 'star', icon: 'lucide:star' },
      { name: 'badge', icon: 'lucide:badge' },
      { name: 'calendar', icon: 'lucide:calendar-days', hint: 'Events, schedules' },
      { name: 'plane', icon: 'lucide:plane', hint: 'Travel, destinations' },
      { name: 'mapPin', icon: 'lucide:map-pin', hint: 'Locations, store finder' },
      { name: 'video', icon: 'lucide:video' },
      { name: 'shoppingCart', icon: 'lucide:shopping-cart' },
      { name: 'heart', icon: 'lucide:heart', hint: 'Wishlists' },
      { name: 'user', icon: 'lucide:user', hint: 'Account, profile' },
      { name: 'mail', icon: 'lucide:mail', hint: 'Contact' },
      { name: 'circleHelp', icon: 'lucide:circle-help', hint: 'FAQ, help center' },
      { name: 'newspaper', icon: 'lucide:newspaper', hint: 'News, press' },
      { name: 'images', icon: 'lucide:images', hint: 'Gallery, portfolio' },
      { name: 'gift', icon: 'lucide:gift', hint: 'Promotions, gift cards' },
      { name: 'ticket', icon: 'lucide:ticket', hint: 'Events, vouchers' },
      { name: 'percent', icon: 'lucide:percent', hint: 'Sales, deals' },
      { name: 'package', icon: 'lucide:package', hint: 'Orders, shipments' },
      { name: 'creditCard', icon: 'lucide:credit-card', hint: 'Checkout, payment' },
      { name: 'receipt', icon: 'lucide:receipt', hint: 'Invoices, order confirmation' },
      { name: 'truck', icon: 'lucide:truck', hint: 'Shipping, delivery' },
      { name: 'globe', icon: 'lucide:globe', hint: 'Multi-market, i18n' },
      { name: 'languages', icon: 'lucide:languages', hint: 'Translations, locales' },
      { name: 'megaphone', icon: 'lucide:megaphone', hint: 'Campaigns, announcements' },
      { name: 'sparkles', icon: 'lucide:sparkles', hint: 'AI, recommendations' },
      { name: 'shield', icon: 'lucide:shield', hint: 'Privacy, legal' },
      { name: 'building', icon: 'lucide:building', hint: 'B2B, company pages' },
      { name: 'logIn', icon: 'lucide:log-in', hint: 'Login, registration' },
      { name: 'barChart', icon: 'lucide:chart-bar', hint: 'Analytics, reports' },
      { name: 'palette', icon: 'lucide:palette', hint: 'Configurator, customization' },
      { name: 'circleUser', icon: 'lucide:circle-user', hint: 'Author, team member' },
      { name: 'messageSquare', icon: 'lucide:message-square', hint: 'Reviews, comments' },
      { name: 'ferrisWheel', icon: 'lucide:ferris-wheel', hint: 'Theme parks, attractions' },
    ],
  },
  {
    label: 'Structure',
    icons: [
      { name: 'layout', icon: 'lucide:layout' },
      { name: 'template', icon: 'lucide:layout-template' },
      { name: 'section', icon: 'lucide:diamond' },
      { name: 'globalSection', icon: 'bi:diamond' },
      { name: 'block', icon: 'lucide:component' },
      { name: 'container', icon: 'lucide:square-dashed' },
      { name: 'masonry', icon: 'lucide:layout-dashboard' },
    ],
  },
  {
    label: 'Alignment',
    icons: [
      { name: 'alignLeft', icon: 'lucide:align-left' },
      { name: 'alignCenter', icon: 'lucide:align-center' },
      { name: 'alignRight', icon: 'lucide:align-right' },
      { name: 'alignJustify', icon: 'lucide:align-justify' },
      { name: 'alignTop', icon: 'tabler:arrow-bar-to-up' },
      { name: 'alignBottom', icon: 'tabler:arrow-bar-to-down' },
      { name: 'layoutAlignBottom', icon: 'tabler:layout-align-bottom' },
      { name: 'layoutAlignCenter', icon: 'tabler:layout-align-center' },
      { name: 'layoutAlignLeft', icon: 'tabler:layout-align-left' },
      { name: 'layoutAlignMiddle', icon: 'tabler:layout-align-middle' },
      { name: 'layoutAlignRight', icon: 'tabler:layout-align-right' },
      { name: 'layoutAlignTop', icon: 'tabler:layout-align-top' },
      { name: 'layoutDistributeHorizontal', icon: 'tabler:layout-distribute-horizontal' },
      { name: 'layoutDistributeVertical', icon: 'tabler:layout-distribute-vertical' },
      { name: 'boxAlignBottom', icon: 'tabler:box-align-bottom' },
      { name: 'boxAlignBottomLeft', icon: 'tabler:box-align-bottom-left' },
      { name: 'boxAlignBottomRight', icon: 'tabler:box-align-bottom-right' },
      { name: 'boxAlignLeft', icon: 'tabler:box-align-left' },
      { name: 'boxAlignRight', icon: 'tabler:box-align-right' },
      { name: 'boxAlignTop', icon: 'tabler:box-align-top' },
      { name: 'boxAlignTopLeft', icon: 'tabler:box-align-top-left' },
      { name: 'boxAlignTopRight', icon: 'tabler:box-align-top-right' },
    ],
  },
  {
    label: 'Box Styles',
    icons: [
      { name: 'boxGradient', icon: 'material-symbols:gradient' },
      { name: 'boxOutline', icon: 'ion:square-outline' },
      { name: 'boxSolid', icon: 'ion:square' },
      { name: 'boxDashed', icon: 'lucide:square-dashed' },
      { name: 'boxNone', icon: 'lucide:square-slash', hint: 'No background' },
      { name: 'boxMultiple', icon: 'tabler:box-multiple' },
      { name: 'boxMargin', icon: 'tabler:box-margin' },
      { name: 'boxPadding', icon: 'tabler:box-padding' },
    ],
  },
  {
    label: 'Borders',
    icons: [
      { name: 'borderAll', icon: 'tabler:border-all' },
      { name: 'borderTop', icon: 'tabler:border-top' },
      { name: 'borderBottom', icon: 'tabler:border-bottom' },
      { name: 'borderLeft', icon: 'tabler:border-left' },
      { name: 'borderRight', icon: 'tabler:border-right' },
      { name: 'borderClear', icon: 'tabler:border-none' },
      { name: 'borderInner', icon: 'tabler:border-inner' },
      { name: 'borderOuter', icon: 'tabler:border-outer' },
      { name: 'borderHorizontal', icon: 'tabler:border-horizontal' },
      { name: 'borderVertical', icon: 'tabler:border-vertical' },
    ],
  },
];
</script>

<template>
  <div class="sig">
    <div v-for="section in sections" :key="section.label" class="sig__section">
      <h3 :id="section.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')" class="sig__heading">
        {{ section.label }}
      </h3>
      <div class="sig__items">
        <button
          v-for="entry in section.icons"
          :key="entry.name"
          class="sig__item"
          :title="`Copy '${entry.name}'`"
          @click="copy(entry.name)"
        >
          <span class="sig__copy-badge" :class="{ 'sig__copy-badge--done': copiedName === entry.name }">
            <UIcon :name="copiedName === entry.name ? 'lucide:check' : 'lucide:copy'" class="sig__copy-icon" />
          </span>
          <div class="sig__icon-area">
            <UIcon :name="entry.icon" class="sig__icon" />
          </div>
          <code class="sig__name">{{ entry.name }}</code>
          <span v-if="entry.hint" class="sig__hint">{{ entry.hint }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sig__section {
  margin-block: 1.75rem;
}

.sig__heading {
  margin: 0 0 0.625rem;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-gray-400);
}

:root.dark .sig__heading {
  color: var(--color-gray-500);
}

.sig__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: 0.375rem;
}

/* ---- Card ---- */
.sig__item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.875rem 0.5rem 0.625rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 0.5rem;
  background: transparent;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s;
}

.sig__item:hover {
  border-color: var(--color-gray-300);
  background: var(--color-gray-50);
}

:root.dark .sig__item {
  border-color: var(--color-gray-800);
}

:root.dark .sig__item:hover {
  border-color: var(--color-gray-700);
  background: var(--color-gray-900);
}

/* ---- Icon area ---- */
.sig__icon-area {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  margin-bottom: 0.125rem;
}

.sig__icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-gray-700);
}

:root.dark .sig__icon {
  color: var(--color-gray-300);
}

/* ---- Copy badge ---- */
.sig__copy-badge {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.15s, transform 0.15s;
}

.sig__copy-badge--done {
  opacity: 1;
  transform: scale(1);
  background: var(--color-emerald-50);
  border-color: var(--color-emerald-200);
}

:root.dark .sig__copy-badge {
  background: var(--color-gray-800);
  border-color: var(--color-gray-700);
}

:root.dark .sig__copy-badge--done {
  background: var(--color-emerald-950);
  border-color: var(--color-emerald-800);
}

.sig__item:hover .sig__copy-badge {
  opacity: 1;
  transform: scale(1);
}

.sig__copy-icon {
  width: 0.8125rem;
  height: 0.8125rem;
  color: var(--color-gray-500);
}

.sig__copy-badge--done .sig__copy-icon {
  color: var(--color-emerald-500);
}

/* ---- Name ---- */
.sig__name {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.6875rem;
  line-height: 1.4;
  color: var(--color-gray-700);
  overflow-wrap: break-word;
  word-break: break-all;
  max-width: 100%;
}

:root.dark .sig__name {
  color: var(--color-gray-400);
}

/* ---- Hint ---- */
.sig__hint {
  font-size: 0.625rem;
  line-height: 1.3;
  color: var(--color-gray-400);
}

:root.dark .sig__hint {
  color: var(--color-gray-600);
}
</style>
