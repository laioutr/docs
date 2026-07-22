---
title: Media and Media Library
description: Laioutr’s media library abstraction lets business users choose assets from connected backends visually in Cockpit. Implement a media library connector for your asset system so editors can browse, filter, and (optionally) upload media in Studio.
seo:
  title: Media and Media Library
  description: Laioutr’s media library abstraction lets business users choose assets from connected backends visually in Cockpit.…
sitemap:
  loc: /frontend/features/media
  lastmod: 2026-07-08
  changefreq: monthly
  priority: 1.0
changelogKeys:
  - MediaLibrary

---

::since-version{version="0.35.0" packages="@laioutr-core/frontend-core, @laioutr-core/orchestr" changelog="frontend"}
::

## What is the media library?

In Laioutr, **media** (images, videos, audio) are used in sections and blocks: hero banners, product tiles, content blocks, podcast players, and so on. Editors configure these in **Cockpit** (Studio) by picking assets from a **media library**. The library is not a single source: it is an **abstraction** over one or more **backends**. Each connected backend (e.g. Shopify Files, Shopware Media, your own DAM or CMS) is exposed as a **media library connector**. The editor selects a library (e.g. “Shopify”), browses, searches, or filters assets, and picks one; the chosen asset is stored as Laioutr’s canonical [`Media`](/frontend/api-reference/common-types/media) type (image, video, or audio with sources, alt, optional placeholder or poster) and rendered on the frontend.

This gives you:

- **One editing experience** – Cockpit shows a unified media picker; the editor doesn’t need to leave Studio to choose from Shopify, Shopware, or a custom system.
- **Backend-agnostic content** – Stored content uses Laioutr’s **Media** shape (sources, provider for Nuxt Image, alt, etc.), so the frontend can render it regardless of which provider supplied it.
- **Extensibility** – You can implement a **media library connector** for your own asset system so it appears as a selectable library in Cockpit, and editors can browse, filter, and (optionally) upload assets.

A media library is an **Orchestr integration facet**: you declare it on the same builder that carries your app’s identity (`.meta()`) and per-request context (`.extendRequest()`), alongside `queryHandler` / `componentResolver` / `actionHandler`. It inherits the app’s label, logo, and backend client — no re-declaration, no second client to instantiate. Apps like **@laioutr-app/shopify** and **@laioutr-app/shopware** ship with a built-in connector; you add more by declaring and registering your own.

## How it works

1. **Declaration** – Each app that contributes a media library declares a connector via **`defineX.mediaLibrary({ … })`** on its Orchestr builder. Identity (`id`, `label`, `iconSrc`) is **derived from the builder’s `.meta()`** — the connector object itself carries only `capabilities` and the handler functions (`list`, and optionally `upload` / `createUploadTargets` / `finalizeUploads`). The return value is a Nitro plugin, registered exactly like the app’s other Orchestr handlers.
2. **Discovery** – When Cockpit loads the project context, it fetches the registered libraries from the frontend app (`POST /api/laioutr/media-libraries`). The response is a **`MediaLibraryDescriptor[]`** — `{ id, label, iconSrc, capabilities }` per library. Cockpit reads `capabilities` to configure the picker (search box, sort dropdown, folder navigation, upload button) **before its first list call**, with no round-trip.
3. **Browsing** – When the editor opens the picker and selects a library, Cockpit calls `POST /api/laioutr/media-list` with a **`MediaQuery`** (opaque `cursor`, `limit`, and — where the capabilities allow — `term`, `type`, `tags`, `sorting`, `folderId`, `scope`). The connector compiles the query into its backend’s native DSL, maps results to Laioutr’s **Media** type, and returns a **`MediaListResult`** (`items`, optional `folders`, `nextCursor`, optional `total`).
4. **Selection** – The editor picks an item. Cockpit stores the **Media** object (plus a studio preview URL) in the block/section prop. The frontend then renders that media (e.g. via Nuxt Image using each source’s **provider** and **src**).
5. **Upload (optional)** – If the connector declares an upload capability, the picker shows an upload UI. Depending on `capabilities.upload.transfer`, bytes either **relay through the Nitro route** (proxied) or **go browser → backend directly** (staged). Either way the connector returns finished `Media` — readiness is absorbed by the connector, never modeled in the contract.

