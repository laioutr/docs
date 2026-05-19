---
title: Footer
description: Responsive site footer with menu columns, contact rows, social links, and an optional email CTA.
jiraIssueId: LUI-221
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/QgRgNtTxCAxpTe1rriHM/Studio-v1.0?node-id=985-108133&t=lxa1EnPQ6WmLk1ee-4
    target: _blank
seo:
  title: Footer | Laioutr
  description: Responsive site footer with menu columns, contact rows, social links, and an optional email CTA.
sitemap:
  loc: /laioutr-ui/navigation/footer
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
---

## Overview

`Footer` is the site footer. The left column carries the brand logo, optional phone / email / address contact rows (rendered as tappable `NavLinkItem`s) plus a `belowLogo` slot for anything else (locale switcher, dark-mode toggle, social handles).

The default slot accepts `FooterMenu` columns. The number of columns is responsive: one stack on phones, two columns starting at `sm`, three at `lg`, and four at `xl`. Set the `menuCount` prop to the number you actually pass so the responsive grid lays them out correctly.

The lower row carries a row of social `IconButton`s (drive them with the `socialIcons: { icon, url, title }[]` prop), an optional `lowerEmail` newsletter-style CTA that opens a `mailto:`, and a copyright line composed from `copyrightBy` plus the current year.

Use `alignment` to set the horizontal alignment of the menu grid as a whole, and `contentAlignment` to set the alignment inside each cell (left, center, right).

## Key Business & UX Benefits

- One block carries the brand logo, contact details, navigation columns, and social proof, so the global footer is configured once instead of stitched per page.
- Responsive grid from 1 to 4 menu columns adapts the footer to phones, tablets, and wide desktops without per-breakpoint forks.
- Tappable contact rows (`tel:`, `mailto:`) put service one tap away on mobile, reducing the friction that drives support volume up.
- `belowLogo` slot is where brand-level utility lives (locale, dark mode, accreditation badges), so the chrome can flex without prop-bloating the footer.

## Usage

::component-code
---
:name: LFooter
story-id: ui-sections-footer--four-columns
---
::

## Feature List

::features
---
items:
  - "Responsive menu grid scales from one stack on phones to two columns at `sm`, three at `lg`, and four at `xl`"
  - "`menuCount` prop tells the grid how many `FooterMenu` columns are passed so the layout stays aligned"
  - "Left column hosts brand logo plus tappable phone, email, and address rows rendered as `NavLinkItem`s"
  - "`belowLogo` slot accepts utility chrome like locale switcher, dark-mode toggle, or accreditation badges"
  - "`socialIcons` prop drives a row of `IconButton`s with icon, url, and title for each social handle"
  - "Optional `lowerEmail` newsletter CTA opens a `mailto:` and a copyright line composes `copyrightBy` with the current year"
  - "`alignment` and `contentAlignment` control horizontal alignment of the grid and inside each cell"
---
::

## API Reference

### LFooter

::component-meta{:name="Footer"}
::

### LFooterMenu

::component-meta{:name="FooterMenu"}
::
