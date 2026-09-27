---
title: Environments
description: Run a stage or dev copy of a project beside the live site in Cockpit—its own address, content, apps and platform version, copying work between them, and undo.
seo:
  title: Environments | Cockpit
sitemap:
  loc: /cockpit/features/environments
  lastmod: 2026-09-24
  changefreq: monthly
  priority: 0.8

---

## Environments

**Environments** let you run copies of a project beside the live site—for example a **stage** to rehearse a release, or a **dev** to try something out. Every project starts with one, **main**, which is the live site.

Open **Environments** from the project sidebar. The overview lists every environment as a card, and shows how many of your plan's allowance are in use.

### What you see

Each card shows the environment's **address**, how new platform versions reach it, and whether its apps are still configured exactly as production's. **Deploy** starts a build for that environment; **History** opens its deployments. **Open** visits the storefront it serves.

When the allowance still has room, an **Add an environment** card offers to create one.

### Creating one

**Create environment** asks for a **name** and which environment to **copy from**. The new environment gets the source's content, markets, languages, redirects, apps and app settings, then runs on its own.

The name becomes part of the address. You can rename the environment later, but its address stays as it was created.

::callout{type="warning"}
A new environment copies production's **app settings, including the connection to your shop**. Anything it writes—orders, customers, carts—reaches the live shop. There is no way to point an environment at a different shop yet.

The environment's page warns you for as long as its apps stay configured that way.
::

Search engines are told not to index any environment that is not production, so a rehearsal storefront cannot turn up in search results.

## What each environment owns

Its own **address**, **pages and sections**, **markets, languages and redirects**, **apps** at their own versions, **platform version**, and **deployments** with their own history and build logs. Changing any of these in one environment does not touch another.

Some things belong to the **project** rather than to an environment, so every environment sees the same ones: **CMS entries and media**, the **project secret key**, and the **content-preview token**.

## Versions

### Platform version

**App and core versions** on the environment's page sets how new platform versions reach it:

- **Pinned** — it stays on the version you chose until you change it.
- **Follow a tag** — the next build installs whatever the tag points at that day.

The card shows what the environment is **set to** and what its last build **actually installed**. When those differ, it offers to pin to what was built.

### App versions

Each app carries its own version per environment, so **stage** can run a newer app than production while you check it. Versions the environment's platform cannot install are listed and greyed out with the reason—the next step for those is the platform version, not the app.

### Adding and removing apps

**Apps** lists what the environment carries. **Add an app** searches the catalogue; the trash icon marks one for removal; the version dropdowns move one to another release. Nothing is written until you press **Save**, so several changes are applied as one. Saving changes what the **next deployment** installs; it does not change the running site.

## Copying between environments

**Copy into this environment** takes everything from another environment of the same project. The dialog names the direction: **Promote** moves work forward, for example stage into main; **Reset** replaces an environment with another, for example main back into dev after you have broken it.

You choose what travels—pages and sections, app versions and the platform version, app settings, markets and languages, redirects. The address is never carried; each environment keeps its own.

Promoting into production asks you to type the project's name first.

App versions travel as **what the source last built with**, not what it is set to. An environment that follows a tag has no fixed version to give, so promoting it is refused rather than removing the target's pin.

### Undo

Every copy writes a restore point first, and **History** offers **Undo** for copies that still have one.

::callout{type="warning"}
**Undo restores the pages and sections only.** Markets, languages, redirects, app versions and the platform version stay exactly as the copy left them. If you need those back, set them again by hand.
::

## History

**History** lists everything done to an environment—created, deployed, copied, migrated—with who did it and when, newest first. A copy appears in the history of both environments, read from the side you are on: **replaced by stage** on the target, **copied onto dev** on the source.

## Appearance and renaming

**Appearance** sets the environment's **name** and a **colour** that tints the Cockpit for it, so a rehearsal copy never reads as the live site at a glance. The colour shows in the sidebar, on the environment's card, and across its pages. **Studio** shows which environment you are editing in its top bar, with the live one marked distinctly.

Renaming does not move the address: an environment renamed from **dev** to **sandbox** keeps the hostname it was created with, and the dialog shows you which one that is. Links you saved to the old name stop working.

Production cannot be renamed. Its name is how a deployment knows it is building the live site.

## Deleting an environment

**Delete environment** sits at the bottom of the environment's page and asks you to type its name first. It removes the environment's pages and sections, markets, languages and redirects, apps and platform version, deployment history, **snapshots**, and its address, which stops answering.

::callout{type="warning"}
This cannot be undone. The snapshots that could have restored the environment go with it, and the copies it took part in disappear from the other environment's history.
::

Production cannot be deleted on its own. Deleting the **project** removes it, along with everything else.

## How many you can have

Your plan decides how many environments a project may have, counting production. The overview shows how many are in use and offers no way past the allowance. If you need more, talk to us about your plan.

## Access and effect on the live site

Who can create, copy and delete environments depends on your **organization roles**. Nothing you change in an environment reaches its storefront until that environment is **deployed**, and deploying one environment never affects another.
