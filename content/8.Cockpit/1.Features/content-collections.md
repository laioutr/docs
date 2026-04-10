---
title: Content (Collections)
description: Laioutr Cockpit Content area—structured collections and entries, statuses, multilingual editing, and media library entry point.
seo:
  title: Content (Collections) | Cockpit | Laioutr
sitemap:
  loc: /cockpit/features/content-collections
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.8

---

## Content (Collections)

The **Content** section in the project sidebar is where you work with **structured content** that belongs to your storefront project—similar to a lightweight **CMS** inside the Cockpit. Today the main part of this area is **Collections**: repeatable **content types** (defined for your project) and their **entries** (individual items such as articles, promos, or snippets, depending on your setup).

A second item, **Media Library**, appears under **Content** as the place for **media** management; its detailed behaviour may still be minimal while the feature set grows.

---

## Where to click

From the project sidebar:

- **Content** — top-level entry for the content workspace (overview may evolve over time).
- **Collections** — opens the **collections** overview for the current project.
- **Media Library** — opens media management when your team uses it.

URLs follow the pattern  
`/o/{organization}/p/{project}/content/collections`  
and, for a single collection or entry,  
`.../content/collections/c/{collection-slug}`  
and  
`.../content/collections/c/{collection-slug}/e/{entry-id}`.

---

## Collections overview

The **Collections** page explains that you **create and manage content that follows a schema**—meaning each collection has a fixed **shape** (fields and rules) decided when the project was set up.

### If nothing is listed yet

You may see an empty state saying you **do not have a collection yet**. In that case you need a **connected app** or a **developer** to register collection types for the project. Collections are not invented from scratch inside this screen; they come from your **project configuration**.

### When collections exist

You get a **searchable, sortable table** of all collection **types**:

- Typical columns include **name**, **description**, **last updated**, **edited by**, and **entry count** (wording may match your Cockpit language).
- **Search** narrows the list by name or description.
- **Sort** options include ordering by **name** and by **number of entries**.
- **Pagination** uses **items per page** (for example 10, 25, 50, or 100) plus **previous** / **next** controls. The footer can show how many rows match and that the list is **filtered** from a larger total.

**Click a row** (or the collection name) to open that collection’s **entries** list.

Header actions may include links for a **video tutorial** or **documentation** when your organization provides them.

---

## Inside a collection (entries list)

The header shows the **collection name** and **description** (or a default explanation). A link back to **Collections** keeps orientation clear.

### Toolbar

- **Add entry** — creates a **new entry**, gives it a starter title, and opens the **entry editor**. (When the list is still empty, the same action appears in the empty state.)
- The section label **Collection** links back to the **Collections** overview.

### Entries table

Each row is one **entry**. You usually see:

- **Title**
- **Created** and **updated** dates
- **Status** — shown as a coloured badge (see below)
- A **menu** (⋯) with actions such as **Publish**, **Unpublish**, **Duplicate**, and **Delete**, depending on the current status.

You can **open an entry** by clicking its **title** (or the row, where implemented).

The table again supports **search** (for example on title or id), **sort** (by title, dates, or status), and **paging** with configurable page size.

### Entry statuses (plain language)

Statuses describe where the entry stands relative to the live storefront:

- **Draft** — work in progress; not treated as live.
- **Changed** — previously published content with **unsaved or unpublished edits** (your team can treat this as “pending update”).
- **Live** — the entry is **published** for customers (the product may still show a shorter label such as “published” in code, but the badge text is oriented to editors).

---

## Editing an entry

### Header actions

On the entry screen you see the **entry title**, the **collection** name (with a link back to the list), and a **status** badge.

Actions typically include:

- **Duplicate** — copies the entry and opens the new copy.
- **Delete** — removes the entry (use with care).
- **Publish** — available when the entry is **not** live; turns it **live** for the storefront **after** the form passes validation.
- **Unpublish** — available when the entry **is** live; pulls it back from the live state.

You also see **who created** the entry and **when** it was created and last updated.

### Multilingual fields

If your project has several **languages**, the editor shows **tabs**—one per language. The **default** language may carry a small badge. Fields you change apply to the **language tab you have selected**, so you can translate or adjust copy per locale.

### Form content

The body of the editor is built from your project’s **schema**: groups of fields (text, numbers, choices, links, media, rich text, measurements, and more, depending on configuration). **Required** fields show validation if left empty.

Some complex field types may still show a short message that **editing is not yet supported** in the UI—your developer can adjust the schema or wait for a future release.

### Publishing and validation

**Publish** stays **disabled** until there are **no blocking validation errors**—fix highlighted fields first.

### If the entry cannot be loaded

You may see **Entry not found** with a button **back to collection**—for example after someone else deleted the entry or the link is outdated.

---

## Command bar (bottom)

A **command bar** can appear at the bottom of Collections screens (same family of tools as in Studio). You can type to run **commands** your organization exposes.

**Developer / debug** options (such as showing raw **JSON** or an **explorer**) are meant for **technical troubleshooting** only. The product warns that misuse can cause odd behaviour and is **not supported** for normal editorial work—ignore those commands unless your engineering team asks you to use them.

---

## Media Library

Under **Content → Media Library**, Cockpit opens the media area for the project. While the product matures, this page may still be a **simple shell**; treat it as the future home for **uploading, browsing, and reusing assets** alongside Collections.

---

## How this ties to the rest of Laioutr

- **Collections** reflect **what your frontend project knows about**—driven by apps and configuration, not only by Cockpit clicks.
- **Publishing** an entry updates the **project’s content state**; making it visible on the **public site** still depends on your usual **save / deploy / cache** workflow.
- For schema changes or new collection types, continue to involve **developers** or **installed apps** as for other project capabilities.
