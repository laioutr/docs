<script setup lang="ts">
import type { CalendarDate as CalendarDateType } from '@internationalized/date';
import type { StorybookArgTypes, StorybookArgType, StorybookArgs } from '~/composables/useStorybookChannel';

// `@internationalized/date` is only needed when a date control is on the
// page. Lazy-load it the first time we need to convert a value so it stays
// out of the playground chunk for the typical case (no date controls).
let dateLib: typeof import('@internationalized/date') | null = null;
async function ensureDateLib() {
  if (!dateLib) dateLib = await import('@internationalized/date');
  return dateLib;
}

const props = defineProps<{
  argTypes: StorybookArgTypes;
  args: StorybookArgs;
  initialArgs: StorybookArgs;
  ready: boolean;
}>();

const emit = defineEmits<{
  (e: 'set-arg', name: string, value: unknown): void;
  (e: 'clear-arg', name: string): void;
  (e: 'reset'): void;
  (e: 'reload'): void;
}>();

function isRequired(def: StorybookArgType | undefined) {
  return def?.type?.required === true;
}

function controlTypeOf(def: StorybookArgType | undefined): string | null {
  if (!def) return null;
  if (def.table?.disable) return null;
  if (def.control?.disable === true) return null;
  if (def.table?.category === 'events') return null;
  if (def.control && def.control.type === false) return null;
  if (def.control?.type) return def.control.type;
  const tn = def.type?.name;
  if (tn === 'enum') return 'radio';
  if (tn === 'boolean') return 'boolean';
  if (tn === 'number') return 'number';
  if (tn === 'string') return 'text';
  if (tn === 'object' || tn === 'array') return tn;
  return null;
}

function optionsOf(def: StorybookArgType | undefined): unknown[] {
  if (!def) return [];
  const o = def.control?.options ?? def.options ?? def.type?.value ?? [];
  return Array.isArray(o) ? o : [];
}

function labelFor(def: StorybookArgType | undefined, o: unknown) {
  const map = def?.control?.labels ?? {};
  return map[String(o)] ?? String(o);
}

function defaultSummary(def: StorybookArgType | undefined): string | null {
  return def?.defaultValue?.summary ?? def?.table?.defaultValue?.summary ?? null;
}

interface RenderedControl {
  name: string;
  def: StorybookArgType;
  ct: string;
  required: boolean;
}