Everything after the connector — API routes, the Cockpit picker UI, prop storage, origin stamping, and output validation — is handled by the platform. **You implement a connector** that talks to your asset system and speaks the **Media** type and the media-library contract.

## The connector contract

All types live in **`@laioutr-core/core-types/media-library`** (plus [`Media`](/frontend/api-reference/common-types/media) from `@laioutr-core/core-types/common`). A connector implements `MediaLibraryProvider`:

```ts [@laioutr-core/core-types/media-library]
interface MediaLibraryProvider<TContext> {
  capabilities: MediaLibraryCapabilities;
  list: (query: MediaQuery, ctx: TContext) => Promise<MediaListResult>;
  // proxied upload — bytes relay through the Nitro route:
  upload?: (args: { files: ProviderStudioMediaFile[] }, ctx: TContext) => Promise<UploadOutcome[]>;
  // staged upload — browser PUTs bytes directly to the backend:
  createUploadTargets?: (args: { files: UploadFileMeta[] }, ctx: TContext) => Promise<UploadTarget[]>;
  finalizeUploads?: (args: { refs: string[] }, ctx: TContext) => Promise<UploadOutcome[]>;
}
```

> Identity (`id` / `label` / `iconSrc`) is **not** declared on the connector. It is derived from the builder’s `.meta()`: the library `id` is `meta.app`, `label` is `meta.label`, `iconSrc` is `meta.logoUrl`. This is why the connector object has no `name`/`label`/`iconSrc` fields — the logo and label can never drift from the app’s.

Every handler receives, as its **second argument**, the per-request **`ctx`** built by the app’s `.extendRequest()` initwares — the same context the data handlers get. Reuse the already-built backend client instead of instantiating your own:

```ts
list: async (query, ctx) => {
  const adminClient = ctx.shopifyAdminClient; // built by the app's extendRequest
  // …
}
```

### Capabilities

Static flags the picker reads before its first list call, shipped in the discovery payload so the UI configures itself:

```ts [@laioutr-core/core-types/media-library]
interface MediaLibraryCapabilities {
  search?: boolean;             // free-text term supported
  tags?: boolean;               // tag filtering supported
  folders?: boolean;            // library has a folder tree — picker renders folder nav
  sorts?: MediaSortOption[];    // declared sort options: { key, label }, e.g. { key: 'createdAt:desc', label: 'Newest first' }
  upload?: MediaUploadCapability;
  deleteAssets?: boolean;       // reserved for a future capability — not used in v1
}

interface MediaUploadCapability {
  transfer: 'proxied' | 'staged';
  maxBatchSize?: number;
  maxFileSize?: number;         // bytes
  accept?: string[];            // MIME patterns, e.g. ['image/*', 'video/mp4']
}
```

Declare only what your backend supports. The picker hides UI it can’t use — no sort dropdown when `sorts` is empty, no folder breadcrumb when `folders` is `false`, no upload button when `upload` is absent — and pre-validates uploads client-side against `accept` / `maxFileSize`.

Pagination is **not** a capability: the outward contract is always opaque-cursor. An offset-only backend encodes its offset inside the cursor.

### Browsing — `MediaQuery` → `MediaListResult`

