---
title: PWA
description: Turn your Laioutr frontend into a Progressive Web App—installable on devices, with offline support and an app-like experience—using zero-config defaults and optional customization.
seo:
  title: PWA | Laioutr
  description: Turn your Laioutr frontend into a Progressive Web App—installable on devices, with offline support and an app-like…
sitemap:
  loc: /frontend/features/pwa
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## What is PWA?

The **PWA** (Progressive Web App) feature lets your Laioutr frontend behave like a native app: users can **install** it on their phone or desktop, open it from the home screen or app list, and in many cases **use it offline** thanks to cached assets and pages. Browsers that support PWA will show an “Add to Home Screen” or “Install app” option when your site meets the required criteria (HTTPS, valid web app manifest, and a registered service worker).

Laioutr’s PWA support is provided by the **@laioutr-app/pwa** package. It wires in [Vite PWA](https://vite-pwa-org.netlify.app/) (via **@vite-pwa/nuxt**) with sensible defaults so you get a working PWA with minimal configuration. You can override manifest, caching, and update behavior to match your brand and requirements.

## What you get

- **Web app manifest** – Name, short name, theme color, and icons so the browser and OS can show your app correctly when installed and in the task switcher.
- **Service worker** – Caches your app’s assets (JS, CSS, HTML, images) so the app can load and navigate even when the network is slow or unavailable.
- **Auto-update** – By default, the service worker updates in the background; the next full page load uses the new version so users stay up to date without extra steps.
- **Install prompt** – Optional support for triggering the browser’s “Install app” flow from your UI (e.g. a custom banner or button).
- **Page wrapper** – The app registers a small PWA wrapper in the Laioutr page wrapper stack so PWA assets are included where your layout is used.

No orchestr, analytics, or backend is added; the feature is purely about making your existing frontend installable and offline-capable.

## Enabling PWA

Add the PWA app to your Nuxt modules. In `nuxt.config.ts` or via your Laioutr project config (e.g. **laioutrrc.json**):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/pwa', '@laioutr-core/frontend-core'],
});
```

Once the module is enabled, it merges its default PWA config with any options you pass under **`@laioutr-app/pwa`** (or under **`pwa`** in Nuxt config). The underlying **@vite-pwa/nuxt** module is installed automatically. Ensure your app is served over **HTTPS** in production so the service worker and install flow work.

## Configuration

Configuration is optional. The module ships with defaults that work out of the box; you only need to change them to customize name, icons, theme, caching, or update strategy.

### Where to configure

- **Laioutr projects** – In **laioutrrc.json**, under the app entry for **@laioutr-app/pwa**, put your overrides in the **config** object. They are passed into the module and merged with the defaults.
- **Nuxt config** – In **nuxt.config.ts**, use the **`@laioutr-app/pwa`** key (or **`pwa`**) and set the same options. Options are merged with the module’s defaults.

All options are the same as those supported by [Vite PWA / @vite-pwa/nuxt](https://vite-pwa-org.netlify.app/); the Laioutr app simply provides defaults and forwards your config to that module.

### Main options (overview)

| Area | What it does | Default (Laioutr) |
|------|----------------|-------------------|
| **Manifest** | App name, short name, theme color, icons shown when installed and in the task switcher. | Name: "Laioutr App", short_name: "LaioutrApp", theme_color: "#ffffff", icons: 192×192 and 512×512 (you should replace with your own). |
| **Register type** | When the service worker updates: **autoUpdate** = use new version on next reload; **prompt** = ask the user to reload. | **autoUpdate** |
| **Workbox** | What to cache and how. **navigateFallback** = fallback URL for offline navigation; **globPatterns** = which file types to precache. | navigateFallback: "/", globPatterns: JS, CSS, HTML, PNG, SVG, ICO. |
| **Client / install prompt** | Whether to enable the API for showing an install prompt from your UI. | **true** |
| **Dev options** | Whether to enable PWA in development (e.g. for testing the service worker). | **enabled: true**, type: "module" |

Replace the default **icons** (e.g. `pwa-192x192.png`, `pwa-512x512.png`) with your own in `public/` and reference them in the manifest, or override the full **manifest** object. Similarly, set **name**, **short_name**, and **theme_color** to match your brand.

### Example customization

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-app/pwa'],
  '@laioutr-app/pwa': {
    manifest: {
      name: 'My Store',
      short_name: 'MyStore',
      theme_color: '#1a1a2e',
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    registerType: 'autoUpdate',
    // workbox, client, devOptions, etc. can be overridden here as needed
  },
});
```

Place your icon files in `public/icons/` (or the paths you use in the manifest). For full option reference, see the [Vite PWA documentation](https://vite-pwa-org.netlify.app/).

## What you need to provide

- **Icons** – At least one icon (e.g. 192×192 and 512×512 PNG) for the manifest. The default config references `pwa-192x192.png` and `pwa-512x512.png`; add these to `public/` or override **manifest.icons** with your paths.
- **HTTPS** – In production, serve your site over HTTPS so the service worker can register and the install prompt is available.
- **Name and branding** (optional) – Override **manifest.name**, **manifest.short_name**, and **manifest.theme_color** so the installed app and splash screen match your brand.

## Summary

- **PWA** makes your Laioutr frontend installable and offline-capable with sensible defaults.
- Add **@laioutr-app/pwa** to your modules and, if needed, configure **@laioutr-app/pwa** (or **pwa**) in Nuxt config or laioutrrc.json.
- Provide your own icons and optionally customize manifest, workbox, register type, and install prompt. Use HTTPS in production.
- For advanced options and full reference, see the [Vite PWA docs](https://vite-pwa-org.netlify.app/).
