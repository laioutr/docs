---
title: URL mapping
description: Move the images and files of an old DAM such as Adobe Dynamic Media (Scene7) into Assetr from a CSV of old URLs, keep every old address working after the old DAM is switched off, and give new uploads old-style addresses too.
seo:
  title: URL mapping | Cockpit
sitemap:
  loc: /cockpit/features/url-mapping
  lastmod: 2026-11-12
  changefreq: monthly
  priority: 0.8
---

## URL mapping

**URL mapping** moves the images and files of an old DAM, such as Adobe Dynamic Media (Scene7), into the project's Assetr library, and keeps every old URL working on its old address once the old DAM is switched off. Links in old emails, marketplaces, PDFs and search results keep working. Images uploaded to Assetr afterwards can answer on old-style addresses too. Open it from the project sidebar under **Assetr → URL mapping**, or go to [URL mapping](https://cockpit.laioutr.cloud/o/_/p/_/urlmapping).

The old DAM keeps serving visitors until the DNS switch at the end, so nothing changes for the shop while the files move. The storefront, the shop and their stored URLs need no change.

### Who does what

| # | Step | Who | When |
| --- | --- | --- | --- |
| 1 | Turn on the Laioutr CDN for the project and give the migration team access | Laioutr | Before the start |
| 2 | Export every old asset URL into one CSV | Migration team | Before the start |
| 3 | Upload the CSV, map its columns, review the check, start | Migration team | Any time; it runs in the background |
| 4 | Work through the Problems tab until nothing needed is left | Migration team | While and after it runs |
| 5 | Check the presets and, for new uploads, the old-path pattern | Project Manager or Owner | Before the switch |
| 6 | Add the TXT record for the old host | Customer's DNS admin | A few days before the switch |
| 7 | Point the old host's CNAME to Laioutr | Customer's DNS admin | Once the migration is complete, before the old DAM is switched off |

Following and running a migration needs the role **Content Manager** or higher on the project. Changing how the old host answers needs **Project Manager** or **Owner**.

### Prepare the CSV

One CSV with one old URL per row is all the migration needs. **A URL that is not in the file answers 404 once the old DAM is off**, so collect every source of old URLs before you start.

- **The old URL is the only required column.** Give it in full, as it is used today: `https://media.example.com/is/image/acme/31250100_01`.
- **No full URL, only an asset ID?** Compose the URL from columns in the mapping step, for example `https://media.example.com/is/image/acme/{asset_id}`.
- **Optional columns:** alt text and tags are written onto the file in Assetr; a title and the old asset ID are kept with the old URL's row. The file's name in Assetr is the last part of the old path.
- **Format:** separator comma, semicolon or tab; encoding UTF-8 or Windows-1252. From Excel, save as **CSV UTF-8**; a UTF-16 file is refused.
- **Size:** up to 200 MB and one million rows per import. A larger list is split into several imports.
- **Duplicates do no harm:** the first row with a URL is migrated, the others are counted as duplicates.
- **Several hosts or paths in one file are fine.** What to migrate is chosen after the check, not in the file.

### The file's columns

The first row names the columns. Their order does not matter, and a column with one of these names is matched by itself in the mapping step; case, spaces, hyphens and underscores are ignored, so `Asset ID`, `asset_id` and `ASSET-ID` are the same name. Any other column can be chosen by hand, and columns the import does not need are left out.

| Column | Required | Names matched by themselves | What it does | Example |
| --- | --- | --- | --- | --- |
| Old URL | Yes | `url`, `old_url`, `link`, `asset_url`, `image_url`, `file_url`, `source_url`, `href`, `bild_url`, `datei_url` | The address that keeps working; its file is migrated | `https://media.example.com/is/image/acme/31250100_01` |
| Alt text | No | `alt`, `alt_text`, `alternative_text`, `alt_tag`, `bildbeschreibung` | Written onto the image in Assetr | `Corner sofa in grey` |
| Tags | No | `tags`, `tag`, `category`, `categories`, `kategorie`, `keywords`, `schlagworte` | Written onto the file in Assetr; several separated by a comma, semicolon or vertical bar, up to 50 | `sofa; living room` |
| Title | No | `title`, `name`, `titel`, `bezeichnung` | Kept with the old URL's row | `31250100_01` |
| Old asset ID | No | `asset_id`, `id`, `old_asset_id`, `asset`, `file_id`, `media_id` | Kept with the old URL's row; can build the old URL in the mapping step | `31250100_01` |