```ts [@laioutr-core/core-types/media-library]
interface MediaQuery {
  cursor?: string;              // opaque; omit for the first page
  limit: number;                // 1–100
  term?: string;                // only if capabilities.search
  type?: MediaType[];           // 'image' | 'video' | 'audio'; seeded from the field's allowedTypes
  tags?: string[];              // only if capabilities.tags
  sorting?: string;             // one of capabilities.sorts[].key
  folderId?: string;            // only if capabilities.folders; undefined = root
  scope?: 'folder' | 'all';     // only if capabilities.folders; 'folder' (default) = the folderId
                                //   location, 'all' = whole library, ignoring folderId
}

interface MediaListResult {
  items: ProviderStudioMediaItem[];
  folders?: MediaFolder[];      // subfolders of the queried location; FIRST (cursorless) page only
  nextCursor?: string;          // absent = end of the asset stream
  total?: number;               // optional — many backends can't give it cheaply
}
```

- **Type** is explicit and always present (`image` / `video` / `audio` → MIME prefix). The picker seeds it from the field’s `allowedTypes`; compile it into your backend’s filter so `allowedTypes` is honored server-side.
- **Sorting** maps `capabilities.sorts[].key` to your backend’s native sort. A backend omits sort keys it can’t support.
- **`scope: 'all'`** exists because `folderId: undefined` already means “the root level”. On backends where root holds only *unfiled* assets (Shopware), “root” and “everywhere” are different sets — `scope: 'all'` is the explicit whole-library signal (a “search everywhere” toggle in the picker). An `all` response carries no `folders`.

`ProviderStudioMediaItem` is the browse-time shape for one asset:

```ts [@laioutr-core/core-types/media-library]
interface ProviderStudioMediaItem {
  media: Media;
  previewUrl: string;
  fileName?: string;
  externalId?: string;                          // backend asset id — see "Asset origin" below
  status?: 'ready' | 'processing' | 'failed';   // browse-time only, never persisted; absent ⇒ ready
  statusMessage?: string;                       // optional reason, e.g. a failed transcode
}
```

`status` is transient decoration: fill it from your backend’s list response (Shopify Files’ `fileStatus`, Cloudflare Stream’s `readyToStream`) and the picker renders a spinner on `processing` tiles and an error badge on `failed` ones, disabling selection of failed assets. Image-only backends omit it and everything reads as ready.

### Folder navigation

Folders are **not** a separate endpoint. `list` returns the contents of one location — its assets and (on the first page) its subfolders — and `folderId` chooses the location:

```ts [@laioutr-core/core-types/media-library]
interface MediaFolder { id: string; name: string; parentId?: string; childCount?: number }
```

- Declare `folders: true`. On the **first (cursorless) page** of a level, return that level’s subfolders in `MediaListResult.folders`; on cursor-continuation pages (infinite scroll) return just `items`.
- `folderId: undefined` browses the root; a folder’s id browses into it. The picker renders a breadcrumb and drill-down grid, caching each level for instant breadcrumb-up.
- A flat backend declares `folders: false` and never returns `folders` — the picker shows no breadcrumb.

### Upload

Two paths, chosen by `capabilities.upload.transfer`. Both return **per-file** `UploadOutcome`s (`allSettled` semantics — one bad file never sinks the batch), and both keep readiness out of the contract: the connector returns finished `Media`.

**Proxied** — small images; bytes relay browser → protected Nitro route → connector:

```ts [@laioutr-core/core-types/media-library]
upload?: (args: { files: ProviderStudioMediaFile[] }, ctx) => Promise<UploadOutcome[]>;

interface ProviderStudioMediaFile {
  name: string;
  mimeType: string;
  size: number;
  filepath: string;
  url?: string;
  getStream: () => ReadStream;   // read the uploaded bytes
}
```

**Staged** — large files / serverless body limits; the browser PUTs bytes directly to the backend, so you mint signed targets first and commit them after:

