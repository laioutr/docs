---
title: Consent Adapters
description: How to build a Laioutr app that integrates a Consent Management Platform (CMP) by implementing the ConsentAdapter contract from frontend-core.
seo:
  title: Consent Adapters
  description: How to build a Laioutr app that integrates a Consent Management Platform (CMP) by implementing the ConsentAdapter contract from frontend-core.
sitemap:
  loc: /apps/app-development/consent-adapters
  lastmod: 2026-04-27
  changefreq: monthly
  priority: 1
---

## What you are building

A consent adapter is a small object that bridges a concrete CMP (OneTrust, CookieYes, an in-house solution) and Laioutr's [consent store](/frontend/features/consent-management). The store calls `setup()` to load the CMP and to receive the visitor's verdict — at once, and again on every change — and forwards user actions like "open the banner" through `openConsentUi()`.

If your CMP is already covered by `@laioutr-app/cookiebot` or `@laioutr-app/ccm19`, use those instead. Build your own only when no existing app fits.

A consent adapter app is a normal Laioutr app (a Nuxt module that exposes its options on `runtimeConfig.public` and registers a client plugin) plus two adapter-specific pieces:

1. An **adapter factory** — a function that takes your app's config and returns an object satisfying `ConsentAdapter` from `#frontend/consent`.
2. A **client plugin** that builds the adapter and installs it on the store with `useConsentStore().setAdapter(adapter)`.

For the module skeleton, options handling, and how `runtimeConfig.public` flows into your plugin, scaffold from the [App Starter](/apps/app-development/app-starter) and follow [App Configuration](/apps/app-development/app-configuration). This guide focuses on the consent-specific contract and walks through one worked example against a fictional CMP API.

## The ConsentAdapter contract

The contract is exported from `@laioutr-core/frontend-core` and re-exported under the `#frontend/consent` alias:

```ts
import type { ConsentState } from '#frontend/consent';

/** How an adapter hands the store a verdict. Call it as often as the CMP reports one. */
export type ConsentReport = (consent: Partial<ConsentState>) => void;

/** Which of the CMP's own dialogs to open. */
export type ConsentUiView = 'banner' | 'preferences';

export interface ConsentAdapter {
  readonly name: string;
  setup(report: ConsentReport): void | (() => void);
  openConsentUi(view: ConsentUiView): Promise<void> | void;
  hasDecision?(): boolean;
}
```

::field-group
  :::field{required name="name" type="string"}
  Stable identifier for the adapter (e.g. `'cookiebot'`, `'ccm19'`, `'onetrust'`). Shown in the store's console warnings when the adapter is replaced or fails to start.
  :::

  :::field
  ---
  required: true
  name: setup(report)
  type: "(report: ConsentReport) => void | (() => void)"
  ---
  Loads the CMP and reports the visitor's verdict, in canonical purposes -- at once, and again on every subsequent change. Translating the CMP's own vocabulary onto them is this method's job; a purpose you never report counts as denied.

  Runs synchronously inside the installing plugin, so `useHead` and `useCookie` are available -- do not make this method `async` or await anything before it returns. Return a cleanup function to run when the store drops the adapter, or nothing if there is none to run. Throw when required configuration is missing; the store catches the error, logs it, and drops the adapter.
  :::

  :::field{required name="openConsentUi(view)" type="(view: ConsentUiView) => Promise<void> | void"}
  Opens one of the CMP's own dialogs: `'banner'` for the main consent prompt, `'preferences'` for the granular settings panel. Some CMPs use the same UI for both; that is fine.
  :::

  :::field{name="hasDecision()" type="() => boolean"}
  Optional. Whether the visitor has actually answered, as opposed to the CMP having merely loaded and reported its default. Omit it when the CMP cannot tell -- the store then reports `hasDecision()` as `undefined` to consumers, meaning "no decision signal available", never "declined".
  :::
::

