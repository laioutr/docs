---
title: WishlistAddItemsAction
description: declaration
---

> `const` **WishlistAddItemsAction**: [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)\<\{ `input`: `ZodArray`; `name`: `"ecommerce/wishlist/add-items"`; `output`: `ZodVoid`; \}\>

Add one or more items to the wishlist.

Currently only products can be added to the wishlist. Also, only one wishlist per session is supported.

## Throws

[ProductNotFoundError](/api-reference/ecommerce/classes/productnotfounderror)

## Throws

[UnauthenticatedError](/api-reference/ecommerce/classes/unauthenticatederror) in case the backend-system requires authentication for wishlists.
