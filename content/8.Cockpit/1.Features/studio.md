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

To inspect and edit Studio content from Claude Desktop, ChatGPT, or Cursor, [connect an AI assistant to Cockpit](/cockpit/features/mcp).

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

### Sections and blocks

Selecting a **section** or **block** opens its properties: label, schema-driven fields (text, colors, icons, queries, etc.), and **rules**. If no schema is found for an element, Studio explains that **editing is limited** for that item.

### Layers actions

From the layers tree you can **add sections**, **add blocks** (known types by name or generic “add block”), **duplicate**, **delete**, and control **visibility** for sections and blocks.

### Saving and publishing

Use **Save** to persist draft changes and **Publish** when you are ready to push the configured version according to your project’s workflow. Exact publishing behavior depends on your organization’s setup and hosting.

### Loading and errors

If Studio cannot load the project store or preview, you see a **loading** or **error** state with options to **retry** where applicable.

For **how to build sections and blocks in code**, see the **Frontend** documentation; this page describes only the **Cockpit Studio experience** for end users.