A `Partial<ConsentState>` passed to `report` is enough: the store merges it into the existing state, so omitted keys keep their previous value.

## Registering the adapter

Once the adapter factory exists, the client plugin in your app builds it and hands it to the store with one call:

```ts
useConsentStore().setAdapter(createConsentKitAdapter(config));
```

`setAdapter` runs `setup()` immediately and returns a handle that drops the adapter -- call it, or install a different adapter, to stop it. A project should install exactly one CMP app; if a second `setAdapter` call arrives while one is already active, the store logs a console warning and replaces the first adapter with the second rather than running both.

## Worked example

The fictional CMP `ConsentKit` is the example for the rest of the guide. Imagine its API looks like this:

```ts
declare global {
  interface Window {
    ConsentKit?: ConsentKitGlobal;
  }
}

interface ConsentKitGlobal {
  getConsent(): ConsentKitState | null;
  openBanner(): void;
  openPreferences(): void;
  on(event: 'consent-change', handler: (state: ConsentKitState) => void): () => void;
}

interface ConsentKitState {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  ads: boolean;
}
```

The widget is loaded with a script tag, exposes a `window.ConsentKit` global once ready, fires a `consentkit:ready` event when that global becomes available, and lets you subscribe to consent changes via `ConsentKit.on('consent-change', ...)`. A real CMP will look broadly like this; the moving parts (script injection, late init, mapping, cleanup) are the same shape regardless of the provider.

Here is the full adapter:

```ts
import { useHead } from 'nuxt/app';
import type { ConsentAdapter, ConsentState } from '#frontend/consent';

interface ConsentKitConfig {
  apiKey: string;
  region?: string;
}

// The contract boundary: ConsentKit's own vocabulary becomes Laioutr's purposes. ConsentKit has
// one `ads` bucket, so both ad purposes come from it; a CMP that separates them reports them
// separately, and that is the whole point of translating here rather than downstream.
const mapConsent = (state: ConsentKitState): Partial<ConsentState> => ({
  necessary: state.essential,
  functional: state.functional,
  analytics: state.analytics,
  advertising: state.ads,
  personalization: state.ads,
});

export const createConsentKitAdapter = (config: ConsentKitConfig) =>
  ({
    name: 'consentkit',

    setup(report) {
      if (!config.apiKey) {
        throw new Error('ConsentKit: apiKey is required');
      }

      const params = new URLSearchParams({ key: config.apiKey });
      if (config.region) params.set('region', config.region);

      useHead({
        script: [{ id: 'consentkit', src: `https://cdn.consentkit.example/widget.js?${params}`, async: true }],
      });

      if (!import.meta.client) {
        return undefined;
      }

      let unsubscribe: (() => void) | undefined;

      // The widget may load before or after this plugin runs; handle both.
      const subscribe = () => {
        unsubscribe = window.ConsentKit!.on('consent-change', (state) => report(mapConsent(state)));
        const initial = window.ConsentKit!.getConsent();
        if (initial) report(mapConsent(initial));
      };

      if (window.ConsentKit) {
        subscribe();
      } else {
        window.addEventListener('consentkit:ready', subscribe, { once: true });
      }

      return () => {
        unsubscribe?.();
        window.removeEventListener('consentkit:ready', subscribe);
      };
    },

    openConsentUi(view) {
      if (!import.meta.client) {
        return;
      }

      if (view === 'preferences') {
        window.ConsentKit?.openPreferences();
      } else {
        window.ConsentKit?.openBanner();
      }
    },

    hasDecision() {
      if (!import.meta.client) {
        return false;
      }

      return window.ConsentKit?.getConsent() != null;
    },
  }) satisfies ConsentAdapter;
