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

A consent adapter is a small class that bridges a concrete CMP (OneTrust, CookieYes, an in-house solution) and Laioutr's [consent store](/frontend/features/consent-management). The store calls `init()` to load the CMP, asks `getConsentState()` for the current categories, subscribes to `onConsentChange()` for live updates, and forwards user actions like "open the banner" through `showConsentOverlay()`.

If your CMP is already covered by `@laioutr-app/cookiebot` or `@laioutr-app/ccm19`, use those instead. Build your own only when no existing app fits.

A consent adapter app is a normal Laioutr app (a Nuxt module that exposes its options on `runtimeConfig.public` and registers a client plugin) plus two adapter-specific pieces:

1. An **adapter class** that implements `ConsentAdapter` from `#frontend/consent`.
2. A **client plugin** that instantiates the adapter and registers it with `useConsentStore()` via `registerAdapter` + `activateAdapter`.

For the module skeleton, options handling, and how `runtimeConfig.public` flows into your plugin, scaffold from the [App Starter](/apps/app-development/app-starter) and follow [App Configuration](/apps/app-development/app-configuration). This guide focuses on the consent-specific contract and walks through one worked example against a fictional CMP API.

## The ConsentAdapter contract

The contract is exported from `@laioutr-core/frontend-core` and re-exported under the `#frontend/consent` alias:

```ts
import type { ConsentAdapter, ConsentManagementState } from '#frontend/consent';

export interface ConsentAdapter {
  readonly name: string;
  readonly isActive: boolean;
  init(): Promise<void> | void;
  getConsentState(): Promise<Partial<ConsentManagementState>> | Partial<ConsentManagementState>;
  showConsentOverlay(): Promise<void> | void;
  renewConsent(): Promise<void> | void;
  hasCategoryConsent(category: keyof ConsentManagementState): boolean;
  onConsentChange(callback: (consent: Partial<ConsentManagementState>) => void): void;
  destroy?(): Promise<void> | void;
}
```

::field-group
  :::field{required name="name" type="string"}
  Stable identifier for the adapter (e.g. `'cookiebot'`, `'ccm19'`, `'onetrust'`). The store uses it as the key in `registerAdapter` / `activateAdapter`.
  :::

  :::field{required name="isActive" type="boolean"}
  Readonly flag the adapter sets to `true` after `init()` finishes successfully. Useful for diagnostics; the store does not depend on it.
  :::

  :::field{required name="init()" type="() => Promise<void> | void"}
  Loads the CMP script (typically via `useHead`), wires up cookie or event listeners, and prepares the adapter to report consent. Throw if required configuration is missing; the store will catch the error and deactivate.
  :::

  :::field
  ---
  required: true
  name: getConsentState()
  type: () => Promise<Partial<ConsentManagementState>> |
    Partial<ConsentManagementState>
  ---
  Returns the current consent as a partial of the five-category shape. Called once on activation (the result is merged into `state`). Sync if you can read from a cookie; async only when you genuinely need to wait.
  :::

  :::field{required name="showConsentOverlay()" type="() => Promise<void> | void"}
  Opens the CMP's main banner. Wired to "Cookie preferences" links in the user's app.
  :::

  :::field{required name="renewConsent()" type="() => Promise<void> | void"}
  Opens the granular preferences dialog so the user can revisit individual categories. Some CMPs use the same UI for both; that is fine.
  :::

  :::field
  ---
  required: true
  name: hasCategoryConsent(category)
  type: "(category: keyof ConsentManagementState) => boolean"
  ---
  Synchronous check for one category. Almost always derived from `getConsentState()`.
  :::

  :::field
  ---
  required: true
  name: onConsentChange(callback)
  type: "(callback: (consent: Partial<ConsentManagementState>) => void) => void"
  ---
  Registers a callback fired whenever the CMP reports a consent change. The store calls this once during activation; you must invoke every registered callback when the CMP fires its own change event. The store merges the callback's argument into `state`.
  :::

  :::field{name="destroy()" type="() => Promise<void> | void"}
  Optional. Tear down listeners and globals when the store deactivates the adapter. Lets you clean up timers, event handlers, or injected scripts.
  :::
::

A `Partial<ConsentManagementState>` is enough: the store merges it into the existing state, so omitted keys keep their previous value.

## Registering the adapter

Once the adapter class exists, the client plugin in your app instantiates it, calls `store.registerAdapter(adapter)`, then `store.activateAdapter(adapter.name)`. `registerAdapter` is idempotent; `activateAdapter` deactivates any previously active adapter first, so the active provider is always exactly one. Activation triggers `init()` and the initial `getConsentState()` read inside the store, so the host app does nothing beyond installing your module.

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
import type { ConsentAdapter, ConsentManagementState } from '#frontend/consent';

interface ConsentKitConfig {
  apiKey: string;
  region?: string;
}

export class ConsentKitAdapter implements ConsentAdapter {
  readonly name = 'consentkit';
  private _isActive = false;
  private _callbacks: Array<(c: Partial<ConsentManagementState>) => void> = [];
  private _unsubscribe: (() => void) | null = null;

  constructor(private _config: ConsentKitConfig) {}

  get isActive() { return this._isActive; }

