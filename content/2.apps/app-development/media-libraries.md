---
title: Media Libraries
description: How to connect an external asset source (DAM, CMS, shop backend) to Studio's media picker by implementing the media-library facet of the Orchestr builder.
seo:
  title: Media Libraries | Laioutr
  description: How to connect an external asset source (DAM, CMS, shop backend) to Studio's media picker by implementing the media-library facet of the Orchestr builder.
sitemap:
  loc: /apps/app-development/media-libraries
  lastmod: 2026-07-02
  changefreq: monthly
  priority: 1
changelogKeys:
  - MediaLibrary
---

## What you are building

A media-library connector lets Studio editors browse, search, and upload assets that live in an external system — a shop backend's media section (Shopify Files, Shopware media), a DAM, or a CMS asset store. The connector is a facet of your app's Orchestr builder: you declare static **capabilities** and implement a small set of handlers, and the platform provides the routes, the picker UI, validation, and origin tracking.

```ts [src/runtime/server/media-libraries/acme.ts]
import { defineAcme } from '../middleware/defineAcme';

export default defineAcme.mediaLibrary({
  capabilities: {
    search: true,
    folders: true,
    sorts: [{ key: 'createdAt:desc', label: 'Newest first' }],
    upload: { transfer: 'staged', accept: ['image/*'], maxFileSize: 20 * 1024 * 1024 },
  },
  list: async (query, ctx) => {
    /* compile query into your backend's DSL, return items + folders */
  },
  createUploadTargets: async ({ files }, ctx) => {
    /* mint signed upload URLs */
  },
  finalizeUploads: async ({ refs }, ctx) => {
    /* commit the uploaded files, return finished items */
  },
});
```

The library's identity (id, label, icon) is derived from the builder's `.meta()` — you do not declare it again. Registration happens when the returned Nitro plugin runs, and Studio discovers the library (with its capabilities) through the reflect payload.

Your handlers sit behind five HTTP routes the platform registers for you. If you want to drive them directly (to test a connector with curl, or to script a bulk import), see [Assets](/data-api/management-api/assets) for the wire contract.

Handlers receive two arguments: the query/args object and `ctx` — the per-request context built by your app's `extendRequest` initwares. Use the clients your initware already constructs (e.g. an authenticated admin client) instead of building new ones. Note that media requests originate from Studio, not a storefront visitor: the platform supplies a neutral locale/currency to the initwares, so do not rely on visitor-specific context in media handlers.

## Capabilities

Capabilities are **static** flags the picker reads before its first request. Only declare what your backend genuinely supports — the platform strips undeclared query fields before they reach your handler and drops undeclared response fields (a `folders` array from a library that declared `folders: false` is discarded).

| Capability | Effect                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search`   | Free-text term rides in `query.term`; the picker shows a search box.                                                                              |
| `tags`     | Tag filter rides in `query.tags` (no picker UI yet — the contract is ready).                                                                      |
| `folders`  | The picker renders folder tiles + a breadcrumb; `query.folderId` selects the browsed location and your `list` returns that location's subfolders. |
| `sorts`    | Declared options render as a sort dropdown; the chosen `key` rides in `query.sorting`.                                                            |
| `upload`   | Enables upload; `transfer` selects proxied or staged (see below), `accept`/`maxFileSize`/`maxBatchSize` drive client-side pre-validation.         |
| `createFolders` | The picker can create a folder. Implement `createFolder`. |
| `moveAssets` | The picker can move an asset into a folder. Implement `moveAssets`. |
| `deleteAssets` | The picker can delete an asset. Implement `deleteAssets`. |
| `renameFolders`, `moveFolders`, `deleteFolders` | Folder rename, move, and delete through the API. Implement `renameFolder`, `moveFolder`, `deleteFolder`. |

## Browsing: `list`

`list(query, ctx)` returns one page of one location:

```ts
interface MediaQuery {
  cursor?: string;          // opaque; omit = first page
  limit: number;
  term?: string;            // only when capabilities.search
  type?: Array<MediaType | 'file'>; // 'image' | 'video' | 'audio' | 'file' — filter server-side!
  tags?: string[];          // only when capabilities.tags
  sorting?: string;         // one of your declared sort keys
  folderId?: string;        // only when capabilities.folders; undefined = root
  scope?: 'folder' | 'all'; // 'all' = whole-library search, ignore folderId
}

