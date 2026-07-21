---
title: Product Specifications Table
description: Renders a product's specification rows as a `BasicTable`. Formats each typed value (text, number, boolean, `Measurement`, `Money`) per locale and groups rows into sections.
changelogKeys:
  - TableProductSpecifications
playground:
  name: TableProductSpecifications
  base: ui-blocks-tableproductspecifications
  defaultStory: outlined
  height: 460px
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/92moLelAY8lh8mI0rhCGzy/laioutr-UI?node-id=18994-300
    target: _blank
seo:
  title: Product Specifications Table | Laioutr
  description: Renders a product's specification rows as a `BasicTable`. Formats each typed value (text, number, boolean, Measurement, Money) per locale and groups rows into sections.
sitemap:
  loc: /laioutr-ui/shop/product-detail/product-specifications
  lastmod: 2026-07-02
  changefreq: monthly
  priority: 1.0
---

## Overview

`TableProductSpecifications` renders a product's [`specifications`](/frontend/api-reference/entities/product#specifications) component as a spec sheet built on [`BasicTable`](/laioutr-ui/ui-kit/content/basic-table). Each row carries a `label` and a **typed** `value` — the value arrives as `string | number | boolean | Measurement | Money`, not a pre-formatted string, so the table formats it per locale rather than freezing a format at the data layer.

Formatting is delegated to the `TableProductSpecificationsValue` subcomponent, which resolves each kind against the active locale:

- **string** → rendered as-is
- **number** → `Intl.NumberFormat` in the active locale
- **boolean** → localized Yes / No (`tableProductSpecifications.yes` / `.no`)
- **`Measurement`** (`{ value, unit }`) → `$measurement`
- **`Money`** (`{ amount, currency }`) → `$money`

Rows optionally carry a `sectionName`. When present, the table groups rows into sections (first-seen order) and renders one `BasicTable` per section under a section heading; when absent, all rows render in a single ungrouped table. The `variant` prop (`outlined` default, or `plain`) is forwarded to every `BasicTable`.

Fill it from a product's `specifications` component (via the [Studio block](#studio-block)) or pass rows directly.

## Key Business & UX Benefits

- Typed values mean a German market reformats `1,299.00 €` and `180 g` for its own locale from the same data — the connector never has to pre-format, and no market is stuck with another's number or currency formatting.
- Section grouping mirrors how manufacturers present spec sheets (Dimensions, Materials, Care), so long specification lists stay scannable instead of collapsing into one flat block.
- Absent sections degrade gracefully to a single flat table, so connectors that have no section data still render cleanly.

## Usage

::component-code{:name="LTableProductSpecifications" story-id="ui-blocks-tableproductspecifications--outlined"}
::

## Feature List

::features
---
items:
  - "Formats typed values (`string | number | boolean | Measurement | Money`) per locale via the `TableProductSpecificationsValue` subcomponent"
  - "Booleans render as localized Yes / No; numbers via `Intl.NumberFormat`; `Measurement` via `$measurement`; `Money` via `$money`"
  - "Groups rows into sections by `sectionName` (first-seen order), one `BasicTable` per section; absent ⇒ a single ungrouped table"
  - "`outlined` / `plain` variant forwarded to every underlying `BasicTable`"
  - "Consumes the product `specifications` entity component directly, or accepts manually authored rows"
---
::

## API Reference

### TableProductSpecifications

::component-meta{:name="TableProductSpecifications"}
::

### TableProductSpecificationsValue

Per-value formatter. Takes a single `value` (`string | number | boolean | Measurement | Money`) and renders its locale-formatted string. Extracted so the value-formatting logic stays in one place and can be reused outside the table.

::component-meta{:name="TableProductSpecificationsValue"}
::

## Studio block

`BlockTableProductSpecifications` (in `@laioutr-app/ui`) wraps this component as a standalone Studio block. It can be filled either from a query (a Product's `specifications`) or with manually entered rows, switchable via a **Data Source** toggle, and exposes the `outlined` / `plain` style toggle. Query mode forwards the product's typed specification values unchanged; manual mode adds an optional **Section** field per row for grouped output.

## Related

- [`BasicTable`](/laioutr-ui/ui-kit/content/basic-table): the underlying two-column primitive.
- [`TableOpeningHours`](/laioutr-ui/location/table-opening-hours): the sibling table built on the same primitive.
- [Product entity › Specifications](/frontend/api-reference/entities/product#specifications): the `specifications` component this table renders.
- [`Money` type](/frontend/api-reference/common-types/money) and [`Measurement` type](/frontend/api-reference/common-types/measurement): the structured value types the formatter handles.