  async init() {
    if (!this._config.apiKey) throw new Error('ConsentKit: apiKey is required');

    const params = new URLSearchParams({ key: this._config.apiKey });
    if (this._config.region) params.set('region', this._config.region);

    useHead({
      script: [{ id: 'consentkit', src: `https://cdn.consentkit.example/widget.js?${params}`, async: true }],
    });

    if (import.meta.client) {
      // The widget may load before or after this plugin runs; handle both.
      const subscribe = () => {
        this._unsubscribe = window.ConsentKit!.on('consent-change', (state) => {
          this._notify(this.mapConsent(state));
        });
        const initial = window.ConsentKit!.getConsent();
        if (initial) this._notify(this.mapConsent(initial));
      };

      if (window.ConsentKit) subscribe();
      else window.addEventListener('consentkit:ready', subscribe, { once: true });
    }

    this._isActive = true;
  }

  getConsentState(): Partial<ConsentManagementState> {
    if (import.meta.client && window.ConsentKit) {
      const current = window.ConsentKit.getConsent();
      if (current) return this.mapConsent(current);
    }
    return { necessary: true }; // SSR or pre-load: only essential is safe by default.
  }

  hasCategoryConsent(category: keyof ConsentManagementState): boolean {
    return this.getConsentState()[category] ?? false;
  }

  onConsentChange(callback: (c: Partial<ConsentManagementState>) => void) {
    this._callbacks.push(callback);
  }

  async showConsentOverlay() {
    if (import.meta.client) window.ConsentKit?.openBanner();
  }

  async renewConsent() {
    if (import.meta.client) window.ConsentKit?.openPreferences();
  }

  async destroy() {
    this._unsubscribe?.();
    this._unsubscribe = null;
    this._callbacks = [];
    this._isActive = false;
  }

  // The contract boundary: ConsentKit's category names become Laioutr's.
  private mapConsent(c: ConsentKitState): Partial<ConsentManagementState> {
    return { necessary: c.essential, functional: c.functional, statistics: c.analytics, marketing: c.ads };
  }

  private _notify(consent: Partial<ConsentManagementState>) {
    for (const cb of this._callbacks) cb(consent);
  }
}
```

## Patterns worth stealing

Even if your CMP looks nothing like ConsentKit, the same handful of moves apply:

- Inject the CMP script through `useHead` so it gets the same SSR/hydration handling as any other Nuxt-managed tag.
- Validate required configuration in `init()` and throw on missing values. The store catches the error, logs it, and deactivates the adapter. Treat this as the right way to fail loudly.
- Handle both load orderings. If the CMP's global is already on `window` when your plugin runs, subscribe immediately. Otherwise wait for the CMP's "ready" event. Either case must end with you holding a subscription.
- Keep all category-name translation in one private method. The contract boundary belongs in one place, not sprinkled across `init()`, `getConsentState()`, and the change handler.
- Return `{ necessary: true }` from `getConsentState()` when you cannot reconstruct consent on the server (or before the script has loaded). The client overwrites it once the CMP reports in, and consumers see safe defaults until then.
- Save every subscription handle (the function returned by `on(...)`, the `addEventListener` reference) and release them in `destroy()`. Without this, deactivating the adapter (or hot-reloading in dev) leaks handlers.

If your CMP fires its consent events synchronously during its own init script (before any client plugin can attach), the standard fix is to inject an inline bootstrap script via `useHead` with `tagPriority: 1`. The bootstrap parses before the CMP and accumulates the early event burst into a `window.__*` global that `getConsentState()` reads later.

## Notes on SSR, late init, and cleanup

A few constraints are easy to miss:

- `useHead` and `useCookie` work on both the server and the client. Call them unconditionally inside `init()`. Only `window`, `document`, and `addEventListener` need an `import.meta.client` guard.
- The store calls `init()` first, then `getConsentState()`, then registers its own callback through `onConsentChange()`. The order matters when you reason about which payloads arrive at the store before activation completes (none) versus after (every subsequent `_notify` call).
- If your CMP exposes consent through a server-readable cookie, `getConsentState()` can read it on SSR and the first byte renders with the correct state. If it does not, return the denied baseline and let the client correct it.
- `destroy()` only runs when the store deactivates the adapter (an explicit `deactivateAdapter()` call or a swap to a different adapter via `activateAdapter()`). It does not run on Nuxt page navigation. Adapters that need per-route cleanup must arrange that themselves.

Once your adapter is active, `useConsentStore().hasCategoryConsent('statistics')` works in every consumer (your code, the tracking store, the GTM app) without anyone knowing which CMP you wired in.

## Related

- [App Starter](/apps/app-development/app-starter). Scaffold the Nuxt module, runtime, and plugin skeleton your adapter plugs into.
- [App Configuration](/apps/app-development/app-configuration). How `runtimeConfig`, options, and per-app keys flow into your plugin.
- [Consent Management feature overview](/frontend/features/consent-management). The consumer-facing side of the same store.
- [Cookiebot app](/apps/app-docs/cookiebot). Reference implementation for cookie-based CMPs.
- [CCM19 app](/apps/app-docs/ccm19). Reference implementation for event-based CMPs with custom purposes.
