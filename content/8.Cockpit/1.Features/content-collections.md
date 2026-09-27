---
title: Content (Collections)
description: Laioutr Cockpit Content area—content types declared by your storefront, their entries, statuses, multilingual editing, links between entries, and publishing.
seo:
  title: Content (Collections) | Cockpit
sitemap:
  loc: /cockpit/features/content-collections
  lastmod: 2026-09-27
  changefreq: monthly
  priority: 0.8

---

## Content (Collections)

The **Content** section in the project sidebar is where you work with **structured content** that belongs to your storefront project—similar to a lightweight **CMS** inside the Cockpit. It lists the **content types** your storefront declares (for example blog posts, recipes or authors) and their **entries** (the individual items of each type).

Content types are not created in Cockpit. Developers declare them in the storefront's configuration; see [Content Collections](/apps/app-development/content-collections) for how.

---

## Where to click

From the project sidebar, open **Content**. It appears when content is enabled for your organization and you have permission to edit content in the project.

URLs follow the pattern  
`/o/{organization}/p/{project}/content`  
and, for a single content type or entry,  
`.../content/{entityType}`  
and  
`.../content/{entityType}/{entryId}`.

---

## Content types overview

The **Content** page lists every content type of the project in a table with two columns: the **type** and its number of **entries**.

**Click a row** to open that type's **entries** list.

### If nothing is listed yet

You may see an empty state saying there is **no content yet**. In that case a **developer** needs to declare content types in the storefront's configuration and deploy it. Content types are not invented from scratch inside this screen; they come from your **project configuration**.

### Types marked "Not declared"

A type that still has entries but that the deployed storefront no longer declares stays in the list with a **Not declared** badge, so its entries remain reachable. You cannot create, edit or publish entries of such a type until the storefront declares it again.

If the storefront cannot be reached, Cockpit says so and lists the content types as the storefront last declared them.

---

## Inside a content type (entries list)

### Toolbar

- **New entry** — creates a **new entry** and opens the **entry editor**. It is disabled for a type the storefront no longer declares.

### Entries table

Each row is one **entry**. You see:

- **Label** — the entry's title or name
- **Status** — shown as a coloured badge (see below)
- **Updated** — when the entry last changed
- A **delete** button. Its confirmation tells you how many other entries link to the entry.

A marker on a row shows that the entry has **validation issues**. **Click a row** to open the entry. The list shows 50 entries per page, with **previous** / **next** controls.

### Not served by the CMS

Below the table, a collapsed list can name parts of the type that the storefront cannot answer from the CMS—for example a search query—with the reason for each. It is information for developers; nothing needs to be done in Cockpit.

### Entry statuses (plain language)

Statuses describe where the entry stands relative to the live storefront:

- **Draft** — work in progress; not treated as live.
- **Changed** — previously published content with **unpublished edits** (your team can treat this as “pending update”).
- **Live** — the entry is **published** for customers.

---

## Editing an entry

### Header actions

On the entry screen you see the **entry label**, a link back to its **content type**, and a **status** badge.

Actions include:

- **Publish** — for a draft; turns it **live** for the storefront after it passes validation.
- **Publish Changes** — for a changed entry; makes your latest edits live. **Unpublish** is then in the **More actions** menu.
- **Unpublish** — for a live entry; takes it off the live storefront after a confirmation. Links to it from other entries stop resolving.
- **Delete** — removes the entry (use with care).

You also see **who created** the entry and **when**, and who **last updated** it.

### Editing together

Several people can edit the same entry at once and see each other's changes live. Changes are saved automatically; an indicator in the header shows the connection. If editing is not possible for the moment—for example while the entry is opening, or when too many editor tabs are open in the project—a message above the form says why.

### Multilingual fields

If your project has several **languages**, the editor shows **tabs**—one per language. The **default** language carries a small badge. Fields you change apply to the **language tab you have selected**, so you can translate or adjust copy per locale. A field left empty in a language shows the value of the language it falls back to, and a field can copy its value from another language.

### Form content

The body of the editor is built from your storefront's **schema**: one group per component of the content type, with fields for text, numbers, choices, dates, links, media, rich text and more, depending on the type. **Required** fields show validation if left empty.

Some components are **required**: they carry a red asterisk, and the entry cannot be published without them.

Images and other media are chosen or uploaded directly in their field.

Some complex field types may still show a short message that there is **no editor for this field yet**, so the value can only be viewed—your developer can adjust the schema or wait for a future release.

### Links to other entries

If the content type links to other content types, a **Links** card below the form holds one group per link. **Choose…** or **Add** opens a search over the entries of the target type, and can also **create a new entry** of that type. Click a linked entry to open it. A link whose target was deleted shows as **Deleted entry**, with a button to remove it.

### Publishing and validation

**Publish** checks the entry against the schema of the deployed storefront. If there are **blocking validation errors**, the entry is not published and the issues are listed—fix the highlighted fields first. Warnings, such as an entry that is getting large, do not block publishing. Publishing waits until every change has reached the server.

If the storefront cannot be reached, the form opens on the schema it last read and says so. You can keep editing; publishing works again once the storefront is reachable.

### If the entry cannot be loaded

You may see a message that the entry **could not be loaded**—for example after someone else deleted the entry or the link is outdated.

---

## How this ties to the rest of Laioutr

- **Content types** reflect **what your frontend project knows about**—driven by apps and configuration, not by Cockpit clicks. A new or changed content type appears after the storefront is deployed.
- **Publishing** an entry makes it visible on the **public site** with the next page request; no deploy is needed. Drafts can be viewed on the storefront through [content preview](/frontend/features/content-preview).
- For schema changes, new content types, and the limits on entry size and open editor tabs, see [Content Collections](/apps/app-development/content-collections) and involve **developers** or **installed apps** as for other project capabilities.
