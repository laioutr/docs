---
title: Media and Media Library
description: Laioutr’s media library abstraction lets business users choose assets from connected backends visually in Cockpit. Implement your own media adapter for your asset system so editors can browse and select (and optionally upload) media in Studio.
seo:
  title: Media and Media Library | Laioutr
  description: Laioutr’s media library abstraction lets business users choose assets from connected backends visually in Cockpit.…
sitemap:
  loc: /frontend/features/media
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## What is the media library?

In Laioutr, **media** (images, videos, audio) are used in sections and blocks: hero banners, product tiles, content blocks, podcast players, and so on. Editors configure these in **Cockpit** (Studio) by picking assets from a **media library**. The library is not a single source: it is an **abstraction** over one or more **backends**. Each connected backend (e.g. Shopify Files, Shopware Media, your own DAM or CMS) is exposed as a **media library provider**. The editor selects a library (e.g. “Shopify”), browses or searches assets, and picks one; the chosen asset is stored as Laioutr’s canonical **Media** type (image, video, or audio with sources, alt, optional placeholder or poster) and rendered on the frontend.

This gives you:

- **One editing experience** – Cockpit shows a unified media picker; the editor doesn’t need to leave Studio to choose from Shopify, Shopware, or a custom system.
- **Backend-agnostic content** – Stored content uses Laioutr’s **Media** shape (sources, provider for Nuxt Image, alt, etc.), so the frontend can render it regardless of which provider supplied it.
- **Extensibility** – You can implement a **media library provider** (adapter) for your own asset system so it appears as a selectable library in Cockpit and editors can browse (and optionally upload) assets.

The abstraction lives in **@laioutr-core/frontend-core** and **@laioutr-core/core-types**. Your Nuxt app must use frontend-core so the media library API and registry are available. Apps like **@laioutr-app/shopify** and **@laioutr-app/shopware** ship with a built-in provider; you can add more by implementing and registering your own.

## How it works

1. **Registration** – Each app that contributes a media library registers a **media library provider** (name, label, optional icon, and a **list** function; optionally an **upload** function). The provider is registered on the server via a Nitro plugin that calls **defineMediaLibraryProvider(provider)**.
2. **Discovery** – When Cockpit loads the project context (e.g. for the reflect route), it fetches the list of available libraries from the frontend app’s API (`POST /api/laioutr/media-libraries`). The response is the **metadata** of each provider (name, label, iconSrc), which Cockpit uses to show library tabs or a dropdown.
3. **Listing** – When the editor opens the media picker and selects a library (and optionally applies search/sort/pagination), Cockpit calls `POST /api/laioutr/media-list` with **library**, **offset**, **limit**, and optional **search** and **sort**. The server looks up the provider by name and calls **provider.list(args)**. The provider calls your backend (e.g. Shopify Files API, Shopware Media API), maps results to Laioutr’s **Media** type plus a **previewUrl** (and optional **fileName**), and returns **items**, **total**, **offset**, **limit**.
4. **Selection** – The editor picks an item. Cockpit stores the **Media** object (and optional studio preview URL) in the block/section prop. The frontend then renders that media (e.g. via Nuxt Image using the media’s **provider** and **src**).
5. **Upload (optional)** – If the provider implements **upload**, the media picker can show an upload UI. Cockpit sends files to `POST /api/laioutr/media-upload` (multipart form with **library** and files). The server validates the library, calls **provider.upload({ files })**, and returns the same shape as list (new items). The provider uploads to your backend and returns the created assets as **ProviderStudioMediaItem[]**.

So: **you implement a provider** that talks to your asset system and speaks the **Media** type and **ProviderStudioMedia** contract; the rest (API routes, Cockpit UI, storage of media in props) is handled by the platform.

## Types and contracts

### Media (canonical shape)

Assets are stored and passed around as the canonical [`Media`](/frontend/api-reference/common-types/media) type from `@laioutr-core/core-types/common`. Your provider must return `Media` objects (with the right `provider` field on each source so nuxt-image can fetch them) so the frontend can render them through the [`<Media>`](/laioutr-ui/ui-kit/general/media) component. See the [Media reference page](/frontend/api-reference/common-types/media) for the full type, source variants, responsive sources, focal points, and placeholder formats.

### Media library provider (your adapter)

A **MediaLibraryProvider** extends **MediaLibraryMeta** and implements:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| **name** | string | yes | Unique id (e.g. `'shopify'`, `'shopware'`, `'my-dam'`). Used in API calls and in project context. |
| **label** | string | yes | Display name in Cockpit (e.g. “Shopify”, “Shopware”). |
| **iconSrc** | string | no | URL to an icon for the library (e.g. `/app-shopify/shopify-logo.svg`). |
| **list** | function | yes | **list(args) => Promise<ProviderStudioMediaResponse>**. Lists assets with pagination/search/sort. |
| **upload** | function | no | **upload(args) => Promise<ProviderStudioMediaResponse>**. Called when the user uploads files; implement only if your backend supports uploads. |

**ProviderStudioMediaArgs** (for **list**):

- **library** – string (your provider name).
- **offset** – number.
- **limit** – number.
- **search** – string (optional).
- **sort** – string (optional).

**ProviderStudioMediaResponse**:

- **items** – **ProviderStudioMediaItem[]**: each has **media** (Media), **previewUrl** (string, for Studio preview), **fileName** (optional).
- **total** – number (total count for pagination).
- **offset** – number.
- **limit** – number.

**UploadMediaArgs** (for **upload**): **files** – array of **ProviderStudioMediaFile** (name, mimeType, size, filepath, optional url, **getStream()** to read the file). Your **upload** implementation should upload each file to your backend and return the same response shape as **list** (the newly created items).

## How to implement a media library provider