A tags cell that holds a comma must be quoted, as CSV always requires: `"sofa, living room"`.

[Download an example file](/assets/files/url-mapping-example.csv) with full URLs, alt text, tags and asset IDs, for images and files together.

### Exporting from Adobe Dynamic Media (Scene7)

The CSV needs every Scene7 address the shop, its emails and its documents use, written on the customer's own media host. Scene7 serves two kinds of address:

| Kind | Address | Example |
| --- | --- | --- |
| Images | `https://<media host>/is/image/<company>/<asset ID>` | `https://media.example.com/is/image/acme/31250100_01` |
| Files (PDFs, documents) | `https://<media host>/is/content/<company>/<asset ID>` | `https://media.example.com/is/content/acme/803313 montage` |

**Use the customer's own host, not a Scene7 host.** Only a domain the customer owns, such as `media.example.com`, can be switched to Laioutr. An address on Adobe's own hosts (`s7d1.scene7.com` and similar) stops working with Adobe and cannot be kept. Where the shop or its emails use one, list it anyway so its file is migrated, and change the shop data to the new address.

**Where the list comes from:**

- the asset list of the Dynamic Media company: asset ID and type (image or file) of every asset;
- the shop's product data: every field that holds a Scene7 address, such as product images and safety or assembly documents;
- CMS pages, newsletters and PDFs that link to Scene7 images.

The same address in several sources does no harm: it is migrated once.

**Writing the rows:**

- Write the asset ID exactly as Scene7 serves it, case included. A space in an ID may be written as a space or as `%20`.
- A preset in the query (`?$sm$`, `?wid=280&hei=280`) may stay; only the path decides which file is migrated. Each preset the URLs use should be in the presets table before the switch.
- With full URLs, one file can hold images and files together. With asset IDs only, export images and files as two CSVs and compose each one's URL in the mapping step with its own prefix, `/is/image/…` or `/is/content/…`.

A file with full URLs, alt text and tags:

```csv
old_url,alt,tags
https://media.example.com/is/image/acme/31250100_01,Corner sofa in grey,sofa; living room
https://media.example.com/is/image/acme/31250100_02,Corner sofa from the side,sofa; living room
https://media.example.com/is/content/acme/803313 montage,,assembly instructions
```

**Fetch the originals at full size.** Scene7 hands out a smaller copy (1280 px) of an image unless the URL asks for the original with `?scl=1`. Set Configuration → Moving files → **Fetch originals with** to `scl=1` before you start an import, and every file is fetched with it. Files moved before keep the copy they were moved with.

**Before handing it over,** open a few rows in a browser. An image that answers 403 "Unable to find image" no longer exists on Adobe; it is reported as missing, not migrated.

### Run the import

Nothing is fetched until you press **Start**, and once started the import runs by itself: you can close the page at any step.

1. **Upload.** Import → New import, and drop the CSV.
2. **Mapping.** The separator, encoding and header row are detected; change them if the preview looks wrong. Columns with a familiar name are matched already. With **Use this mapping for the next file** on, the next CSV of the same layout is mapped for you.
3. **Check.** Every row is read; nothing is moved yet. You see every host and path prefix the URLs use, with how many URLs each holds; untick what should not be migrated, and confirm what each path holds, images or files. You also see how many files will be migrated, how many an earlier import moved already, duplicates and rows that are not a usable URL, the presets the old URLs ask for, and how long it will take.
4. **Start.** For each old URL the file is fetched from the old DAM, stored in Assetr in a folder of its own for this import (`Migrated/<file name> <date>`), and its new URL is checked before the row counts as migrated.

While it runs, **Overview** shows the share migrated, the chunks and the time left. **Old URLs** lists every row with its state and new file, and **Export** downloads the list as filtered. A passing failure, such as a busy old DAM or a timeout, is tried again by itself before the row is marked failed.