const sortedControls = computed<RenderedControl[]>(() => {
  const items: RenderedControl[] = [];
  for (const [name, def] of Object.entries(props.argTypes)) {
    const ct = controlTypeOf(def);
    if (!ct) continue;
    items.push({ name, def, ct, required: isRequired(def) });
  }
  return items.sort((a, b) => {
    if (a.required !== b.required) return a.required ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
});

function isNull(v: unknown) {
  return v === null || v === undefined;
}

// The native `<input type="color">` (and Nuxt UI's UColorPicker) only deal in
// hex. The color prop's value may be a token name (`var(--primary)`), a CSS
// keyword (`tomato`), or `rgb()`/`hsl()` — in those cases we just feed the
// swatch a transparent default while the text input keeps the raw value
// editable.
function isHexColor(v: unknown): boolean {
  return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);
}

// UInputDate uses reka-ui's DateValue (@internationalized/date CalendarDate).
// The story arg is normally an ISO date string or a Date instance; convert
// in both directions so the picker can drive it.
// Reactive trigger: bumps once @internationalized/date is loaded so any
// template using parseDate() re-renders with the now-functional helper.
const dateLibVersion = ref(0);

function parseDate(v: unknown): CalendarDateType | undefined {
  // Force read so Vue tracks the load
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  dateLibVersion.value;
  if (isNull(v) || !dateLib) return undefined;
  try {
    if (typeof v === 'string') return dateLib.parseDate(v.slice(0, 10));
    if (v instanceof Date) {
      return new dateLib.CalendarDate(v.getFullYear(), v.getMonth() + 1, v.getDate());
    }
  } catch {
    /* malformed input */
  }
  return undefined;
}

// Kick off the lazy load only when at least one date control is present.
watch(
  () => sortedControls.value.some((c) => c.ct === 'date'),
  async (hasDate) => {
    if (hasDate && !dateLib) {
      await ensureDateLib();
      dateLibVersion.value++;
    }
  },
  { immediate: true }
);

function dateToString(v: unknown): string | null {
  if (!v) return null;
  // CalendarDate has a `toString()` returning ISO; safe across reka-ui versions.
  try {
    return String(v).slice(0, 10);
  } catch {
    return null;
  }
}

function onDateChange(name: string, raw: unknown, required: boolean) {
  const s = dateToString(raw);
  const v = s ?? (required ? '' : null);
  emit('set-arg', name, v);
}

function coerce(name: string, raw: string): unknown {
  const initial = props.initialArgs[name];
  if (typeof initial === 'number') return raw === '' ? null : Number(raw);
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return raw;
}

// Per-control composite state (textarea raw text + error)
const compositeText = reactive<Record<string, string>>({});
const compositeError = reactive<Record<string, string | null>>({});
const compositeFocused = reactive<Record<string, boolean>>({});

// Keep composite text in sync with args unless the user is editing.
watch(
  () => props.args,
  (a) => {
    for (const c of sortedControls.value) {
      if (c.ct !== 'object' && c.ct !== 'array') continue;
      if (compositeFocused[c.name]) continue;
      const v = a[c.name];
      compositeText[c.name] = isNull(v) ? '' : JSON.stringify(v, null, 2);
      compositeError[c.name] = null;
    }
  },
  { immediate: true, deep: true }
);

let compositeTimer: Record<string, ReturnType<typeof setTimeout>> = {};
function onCompositeInput(name: string, raw: string) {
  compositeText[name] = raw;
  clearTimeout(compositeTimer[name]);
  compositeTimer[name] = setTimeout(() => {
    const trimmed = raw.trim();
    if (trimmed === '') {
      compositeError[name] = null;
      emit('set-arg', name, null);
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      compositeError[name] = null;
      emit('set-arg', name, parsed);
    } catch (err) {
      compositeError[name] = (err as Error).message;
    }
  }, 250);
}

function radioOrSelect(c: RenderedControl) {
  const opts = optionsOf(c.def);
  const useSelect = c.ct === 'select' || c.ct === 'multi-select' || (c.ct === 'radio' && opts.length > 6);
  return { opts, useSelect };
}

function onTextInput(name: string, value: string, required: boolean) {
  const v = value === '' && !required ? null : value;
  emit('set-arg', name, v);
}

function onNumberInput(name: string, value: string) {
  const v = value === '' ? null : Number(value);
  emit('set-arg', name, v);
}

function onBoolChange(name: string, checked: boolean) {
  emit('set-arg', name, checked);
}

function onSetBoolean(name: string) {
  emit('set-arg', name, false);
}

function onRadioSelect(name: string, raw: string) {
  emit('set-arg', name, coerce(name, raw));
}

function isChecked(name: string, raw: string) {
  const v = props.args[name];
  if (isNull(v)) return false;
  return String(v) === raw;
}

function reset() {
  emit('reset');
}
</script>

<template>
  <div class="playground-controls">
    <div v-if="!ready" class="playground-loading">
      <UIcon name="i-lucide:loader-circle" class="size-5 animate-spin" />
      <p class="loading-label">Loading playground</p>
      <button type="button" class="loading-reload" @click="emit('reload')">Reload</button>
    </div>
    <template v-else>
      <div class="controls-header">
        <span>Args</span>
        <span class="status">{{ sortedControls.length }} controls</span>
        <button type="button" class="reset" @click="reset">reset</button>
      </div>
    <div class="controls-list">
      <div
        v-for="c in sortedControls"
        :key="c.name"
        class="control"
        :class="{
          'is-null': isNull(args[c.name]),
          'bool-control': c.ct === 'boolean',
          'composite-control': c.ct === 'object' || c.ct === 'array',
        }"
      >
        <div class="control-label-wrap">
          <div class="control-label">
            <UTooltip v-if="c.def.description" :text="c.def.description">
              <span class="prop-name has-tip">{{ c.name }}</span>
            </UTooltip>
            <span v-else class="prop-name">{{ c.name }}</span><span v-if="c.required" class="req">*</span>
            <button
              v-if="!c.required && c.ct !== 'boolean'"
              type="button"
              class="clear"
              title="Set to null"
              @click="emit('clear-arg', c.name)"
            >×</button>
          </div>
          <div v-if="defaultSummary(c.def)" class="control-default">
            default: <span class="v">{{ defaultSummary(c.def) }}</span>
          </div>
        </div>
        <div class="control-input">
          <!-- radio / select -->
          <template v-if="['radio', 'inline-radio', 'select', 'multi-select', 'check'].includes(c.ct)">
            <template v-if="radioOrSelect(c).useSelect">
              <select
                :value="isNull(args[c.name]) ? '' : String(args[c.name])"
                @change="onRadioSelect(c.name, ($event.target as HTMLSelectElement).value)"
              >
                <option value="" disabled>– choose –</option>
                <option v-for="o in radioOrSelect(c).opts" :key="String(o)" :value="String(o)">
                  {{ labelFor(c.def, o) }}
                </option>
              </select>
            </template>
            <template v-else>
              <div class="radio-list">
                <label v-for="o in radioOrSelect(c).opts" :key="String(o)" class="radio-opt">
                  <input
                    type="radio"
                    :name="`ctrl-${c.name}`"
                    :checked="isChecked(c.name, String(o))"
                    @change="onRadioSelect(c.name, String(o))"
                  />
                  <span>{{ labelFor(c.def, o) }}</span>
                </label>
              </div>
            </template>
          </template>

          <!-- boolean -->
          <template v-else-if="c.ct === 'boolean'">
            <template v-if="!isNull(args[c.name])">
              <label class="toggle">
                <input
                  type="checkbox"
                  :checked="!!args[c.name]"
                  @change="onBoolChange(c.name, ($event.target as HTMLInputElement).checked)"
                />
                <span class="bool-state-label">{{ args[c.name] ? 'true' : 'false' }}</span>
              </label>
            </template>
            <template v-else>
              <button v-if="!c.required" type="button" class="set-bool" @click="onSetBoolean(c.name)">Set boolean</button>
              <label v-else class="toggle">
                <input
                  type="checkbox"
                  :checked="false"
                  @change="onBoolChange(c.name, ($event.target as HTMLInputElement).checked)"
                />
                <span class="bool-state-label">false</span>
              </label>
            </template>
          </template>

          <!-- number / range -->
          <template v-else-if="c.ct === 'number' || c.ct === 'range'">
            <input
              type="number"
              :value="isNull(args[c.name]) ? '' : args[c.name] as number"
              @input="onNumberInput(c.name, ($event.target as HTMLInputElement).value)"
            />
          </template>

          <!-- text -->
          <template v-else-if="c.ct === 'text'">
            <input
              type="text"
              :value="isNull(args[c.name]) ? '' : args[c.name] as string"
              :placeholder="c.required ? 'required' : 'optional'"
              @input="onTextInput(c.name, ($event.target as HTMLInputElement).value, c.required)"
            />
          </template>

          <!-- color: swatch button opens UColorPicker in a popover; the text
               input stays editable for tokens like `var(--primary)` that the
               picker can't represent. -->
          <template v-else-if="c.ct === 'color'">
            <div class="color-control">
              <UPopover :content="{ side: 'bottom', align: 'start' }">
                <button
                  type="button"
                  class="color-swatch"
                  :style="{ background: isHexColor(args[c.name]) ? (args[c.name] as string) : 'transparent' }"
                  :aria-label="`Open color picker for ${c.name}`"
                />
                <template #content>
                  <UColorPicker
                    class="p-3"
                    :model-value="isHexColor(args[c.name]) ? (args[c.name] as string) : '#000000'"
                    @update:model-value="(v: string) => emit('set-arg', c.name, v)"
                  />
                </template>
              </UPopover>
              <input
                type="text"
                :value="isNull(args[c.name]) ? '' : args[c.name] as string"
                :placeholder="c.required ? 'required' : '#hex / token'"
                @input="onTextInput(c.name, ($event.target as HTMLInputElement).value, c.required)"
              />
            </div>
          </template>

          <!-- date: UInputDate via reka-ui's CalendarDate string round-trip. -->
          <template v-else-if="c.ct === 'date'">
            <UInputDate
              :model-value="parseDate(args[c.name])"
              @update:model-value="(d) => onDateChange(c.name, d, c.required)"
            />
          </template>

          <!-- object / array -->
          <template v-else-if="c.ct === 'object' || c.ct === 'array'">
            <textarea
              class="composite-textarea"
              :class="{ invalid: compositeError[c.name] }"
              spellcheck="false"
              :value="compositeText[c.name] ?? ''"
              @input="onCompositeInput(c.name, ($event.target as HTMLTextAreaElement).value)"
              @focus="compositeFocused[c.name] = true"
              @blur="compositeFocused[c.name] = false"
            />
            <div v-if="compositeError[c.name]" class="composite-error">{{ compositeError[c.name] }}</div>
          </template>
        </div>
      </div>

      </div>
    </template>
  </div>
