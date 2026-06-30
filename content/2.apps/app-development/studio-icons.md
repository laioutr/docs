---
title: Studio Icons
description: Reference of all icon names available for page types, fieldsets, and props wizard variants in Studio.
links: []
seo:
  title: Studio Icons | Laioutr
  description: Reference of all icon names available for page types, fieldsets, and props wizard variants in Studio.
---

These icons are used in the Studio UI itself to label page types, fieldsets, and other structural elements. They are not the same as the [frontend Icon component](/laioutr-ui/ui-kit/general/icon) icons that render on your storefront.

When you register a [page type](/frontend/features/pagetypes), you can set a `studio.icon` property so editors can tell page types apart in the Studio UI. The same icon names work in [fieldset definitions](/apps/app-development/schema-fields#fieldset-properties), [props wizard variants](/apps/app-development/section-definitions#props-wizard), and `toggle_button` [field options](/apps/app-development/schema-fields#toggle_button).

```ts
export const ProductDetailPage = definePageType('product-detail-page', {
  name: 'product-detail-page',
  kind: 'dynamic',
  studio: {
    label: 'Product Detail Page',
    icon: 'tag',
  },
});
```

## Available icons

:studio-icon-grid

## Fallback behavior

If no icon is set, or the name doesn't match any entry in this list, Studio renders a question-mark file icon.

## Where icons appear

- **Page switcher** in the Studio top bar, next to each page name
- **Add Page modal** when editors pick a page type
- **Fieldset headers** in the sidebar editor (via the fieldset `icon` property)
- **Props wizard** variant cards (via the variant `icon` property)
- **Toggle button** options in the sidebar (via the option `icon` property)

The `variantIcon` property on page types lets you show a different icon for page variants. When omitted, it falls back to the page type's `icon` value.