interface MediaListResult {
  items: ProviderStudioMediaItem[];
  folders?: MediaFolder[];  // subfolders of the queried location — FIRST page only
  nextCursor?: string;      // absent = end of the stream
  total?: number;           // optional; omit if your backend can't answer cheaply
}
```

Rules that matter:

- **Pagination is always opaque-cursor.** If your backend is offset-based, encode the offset inside the cursor string.
- **Honor `type`.** The picker seeds it from the media field's allowed types — an image-only field must not receive videos.
- **Folders ride on the first page only.** A cursor-continuation request continues the asset stream and returns no `folders`. Root is `folderId: undefined`; if your backend distinguishes "unfiled root assets" from "everything" (Shopware does), that's exactly why `scope: 'all'` exists — a whole-library search sends it, and you drop the folder filter.
- **Two kinds of item.** An item is either media or a distribution file. A media item is `{ media, previewUrl?, ... }` and can be picked by a media field. A file item is `{ kind: 'file', file, ... }`, has a delivery URL and no `media`, and no media field can select it. Test an item with `isFileItem(item)`. `file` (`{ url, mimeType, size?, downloadUrl? }`) is the stored original and is also allowed on a media item.
- **The `type` filter has four meanings.** Honor all of them:

  | `type` | Return |
  | --- | --- |
  | absent | media and files |
  | media kinds, for example `['image']` | only those kinds |
  | `['file']` | only distribution files |
  | media kinds and `'file'` | both |

  A provider without distribution files returns no items for `['file']`.
- **Media is what a browser renders.** `mediaKindForMime(mime)` answers `'image'`, `'video'`, `'audio'` or `'file'` for a MIME type, and an image type no browser displays (PSD, TIFF) is a file. Use it or classify the same way.
- Each media item is `{ media, previewUrl?, fileName?, externalId?, status?, statusMessage? }`. Set **`previewUrl`** to a small image the grid can show; leave it out when your backend has none, for example for audio, and the grid shows a type icon. Set **`externalId`** to your backend's stable asset id — the platform fans it into the stored media's per-source `origin` so assets can later be traced back to your library. Set **`status`** (`'processing'` / `'failed'`) for assets your backend is still transcoding or failed to process; the grid shows a spinner or error badge and blocks picking failed assets. Absent means ready.

## Upload

Two transfer modes, chosen by `capabilities.upload.transfer`:

**Proxied** — the browser sends bytes to the project's protected `media-upload` route, which hands them to your handler. Right for small files and backends without signed-upload support:

```ts
upload: async ({ files }, ctx) => Promise<UploadOutcome[]>
```

**Staged** — the browser uploads directly to your backend via a signed target; your handler never touches bytes. Right for large files and serverless deployments:

```ts
createUploadTargets: async ({ files }, ctx) => Promise<UploadTarget[]>  // mint signed URLs (metadata only)
finalizeUploads: async ({ refs }, ctx) => Promise<UploadOutcome[]>     // commit + return finished items
```

The `ref` on each target is an opaque string you invent; it comes back in `finalizeUploads` so you can correlate. Return **per-file outcomes** — one failed file must not sink the batch:

```ts
type UploadOutcome =
  | { ref: string; ok: true; item: ProviderStudioLibraryItem }
  | { ref: string; ok: false; error: { code: 'too_large' | 'unsupported_type' | 'processing_failed' | 'upload_failed'; message: string } };