```ts [@laioutr-core/core-types/media-library]
createUploadTargets?: (args: { files: UploadFileMeta[] }, ctx) => Promise<UploadTarget[]>;
finalizeUploads?:     (args: { refs: string[] }, ctx) => Promise<UploadOutcome[]>;

interface UploadFileMeta { name: string; mimeType: string; size: number }   // metadata only, no bytes

interface UploadTarget {
  ref: string;                        // opaque token correlating target → outcome
  url: string;                        // browser PUTs/POSTs bytes here
  method?: 'PUT' | 'POST';
  fields?: Record<string, string>;    // form fields (GCS/S3); the file field is sent last
  headers?: Record<string, string>;
}

type UploadErrorCode = 'too_large' | 'unsupported_type' | 'processing_failed' | 'upload_failed';

type UploadOutcome =
  | { ref: string; ok: true;  item: ProviderStudioMediaItem }
  | { ref: string; ok: false; error: { code: UploadErrorCode; message: string } };
```

The `ref` is how a target correlates to its outcome across the browser’s direct PUT. In `finalizeUploads` you register the uploaded refs and, if the backend’s delivery URL is only available after processing, **block until it is ready** (e.g. Shopify polls `fileStatus` until `READY`). If the URL is derivable from a stable id issued at upload time and self-heals once processing completes (Cloudflare Stream, Mux), return the optimistic media right away — no wait.

> **Staged-upload CORS.** The signed target’s bucket/endpoint must allow a **CORS PUT/POST from the Cockpit (or storefront) origin**, because the browser uploads directly to it. This is an operational requirement of the staged path; proxied uploads have no such concern (bytes ride the already-protected Nitro route).

## How to implement a connector

A connector is a server-side module whose default export is `defineX.mediaLibrary({ … })`. Register it via `mediaLibraryProviders` in your app definition (below).

### List-only (read-only DAM, flat)

```ts [server/media-libraries/my-dam.ts]
import type { MediaListResult, MediaQuery, ProviderStudioMediaItem } from '@laioutr-core/core-types/media-library';
import type { Media } from '@laioutr-core/core-types/common';
import { defineMyDam } from '../middleware/defineMyDam'; // your app's Orchestr builder (.meta().extendRequest())

export default defineMyDam.mediaLibrary({
  capabilities: {
    search: true,
    folders: false,
    sorts: [
      { key: 'createdAt:desc', label: 'Newest first' },
      { key: 'name:asc', label: 'Name (A–Z)' },
    ],
  },

  list: async (query: MediaQuery, ctx): Promise<MediaListResult> => {
    const api = ctx.damClient; // built by the app's extendRequest — no re-instantiation
    const res = await api.getAssets({
      cursor: query.cursor,
      limit: query.limit,
      q: query.term,
      types: query.type,
      sort: query.sorting,
    });

    const items: ProviderStudioMediaItem[] = res.assets.map((asset) => ({
      media: mapToMedia(asset),
      previewUrl: asset.thumbnailUrl ?? asset.url,
      fileName: asset.fileName,
      externalId: asset.id, // stamped into media.sources[].origin.externalId by the wrapper
    }));

    return { items, nextCursor: res.nextCursor, total: res.total };
  },
});

function mapToMedia(asset: { id: string; width: number; height: number; alt?: string }): Media {
  return {
    type: 'image',
    alt: asset.alt ?? '',
    sources: [{ provider: 'my-dam', src: asset.id, width: asset.width, height: asset.height, responsive: 'static' }],
  };
}
```

### With folders

Declare `folders: true` and return the queried level’s subfolders on the first page only:

```ts [server/media-libraries/my-dam.ts]
export default defineMyDam.mediaLibrary({
  capabilities: { folders: true, search: true, sorts: SORTS },

  list: async (query, ctx): Promise<MediaListResult> => {
    const api = ctx.damClient;
    const isFirstPage = !query.cursor && query.scope !== 'all';

    const [assets, folders] = await Promise.all([
      api.listAssets({ folderId: query.folderId, cursor: query.cursor, limit: query.limit }),
      isFirstPage ? api.listChildFolders(query.folderId) : Promise.resolve(undefined),
    ]);

    return {
      items: assets.items.map((asset) => ({ media: mapToMedia(asset), previewUrl: asset.url, externalId: asset.id })),
      ...(folders ? { folders } : {}),
      nextCursor: assets.nextCursor,
    };
  },
});
```

