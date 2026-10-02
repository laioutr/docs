---
title: Configuration
description: Enter the settings your installed apps need, per environment, test each connection, and know when saved values reach the storefront.
seo:
  title: Configuration | Cockpit
sitemap:
  loc: /cockpit/features/configuration
  lastmod: 2026-10-02
  changefreq: monthly
  priority: 0.8
---

## Configuration

Your storefront's apps need to know which shop, which search account or which tracking property to talk to, and with which credentials. **Configuration** is where you enter those settings, for one environment at a time. Each app decides which settings it asks for; the Cockpit shows them as a form and stores what you save.

### Where it appears

**Configuration** sits in the environment's menu in the project sidebar. Unfold it to see the apps that ask for settings, grouped by their publisher. An orange dot next to an app means a required setting is still empty.

The entry appears only while at least one app installed in the environment declares settings. An environment with no such app has no Configuration entry.

Opening an app shows its settings in sections. The header names the publisher, the package and the installed version; for an environment that follows a dist-tag, it shows the tag and the version it points at today. Each section says whether it is **Complete** or how many settings are missing.

The same form is also reachable from **Package Management**, with **Configure** on the app's row.

You need the **Developer** role on the environment to open Configuration and to save or test settings.

### Settings belong to one environment

Every environment has its own values. Saving the API token on **stage** leaves **main** untouched, so a rehearsal environment can point at a test account while production keeps the live one.

When you [copy one environment into another](/cockpit/features/environments#copying-between-environments) with **App settings** ticked, the values travel with the copy, secrets included.

::callout{type="warning"}
A new environment starts with a copy of its source's app settings, including the connection to your live shop. Change them in the new environment's Configuration before you deploy it if it must not write to the live shop.
::

### Secrets

Tokens, keys and passwords are **secrets**. Once saved, the Cockpit stores a secret encrypted and never shows it again:

- A stored secret of 20 characters or more shows as bullets and its **last four characters** (`•••••••• 3f9a`), so you can tell which token is set. A shorter one shows only that it is stored.
- To replace a secret, type the new value. Leaving the field empty keeps the stored one.
- An optional secret has a **Remove** button. It is removed when you save; **Keep** undoes that before saving.

Some apps ask for a **group of settings as JSON**, for example an id and a key that belong together. When such a group holds a credential, it is stored encrypted as one value and shows only as **stored**, never any part of it. To change one value inside it, paste the whole group again with the change.

### Testing a connection

A section can have a **Test connection** button. It sends one read-only request to the app's service with the values on screen (unsaved changes included, and stored secrets for fields you left empty) and tells you whether it worked or what failed: a missing value, an address the app may not be tested against, no answer, refused credentials, or an unexpected answer.

The test changes nothing in the service and nothing in the Cockpit. Run it before you save, so a wrong token turns up while you still have it in front of you.

### Saving is not deploying

**Save settings** stores the values for this environment. It does not start a deployment, and the running storefront keeps the settings it was built with. Saved settings take effect with the environment's **next deployment**.

The Cockpit refuses to save while a required setting is empty, and says which one.

### Settings not released

**Package Management** (in the environment's **Settings**) lists the apps the environment installs. When the installed version of an app declares settings the Cockpit has not received yet, the app shows a **Settings not released** badge, and Configuration has no form for that version.

The app's publisher fixes this by releasing that version to the Cockpit with `laioutr app release`. For an app you publish yourself, see [Releasing an App](/apps/app-development/releasing-an-app). For Laioutr's own apps, the form arrives with the next catalogue sync.

## For app developers

Which settings an app asks for, how each is shown and how its connection test works is declared in the app's [`laioutr.manifest.json`](/apps/app-development/app-manifest).
