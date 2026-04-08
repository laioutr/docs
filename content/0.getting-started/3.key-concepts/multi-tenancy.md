---
title: Multi-tenancy
description: How to structure multiple storefronts, brands, or regions in Laioutr — single project with rule engine vs. multiple projects sharing apps.
seo:
  title: Multi-tenancy | Laioutr
  description: How to structure multiple storefronts, brands, or regions in Laioutr — single project with rule engine vs. multiple…
sitemap:
  loc: /getting-started/key-concepts/multi-tenancy
  lastmod: 2026-04-08
  changefreq: monthly
  priority: 1.0

---

## Running multiple storefronts

You operate several brands, regional shops, or business units that each need their own storefront. Maybe they share the same product catalog but have different designs. Maybe they are completely independent brands under one company umbrella. This page explains the two main architectural patterns in Laioutr and helps you decide which one fits your situation.

---

## Option A: Single project with rule engine

In this approach, you run **one Laioutr project** that serves multiple domains. Each domain maps to a different [market](/frontend/features/multi-market), and the **rule engine** differentiates content, layout, and behaviour per market or domain.

This is the right choice when your storefronts share the same brand identity, the same set of apps, and largely the same page structure — but need regional variations in content, language, currency, or product availability.

### How it works

Your project has multiple markets configured in [Cockpit](https://cockpit.laioutr.cloud/o/_/p/_/settings/markets), each with its own domain:

| Market | Domain | Currency |
|---|---|---|
| Switzerland | `www.shop.ch` | CHF |
| Germany | `www.shop.de` | EUR |
| Austria | `www.shop.at` | EUR |

All three domains are served by the same Nuxt application. The rule engine lets you vary sections, banners, and navigation per market. For example, you can show a "Free shipping in Switzerland" banner only on `www.shop.ch`, or feature different product highlights per region.

### When to use this pattern

- Same brand across regions
- Shared page structure and design
- Differences are primarily content, language, and currency
- One team manages all storefronts
- You want a single deployment pipeline

---

## Option B: Multiple projects sharing apps

In this approach, you create **separate projects** within your Laioutr [organization](https://cockpit.laioutr.cloud/o/_/p/_/settings). Each project is an independent Nuxt application with its own `laioutrrc.json`, its own Studio workspace, and its own deployment. The shared code lives in your **apps** — Nuxt modules installed as npm packages in both projects.

This is the right choice when your storefronts have fundamentally different designs, different page structures, or are managed by separate teams — but share underlying business logic or integrations.

### How it works

You build your integration logic (commerce connector, checkout flow, tracking) as a reusable app (Nuxt module). Both projects install it:

```json
// Project A: package.json
{
  "dependencies": {
    "@your-org/commerce-app": "^2.0.0",
    "@your-org/brand-a-ui": "^1.0.0"
  }
}
```

```json
// Project B: package.json
{
  "dependencies": {
    "@your-org/commerce-app": "^2.0.0",
    "@your-org/brand-b-ui": "^1.0.0"
  }
}
```

Each project has its own UI app with brand-specific components, sections, and styling. The commerce app handles product data, cart, and checkout identically across both. Each project is managed independently in Cockpit and Studio.

### When to use this pattern

- Different brands with distinct visual identities
- Different page structures or customer journeys
- Separate teams managing each storefront
- Independent release cycles
- Shared backend integrations (same commerce platform, same payment provider)

For more on building reusable apps, see [App Development](/apps/app-development).

---

## Decision criteria

| Criterion | Single project (Option A) | Multiple projects (Option B) |
|---|---|---|
| Brand identity | Same brand, regional variants | Different brands or sub-brands |
| Page structure | Shared across storefronts | Different per storefront |
| Design system | One design, minor variations | Distinct designs per brand |
| Team structure | One team manages everything | Separate teams per storefront |
| Deployment | Single build and deploy | Independent deployments |
| Content management | One Studio workspace with rules | Separate Studio workspaces |
| Code sharing | Implicit (same project) | Explicit (shared npm modules) |
| Complexity | Lower — one project to maintain | Higher — multiple projects, but cleaner separation |

---

## Domain routing across both options

In **Option A**, domain routing is handled by the [multi-market](/frontend/features/multi-market) system. Each market maps to one or more domains, and the platform resolves the correct market at request time based on the hostname.

In **Option B**, each project has its own domain configuration. Since projects are independent deployments, domain routing is handled at the hosting level — each project's domain points to its own deployment. There is no cross-project routing within Laioutr itself.

---

## Shared code patterns

Regardless of which option you choose, the app architecture encourages code reuse. A Laioutr app is a standard Nuxt module distributed as an npm package. This means you can:

- **Extract common integrations** into a shared app (commerce data, authentication, tracking) and install it across projects.
- **Version independently** — update the shared app in one project without forcing the other to upgrade immediately.
- **Keep brand-specific code separate** — each project or brand gets its own UI app with components tailored to its design.

This pattern mirrors how the platform's own apps work. The Shopify app, for example, handles data and integration logic while the UI app handles presentation. You can follow the same separation for your own multi-brand setup.

For more on Laioutr's overall architecture and how apps fit together, see [Architecture](/getting-started/key-concepts/architecture).
