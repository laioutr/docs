---
title: Redirects
description: Manage URL redirects for a project environment in Cockpit—source and target paths, permanent vs temporary, bulk edits, CSV import and export.
seo:
  title: Redirects | Cockpit | Laioutr
sitemap:
  loc: /cockpit/features/redirects
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.8

---

## Redirects

**Redirects** let you send visitors from an old **URL path** to a new **destination**—for example after a relaunch, a renamed page, or consolidating content. In the Cockpit, they are managed **per project** and **per project environment** (the same environment your storefront configuration uses).

Open **Redirects** from the project sidebar (next to **Markets** and **Translations**). The page sits under **Settings** in the breadcrumbs.

### What you see

The overview explains that you are **managing URL redirects** for the current environment. The main area is a **table** of rules. When nothing is configured yet, an **empty state** invites you to **add a redirect** or **import from CSV**.

### Each redirect (one row)

For every rule you set:

- **Source path** — the incoming path on your site (must **start with `/`**). Click the cell to type or edit it. If the path contains a **`:`** segment (often used for dynamic parts of a URL), Cockpit shows a small **pattern** hint so you can tell structured rules apart from fixed paths.
- **Target path** — where the visitor should end up. This can be **another path on your site** (starting with `/`) or a **full web address** (`http` or `https`) if you need to send traffic elsewhere.
- **Permanent** — when enabled, the rule is treated as a **lasting move** (browsers and search engines usually remember it more strongly). When off, it behaves as a **temporary** redirect.
- **Enabled** — turn a rule **off** without deleting it; disabled redirects do not apply.

Rows you have just added or changed are visually highlighted until you save.

### Saving your changes

When you edit paths or toggles, a **floating bar** appears at the bottom showing how many **unsaved changes** you have. Use **Save** to store everything valid, or **Discard** to reload the list from the server and drop local edits. If something is invalid (for example a missing path or a source that does not start with `/`), Cockpit shows a short **error** under the field so you can correct it before saving.

### Toolbar: search, filters, add, import, export

When **no rows are selected**, the toolbar offers:

- **Search** — finds redirects whose **source or target** contains what you type (there is a short delay while you type).
- **Status filter** — **all**, **enabled only**, or **disabled only**.
- **Type filter** — **all**, **permanent only**, or **temporary only**.
- **Add redirect** — inserts a **new row** at the top so you can fill in source, target, and options.
- **Import CSV** — choose a `.csv` file from your computer (see below).
- **Export CSV** — downloads a spreadsheet of **all** redirects for this environment (filename includes your **project slug**).

Long lists are split into **pages** (50 rules per page). Use **Previous** / **Next** and read the line that shows which page you are on and how many redirects exist in total.

If filters or search hide every row but redirects still exist, a **no results** message explains that nothing matches the current view.

### Working with many rows at once

Select one or more rows with the checkboxes. While a selection is active, the toolbar is replaced by a **bulk action** bar. You can **enable**, **disable**, **set permanent**, **set temporary**, or **delete** everything selected. **Delete** asks for confirmation and shows how many rules will be removed.

Unsaved **new** rows that were never saved can be removed from the list without hitting the server; already saved rules are deleted only after you confirm.

### Importing and exporting CSV

**Export** produces a file with column headers **`source`**, **`target`**, **`permanent`**, and **`enabled`**, one redirect per line. You can edit that file in a spreadsheet app and **import** it again to apply bulk changes.

**Import** expects a header row. **`source`**, **`target`**, and **`permanent`** are required columns; **`enabled`** is optional (if you omit it, new or updated rows default to **enabled**). Acceptable values for true/false columns are the usual forms such as **true/false**, **yes/no**, or **1/0** (as shown in any error messages if a row fails).

After import, an **Import results** dialog summarizes how many redirects were **added or updated**. If some lines could not be read, you can expand **skipped rows** to see the **row number**, **field**, and **reason**—fix the file and import again if needed.

Duplicate **source** paths in the same file are resolved by keeping the **last** occurrence for that source.

### Access and effect on the live site

Who can open **Redirects** depends on your **organization roles**; admins can grant access to redirect management separately from other project tasks where that is configured.

Redirects are **stored with your project environment**. They become part of the configuration your storefront uses; **when** they appear on the live site follows your normal **publish or deploy** process for that project—plan a deploy or sync if your team requires one after changes.
