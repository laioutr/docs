---
title: Variant Selector Configurator
description: Wizard-style variant configurator with accordion sections, options lists, and swatch lists.
playground:
  name: VariantSelectorConfigurator
  base: ui-blocks-variantselectorconfigurator
  defaultStory: default
  height: 460px
seo:
  title: Variant Selector Configurator
  description: Wizard-style variant configurator.
sitemap:
  loc: /laioutr-ui/shop/product-detail/variant-selector-configurator
  lastmod: 2026-05-15
  changefreq: monthly
  priority: 1.0
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://www.figma.com/design/QgRgNtTxBTCAxpTe1rriHM/Studio-v1.0?node-id=1587-118248&t=DbsEktYWA8Dj8jGj-4
    target: _blank
---

## Overview

`VariantSelectorConfigurator` is the wizard-style picker for products with many configurable attributes (furniture, custom hardware, configurable bundles). Each attribute lives in its own accordion section, and renders either an options list or a swatch list depending on the attribute type. Reach for this component when a flat [`VariantSelectorOptions`](/laioutr-ui/shop/product-detail/variant-selector-options) row would overwhelm the shopper, or when a sheet handoff via [`VariantSelectorMultiple`](/laioutr-ui/shop/product-detail/variant-selector-multiple) is too coarse.

The required prop is `options: selectionButton[]` (each entry models one attribute and its values). The component emits `update:modelValue` with a `{ optionId, option }` payload whenever the shopper picks a value, so the parent always knows which attribute changed and to what.

Auto-import tag: `<LVariantSelectorConfigurator>`.

## Key Business & UX Benefits

- Wizard-style accordion guides shoppers through high-consideration purchases (furniture, configurable bundles) one decision at a time, lowering the bail-out rate that flat selectors cause.
- Per-attribute control type (options list or swatch list) matches each step to the right input pattern, so shoppers don't fight the UI on color vs. size choices.
- Configurable bundles ship with a single component, removing the need for per-category custom configurators that are expensive to build and maintain.
- Progressive disclosure keeps the buy-box compact until the shopper engages, which protects PDP scanability for the majority who don't customize.

## Feature List

::features
---
items:
  - "Each attribute lives in its own accordion section so high-consideration purchases break into one decision at a time"
  - "Per-attribute control type renders an options list or a swatch list based on the attribute shape"
  - "Single component handles furniture, custom hardware, and configurable bundles without per-category forks"
  - "Progressive disclosure keeps the buy-box compact until shoppers engage, protecting PDP scanability"
  - "update:modelValue fires with { optionId, option } so the parent always knows which attribute changed and to what"
  - "Composable from named primitives (AccordionItem, OptionsList, SwatchList) when teams need custom configurator surfaces"
---
::

## API Reference

::component-meta{:name="VariantSelectorConfigurator"}
::

::component-meta{:name="VariantSelectorConfiguratorAccordionItem"}
::

::component-meta{:name="VariantSelectorConfiguratorOptionsList"}
::

::component-meta{:name="VariantSelectorConfiguratorSwatchList"}
::
