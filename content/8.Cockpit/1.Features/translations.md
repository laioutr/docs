---
title: Translations
description: Manage storefront languages, fallback chains, and where each language is used on domains, and export or import all translatable content as a JSON file—in the Cockpit.
seo:
  title: Translations | Cockpit | Laioutr
sitemap:
  loc: /cockpit/features/translations
  lastmod: 2026-06-24
  changefreq: monthly
  priority: 0.8

---

## Translations

**Translations** is where you define which **languages** exist for your project and how they **fall back** when content is missing. Those languages are then available when you assign **domains** in **Markets**. Open **Translations** from the project sidebar (project settings).

### Overview

The page header summarizes the purpose of the section. In the toolbar you will find:

- **Add language** — opens the dialog to register a new locale.
- **Export** / **Import** — download all translatable content for the project as a JSON file, or upload an edited file to apply translations in bulk. Both are disabled until the project has at least one language. See [Exporting and importing translations](#exporting-and-importing-translations).

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

### Exporting and importing translations

The toolbar **Export** and **Import** actions let you take all of a project's translatable content out as a single **JSON file**, edit it offline (or hand it to a translation team), and bring it back in. Both actions are disabled until the project has at least one language, and access follows the same permission as **Markets** management.

#### What counts as translatable content

Export and import operate on the **localized fields of your storefront configuration**—the content you would otherwise edit per language in **Studio**:

- **Section, block, and global-section props** whose field type can hold text: **text**, **textarea**, **rich text**, **link**, and **media**. Other field types (numbers, selects, colors, icons, and so on) are not translated and are left out.
- **Page SEO** — each page variant's **title** and **description**.

The export is driven by your **field schema**, not just the stored values, so only fields that are genuinely marked translatable are included. Values are scoped to the **languages you have configured** on this page; any locale outside that set is dropped.

This is **not** about UI message strings or product/catalog data from a connected app—only the content configured on your project's pages.

::callout{icon="i-lucide-triangle-alert" color="warning"}
Export and import read your field schema from the project's **deployed frontend**. If the frontend has never been published or deployed—or the deployment is unreachable—both actions fail with a message asking you to publish or deploy first.
::

#### Exporting

Select **Export** to download a file named `translations-<project-slug>.json`. It contains every configured language (with its fallback chain), a description of each component and field, and one entry per translatable value holding the text for each language.

If some fields could not be read—usually because the saved content no longer matches the current schema (**schema drift**)—the export still completes and a notice tells you **how many fields were skipped**.

#### Importing

**Import** lets you upload a file in the same format—typically an export you have since edited. Because importing **rewrites the project's configuration** with the contents of the file, Cockpit asks you to confirm first:

> Importing overwrites this project's configuration with the uploaded file and will disconnect anyone editing in Studio. Only proceed when Studio is closed. This cannot be undone.

Close Studio before you import. The action is **destructive and not reversible** from the dialog, so treat it deliberately. As a safety net, Cockpit captures a **snapshot** of the current configuration before applying any changes; if you need to roll back, restore that `pre-translation-import` snapshot from the project's snapshots list.

Import applies values **entry by entry**, matching each one to its field by a stable identifier:

- A value is written only if its **field still exists** and is **still translatable**, and only for **languages configured** on the project.
- An entry that no longer matches anything in the project—or whose value is not valid for its field—is **skipped** rather than aborting the whole import. One bad entry never stops the rest.
- Page SEO values are **merged** with what is already there, so importing one language does not wipe the others.

When it finishes, Cockpit reports how many translations were **applied** and how many were **skipped** (for example, *"Imported 124 translations, 3 skipped"*). Imported content becomes part of your project configuration and reaches the live storefront through your normal **publish or deploy** process.

### Footer hints

If domains are missing, the footer can point you to **Markets** to attach languages to URLs. A **documentation** link opens external help.

### Working together with Markets

Always add **languages** here first, then go to **Markets** and assign each **domain** to the right language. **Studio** and the live storefront rely on this setup for **localized content** and the **market/language** selector when multiple options exist.
