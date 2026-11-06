---
title: URL mapping
description: Move the images and files of an old DAM such as Adobe Dynamic Media (Scene7) into Assetr from a CSV of old URLs, and keep every old address working after the old DAM is switched off.
seo:
  title: URL mapping | Cockpit
sitemap:
  loc: /cockpit/features/url-mapping
  lastmod: 2026-11-06
  changefreq: monthly
  priority: 0.8
---

## URL mapping

**URL mapping** moves the images and files of an old DAM, such as Adobe Dynamic Media (Scene7), into the project's Assetr library, and keeps every old URL working on its old address once the old DAM is switched off. Links in old emails, marketplaces, PDFs and search results keep working. Open it from the project sidebar under **Assetr → URL mapping**.

The old DAM keeps serving visitors until the DNS switch at the end, so nothing changes for the shop while the files move. The storefront, the shop and their stored URLs need no change.

### Who does what

| # | Step | Who | When |
| --- | --- | --- | --- |
| 1 | Turn on the Laioutr CDN for the project and give the migration team access | Laioutr | Before the start |
| 2 | Export every old asset URL into one CSV | Migration team | Before the start |
| 3 | Upload the CSV, map its columns, review the check, start | Migration team | Any time; it runs in the background |
| 4 | Work through the Problems tab until nothing needed is left | Migration team | While and after it runs |
| 5 | Choose how old URLs answer (308 or rewrite) and check the presets | Project Manager or Owner | Before the switch |
| 6 | Add the TXT record for the old host | Customer's DNS admin | A few days before the switch |
| 7 | Point the old host's CNAME to Laioutr | Customer's DNS admin | Once the migration is complete, before the old DAM is switched off |

Following and running a migration needs the role **Content Manager** or higher on the project. Changing how the old host answers needs **Project Manager** or **Owner**.

### Prepare the CSV

One CSV with one old URL per row is all the migration needs. **A URL that is not in the file answers 404 once the old DAM is off**, so collect every source of old URLs before you start.

- **The old URL is the only required column.** Give it in full, as it is used today: `https://media.example.com/is/image/acme/31250100_01`.
- **No full URL, only an asset ID?** Compose the URL from columns in the mapping step, for example `https://media.example.com/is/image/acme/{asset_id}`.
- **Optional columns** are written onto the file in Assetr: alt text, title, tags, the old asset ID.
- **Format:** separator comma, semicolon or tab; encoding UTF-8 or Windows-1252. From Excel, save as **CSV UTF-8**; a UTF-16 file is refused.
- **Size:** up to 200 MB and one million rows per import. A larger list is split into several imports.
- **Duplicates do no harm:** the first row with a URL is migrated, the others are counted as duplicates.
- **Several hosts or paths in one file are fine.** What to migrate is chosen after the check, not in the file.

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

A file with full URLs and two optional columns:

```csv
old_url,alt,title
https://media.example.com/is/image/acme/31250100_01,Corner sofa in grey,31250100_01
https://media.example.com/is/image/acme/31250100_02,Corner sofa from the side,31250100_02
https://media.example.com/is/content/acme/803313 montage,,Assembly instructions 803313
```

**Before handing it over,** open a few rows in a browser. An image that answers 403 "Unable to find image" no longer exists on Adobe; it is reported as missing, not migrated.

### Run the import

Nothing is fetched until you press **Start**, and once started the import runs by itself: you can close the page at any step.

1. **Upload.** Import → New import, and drop the CSV.
2. **Mapping.** The separator, encoding and header row are detected; change them if the preview looks wrong. Columns with a familiar name are matched already. With **Use this mapping for the next file** on, the next CSV of the same layout is mapped for you.
3. **Check.** Every row is read; nothing is moved yet. You see every host and path prefix the URLs use, with how many URLs each holds; untick what should not be migrated, and confirm what each path holds, images or files. You also see how many files will be migrated, how many an earlier import moved already, duplicates and rows that are not a usable URL, the presets the old URLs ask for, and how long it will take.
4. **Start.** For each old URL the file is fetched from the old DAM, stored in Assetr in a folder of its own for this import (`Migrated/<file name> <date>`), and its new URL is checked before the row counts as migrated.

While it runs, **Overview** shows the share migrated, the chunks and the time left. **Old URLs** lists every row with its state and new file, and **Export** downloads the list as filtered. A passing failure, such as a busy old DAM or a timeout, is tried again by itself before the row is marked failed.

A file migrated once is never moved again. Importing the same or a larger list later only adds what is new and retries what failed.

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

On the **Configuration** tab, per old host:

| Setting | 308 redirect (default) | Rewrite |
| --- | --- | --- |
| What the browser gets | A permanent redirect to the new file in Assetr | The file itself, on the old address |
| Requests per image | Two | One |
| Format | As stored | AVIF or WebP where the browser takes them, else JPEG |
| Best for | Few images per page, or when the new address should become the known one | Pages with many images, such as category pages |

SVG files, files that are no image and originals over 20 MB are always answered with a 308. **Browsers keep the answer for** 1 hour, 1 day (default) or 7 days; choose a short time while you test.

**Presets.** Scene7 sizes an image by a named preset in the query, wrapped in dollar signs: `?$sm$`, also written `?%24sm%24`, sometimes followed by other parameters (`?$sm$&cb=1`). The table comes filled with the common set, square at quality 85:

| Preset | `$4xs$` | `$3xs$` | `$2xs$` | `$xs$` | `$sm$` | `$md$` | `$lg$` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Size (px) | 36 | 72 | 100 | 140 | 280 | 480 | 780 |

Presets found in your imports are listed with the size the old DAM gave them, and **Add** puts one into the table. Size parameters such as `?wid=280&hei=280` work too, in any order, once a preset of that name is added. A preset that is not configured answers the original image, and the **Log** lists every preset that was asked for and not configured.

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
- [ ] The answer mode is chosen: 308 or rewrite.
- [ ] The TXT record is added and the host shows **TXT verified**.
- [ ] **Test a URL** (in the page's header) answers as expected for one URL per preset: right file, right size, right type.

**After the switch**

- [ ] The host shows **Live**.
- [ ] One URL per preset, opened in a browser, shows the right image and size.
- [ ] A category page of the shop, with the browser's Network tab open, loads every image without errors.
- [ ] The **Log** shows no unexpected 404s or unconfigured presets; anything it shows is added or imported.
- [ ] Only then is the old DAM switched off.
