---
title: Translations
description: Manage storefront languages, fallback chains, and where each language is used on domains—linked to Markets in the Cockpit.
seo:
  title: Translations | Cockpit | Laioutr
sitemap:
  loc: /cockpit/features/translations
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.8

---

## Translations

**Translations** is where you define which **languages** exist for your project and how they **fall back** when content is missing. Those languages are then available when you assign **domains** in **Markets**. Open **Translations** from the project sidebar (project settings).

### Overview

The page header summarizes the purpose of the section. In the toolbar you will find:

- **Add language** — opens the dialog to register a new locale.
- **Export** / **Import** — may appear as actions for future or staged workflows; if they are disabled, bulk export/import is not available in your build yet.

Below, **Published languages** lists every language that is already configured.

### Adding a language

**Add language** opens a dialog where you:

1. **Search or pick a locale** — choose from a large list of common language/region combinations, or type a **BCP 47** style tag; the dialog can suggest a matching label when your input looks like a valid locale code.
2. **Avoid duplicates** — locales that already exist are marked and cannot be added again.
3. **Fallback chain** — optionally define **which other languages** this one should fall back to, in order, when translated content is not available. You can reorder fallback entries with **up** / **down** controls.

Confirming the dialog creates the language and refreshes the list. Success or error feedback is shown if something goes wrong.

### Language cards

Each language row shows:

- **Flag** and **display name**.
- **Language code** (badge)—the technical identifier used across the product.
- **Fallbacks** — listed in order when configured.
- **Domains** — badges for hosts/paths where this language is currently wired (through **Markets**). If none appear, the language exists but is not yet used on a domain.

Use the **row menu** to **delete** a language or to access **export** for that row when offered.

### Deleting a language

Removing a language asks for **confirmation**. The dialog may warn you if:

- The language is still assigned to **one or more domains** (removal will unassign it from those domains).
- Other languages use this one in their **fallback** chain (those relationships need to be updated).

After deletion, the list updates automatically.

### Footer hints

If domains are missing, the footer can point you to **Markets** to attach languages to URLs. A **documentation** link opens external help.

### Working together with Markets

Always add **languages** here first, then go to **Markets** and assign each **domain** to the right language. **Studio** and the live storefront rely on this setup for **localized content** and the **market/language** selector when multiple options exist.