</template>

<style scoped>
.playground-controls {
  background: var(--ui-bg);
  border-left: 1px solid var(--ui-border);
  overflow-y: auto;
  /* max-height comes from the parent ComponentPlayground via inline style,
     so the controls always match the preview pane's height exactly. */
  font-size: 13px;
}
.playground-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  min-height: 200px;
  color: var(--ui-text-dimmed);
}
.playground-loading .loading-label {
  margin: 0;
  font-size: 13px;
  color: var(--ui-text-muted);
}
.playground-loading .loading-reload {
  background: none;
  border: none;
  color: var(--ui-primary);
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
  text-decoration: underline;
  padding: 0;
}
.playground-loading .loading-reload:hover { text-decoration: none; }
.controls-header {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg-muted);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ui-text-muted);
  font-weight: 600;
  gap: 8px;
}
.controls-header .status {
  font-size: 10px;
  color: var(--ui-text-dimmed);
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
}
.controls-header .reset {
  margin-left: auto;
  background: none;
  border: none;
  color: var(--ui-primary);
  cursor: pointer;
  text-transform: none;
  letter-spacing: 0;
  font-size: 11px;
  font-weight: 500;
}
.control {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--ui-border);
  align-items: start;
}
.control:last-of-type { border-bottom: none; }
.control-label-wrap { padding-top: 4px; min-width: 0; }
.control-label {
  font-weight: 600;
  color: var(--ui-text);
  display: flex;
  align-items: baseline;
  gap: 2px;
  word-break: break-word;
  overflow-wrap: anywhere;
  line-height: 1.25;
}
.control-label .req {
  color: #ef4444;
  font-weight: normal;
  font-size: 14px;
  line-height: 1;
}
.control-label .prop-name.has-tip {
  text-decoration: underline dotted var(--ui-text-dimmed);
  text-underline-offset: 3px;
  cursor: help;
}
.control-label .clear {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  color: var(--ui-text-dimmed);
  padding: 0 4px;
  opacity: 0;
  transition: opacity .1s;
  border-radius: 3px;
}
.control:hover .control-label .clear { opacity: 1; }
.control-label .clear:hover { color: var(--ui-text); background: var(--ui-bg-muted); }
.control-default {
  font-size: 10.5px;
  color: var(--ui-text-dimmed);
  font-family: ui-monospace, Menlo, monospace;
  margin-top: 4px;
}
.control-default .v { color: var(--ui-text-muted); }
.control-input { min-width: 0; }

