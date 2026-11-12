---
title: Adobe Experience Manager
description: Documentation for the Laioutr Adobe Experience Manager app. Read AEM's assets and their Dynamic Media addresses, so URL mapping can move every original into Assetr without a CSV.
seo:
  title: Adobe Experience Manager
  description: Documentation for the Laioutr Adobe Experience Manager app. Read AEM's assets and their Dynamic Media addresses…
sitemap:
  loc: /apps/app-docs/aem
  lastmod: 2026-11-12
  changefreq: monthly
  priority: 1.0

---

## Overview

The **@laioutr-app/aem** app connects a Laioutr project to [Adobe Experience Manager](https://business.adobe.com/products/experience-manager/adobe-experience-manager.html) (AEM). It reads the assets of AEM's DAM, with the Dynamic Media (Scene7) address each one was published on, so [URL mapping](/cockpit/features/url-mapping#from-adobe-experience-manager) can move every original into Assetr and keep each old URL answering — no CSV export needed.

The app only reads. It never writes to AEM, and it reads only what the credential you give it may read.

::callout{icon="i-heroicons-information-circle"}
The app supports **AEM as a Cloud Service**. AEM 6.5 follows. It is free, like Laioutr's other connectors.
::

## What it supports

| | |
|---|---|
| **AEM version** | AEM as a Cloud Service, read on its author tier. |
| **Signing in** | An access token (such as the 24-hour local development token), or OAuth Server-to-Server keys that renew by themselves. |
| **What it reads** | Every asset (`dam:Asset`) below a DAM folder you choose: its path, name, file type, size, last change, title, description, tags, and the Dynamic Media file it was published as. |
| **Old URLs** | Built for every asset published to Dynamic Media, on your own media host: `/is/image/…` for images, `/is/content/…` for PDFs, SVGs, videos and other files. |
| **Originals** | The file stored in AEM, at full size, served to Laioutr through a signed link of your storefront. |
| **Where it is used** | URL mapping's **From: AEM** import. |
| **Large DAMs** | Assets are read in pages of 100, in the order AEM created them, so a DAM of any size is read to the end and a new asset added during the read is not missed. |

Not supported yet: Content Fragments, pages, asset renditions and metadata beyond the fields above, delivery through Dynamic Media with OpenAPI, and change notifications from AEM.

## What you need

- The **author host** of your AEM as a Cloud Service environment, as Cloud Manager shows it, such as `author-p12345-e67890.adobeaemcloud.com`. Publish hosts do not answer the queries the app needs.
- A way to sign in: an **access token** for a first look, or **OAuth Server-to-Server** keys for everything that runs by itself.
- The **host your old Dynamic Media URLs answered on**, such as `media.example.com`.
- A storefront environment of the project the app can be installed and deployed on. It must answer from the internet without a password while an import runs: each original is fetched through it.

## Install and configure

1. In the Cockpit, open the project's environment → **Package Management**, add **Adobe Experience Manager** and save.
2. Open the environment's **Configuration** in the menu, choose the app, and fill in the sections below. Each sign-in section has a **Test connection** button that checks the values before you save. (Package Management → **Configure** shows the same fields, without the tests.)
3. Deploy the environment. Until the app has an author host and a deploy has run, URL mapping does not offer AEM for it.

### Connection

| Field | What to enter |
|-------|---------------|
| **Author host** | The author tier of your AEM as a Cloud Service environment, without `https://`. |
| **Sign in with** | **An access token** or **OAuth Server-to-Server keys**. Fill in the matching section below; the other one is ignored. |

### Access token

| Field | What to enter |
|-------|---------------|
| **Access token** | The `accessToken` value of the downloaded JSON, without `Bearer`. |

Where to get it: in Cloud Manager, open the environment's **Developer Console**, then **Integrations → Local token → Get Local Development Token**.

- It is valid for **24 hours**. The app stops reading once it expires, and says so.
- It reads everything **its user** may read — the person who generated it. Adobe recommends it for development only, so switch to OAuth keys before a real migration.

**Test connection** lists one asset with the token and passes when AEM answers with it.

### OAuth Server-to-Server

| Field | What to enter |
|-------|---------------|
| **Client ID** | The credential's client ID. |
| **Client secret** | The credential's client secret. |
| **Scopes** | As the credential's page lists them, separated by commas. |
| **IMS host** | The credential's IMS endpoint. Leave empty for `ims-na1.adobelogin.com`. |

Setting it up in Adobe:

1. In the [Adobe Developer Console](https://developer.adobe.com/console), add an **OAuth Server-to-Server** credential to a project that has AEM.
2. Copy its client ID, client secret and scopes into the settings above.
3. Make one call — press **Test connection**. AEM creates the credential's technical account at that moment, in the read-only Contributors group.
4. In AEM, under **Tools → Security**, give that technical account **read access** to the DAM folders the migration needs: the DAM folder below, `/content/dam/dynamic-media` where Dynamic Media keeps logos and similar assets, and any folder the [access report](#what-the-credential-may-read) shows as empty. Read only.

The app asks Adobe for a new token by itself, five minutes before the current one expires.

**Test connection** asks Adobe IMS for a token with the keys and passes when one is returned. It checks the keys, not what the technical account may read — the [access report](#what-the-credential-may-read) does that.

### Assets

| Field | What to enter |
|-------|---------------|
| **DAM folder** | Assets are read below this folder. Leave empty for the whole DAM (`/content/dam`). |
| **Dynamic Media host** | Your own host the old Dynamic Media URLs answered on, such as `media.example.com`. The old URL of each asset is built on it. |

Use your own host, not an Adobe one (`s7d1.scene7.com` and similar): only a domain you own can be switched to Laioutr once AEM is gone. See [Switch the DNS](/cockpit/features/url-mapping#switch-the-dns).

## What the credential may read

AEM does not refuse an asset a user may not read; it leaves it out of the answer. A credential with too little access therefore looks like a DAM with fewer assets, and nothing fails.

Before the first import, Laioutr runs an **access report** with your credential and sends you the result: the user AEM signs it in as, when its token expires, and for the DAM folder, `/content/dam/dynamic-media` and any other folder you name, how many assets are readable and how many of them were published to Dynamic Media. A folder that shows no assets usually means its read access is missing. The report only reads.

## What is imported

In URL mapping, **New import → From: AEM** reads the assets through the app, in pages, in the background. For each asset published to Dynamic Media:

- **The old URL** is the one Dynamic Media answered on, on the Dynamic Media host above.
- **The file** is the original stored in AEM, never the smaller copy Dynamic Media served.
- An old URL that an earlier import moved already (from a Dynamic Media CSV, say) is moved again with the AEM original. It keeps answering with the earlier file until the original is stored; the earlier file stays in your Assetr library.

Assets AEM never published to Dynamic Media have no old URL to keep, and are not imported.

## Security

- The access token and the client secret are kept as secrets: they stay on the storefront's server and never reach a browser.
- An original is served only to a link signed with a key derived from the project's secret. A link is valid for 30 days; an expired one is refused, and reading the assets again in a new import gives every asset a new one.
- The link hands out the file as a download, never as a page, and only for an asset below the DAM folder.
- An original AEM answers with a redirect to its own file storage is fetched from there without sending your credential along.

## Troubleshooting

| What you see | What to do |
|--------------|------------|
| URL mapping says no storefront of the project offers AEM's assets | Fill in the author host and the sign-in, save, and deploy the environment again. |
| **Test connection** of the access token fails | The token expired (after 24 hours) or was copied with `Bearer`. Get a new one and paste only its value. |
| **Test connection** of the OAuth keys fails | Check the client ID, secret and scopes against the credential's page, and the IMS host if the credential names one. |
| The import reads fewer assets than AEM holds | The credential may not read some folders. Give it read access there and import again; what was moved is not moved twice. |
| The import stops because AEM refused the credential | The token expired or the keys were revoked. Set a new token or keys, deploy, and start the import again. |
| The import stops because the storefront is unreachable | The storefront is behind a password, or not deployed. Remove the password for the time of the import, or choose another environment. |

A busy AEM (429, 502, 503, 504) or a timeout is not a stop: the page is asked for again later.

## For developers

The package is a Nuxt module configured under the key **`@laioutr-app/aem`**. In a Laioutr project the Cockpit writes these options from the settings above; in a project of your own, set them in `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@laioutr-core/frontend-core', '@laioutr-core/orchestr', '@laioutr-app/aem'],
  '@laioutr-app/aem': {
    authorHost: process.env.AEM_AUTHOR_HOST!,
    authMode: 'oauth',
    clientId: process.env.AEM_CLIENT_ID,
    clientSecret: process.env.AEM_CLIENT_SECRET,
    scopes: process.env.AEM_SCOPES,
    damRoot: '/content/dam',
    mediaHost: 'media.example.com',
  },
});
```

| Option | Type | Description |
|--------|------|-------------|
| **`authorHost`** | `string` | The author host. When empty, the app registers nothing. |
| **`authMode`** | `'token' \| 'oauth'` | How the app signs in. |
| **`accessToken`** | `string` | For `token`. Secret. |
| **`clientId`**, **`clientSecret`**, **`scopes`** | `string` | For `oauth`. The secret is secret. |
| **`imsHost`** | `string` | For `oauth`; `ims-na1.adobelogin.com` when unset. |
| **`damRoot`** | `string` | The DAM folder; `/content/dam` when unset. |
| **`mediaHost`** | `string` | The Dynamic Media host old URLs are built on. |

### Source entity `Asset`

The app offers AEM's assets as source entities of type **`Asset`** through frontend-core's source entity API. Each entity is identified by its DAM path, carries one locale (`und`), and gets a new version whenever any of its values changes.

| Field | Description |
|-------|-------------|
| `path` | The DAM path, such as `/content/dam/brand/chair.jpg`. |
| `name` | The file name. |
| `mimeType` | The file type. |
| `size` | The original's size in bytes. |
| `modifiedAt` | When the asset last changed. |
| `scene7File` | The Dynamic Media file it was published as (`dam:scene7File`). |
| `oldUrl` | Its Dynamic Media URL on `mediaHost`. |
| `originalUrl` | The signed link its original is served on (`/api/aem/original/<token>`). |
| `title`, `description`, `tags` | Its metadata in AEM. |

A field AEM has no value for is left out.

## Changelog

All changelogs are managed in **`CHANGELOG.md`** in the package's GitHub repository. This app does not currently have a [public repository under the Laioutr organization](https://github.com/orgs/laioutr/repositories?q=&type=public); when it is published there, use that repo's **`CHANGELOG.md`** for release notes.