### With staged upload

```ts [server/media-libraries/my-backend.ts]
export default defineMyBackend.mediaLibrary({
  capabilities: {
    upload: { transfer: 'staged', maxBatchSize: 20, accept: ['image/*', 'video/*'] },
  },

  list: async (query, ctx) => { /* … */ },

  createUploadTargets: async ({ files }, ctx) => {
    const api = ctx.backendClient;
    return Promise.all(
      files.map(async (file) => {
        const target = await api.createUploadUrl({ name: file.name, mimeType: file.mimeType });
        return { ref: target.token, url: target.url, method: 'PUT' as const };
      })
    );
  },

  finalizeUploads: async ({ refs }, ctx) => {
    const api = ctx.backendClient;
    return Promise.all(
      refs.map(async (ref) => {
        try {
          const asset = await api.commit(ref);      // block until a usable delivery URL exists
          return { ref, ok: true, item: { media: mapToMedia(asset), previewUrl: asset.url, externalId: asset.id } };
        } catch (error) {
          return { ref, ok: false, error: { code: 'processing_failed', message: String(error) } };
        }
      })
    );
  },
});
```

## Registering the connector in your app

The default export of your connector module is a Nitro plugin. Register it by adding its path to `mediaLibraryProviders` in your app definition — unchanged from before:

```ts [module.ts]
export default defineNuxtModule({
  setup(options, nuxt) {
    registerLaioutrApp({
      name: 'my-app',
      version: '1.0.0',
      mediaLibraryProviders: [resolveRuntimeModule('./server/media-libraries/my-dam')],
      // … other app config
    });
  },
});
```

After that, the connector is registered when the frontend app starts, and the media-libraries / media-list (and upload) routes drive it.

## Asset origin and output validation

Two platform behaviors wrap every connector, at the `.mediaLibrary()` boundary — you don’t implement them, but you should know they run.

### Origin stamping

Each media source records **where it came from** via an optional `origin`:

```ts [@laioutr-core/core-types/common]
interface MediaOrigin {
  libraryId: string;     // the producing library's id (= meta.app)
  externalId?: string;   // the asset's stable id within that library (Shopify gid, Shopware media UUID)
}
// origin?: MediaOrigin — added to every media source (image, video, audio)
```

You supply the backend asset id once, at the item level, via `ProviderStudioMediaItem.externalId`. The wrapper **fans it into every `media.sources[].origin`** (with the resolved `libraryId`) — a per-source value you set explicitly is never clobbered; the framework fills the rest. `origin` is additive and optional, so no stored-data migration is needed; old persisted media validate with it absent. It is management-plane data (the seam for future re-resolution / orphan detection) — the storefront renderer never reads it.

### Trust-boundary validation

The wrapper is the single trust boundary for connector output. Every `Media` returned by `list` / `upload` / `finalizeUploads` is:

1. **Schema-parsed** against the canonical `Media` Zod schema. A parse failure drops the `list` item (with a server-side warning) or becomes a failed `UploadOutcome` — never a silent partial value.
2. **URL-scheme guarded.** Every `src` and `previewUrl` must use `http(s):` (or a known render-provider scheme). `javascript:`, `data:`, and `vbscript:` are rejected — including inside nested poster/cover images — so a buggy or malicious connector can’t plant stored XSS into the render payload.
3. **Capability-agreed.** Response fields the library didn’t declare are dropped (`folders` when `folders: false`, a `sorting` key absent from `capabilities.sorts`), and inbound queries are constrained to declared capabilities — so a caller bypassing the picker (MCP, curl) can’t feed your connector parameters outside its contract.

This validates *shape and safety*, not *truthfulness*: it can’t tell whether `status: 'ready'` is honest or whether `externalId` names the right asset — those stay your connector’s responsibility.