.radio-list { display: flex; flex-direction: column; gap: 4px; }
.radio-opt {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  padding: 2px 0;
}
.radio-opt input[type="radio"] { accent-color: var(--ui-primary); margin: 0; }

.control-input input[type="text"],
.control-input input[type="number"],
.control-input select {
  width: 100%;
  border: 1px solid var(--ui-border);
  background: var(--ui-bg);
  border-radius: 4px;
  padding: 5px 9px;
  font-size: 13px;
  font-family: inherit;
  color: var(--ui-text);
}
.control-input input:focus,
.control-input select:focus {
  outline: 2px solid var(--ui-bg-accented);
  border-color: var(--ui-primary);
}
.control.is-null input[type="text"],
.control.is-null input[type="number"] { color: var(--ui-text-dimmed); font-style: italic; }

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
}
.toggle input { accent-color: var(--ui-primary); }
.bool-state-label {
  color: var(--ui-text-muted);
  font-family: ui-monospace, Menlo, monospace;
  font-size: 12.5px;
}
.set-bool {
  background: none;
  border: 1px dashed var(--ui-border-accented);
  border-radius: 4px;
  padding: 5px 12px;
  font-size: 12px;
  color: var(--ui-text-muted);
  cursor: pointer;
  font-family: inherit;
}
.set-bool:hover {
  color: var(--ui-text);
  border-color: var(--ui-text-muted);
  background: var(--ui-bg-muted);
}

.color-control {
  display: flex;
  align-items: center;
  gap: 8px;
}
.color-control .color-swatch {
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid var(--ui-border);
  border-radius: 4px;
  cursor: pointer;
  flex-shrink: 0;
  /* checkered backdrop so transparent / undefined reads as "unset" */
  background-color: white;
  background-image: linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),
                    linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);
  background-size: 8px 8px;
  background-position: 0 0, 4px 4px;
}
.color-control input[type="text"] {
  flex: 1;
  min-width: 0;
}

.composite-textarea {
  width: 100%;
  border: 1px solid var(--ui-border);
  background: var(--ui-bg);
  border-radius: 4px;
  padding: 6px 10px;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-text);
  resize: vertical;
  min-height: 64px;
  max-height: 220px;
}
.composite-textarea:focus { outline: 2px solid var(--ui-bg-accented); border-color: var(--ui-primary); }
.composite-textarea.invalid { border-color: #ef4444; background: rgba(239, 68, 68, 0.06); }
.composite-error {
  margin-top: 4px;
  font-size: 11px;
  color: #b91c1c;
  font-family: ui-monospace, Menlo, monospace;
}

</style>
