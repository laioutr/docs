---
title: CartAddItemsAction
description: declaration
---

> `const` **CartAddItemsAction**: [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)\<\{ `input`: `ZodArray`; `name`: `"ecommerce/cart/add-items"`; `output`: `ZodVoid`; \}\>

Add items to the cart.

Laioutr supports only one cart per session. Therefore, the items are all added to the same cart.

Also, there is no separate action for creating a cart in laioutr. If the backend-system requires the creation of a
cart before items can be added, that must be done in the implementation of this action.

## Example

```ts
import { CartAddItemsAction } from '@laioutr-core/canonical-types/ecommerce';
fetchAction(CartAddItemsAction, [
  {
    type: 'product',
    productId: '123',
    variantId: '456',
  },
  {
    type: 'discount-code',
    code: '123',
  },
]);
```

## Throws

[ProductNotFoundError](/api-reference/ecommerce/classes/productnotfounderror)

## Throws

[ProductQuantityError](/api-reference/ecommerce/classes/productquantityerror)

## Throws

[ProductSoldOutError](/api-reference/ecommerce/classes/productsoldouterror)

## Throws

[DiscountCodeNotFoundError](/api-reference/ecommerce/classes/discountcodenotfounderror)

## Throws

[DiscountCodeNotRedeemableError](/api-reference/ecommerce/classes/discountcodenotredeemableerror)
