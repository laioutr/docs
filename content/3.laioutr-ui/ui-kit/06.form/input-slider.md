---
title: Input Slider
description: Single-thumb or multi-thumb range slider for numeric input and range filters.
playground:
  name: InputSlider
  base: ui-kit-molecules-inputslider
  defaultStory: default
  height: 460px
seo:
  title: Input Slider
  description: Single-thumb or multi-thumb range slider.
sitemap:
  loc: /laioutr-ui/ui-kit/form/input-slider
  lastmod: 2026-05-13
  changefreq: monthly
  priority: 1.0
---

## Overview

`InputSlider` is the range slider used by numeric inputs and range filters. The shape of `defaultValue` decides the mode: a single-element array gives one thumb (single-value slider); a two-element array gives two thumbs (min/max range). Both share the same `min`, `max`, and `step` bounds, so consumer state always lines up with what the slider can produce.

Useful when:

- you need a quick numeric input that benefits from drag interaction (volume, quantity, intensity);
- you're driving a price, size, or rating filter where the two-thumb range is the right affordance;
- you want a value-label affordance — set `valueLabel="auto"` to show the value only while dragging, or `valueLabel="always"` to keep it visible.

Switch to `orientation="vertical"` for sliders that read top-to-bottom (column controls, vertical filter panels). `step` snaps the value to integer multiples, so set it to match the catalog's price grain or size grid.

`InputSlider` is Field-aware: inherit `disabled` and `invalid` from a surrounding `<LField>` instead of prop-drilling.

### Range (two thumbs)

::component-code
---
:name: LInputSlider
:story-height: 150px
story-id: ui-kit-molecules-inputslider--range
title: InputSlider Range
---
```vue-template
<InputSlider
  v-model="priceRange"
  :default-value="[20, 80]"
  :min="0"
  :max="100"
  :step="1"
/>
```
::

### With format label

Use `formatLabel` to render the value in a localized currency, percentage, or unit format.

::component-code
---
:name: LInputSlider
:story-height: 150px
story-id: ui-kit-molecules-inputslider--with-format-label
title: InputSlider With Format Label
---
```vue-template
<InputSlider
  v-model="price"
  :default-value="[42]"
  :min="0"
  :max="100"
  :format-label="(v) => `$${v}`"
  value-label="always"
/>
```
::

### Vertical

::component-code
---
:name: LInputSlider
:story-height: 250px
story-id: ui-kit-molecules-inputslider--vertical
title: InputSlider Vertical
---
```vue-template
<InputSlider v-model="value" :default-value="[40]" orientation="vertical" />
```
::

## Feature List

::features
---
items:
  - "`defaultValue` shape decides the mode: one-element array gives a single thumb; two-element array gives a min/max range with two thumbs"
  - "`min`, `max`, and `step` constrain the value space, so price filters never offer a `$13.27` cutoff that returns zero results"
  - "v-model passes the current value array, keeping consumer state matched to the slider's shape"
  - "Used by `FilterOffCanvasRangeSlider` and any numeric input that needs drag interaction, so behavior stays consistent across filters and configurators"
  - "Field-aware: inherits `<LField>` `disabled` and `invalid` state, so wrapped sliders pick up form chrome automatically"
---
::

## API Reference

::component-meta{:name="InputSlider"}
::