```

Three things about this shape are load-bearing, not style:

- **`satisfies ConsentAdapter`, not `: ConsentAdapter`.** A return-type annotation widens the object to the interface, so an optional member like `hasDecision` becomes optional on the *value* too. `satisfies` checks the literal against the contract without discarding its inferred type, so callers who read the returned object still see `hasDecision` as present.
- **`setup` is synchronous.** `useHead()` and `useCookie()` need the active Nuxt instance, which is gone once execution resumes after an `await` — so `setup` is never `async`, and nothing inside it is awaited before it returns. If the CMP's own SDK is asynchronous, kick it off here and call `report()` from its callback instead of awaiting it.
- **`setup`'s early exit is `return undefined;`, not a bare `return;`.** The repository's `consistent-return` lint rule is per function: every return within one function must either specify a value or none may. `setup` has a path that returns a cleanup function, so its other path must return a value too — hence `return undefined;`. `openConsentUi` never returns a value on any path, so its bare `return;` a few lines below is correct as written.

## Patterns worth stealing

Even if your CMP looks nothing like ConsentKit, the same handful of moves apply:

- Inject the CMP script through `useHead` so it gets the same SSR/hydration handling as any other Nuxt-managed tag.
- Validate required configuration in `setup()` and throw on missing values. The store catches the error, logs it, and drops the adapter. Treat this as the right way to fail loudly.
- Handle both load orderings. If the CMP's global is already on `window` when your plugin runs, subscribe immediately. Otherwise wait for the CMP's "ready" event. Either case must end with you holding a subscription.
- Keep all vocabulary translation in one function. The contract boundary belongs in one place, not sprinkled across `setup()`, the change handler, and `hasDecision()`.
- Report the visitor's initial state synchronously inside `setup()` when you can reconstruct it (typically from a server-readable cookie) — the first SSR render then reflects it with no flash. When you cannot, report nothing on the server; consumers see the denied baseline until the client reports in.
- Save every subscription handle (the function returned by `on(...)`, the `addEventListener` reference) and release them in the function `setup()` returns. Without this, replacing the adapter (or hot-reloading in dev) leaks handlers.

If your CMP fires its consent events synchronously during its own init script (before any client plugin can attach), the standard fix is to inject an inline bootstrap script via `useHead` with `tagPriority: 1`. The bootstrap parses before the CMP and accumulates the early event burst into a `window.__*` global that your event listener reads before calling `report()`.

## Notes on SSR, synchronous setup, and cleanup

A few constraints are easy to miss:

- `useHead` and `useCookie` work on both the server and the client. Call them unconditionally inside `setup()`. Only `window`, `document`, and `addEventListener` need an `import.meta.client` guard.
- `setup()` runs synchronously inside the plugin that installs the adapter. Never make it `async`, and never await anything before it returns — doing so loses the active Nuxt instance `useHead()` and `useCookie()` need.
- If your CMP exposes consent through a server-readable cookie, read and `report()` it synchronously inside `setup()`, and the first byte renders with the correct state. If it does not, report nothing on the server and let the client correct it once the CMP loads.
- The cleanup function `setup()` returns runs when the adapter is replaced: either the stop handle `setAdapter` returned is called, or a later `setAdapter` call installs a different adapter. It does not run on Nuxt page navigation. Adapters that need per-route cleanup must arrange that themselves.

Once your adapter is active, `useConsentStore().hasPurposeConsent('analytics')` works in every consumer (your code, the analytics bus, the GTM app) without anyone knowing which CMP you wired in.

## Related

- [App Starter](/apps/app-development/app-starter). Scaffold the Nuxt module, runtime, and plugin skeleton your adapter plugs into.
- [App Configuration](/apps/app-development/app-configuration). How `runtimeConfig`, options, and per-app keys flow into your plugin.
- [Consent Management feature overview](/frontend/features/consent-management). The consumer-facing side of the same store.
- [Cookiebot app](/apps/app-docs/cookiebot). Reference implementation for cookie-based CMPs.
- [CCM19 app](/apps/app-docs/ccm19). Reference implementation for event-based CMPs with custom purposes.
