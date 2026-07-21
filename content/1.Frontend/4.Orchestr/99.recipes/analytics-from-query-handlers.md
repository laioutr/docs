---
title: Analytics components from query handlers
description: When per-result context exists only in the originating query response (attribution tokens, search position, relevance scores), provide an entity component inline from the query handler and skip writing a resolver for it.
seo:
  title: Analytics components from query handlers
  description: Provide entity components inline from query handlers when the data only exists in the originating query response.
sitemap:
  loc: /frontend/orchestr/recipes/analytics-from-query-handlers
  lastmod: 2026-05-05
  changefreq: monthly
  priority: 0.9

---

Your search engine returns 20 product IDs plus per-product context: a tracking token (`attributionToken`) the vendor wants back if the customer clicks, the position in the result set, an internal relevance score. That data only exists in the search response. There is no `getAttributionTokenForProduct(id)` endpoint, because the token is generated per-search and tied to that one user's session.

You still want the data on the storefront. Most often: the attribution token has to ride along on the product detail page link as a query parameter so the search vendor can attribute the click back to the right impression.

The pattern: provide a single entity component from the query handler inline, alongside whatever the regular product component resolvers do. Skip writing a resolver for the analytics component, because there is no source of truth for it outside this one query.

```ts [server/orchestr/product/recommendations.query.ts]
import { ProductAnalytics } from '@laioutr-core/canonical-types/entity/product';

export default defineMyAppQuery({
  implements: ProductRecommendationsQuery,
  provides: [ProductAnalytics], // ← only the analytics component
  run: async ({ context, $entity }) => {
    const response = await context.searchClient.recommend({ /* ... */ });

    return {
      entities: response.results.map((result) =>
        $entity({
          id: result.productId,
          analytics: () => ({
            pdpLinkQuery: { attributionToken: response.attributionToken },
          }),
        }),
      ),
    };
  },
});
```

The Shopify, Shopware, or other Product component resolvers continue providing `base`, `prices`, `media`, and everything else they normally do. The query handler only contributes the one component it has data for.

## How this combines with component resolvers

When the frontend requests, say, `[ProductBase, ProductPrices, ProductAnalytics]` against this query:

- `ProductAnalytics` is in `provides:`, so Orchestr extracts it from the query handler's inline `entities` array and returns it directly.
- `ProductBase` and `ProductPrices` are not in `provides:`, so Orchestr forwards them to the registered Product component resolvers, just like it would for any other Product entity.

The two paths run in parallel for each entity. The frontend gets one assembled `Product` with all three components, and never knows the analytics piece came from a different source than the rest.

## Why no resolver

Component resolvers are how Orchestr fetches a component for an entity given only the entity ID. They run anywhere a Product is needed: by-slug query, by-id query, category listings, link targets. If you wrote a resolver for `ProductAnalytics`, Orchestr would call it from those contexts too. The resolver would have nothing to return because the analytics data only exists in the originating query's response.

So the contract is: `analytics` is `undefined` for a Product fetched by anything other than a search-style query. The frontend handles that gracefully.

```vue [components/ProductTile.vue]
<script setup lang="ts">
const props = defineProps<{ product: ProductWithComponents }>();

const detailLink = computed(() => {
  const base = `/products/${props.product.components.base.slug}`;
  const params = props.product.components.analytics?.pdpLinkQuery;
  if (!params) return base;
  return `${base}?${new URLSearchParams(params).toString()}`;
});
</script>
```

## When this pattern fits

Search results, AI recommendations, "frequently bought together", "you might also like", manually merchandised collections with vendor-tracked impressions: anywhere the upstream returns per-result context the standalone product lookup couldn't reconstruct.

## When to write a resolver instead

If the component data has a real source you can query independently (a per-product loyalty tier, a stock-availability lookup, a CMS-managed badge), write a resolver for it instead. The inline-from-query path is for data that genuinely doesn't exist outside the query that produced it.

## Related

- [Queries: Inline Entity Data](/frontend/orchestr/queries#inline-entity-data): the underlying mechanism `provides:` builds on.
- [Component resolvers](/frontend/orchestr/component-resolvers): when a component does have a standalone source and should get a resolver.