## API endpoints (reference)

The frontend-core module registers these handlers; you don’t implement them. All are behind the `Authorization: Bearer <projectSecretKey>` gate that protects every `/api/laioutr/*` route, so they are also drivable server-to-server (e.g. from the Cockpit Studio MCP server).

| Endpoint | Purpose |
|----------|---------|
| **POST /api/laioutr/media-libraries** | Returns **`MediaLibraryDescriptor[]`** (`{ id, label, iconSrc, capabilities }`) for all registered libraries. |
| **POST /api/laioutr/media-list** | Body: `MediaQuery` + `library`. Returns `MediaListResult` (assets **+** subfolders of the queried location). |
| **POST /api/laioutr/media-upload** | Proxied upload (multipart). Returns `UploadOutcome[]`. |
| **POST /api/laioutr/media-upload-targets** | Staged upload phase 1 — mint signed targets from file metadata (no bytes). |
| **POST /api/laioutr/media-finalize** | Staged upload phase 2 — commit uploaded refs, absorb readiness, return finished items. |

## Migrating from `defineMediaLibraryProvider`

The pre-v2 `defineMediaLibraryProvider({ name, label, iconSrc, list, upload })` factory still works as a **deprecated compatibility shim** — existing connectors keep registering without a rewrite. A shimmed library runs in a **degraded mode**: no folder navigation, no staged upload, no declared sorts, and no server-side `type` filtering (the old `list` had no `type` param). It logs a one-time deprecation warning at registration.

Migrate by moving the connector onto your app’s Orchestr builder:

```ts
// Before — standalone factory, offset pagination, identity re-declared
export default defineMediaLibraryProvider({
  name: 'my-dam',
  label: 'My DAM',
  iconSrc: '/app-my-dam/logo.svg',
  list: async ({ offset, limit, search, sort }) => ({ items, total, offset, limit }),
});

// After — Orchestr facet, cursor pagination, identity from .meta()
export default defineMyDam.mediaLibrary({
  capabilities: { search: true, folders: false, sorts: [/* … */] },
  list: async (query, ctx) => ({ items, nextCursor, total }),
});
```

What changes:

- **Identity** moves from the connector’s `name` / `label` / `iconSrc` to the builder’s `.meta({ app, label, logoUrl })`.
- **Pagination** moves from `offset` / `limit` / `total` to an **opaque `cursor`** + `nextCursor`.
- **`list` returns `MediaListResult`** (`items`, `folders?`, `nextCursor`, `total?`) instead of `{ items, total, offset, limit }`.
- **`list` gains a second `ctx` argument** — use the app’s `extendRequest`-built client instead of instantiating your own.
- **Upload becomes per-file `UploadOutcome[]`** (and gains the optional staged path) instead of a single bulk response.
- You can now declare **folders**, **tags**, **static sorts**, and a **server-side type filter** — none expressible in the old contract.

## Summary

- The **media library** lets editors choose assets from connected backends (Shopify, Shopware, custom) visually in Cockpit. Assets are stored as Laioutr’s canonical **Media** type.
- A connector is an **Orchestr integration facet**: `defineX.mediaLibrary({ capabilities, list, upload?, createUploadTargets?, finalizeUploads? })`. Identity is derived from `.meta()`, and every handler receives the app’s per-request `ctx`.
- Declare **capabilities** so the picker configures itself; browse with an **opaque-cursor `MediaQuery`** and return a **`MediaListResult`** (assets + optional folders). Upload via the **proxied** or **staged** path, returning per-file `UploadOutcome`s.
- Register the connector by adding its path to `mediaLibraryProviders` in your app definition. The platform handles the API routes, picker UI, prop storage, **origin stamping**, and **trust-boundary validation**.
- The legacy `defineMediaLibraryProvider` factory still works as a deprecated shim in a degraded mode; migrate to `.mediaLibrary()` for folders, staged upload, declared sorts, and server-side type filtering.
