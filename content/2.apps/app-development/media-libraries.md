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

```ts
// src/runtime/server/media-libraries/acme.ts
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

Handlers receive two arguments: the query/args object and `ctx` — the per-request context built by your app's `extendRequest` initwares. Use the clients your initware already constructs (e.g. an authenticated admin client) instead of building new ones. Note that media requests originate from Studio, not a storefront visitor: the platform supplies a neutral locale/currency to the initwares, so do not rely on visitor-specific context in media handlers.

## Capabilities

Capabilities are **static** flags the picker reads before its first request. Only declare what your backend genuinely supports — the platform strips undeclared query fields before they reach your handler and drops undeclared response fields (a `folders` array from a library that declared `folders: false` is discarded).

| Capability | Effect |
|---|---|
| `search` | Free-text term rides in `query.term`; the picker shows a search box. |
| `tags` | Tag filter rides in `query.tags` (no picker UI yet — the contract is ready). |
| `folders` | The picker renders folder tiles + a breadcrumb; `query.folderId` selects the browsed location and your `list` returns that location's subfolders. |
| `sorts` | Declared options render as a sort dropdown; the chosen `key` rides in `query.sorting`. |
| `upload` | Enables upload; `transfer` selects proxied or staged (see below), `accept`/`maxFileSize`/`maxBatchSize` drive client-side pre-validation. |

## Browsing: `list`

`list(query, ctx)` returns one page of one location:

```ts
interface MediaQuery {
  cursor?: string;          // opaque; omit = first page
  limit: number;
  term?: string;            // only when capabilities.search
  type?: MediaType[];       // 'image' | 'video' | 'audio' — filter server-side!
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
- Each item is `{ media, previewUrl, fileName?, externalId?, status?, statusMessage? }`. Set **`externalId`** to your backend's stable asset id — the platform fans it into the stored media's per-source `origin` so assets can later be traced back to your library. Set **`status`** (`'processing'` / `'failed'`) for assets your backend is still transcoding or failed to process; the grid shows a spinner or error badge and blocks picking failed assets. Absent means ready.

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
  | { ref: string; ok: true; item: ProviderStudioMediaItem }
  | { ref: string; ok: false; error: { code: 'too_large' | 'unsupported_type' | 'processing_failed' | 'upload_failed'; message: string } };
```

**Readiness is your problem, not the contract's.** Return a usable `Media` from `finalizeUploads`/`upload`. If your backend's delivery URL only exists after processing, poll until it's ready (Shopify polls `fileStatus` to `READY`). If the URL is derivable from a stable id issued at upload time and self-heals once processing completes (Cloudflare Stream, Mux), return it immediately.

::callout{type="warning"}
**Staged upload requires CORS on your backend.** The browser PUTs/POSTs bytes directly to the signed target URL, so the target host must allow cross-origin uploads from the Cockpit origin (and any origin you expect editors to use). Shopify's staged targets allow this out of the box; an S3/GCS-backed target needs an explicit bucket CORS rule permitting `PUT`/`POST` from the Cockpit origin. Without it, every upload fails in the browser with an opaque CORS error while your server-side code looks healthy. Document the required CORS setup prominently in your app's README.
::

## What the platform does with your output

Everything your handlers return crosses a validation boundary before it reaches an editor or gets stored:

- Every `media` is parsed against the canonical `Media` schema; invalid items are dropped from `list` results (with a server-side warning naming your library and the failing field) and converted into failed outcomes on upload paths.
- `src` and `previewUrl` values with `javascript:`, `data:`, or `vbscript:` schemes are rejected — including inside nested poster/cover images.
- Response fields you did not declare a capability for are discarded, and query fields you did not declare are stripped before your handler runs.
- The platform stamps every stored media source with `origin: { libraryId, externalId? }` — your library's id plus the item-level `externalId` you provided. If a single media mixes assets (e.g. art-directed sources from different backend assets), set `origin` per source yourself; a value you set is never overwritten.
