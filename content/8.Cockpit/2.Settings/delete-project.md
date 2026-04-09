---
title: Delete a project
description: Permanently delete a project from the Cockpit settings danger zone with name confirmation.
seo:
  title: Delete a project | Cockpit | Laioutr
sitemap:
  loc: /cockpit/settings/delete-project
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.7

---

## Delete a project

You can **permanently remove a project** from **Project → Settings** in the **Danger zone** at the bottom of the page.

### Before you continue

Deleting a project **cannot be undone**. According to the in-product copy, **all project data, configurations, and deployments** will be **permanently removed**. Export or back up anything you must keep before proceeding.

### Steps

1. Open the **project** and go to **Settings** in the sidebar.
2. Scroll to **Danger zone**.
3. Read the **banner** that explains the impact of deletion.
4. Click **Delete project** (or the equivalent red action).
5. A **confirmation dialog** opens (same pattern as other destructive actions in Cockpit): you must **confirm** the deletion. If prompted, **type the project name** exactly as shown so Cockpit can verify your intent.
6. After confirmation, Cockpit runs the deletion. You should see a **success** notification when it completes, and you are typically **redirected to the organization** dashboard (project list) without the deleted project.

If deletion fails, an **error** notification is shown; retry after checking permissions or contact support if the problem persists.

### Permissions

Only users who are allowed to manage the project can delete it. If you do not see the action or the request fails, ask an **organization admin** to review your role or complete the deletion.
