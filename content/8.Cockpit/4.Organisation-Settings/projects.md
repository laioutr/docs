---
title: Projects
description: Organization-level project list, search, open project, create project, and delete from the overflow menu.
seo:
  title: Organization projects | Cockpit | Laioutr
sitemap:
  loc: /cockpit/organisation/projects
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.75

---

## Projects (organization)

In **organization Settings**, open the **Projects** tab (`/o/{organization-slug}/projects`). This is the **list of all storefront projects** in that organization—not the inside of a single project.

### Toolbar

- **Search** — filter projects by **name or slug** as you type. Clear the field to show all projects again.
- **Create project** — opens the flow to **add a new project** (navigates to the create-project route for your organization).

### Project list

Each row shows:

- **Avatar** and **project name** (heading).
- **Project slug** (secondary line).
- The name/slug area **links** into the project workspace (`/o/{org}/p/{project-slug}`).

### Row actions (overflow menu)

- **View** — same as clicking the project: opens that project in the Cockpit.
- **Delete** — starts **project deletion** for that row. You must **confirm** (including typing the **project name** where the dialog requires it). Deletion is permanent; after success the list reloads.

If the search returns no rows, you see a **no results** message. With **no projects at all** and an empty search, you see the **empty state** with guidance to create a project.

While a delete request is running, a **loading overlay** may cover the card.
