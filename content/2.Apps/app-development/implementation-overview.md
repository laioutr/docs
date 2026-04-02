---
title: Implementation Overview
description: What a connector app needs to implement for Laioutr and Laioutr UI compatibility, and what existing connectors already provide.
seo:
  title: Implementation Overview | Laioutr
  description: What a connector app needs to implement for Laioutr and Laioutr UI compatibility, and what existing connectors already…
---

You're building a connector app that plugs a commerce backend into Laioutr. The canonical types in `@laioutr-core/canonical-types` define the full contract between your connector and the frontend. The [API reference](/frontend/api-reference) documents every action, query, link, and entity in detail. This page adds what the reference does not: which parts of that contract matter most, what constitutes a minimum viable connector, and how far existing connectors go.

## Priority tiers

Not every canonical type needs an implementation on day one. The tiers below reflect how the standard Laioutr UI sections, blocks, and page types use each token.

**Required** items power core storefront pages (product detail, product listing, cart, navigation). Without them, those pages break or render empty.

**Expected** items enable common features like login, checkout redirect, customer account, category navigation, and search autocomplete. Omitting them disables the feature but does not break the storefront.

**Optional** items power specific add-ons: blog, reviews, wishlist, newsletter, analytics. Implement them when your project needs them.

### Queries

| Priority | Tokens |
|---|---|
| Required | [`product/by-slug`](/frontend/api-reference/ecommerce/queries#product), [`product/by-category-slug`](/frontend/api-reference/ecommerce/queries#product), [`category/by-slug`](/frontend/api-reference/ecommerce/queries#category), [`cart/get-current`](/frontend/api-reference/ecommerce/queries#cart), [`menu/by-alias`](/frontend/api-reference/ecommerce/queries#menu) |
| Expected | [`product/by-category-id`](/frontend/api-reference/ecommerce/queries#product), [`product/search`](/frontend/api-reference/ecommerce/queries#product), [`category/all`](/frontend/api-reference/ecommerce/queries#category), [`suggested-search/search`](/frontend/api-reference/suggested-search/queries) |
| Optional | [`wishlist/get-current`](/frontend/api-reference/ecommerce/queries#wishlist), [`blog/collection/all`](/frontend/api-reference/blog/queries), [`blog/collection/by-slug`](/frontend/api-reference/blog/queries), [`blog/post/all`](/frontend/api-reference/blog/queries), [`blog/post/by-slug`](/frontend/api-reference/blog/queries) |

### Actions

| Priority | Tokens |
|---|---|
| Required | [`cart/add-items`](/frontend/api-reference/ecommerce/actions#cart), [`cart/remove-items`](/frontend/api-reference/ecommerce/actions#cart), [`cart/update-items`](/frontend/api-reference/ecommerce/actions#cart) |
| Expected | [`cart/get-checkout-url`](/frontend/api-reference/ecommerce/actions#cart), [`auth/login`](/frontend/api-reference/ecommerce/actions#auth), [`auth/logout`](/frontend/api-reference/ecommerce/actions#auth), [`auth/register`](/frontend/api-reference/ecommerce/actions#auth), [`auth/recover`](/frontend/api-reference/ecommerce/actions#auth), [`customer/get-current`](/frontend/api-reference/ecommerce/actions#customer), [`customer/address-get-all`](/frontend/api-reference/ecommerce/actions#customer), [`customer/address-create`](/frontend/api-reference/ecommerce/actions#customer), [`customer/address-update`](/frontend/api-reference/ecommerce/actions#customer), [`customer/address-delete`](/frontend/api-reference/ecommerce/actions#customer), [`customer/address-set-default`](/frontend/api-reference/ecommerce/actions#customer) |
| Optional | [`auth/login-oauth`](/frontend/api-reference/ecommerce/actions#auth), [`auth/logout-oauth`](/frontend/api-reference/ecommerce/actions#auth), [`auth/oauth-callback`](/frontend/api-reference/ecommerce/actions#auth), [`wishlist/add-items`](/frontend/api-reference/ecommerce/actions#wishlist), [`wishlist/remove-items`](/frontend/api-reference/ecommerce/actions#wishlist), [`product/reviews/create`](/frontend/api-reference/ecommerce/actions#review), [`newsletter/subscribe`](/frontend/api-reference/newsletter/actions), [`tracking/event/track`](/frontend/api-reference/tracking/actions) |

### Links

| Priority | Tokens |
|---|---|
| Required | `product/variants`, `product/breadcrumb`, `cart/cart-items`, `cart/cart-item-product-variant` |
| Expected | `category/breadcrumb`, `category/products`, `suggested-search/entries` |
| Optional | `product/reviews`, `product/all-categories`, `suggested-search/products`, `blog/collection/posts`, `blog/post/comments` |

### Entity components

Your connector resolves entity data through component resolvers. Each entity is split into components that resolvers provide independently. The [entity reference](/frontend/api-reference/entities) documents every component. Below is the priority breakdown for the two most complex entities.

**Product:** base, description, media, prices, and defaultVariant are required. seo, info, and flags are expected. brand, rating, and analytics are optional.

**ProductVariant:** base, prices, and options are required. availability and info are expected. quantityPrices, quantityRule, and shipping are optional.

For Cart, CartItem, Category, MenuItem, and BreadcrumbItem, implement at least the `base` component (plus `cost` for Cart and CartItem).

## Minimum viable connector

If you are building a new connector and want the standard Laioutr UI to work, start here:

**Queries (5):**
`product/by-slug`, `product/by-category-slug`, `category/by-slug`, `cart/get-current`, `menu/by-alias`

**Actions (3):**
`cart/add-items`, `cart/remove-items`, `cart/update-items`

**Links (4):**
`product/variants`, `product/breadcrumb`, `cart/cart-items`, `cart/cart-item-product-variant`

**Entity resolvers:**
Product (base, description, media, prices, defaultVariant), ProductVariant (base, prices, options), Category (base), Cart (base, cost), CartItem (base, cost), MenuItem (base), BreadcrumbItem (base)

This gives you working product pages, category listing pages, navigation, cart, and breadcrumbs. From there, add auth, customer, search, and other features as your project requires.


## Related

::card-group
  :::card{title="Ecommerce Actions" to="/frontend/api-reference/ecommerce/actions"}
  Input/output schemas for cart, auth, customer, wishlist, and review actions.
  :::

  :::card{title="Ecommerce Queries" to="/frontend/api-reference/ecommerce/queries"}
  Input schemas and entity types for product, category, cart, menu, and wishlist queries.
  :::

  :::card{title="Entity Reference" to="/frontend/api-reference/entities"}
  Component definitions for Product, ProductVariant, Cart, Category, and all other entities.
  :::

  :::card{title="App Starter" to="/apps/app-development/app-starter"}
  Scaffold a new connector app from the official template.
  :::
::