A file migrated once is never moved again, except by an [AEM import](#from-adobe-experience-manager), which replaces it with the original. Importing the same or a larger list later only adds what is new and retries what failed.

### From Adobe Experience Manager

If your old DAM is AEM with Dynamic Media (Scene7), Laioutr reads the assets from AEM itself — no CSV.

1. Install the [Adobe Experience Manager](/apps/app-docs/aem) app on an environment of the project, fill in its settings under the environment's **Configuration** (an access token, or OAuth Server-to-Server keys; **Test connection** checks them) and deploy it.
2. In URL mapping, open **New import**, choose **AEM** under From, pick the environment and press **Read assets from AEM**.
3. Laioutr reads every asset AEM published to Dynamic Media, in pages, in the background; the page shows how many it has read. The old URL of each asset is the one Dynamic Media answered on (`/is/image/…` for images, `/is/content/…` for PDFs and SVGs), on the Dynamic Media host set in the app.
4. Once all are read, the import opens at **Check** — there is no mapping to do — and runs like any other.

The storefront you pick must answer from the internet without a password while the import runs: each original is fetched through it.

Each original is taken from AEM itself, never the smaller copy Dynamic Media served. An old URL that an earlier import moved already (from a Dynamic Media CSV, say) is moved again with the AEM original: it keeps answering with the earlier file until the original is stored, and the earlier file stays in your Assetr library, for you to delete when you no longer need it.

### Problems, and what to do about each

The **Problems** tab groups failed files by reason. **Retry all that can be retried** sends back every failure a later try can change, and **Export** downloads the failed rows with their reason. One old URL's drawer offers **Retry**, **Upload by hand** (choose a replacement file; it then answers that old URL) and **Mark as gone**.

| Reason | What happened | What to do |
| --- | --- | --- |
| Old URL answered 404 | The old DAM no longer has the file. | Mark as gone, or upload a replacement by hand if it is still needed. |
| Missing on the old DAM (403) | The old DAM says it does not have the file; Scene7 answers "Unable to find image". | Mark as gone, or upload a replacement by hand. |
| Old URL refused access (403) | The old DAM refused to hand the file over. | Retry once the old DAM lets files through again. |
| Old DAM failed | The old DAM answered with an error or not at all. | Retry later. |
| Timed out | The old DAM did not answer in time. | Retry once the run ends. |
| Old URL redirected | Redirects are never followed. | Put the final URL into the CSV and import it again. |
| Too large | Over Assetr's 100 MB per file. | Upload a smaller version by hand, or import the URL of a smaller rendition. |
| Type not accepted | Assetr does not take this type of file. | Import the URL of an accepted rendition. |
| Assetr refused the file, or the new URL did not answer | Storing or its check failed on Laioutr's side. | Retry; if it stays, report it to Laioutr. |

**Gone** means the file does not exist any more and is not needed. A gone URL answers 404 on purpose, and the migration counts as complete without it. If the file turns up later, import its URL again.

Some old DAMs answer a missing image with 403 and a text instead of 404. Configuration → **Answers that mean the file is missing** lists those texts; it comes filled with the common ones, and you can add your old DAM's own.

### How old URLs answer

On the **Configuration** tab, for every old host of the project:

| Setting | 308 redirect (default) | Rewrite (on request) |
| --- | --- | --- |
| What the browser gets | A permanent redirect to the new file in Assetr | The file itself, on the old address |
| Requests per image | Two | One |
| Format | As stored | AVIF or WebP where the browser takes them, else JPEG |
| Best for | Few images per page, or when the new address should become the known one | Pages with many images, such as category pages |

Rewrite resizes every image on each call, which is charged per call, so it is switched on by Laioutr on request: press **Request rewrite** on its card, and the team gets back to you with what it would cost. Until then every old URL is answered with a 308. In rewrite mode, SVG files, files that are no image and originals over 20 MB are still answered with a 308. **Browsers keep the answer for** 1 hour, 1 day (default) or 7 days; choose a short time while you test.

**Presets.** Scene7 sizes an image by a named preset in the query, wrapped in dollar signs: `?$sm$`, also written `?%24sm%24`, sometimes followed by other parameters (`?$sm$&cb=1`). The table comes filled with the common set, square at quality 85:

| Preset | `$4xs$` | `$3xs$` | `$2xs$` | `$xs$` | `$sm$` | `$md$` | `$lg$` | `$xl$` | `$2xl$` | `$3xl$` | `$4xl$` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Size (px) | 36 | 72 | 100 | 140 | 280 | 480 | 780 | 1080 | 1420 | 1640 | 2160 |

Presets found in your imports are listed with the size the old DAM gave them, and **Add** puts one into the table. Size parameters such as `?wid=280&hei=280` work too, in any order, once a preset of that name is added. A preset that is not configured answers the original image, and the **Log** lists every preset that was asked for and not configured.

**Square images with white bars.** An image is fitted inside its preset: a 425 × 850 image asked as `$md$` (480 × 480) answers as 240 × 480. Old DAMs often padded it to the preset's full size instead. With **Pad images to the preset's full size in white** on, it answers as 480 × 480 with white bars, as Scene7 did; a transparent image is filled with white too. A padded preset enlarges a smaller file to fill the box, so fetch the originals at full size (above).

### Old addresses for new uploads

After the move, new images go straight into Assetr. With an **old-path pattern**, each new image also answers on an address in the old DAM's style, so a system that still builds old Scene7 links keeps finding new images. Set it up under Configuration → **Old paths for new files**:

| Field | What it does | Example |
| --- | --- | --- |
| Pattern | The old path a file gets. `{name}` is the file name without its extension, `{ext}` the extension, `{folder}` the file's folders in Assetr. Empty: new files get no old address | `/is/image/acme/{name}` |
| Library folder | `{folder}` counts from this Assetr folder, and only files inside it get an old address | `image` |
| Write the path in lowercase | For an old DAM whose paths were all lowercase | `Photo.JPG` → `photo` |

With `/is/image/acme/{name}`, an image `35029302_01.jpg` uploaded to Assetr answers on `https://media.example.com/is/image/acme/35029302_01`, with every preset (`?$md$` …) and the same answer as the migrated images. While you type, the files of your library show the old address each would get, and every old host says whether the pattern reaches its paths.

- **New uploads get their address within ten minutes**, by themselves. **Test a URL** shows it as soon as it is there.
- **Same name, newer file wins.** An address that failed or was marked gone takes the uploaded file; a migrated one is taken over only by a file uploaded later.
- **Imports follow the pattern too.** Saved before an import starts, a pattern with `{folder}` stores each moved file in the Assetr folder its old path names (`/is/image/acme/x` → `image/acme`) instead of `Migrated/<file name> <date>`.

**Reindex** (at the bottom of the Configuration tab) gives every file already in the library the address of the saved pattern, and takes down the address of a file deleted from the library. It reads the whole library, so it asks before it runs and is meant for mass changes only: once after the pattern is first saved, after changing it, or after deleting many files. New uploads never need it. An address the pattern no longer gives keeps answering, so a link that works never breaks. The addresses of uploaded files are listed as an import of their own, **Uploaded in Assetr**.

### Switch the DNS

The switch is two DNS records on the old host, shown per host on the **Configuration** tab. Until the second one, the old DAM keeps answering visitors.

1. **TXT record: the host becomes the project's.** Laioutr shows a TXT record (name and value) for the old host, such as `media.example.com`. Once it is found, the host is **TXT verified**: it belongs to this project alone and its certificate is issued. Answers can be tested now, before any visitor reaches Laioutr.
2. **CNAME: visitors reach Laioutr.** Point the old host's CNAME to the target Laioutr shows. Once it resolves, the host is **Live** and every old URL is answered by Laioutr.

Switch the CNAME once the migration is complete, and before the old DAM is switched off: an old URL that is not migrated yet answers 404. Until the old DAM is off, the switch can be undone by pointing the CNAME back.

Browsers and CDNs may keep images from the old DAM for as long as its cache headers allowed, so some visitors see the old copies for a while after the switch.

### Checklist

**Before the switch**

- [ ] Every source of old URLs is in an import: DAM export, shop product data, CMS pages, emails and PDFs.
- [ ] Overview shows the migration complete; Problems holds nothing that is still needed.
- [ ] The presets the old URLs ask for are in the table, at the right sizes.
- [ ] The answer mode is settled: 308, or rewrite after a request to Laioutr.
- [ ] If new uploads should keep old-style addresses: the pattern is saved, the preview shows the right addresses, and Reindex ran once.
- [ ] The TXT record is added and the host shows **TXT verified**.
- [ ] **Test a URL** (in the page's header) answers as expected for one URL per preset: right file, right size, right type.

**After the switch**

- [ ] The host shows **Live**.
- [ ] One URL per preset, opened in a browser, shows the right image and size.
- [ ] A category page of the shop, with the browser's Network tab open, loads every image without errors.
- [ ] The **Log** shows no unexpected 404s or unconfigured presets; anything it shows is added or imported.
- [ ] Only then is the old DAM switched off.
