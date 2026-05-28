---
title: Email Input Form
description: Email field and submit button for newsletter signup. Generic enough for footers, popups, or dedicated newsletter sections.
playground:
  name: EmailInputForm
  base: ui-kit-molecules-emailinputform
  defaultStory: default
  height: 460px
seo:
  title: Email Input Form | Laioutr
  description: Email field and submit button for newsletter signup.
sitemap:
  loc: /laioutr-ui/cms/newsletter/email-input-form
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
aliases:
  - /laioutr-ui/cms/newsletter/inputnewsletter
---

## Overview

`EmailInputForm` is the email-capture field and submit button used inside `NewsletterRegistration`, `PopUpNewsletter`, and standalone footer signups. The form is accessible and validation-ready, with optional placeholder and label.

`EmailInputFormDisplay` is the display sub-component. Use it to separate the form chrome from the success or empty state when you need finer control over rendering.

## Key Business & UX Benefits

- One signup field drops into footers, popups, and dedicated sections, so the same primitive grows the subscriber list everywhere it appears.
- Built-in accessibility and validation reduce drop-off on the highest-friction step of marketing acquisition.
- Splitting form chrome from the success state via the display sub-component gives teams full control over post-signup messaging.
- Editors place the form anywhere in Studio, opening signup placements that engineering would otherwise have to ticket.

:::tip
Pro-Tip from Larry: Drop `EmailInputForm` in the footer so signup is always available without a separate page.
:::

## Feature List

::features
---
items:
  - "Email field plus submit button reused inside NewsletterRegistration, PopUpNewsletter, and standalone footer signups"
  - "Accessible and validation-ready out of the box, with optional placeholder and label"
  - "EmailInputFormDisplay sub-component separates form chrome from success or empty states for finer rendering control"
  - "Drops into any layout, so the same primitive grows the subscriber list everywhere it appears"
  - "Editors place the form anywhere in Studio without engineering tickets"
---
::

### LEmailInputForm

::component-meta{:name="EmailInputForm"}
::

### LEmailInputFormDisplay

::component-meta{:name="EmailInputFormDisplay"}
::
