---
title: Legal
description: The Laioutr Legal essentials app provides ready-to-use legal pages and components (imprint, privacy policy, terms) so projects ship compliance-relevant content from day one.
seo:
  title: Legal
  description: Ready-to-use legal pages and components for Laioutr projects — imprint, privacy policy, terms, and more.
sitemap:
  loc: /apps/essentials/legal
  lastmod: 2026-05-06
  changefreq: monthly
  priority: 1.0

---

The **Legal** essentials app provides the building blocks every Laioutr project needs to ship legally required content — imprint, privacy policy, terms and conditions, withdrawal information, and similar pages.

It is intended as a baseline so new projects do not start from a blank canvas for compliance-relevant pages. Content and structure are configurable in Studio and can be adapted to match the project's jurisdiction, brand voice, and legal review.

## Widerrufsbutton (EU-Richtlinie 2023/2673)

The first concrete feature shipped with the Legal app is the **Widerrufsbutton** — the digital revocation button that becomes mandatory across the EU, and Germany in particular, on **19 June 2026** (EU Directive 2023/2673). The directive's core requirement is that consumers must be able to terminate distance contracts "as easily as they were concluded", which means a clearly visible, always-reachable button instead of buried forms or support emails.

### Who is affected

The obligation applies to virtually all businesses with distance contracts, regardless of company size:

- Online shops selling goods or services
- Providers of digital products
- Subscription platforms
- Brokers of financial services

### What the app provides

The Legal app ships a ready-to-use Widerrufsbutton implementation that satisfies the directive's requirements out of the box:

- **Persistent placement** — a button that stays available throughout the entire revocation period, suitable for header, footer, or main navigation slots in the Laioutr layout.
- **Compliant labelling** — unambiguous wording (e.g. "Vertrag widerrufen") with translations and labelling guidance built in. Ambiguous terms like "Stornieren" are avoided by default.
- **Two-step revocation flow** — the directive mandates that consumers first identify the contract they want to revoke and then confirm the revocation declaration. The app provides both steps as configurable pages/blocks.
- **Automatic confirmation of receipt** — once a revocation is submitted, the customer receives an automatic acknowledgement. Delivery is handled via the [Mailer](/apps/essentials/mailer) essentials app, so the confirmation email integrates with the project's existing transactional email setup.
- **Audit trail** — every revocation request is recorded with timestamp and contract reference so merchants can prove compliance.

### Customization

Wording, layout, and the contract data sources surfaced in the first step (orders, subscriptions, digital purchases) are configurable in Studio and can be wired to whichever commerce or subscription app the project uses. The two-step flow itself is provided as Laioutr blocks/sections, so projects can restyle it to match their brand without losing the compliance guarantees.

::callout{type="info"}
Further legal building blocks (imprint, privacy policy, terms and conditions, withdrawal information pages) will follow in later iterations of the Legal app.
::