### 1. Implement the provider object

Create a server-side module that builds a **MediaLibraryProvider** and registers it with **defineMediaLibraryProvider**. You can use **@laioutr-core/core-types/media-library** for types and **defineMediaLibraryProvider** from frontend-core (auto-imported when the app uses frontend-core).

Example: list-only provider (e.g. a read-only DAM):

```ts
// e.g. server/media-libraries/my-dam.ts
import { defineMediaLibraryProvider } from '#imports';
import type { ProviderStudioMediaItem } from '@laioutr-core/core-types/media-library';
import type { Media, MediaImage } from '@laioutr-core/core-types/common';

export default defineMediaLibraryProvider({
  name: 'my-dam',
  label: 'My DAM',
  iconSrc: '/app-my-dam/logo.svg',
  list: async ({ limit, offset, search, sort }) => {
    const api = getMyDamClient();
    const response = await api.getAssets({ limit, offset, q: search, sort });

    const items: ProviderStudioMediaItem[] = response.items.map((asset) => ({
      media: mapToMedia(asset),
      previewUrl: asset.thumbnailUrl ?? asset.url,
      fileName: asset.fileName,
    }));

    return {
      items,
      total: response.total,
      offset,
      limit,
    };
  },
});

function mapToMedia(asset: any): Media {
  const image: MediaImage = {
    type: 'image',
    sources: [
      {
        provider: 'my-dam',
        src: asset.id,
        width: asset.width,
        height: asset.height,
        responsive: 'static',
      },
    ],
    alt: asset.alt ?? '',
  };
  return image;
}
```

Example: provider with upload (e.g. Shopify-style):

```ts
export default defineMediaLibraryProvider({
  name: 'my-backend',
  label: 'My Backend',
  list: async (args) => { /* ... */ },
  upload: async ({ files }) => {
    const results = await Promise.all(
      files.map(async (file) => {
        const stream = file.getStream();
        const uploaded = await myBackendClient.upload(stream, { name: file.name, mimeType: file.mimeType });
        return {
          media: mapToMedia(uploaded),
          previewUrl: uploaded.previewUrl ?? '',
          fileName: uploaded.name,
        };
      })
    );
    return { items: results, total: results.length, offset: 0, limit: results.length };
  },
});
```

**defineMediaLibraryProvider(provider)** returns a function that, when run, registers the provider with the global **mediaLibraryRegistry**. So the default export of your file is that function; when Nitro loads it as a server plugin, it runs and registers the provider.

### 2. Register the provider in your app

Your app (Nuxt module) must register the media library provider so the frontend app loads it. In **registerLaioutrApp**, pass the path to your provider file in **mediaLibraryProviders**. The kit will add it as a server plugin.

```ts
// In your app's module or registerLaioutrApp call
export default defineNuxtConfig({
  laioutr: {
    apps: [
      {
        name: 'my-app',
        version: '1.0.0',
        mediaLibraryProviders: [resolveRuntimeModule('./server/media-libraries/my-dam')],
        // ... other app config
      },
    ],
  },
});
```

If you use **registerLaioutrApp** from **@laioutr-core/kit** (e.g. in a custom app package):

```ts
registerLaioutrApp({
  name: 'my-app',
  version: '1.0.0',
  mediaLibraryProviders: [resolveRuntimeModule('./server/media-libraries/my-dam')],
  // ...
});
```

After that, the provider is registered when the frontend app starts; **media-libraries** and **media-list** (and **media-upload** if you implemented **upload**) will use it.

### 3. Map your backend assets to Media

Your **list** (and **upload**) must return **Media** that the frontend can render. For images:

- **type: 'image'**.
- **sources**: at least one **MediaSourceImage** with **provider** (your Nuxt Image provider name, or `'raw'` for plain URLs), **src** (URL or id), and optionally **width**, **height**, **responsive**, **focalPoint**.
- **alt** optional.

For video, use **type: 'video'** and **sources** as **MediaSourceVideo[]**. If your backend has a thumbnail, set **poster** on the video media so the player can show it before playback starts. For audio assets, use **type: 'audio'** and **sources** as **MediaSourceAudio[]**; set **cover** if you have album art or a podcast cover.

Ensure your frontend has a Nuxt Image provider for the **provider** value you use (e.g. a custom provider that resolves **src** to your DAM URL), or use **raw** and pass a full URL as **src**.

## API endpoints (reference)

The frontend-core module registers these handlers; you don’t implement them yourself:

| Endpoint | Purpose |
|----------|---------|
| **POST /api/laioutr/media-libraries** | Returns **MediaLibraryMeta[]** (name, label, iconSrc) for all registered providers. Cockpit uses this to show available libraries. |
| **POST /api/laioutr/media-list** | Body: **ProviderStudioMediaArgs**. Returns **ProviderStudioMediaResponse**. Cockpit uses this to show the asset list in the picker. |
| **POST /api/laioutr/media-upload** | Multipart form: **library** + files. Returns **ProviderStudioMediaResponse**. Called when the user uploads; returns 400 if the provider has no **upload**. |

## Summary

- The **media library** lets editors choose assets from connected backends (Shopify, Shopware, custom) visually in Cockpit. Assets are stored as Laioutr’s canonical **Media** type.
- You implement a **media library provider**: **name**, **label**, **iconSrc**, **list(args)**, and optionally **upload({ files })**. You map your backend’s assets to **Media** and **ProviderStudioMediaItem** (with **previewUrl** for Studio).
- Register the provider by exporting it with **defineMediaLibraryProvider** and adding its path to **mediaLibraryProviders** in your app definition. The platform then exposes it via the media-libraries and media-list (and media-upload) APIs so Cockpit can offer it as a selectable library and use it in the media picker.
