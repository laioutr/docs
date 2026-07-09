---
title: Members
description: Invite users, view roles and pending invites, open a member profile, remove members, and leave the organization.
seo:
  title: Organization members | Cockpit
sitemap:
  loc: /cockpit/organisation/members
  lastmod: 2026-04-09
  changefreq: monthly
  priority: 0.75

---

## Members (organization)

The **Members** tab (`/o/{organization-slug}/members`) lists everyone in the organization—active members and **pending invitations**.

### Toolbar

- **Invite** — opens a dialog to invite users by **email**. You can enter **many addresses** (the field accepts multiple emails, separated by comma or line breaks, up to the limit shown in the product). You also choose **one or more roles** to assign to those invites. Submitting sends invitations; success or error feedback is shown, and the list refreshes.
- **Leave organization** — starts a confirmation, then removes **you** from the organization and navigates away (e.g. home).  
  This action is **disabled** when you are the **only member** or the **only admin**—a **tooltip** explains that you cannot leave in that situation (you would strand the org or remove its last admin).

### Member rows

For each person you typically see:

- **Avatar** and **display name** (or email if no name).
- **Email** on a second line.
- **Tags** for **pending invitation** (with a clock-style indicator) when the user has not finished signup.
- **Role tags** — each assigned role is shown as a chip.

Clicking the member opens their **user profile** in the organization context (`/o/{org}/user/{userId}`).

### Row menu

- **View user** — opens the same member profile.
- **Remove** — removes that member from the organization (with confirmation where applicable). This option is shown according to your **permissions** (member management).

The page loads member data from the server; if the query fails, the surrounding **query wrapper** handles error/empty states as in the rest of the Cockpit.
