---
title: Roles
description: Custom organization roles with permissions; create, edit, and delete roles from the Roles tab.
seo:
  title: Organization roles | Cockpit
sitemap:
  loc: /cockpit/organisation/roles
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.75

---

## Roles (organization)

The **Roles** tab (`/o/{organization-slug}/roles`) is where you define **named roles** and attach **permissions** to them. Members receive those roles when they are invited or when an admin assigns roles later.

### Access

The **Roles** tab is only available if your user has the **`roles`** permission. Without it, the tab appears **disabled** and a **tooltip** indicates the missing permission (same pattern as **Billing** and **API Keys**).

### Toolbar

- **Create new role** — opens a dialog to add a role.

A search field may appear in the toolbar layout; behavior depends on your Cockpit version.

### Role list

Each row shows:

- **Role name** (heading).
- **Permission tags** — each permission granted to that role is listed as a chip (internal permission identifiers such as `admin`, `members`, `billing`, etc., as configured for your organization).

### Row menu

- **Update role** — opens the role editor with the current **name** and **permissions** pre-filled. Save runs an update; success or error is shown, and organization state is refreshed.
- **Remove role** / **delete** — deletes that role after confirmation where applicable; the list and available roles for invitations update.

### Create / edit dialog

When creating or updating a role you set:

- **Name** — required label for the role.
- **Permissions** — multi-select of **one or more** permissions that members with this role should have.

Use roles to **separate duties** (e.g. who can manage billing, API keys, members, or project content) without giving everyone full admin access.
