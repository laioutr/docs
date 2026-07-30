---
title: Studio
description: Visual storefront editor—layers, properties, preview, save and publish, and page SEO.
seo:
  title: Studio | Cockpit
sitemap:
  loc: /cockpit/features/studio
  lastmod: 2026-07-21
  changefreq: monthly
  priority: 0.8

---

## Studio

**Studio** is the in-browser editor for your Laioutr storefront. Open it from the project sidebar to work on **pages, sections, and blocks** with a **live preview** of the frontend.

To inspect and edit Studio content from Claude Desktop, ChatGPT, or Cursor, [connect an AI assistant through Laioutr MCP](/agent-api/laioutr-mcp).

### Layout

- **Top bar** — global Studio actions: context for the current page, market/language selection, preview device modes, **Save**, **Publish**, and related controls.
- **Left sidebar (layers)** — hierarchical tree of the page: header, body, footer regions; add sections and blocks, duplicate, delete, and toggle visibility.
- **Center** — **preview** of the storefront (or a **debug** view when debug mode is enabled).
- **Right sidebar (properties)** — inspector for the selected page, section, or block.

A **command bar** at the bottom provides additional Studio commands (including optional debug tooling for advanced users).

### Pages

When a **page** is selected in the properties panel, you can:

- Rename the page and edit **URL path** (with validation and hints when the page type fixes the path).
- Configure **SEO** fields such as meta title and meta description.
- Manage **rules** that control where or how the page applies.
- **Duplicate** or **delete** the page where the product allows it.
- Work with **localized** fields; the UI indicates when content is localized or shown from a **fallback** language.
- Enable or remove **path translation** when supported for the page type.

### Preview data for dynamic pages

A dynamic page such as **Product Detail Page** is one page configuration rendered for many products. When the connector supports it, the page properties panel shows a **Preview Data** field naming the product (or article, or recipe) currently on screen, with a searchable list to switch to a different one. Where the app cannot resolve a title, the field falls back to showing the page's route params.

Studio picks a first instance automatically when you open such a page, and clicking through the preview updates the field to whatever the preview navigated to. Your choice lasts for the Studio session only and is never saved into the project configuration, so it never affects what visitors see.

If the field is missing, the app providing that page type does not list its pages. The page still previews; you set the instance through the preview URL instead.

### Linking to a specific page

Link fields let you pick a page type and then a concrete page of that type from the same menu, so linking a banner to one product no longer means copying a slug out of the shop admin. The list is searchable and shows a thumbnail where the connector provides one.

**Enter params manually** stays at the top of that list. Use it for a page the list does not cover, or when the connector's list is unavailable.

### Sections and blocks

Selecting a **section** or **block** opens its properties: label, schema-driven fields (text, colors, icons, queries, etc.), and **rules**. If no schema is found for an element, Studio explains that **editing is limited** for that item.

### Layers actions

From the layers tree you can **add sections**, **add blocks** (known types by name or generic “add block”), **duplicate**, **delete**, and control **visibility** for sections and blocks.

### Saving and publishing

Use **Save** to persist draft changes and **Publish** when you are ready to push the configured version according to your project’s workflow. Exact publishing behavior depends on your organization’s setup and hosting.

### Loading and errors

If Studio cannot load the project store or preview, you see a **loading** or **error** state with options to **retry** where applicable.

For **how to build sections and blocks in code**, see the **Frontend** documentation; this page describes only the **Cockpit Studio experience** for end users.
