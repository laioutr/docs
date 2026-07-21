---
title: Table of Contents
description: In-page navigation list that links to a page's headings and highlights the section currently in view as the reader scrolls, powered by the useScrollSpy composable.
playground:
  name: TableOfContents
  base: ui-kit-atoms-tableofcontents
  defaultStory: default
  height: 320px
seo:
  title: Table of Contents | Laioutr
  description: In-page navigation list that links to a page's headings and highlights the section in view as the reader scrolls.
sitemap:
  loc: /laioutr-ui/ui-kit/general/table-of-contents
  lastmod: 2026-07-21
  changefreq: monthly
  priority: 1.0
---

::since-version{version="2.6.0" packages="@laioutr-core/ui-kit" changelog="ui"}
::

## Overview

`TableOfContents` renders an ordered list of in-page links — one per section — and highlights the entry whose section is currently in view. Pass an `items` array of `{ id, label }`; each item becomes an anchor to `#id`, and the component tracks scroll position to mark the active entry with a left border and the primary text colour.

Scroll tracking is built in through the [`useScrollSpy`](#usescrollspy) composable, so there is nothing to wire up beyond the items. Entries are numbered by default; set `showNumbers` to `false` for a plain list.

Each item's `id` must match the `id` of the heading it points to. The component only renders and highlights the links — the target headings, and their `id` attributes, live in your page markup.

## Key Business & UX Benefits

- Keeps a reader oriented in long editorial content — guides, glossaries, buying advice — by always showing which section they are reading.
- Scroll-spy highlighting comes for free: pass the items and the active state tracks itself, with no scroll listeners to manage.
- Renders as a semantic `<nav>` and ordered list of anchor links, so it is keyboard-navigable and exposed to assistive technology.
- Numbered or plain, and driven entirely by data, so the same component serves an article sidebar, a step index, or a compact section jump-list.

## Usage

Give each item an `id` that matches a heading on the page, then render the component alongside your content — typically in a sticky sidebar:

```vue
<script setup lang="ts">
const sections = [
  { id: 'pricing', label: 'What it costs' },
  { id: 'plans', label: 'The plans in detail' },
  { id: 'hidden-costs', label: 'The hidden costs' },
];
</script>

<template>
  <aside class="toc">
    <LTableOfContents :items="sections" />
  </aside>

  <article>
    <h2 id="pricing">What it costs</h2>
    <!-- ... -->
    <h2 id="plans">The plans in detail</h2>
    <!-- ... -->
    <h2 id="hidden-costs">The hidden costs</h2>
    <!-- ... -->
  </article>
</template>
```

To drop the leading numbers, set `:show-numbers="false"`.

## useScrollSpy

`useScrollSpy` is the composable behind the active-item highlight. `TableOfContents` uses it internally, but you can call it directly to drive your own navigation UI from scroll position. It is auto-imported.

```ts
function useScrollSpy(
  ids: Ref<string[]> | ComputedRef<string[]>
): Ref<string | undefined>
```

- **`ids`** — a reactive list of element `id`s to observe, in document order. When the list changes, the observer re-binds to the new set.
- **Returns** — a ref holding the `id` of the topmost section in view. Before the reader scrolls it holds the first `id`; it is `undefined` only before mount or while the list is empty.

Under the hood it uses an `IntersectionObserver` with a bottom root-margin of `-66%`, so a section becomes active once its heading passes into the top third of the viewport. Observation starts on mount, re-binds when `ids` change, and is cleaned up on unmount. It is SSR-safe — no observer is created where `IntersectionObserver` is unavailable — and several instances can watch the same `ids` at once (for example a sticky desktop copy and a collapsed mobile copy of the same list).

```vue
<script setup lang="ts">
import { computed } from 'vue';

// useScrollSpy is auto-imported
const activeId = useScrollSpy(computed(() => sections.map((s) => s.id)));
</script>
```

## Feature List

::features
---
items:
  - "Ordered list of in-page anchor links, one per `{ id, label }` item"
  - "Highlights the section currently in view via the built-in `useScrollSpy` composable"
  - "`showNumbers` toggles the leading numbers (on by default)"
  - "Semantic `<nav>` and `<ol>` markup, keyboard-navigable and screen-reader friendly"
  - "Active entry marked with a left border and the primary text colour"
  - "`useScrollSpy` is exported separately to drive custom scroll-linked navigation"
---
::

## API Reference

### TableOfContents

::component-meta{:name="TableOfContents"}
::

## Related

- [Article Detail](/laioutr-ui/cms/blog/article-detail): editorial reading view that renders an auto-generated table of contents from its body headings.
- [Navigation Bullets](/laioutr-ui/ui-kit/general/navigationbullets): compact dot-style section indicator for full-height scrollers.
