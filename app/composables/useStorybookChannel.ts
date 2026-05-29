import type { Ref } from 'vue';

export interface StorybookArgType {
  name?: string;
  description?: string;
  type?: { name?: string; required?: boolean; value?: unknown };
  control?: {
    type?: string | false;
    options?: unknown[];
    labels?: Record<string, string>;
    disable?: boolean;
  };
  table?: {
    category?: string;
    disable?: boolean;
    defaultValue?: { summary?: string };
  };
  defaultValue?: { summary?: string };
  options?: unknown[];
}

export type StorybookArgs = Record<string, unknown>;
export type StorybookArgTypes = Record<string, StorybookArgType>;

const CHANNEL_KEY = 'storybook-channel';

// Storybook serialises non-JSON-safe arg values as sentinel strings through
// the channel (JSON has no `undefined`/`function`/etc). Walk the tree on
// arrival and turn those sentinels back into their real JS values so they
// don't surface as literal "_undefined_" strings in the controls panel or
// the generated code preview.
const SENTINELS: Record<string, unknown> = {
  __undefined__: undefined,
  _undefined_: undefined,
  __function__: undefined,
  _function_: undefined,
  __symbol__: undefined,
  _symbol_: undefined,
};

function revivePlaceholders(value: unknown): unknown {
  if (typeof value === 'string') {
    return value in SENTINELS ? SENTINELS[value] : value;
  }
  if (Array.isArray(value)) {
    return value.map(revivePlaceholders);
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const revived = revivePlaceholders(v);
      // Drop keys whose value reduces to undefined — that's the JS-native
      // representation of "not set", matching what `args[k] = undefined`
      // would mean in a real component invocation.
      if (revived !== undefined) out[k] = revived;
    }
    return out;
  }
  return value;
}

export function useStorybookChannel(
  iframeRef: Ref<HTMLIFrameElement | null>,
  options: { base: string; defaultStory: string; theme: Ref<string> }
) {
  const { base, defaultStory, theme } = options;

  const argTypes = ref<StorybookArgTypes>({});
  const initialArgs = ref<StorybookArgs>({});
  const args = ref<StorybookArgs>({});
  const storyId = ref(defaultStory);
  const ready = ref(false);
  const fromId = `playground-${Math.random().toString(36).slice(2, 10)}`;

  function send(eventType: string, eventArgs: unknown[]) {
    const w = iframeRef.value?.contentWindow;
    if (!w) return;
    w.postMessage(
      JSON.stringify({
        key: CHANNEL_KEY,
        event: { type: eventType, args: eventArgs, from: fromId },
        refId: null,
      }),
      '*'
    );
  }

  function pushArgs(updatedArgs: StorybookArgs) {
    if (!ready.value) return;
    send('updateStoryArgs', [{ storyId: `${base}--${storyId.value}`, updatedArgs }]);
  }

  function pushTheme() {
    if (!ready.value) return;
    send('updateGlobals', [
      { globals: { theme: theme.value }, options: { target: 'storybook-preview-iframe' } },
    ]);
  }

  function switchStory(newStoryId: string) {
    storyId.value = newStoryId;
    if (!ready.value) return;
    send('setCurrentStory', [{ storyId: `${base}--${newStoryId}`, viewMode: 'story' }]);
    // After switching, reapply the playground args on top of the new story's defaults.
    setTimeout(() => pushArgs(args.value), 150);
  }

  function setArg(name: string, value: unknown) {
    args.value = { ...args.value, [name]: value };
    pushArgs({ [name]: value });
  }

  function clearArg(name: string) {
    setArg(name, null);
  }

  // Hard-reload the iframe. Used by resetArgs() and the loading-state "Reload"
  // affordance — exposing it separately so the loading UI can recover from a
  // missed storyPrepared without also wiping pending arg changes.
  function reloadIframe() {
    const iframe = iframeRef.value;
    if (!iframe) return;
    ready.value = false;
    const src = iframe.src;
    iframe.src = 'about:blank';
    requestAnimationFrame(() => {
      iframe.src = src;
    });
  }

  function resetArgs() {
    args.value = { ...initialArgs.value };
    send('resetStoryArgs', [{ storyId: `${base}--${storyId.value}` }]);
    // Hard-reload too, so any imperative state inside the story (animations,
    // hover, focus, transient cart state) is cleared.
    reloadIframe();
  }

  function onMessage(e: MessageEvent) {
    let payload: any;
    try {
      payload = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    } catch {
      return;
    }
    if (payload?.key !== CHANNEL_KEY) return;
    const ev = payload.event;
    if (!ev) return;

    if (ev.type === 'storyPrepared') {
      // Only accept storyPrepared from our own iframe. The variant grid
      // mini-previews fire their own storyPrepared with different initialArgs.
      if (!iframeRef.value || e.source !== iframeRef.value.contentWindow) return;
      const detail = ev.args?.[0] ?? {};
      argTypes.value = detail.argTypes ?? {};
      initialArgs.value = revivePlaceholders(detail.initialArgs ?? detail.args ?? {}) as StorybookArgs;
      args.value = { ...initialArgs.value };
      ready.value = true;
      pushTheme();
    }
  }

  watch(theme, () => pushTheme());

  // Attach the message listener synchronously in setup (client only) so it is
  // in place before the iframe element is created and before Storybook can
  // fire `storyPrepared`. onMounted would race iframe load + cached responses.
  if (import.meta.client) {
    window.addEventListener('message', onMessage);
    onBeforeUnmount(() => {
      window.removeEventListener('message', onMessage);
    });
  }

  return {
    argTypes,
    initialArgs,
    args,
    storyId,
    ready,
    pushArgs,
    pushTheme,
    setArg,
    clearArg,
    switchStory,
    resetArgs,
    reloadIframe,
  };
}