```

An upload outcome's `item` may be a file item when the uploaded file is not media. A library that accepts distribution files lists them in `capabilities.upload.accept` like any other type.

**Readiness is your problem, not the contract's.** Return a usable `Media` from `finalizeUploads`/`upload`. If your backend's delivery URL only exists after processing, poll until it's ready (Shopify polls `fileStatus` to `READY`). If the URL is derivable from a stable id issued at upload time and self-heals once processing completes (Cloudflare Stream, Mux), return it immediately.

::callout{type="warning"}
**Staged upload requires CORS on your backend.** The browser PUTs/POSTs bytes directly to the signed target URL, so the target host must allow cross-origin uploads from the Cockpit origin (and any origin you expect editors to use). Shopify's staged targets allow this out of the box; an S3/GCS-backed target needs an explicit bucket CORS rule permitting `PUT`/`POST` from the Cockpit origin. Without it, every upload fails in the browser with an opaque CORS error while your server-side code looks healthy. Document the required CORS setup prominently in your app's README.
::

## Managing the library

**A rename or a move must never change a delivery URL.** A stored media value keeps the URL it had
when an editor picked it. If your backend builds the URL from a folder path or a file name, do not
implement that operation. If your backend can only tell at runtime — Cloudinary's `folder_mode` is
`fixed` on some accounts and `dynamic` on others — throw `MediaProviderError` with `url_change`.

**`deleteFolder` deletes an empty folder only.** A folder with assets or subfolders must be refused
with `not_empty`. Never cascade: a caller empties the folder first.

**Refuse with `MediaProviderError`, not a plain `Error`.** A plain throw reaches the caller as `502`.
A coded refusal keeps its own status and its code:

| Code | Status | When |
| --- | --- | --- |
| `not_found` | 404 | The folder or asset does not exist. |
| `name_taken` | 409 | A sibling folder already has the name. |
| `not_empty` | 409 | `deleteFolder` on a folder with contents. |
| `url_change` | 409 | The operation would change a delivery URL. |
| `invalid_target` | 422 | The target folder does not exist, or lies inside the moved folder. |
| `not_enabled` | 403 | The project has not enabled the feature, for example video uploads. |

The message reaches the editor unchanged, so write it for them.

## What the platform does with your output

Everything your handlers return crosses a validation boundary before it reaches an editor or gets stored:

- Every `media` is parsed against the canonical `Media` schema; invalid items are dropped from `list` results (with a server-side warning naming your library and the failing field) and converted into failed outcomes on upload paths.
- `src`, `previewUrl`, `file.url` and `file.downloadUrl` values with `javascript:`, `data:`, or `vbscript:` schemes are rejected — including inside nested poster/cover images, and also when tabs, line breaks or control characters are placed inside the scheme, which browsers ignore.
- A file item is checked against its own schema: its `file` must be valid, and keys a file item does not have (such as `media` or `previewUrl`) are removed. An item whose `kind` is neither `'media'`, `'file'` nor absent is dropped.
- Response fields you did not declare a capability for are discarded, and query fields you did not declare are stripped before your handler runs.
- The platform stamps every stored media source with `origin: { libraryId, externalId? }` — your library's id plus the item-level `externalId` you provided. If a single media mixes assets (e.g. art-directed sources from different backend assets), set `origin` per source yourself; a value you set is never overwritten.

## Declaring AI provenance

If your backend knows that an asset was produced with generative AI, say so on the media you return. Set [`aiDisclosure`](/frontend/api-reference/common-types/media#ai-disclosure) to `'generated'` for a fully AI-generated asset, or `'modified'` where generative AI altered human-authored content.

```ts
list: async (query, ctx) => ({
  items: assets.map((asset) => ({
    externalId: asset.id,
    previewUrl: asset.thumbnailUrl,
    media: {
      type: 'image',
      sources: [{ provider: 'myBackend', src: asset.url }],
      // only because this backend has an explicit flag for it
      ...(asset.generatedByAi ? { aiDisclosure: 'generated' as const } : {}),
    },
  })),
}),
```

Two rules:

- **Only from an authoritative backend signal.** A dedicated flag, or a location the platform itself guarantees, qualifies. A filename, an editor-renamable folder, or a guess does not — a wrong disclosure is worse than none, because a merchant may rely on it to meet a legal obligation.
- **Omit it when your backend says nothing.** Absent means no disclosure is known; it is not a claim that the asset is human-made. Leaving it out is the correct answer for an unknown asset, not a gap in your adapter.

An unrecognised value fails the canonical `Media` parse, so the whole item is dropped with a warning — the same as any other invalid field. Set one of the two documented values or nothing at all.
