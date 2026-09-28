---
title: Schema.org
description: The JSON-LD structured data a Laioutr frontend emits out of the box — organization, breadcrumbs, FAQ, product and category pages — and how to add your own from a custom section.
seo:
  title: Schema.org
  description: The JSON-LD structured data a Laioutr frontend emits out of the box, and how to add your own from a custom section.
sitemap:
  loc: /frontend/seo/schema-org
  lastmod: 2026-09-28
  changefreq: monthly
  priority: 1.0

---

## Overview

Schema.org structured data (JSON-LD) tells search engines what a page is about. It enables rich results such as product prices and stock, breadcrumbs, and Google merchant listings.

Every page carries **one** schema.org graph. Several parts of the platform add nodes to it, and all of them merge into a single `<script type="application/ld+json">` in the server-rendered HTML. No module has to be installed.

| Source | Nodes | Turn it off |
| --- | --- | --- |
| [SEO app](/apps/essentials/seo) | `WebSite`, `WebPage`, `Organization` | `structuredData.enabled: false` in the app config |
| `SectionBreadcrumbs` | `BreadcrumbList` | its "Emit BreadcrumbList structured data" checkbox |
| `BlockAccordion` set to FAQ | `FAQPage` with one `Question` per item | set "Structured data" to "None" |
| `SectionProductDetail` | `ItemPage` and a `ProductGroup` (or `Product`) | its "Turn off product structured data" checkbox |
| `BlockProductsListing` on category and search pages | `CollectionPage` and an `ItemList` | its "Turn off product list structured data" checkbox |

The organization — legal name, address, logo, social profiles — is configured in the SEO app, per project and per market. See [SEO](/apps/essentials/seo).

## Product pages

`SectionProductDetail` describes the product it shows. A product with two or more variants becomes a `ProductGroup`; a product with one variant becomes a single `Product`.

| Property | Source |
| --- | --- |
| `name`, `description`, `image`, `brand` | `ProductBase`, `ProductDescription` (as plain text), `ProductMedia` or `ProductInfo.cover`, `ProductInfo.brand` |
| `productGroupID` | the product id |
| `variesBy` | the option types the variants use: color, size, material, pattern |
| `hasVariant` | one `Product` per variant (at most 100) |

Each variant carries its `sku`, its `gtin` as the connector delivers it, its image, its option values (`color`, `size`, …), its own URL (`?variant=<id>`, which the product page resolves on the server), and an `Offer`:

- `price` and `priceCurrency` from the variant's price;
- `availability` from its stock status;
- when a strikethrough price is set and higher than the price, a `StrikethroughPrice` price specification, which Google can show as a reduction.

A variant without a valid price is left out, and a product with no valid price gets no product node at all — no markup is better than a wrong price.

Not emitted: reviews and ratings, the return policy, and shipping details.

## Category and search pages

On a page of type `ecommerce/product-listing-page` or `ecommerce/product-search-page`, `BlockProductsListing` adds an `ItemList` of the products on the current page, for Google's product carousel. Each entry names the product, its image, brand, product page URL and offer. Positions continue across pages: on page 2 with 48 products per page, the first entry is position 49. A product list embedded in a content page emits nothing.

## Custom sections

Add nodes to the page's graph with `useStructuredData(nodes)` from Frontend Core. It runs only on the server. Build nodes with the `define*` helpers of `@unhead/schema-org/vue`, or with the product mappers in `@laioutr-core/canonical-types/structured-data`:

```vue [app/sections/MyProductDetail.vue]
<script setup lang="ts">
import { defineWebPage } from '@unhead/schema-org/vue';
import { schemaOrgProductId, toSchemaOrgProduct } from '@laioutr-core/canonical-types/structured-data';

const props = defineProps(definitionToProps(definition));
const url = useCanonicalUrl().value;

if (props.product && url) {
  const node = toSchemaOrgProduct(props.product, { url });
  if (node) useStructuredData([defineWebPage({ '@type': 'ItemPage', mainEntity: { '@id': schemaOrgProductId(url) } }), node]);
}
</script>
```

- `useCanonicalUrl()` returns the canonical URL of the page being rendered. Use it for every absolute URL in your nodes, so they match the page's canonical link.
- `toSchemaOrgProduct(product, { url })` reads the product and its linked variants. Every component may be missing; the function never throws and returns `undefined` when there is no valid price.
- `toSchemaOrgProductListItem(product, { url, position })` builds one list entry for a product tile.

The page's `title`, `description` and `robots` come from the SEO fields in Studio. To change them, use the `frontend-core:page-head:resolve` [hook](/frontend/features/hooks), not a section.

## Testing

Check a live page with Google's [Rich Results Test](https://search.google.com/test/rich-results), and watch the merchant listings report in Search Console after the pages are crawled.
