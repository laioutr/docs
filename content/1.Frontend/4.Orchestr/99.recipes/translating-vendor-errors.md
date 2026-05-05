---
title: Translating vendor errors
description: Map raw backend errors into canonical Laioutr errors so the storefront UI can render them with no connector-specific code.
seo:
  title: Translating vendor errors | Laioutr
  description: Map raw backend errors into canonical Laioutr errors so the storefront UI can render them with no connector-specific code.
sitemap:
  loc: /frontend/orchestr/recipes/translating-vendor-errors
  lastmod: 2026-05-05
  changefreq: monthly
  priority: 0.9

---

A customer adds a discontinued variant to their cart. Shopify returns `200 OK` with a `userErrors: [{ code: 'INVALID_MERCHANDISE_ID' }]` payload. Your action handler ignores it and returns the (empty) cart, so the customer sees their click do nothing. Throwing alone is not enough either: `throw new Error('Invalid merchandise')` arrives on the client as a generic 500 toast that says "Something went wrong", and pattern-matching on Shopify's error vocabulary in the storefront would couple the UI to one connector.

The standard pattern is to translate vendor errors into canonical Laioutr errors before throwing. Every storefront template Laioutr ships handles those canonical errors out of the box, so the same `add-to-cart` UI works against Shopify, Shopware, or any custom connector with no changes.

```ts
// One assertion + one catch + one warnings call after every mutation.
assertShopifyResponseHasData(response);              // transport errors
catchUserErrors(response, 'cartLinesAdd');           // payload errors → canonical
catchWarnings(response, 'cartLinesAdd');             // payload warnings → canonical
```

## Why translation matters

Orchestr serializes thrown errors with `errorFromUnknown` and ships them to the client as `{ name, message, data, cause, errors }`. The frontend cannot import a connector's error classes, so the only stable handle it has is `error.name`. A throw from a connector that uses canonical error classes (`ProductNotFoundError`, `DiscountCodeNotRedeemableError`, etc. from `@laioutr-core/canonical-types/ecommerce`) arrives with a recognizable `name`, and the storefront branches on it.

## Step 1: pick a canonical error

Browse `@laioutr-core/canonical-types/ecommerce` for an error class that matches your case. Common ones:

- `ProductNotFoundError`: the variant or product no longer exists.
- `ProductStockError`: out of stock or not enough stock.
- `ProductQuantityError`: minimum or maximum quantity violated.
- `DiscountCodeNotFoundError`, `DiscountCodeNotRedeemableError`: discount issues.
- `AddressNotFoundError`, `InvalidFieldError`: address or form-field validation.

If nothing fits, define a custom class (see [Custom errors](#custom-errors-when-no-canonical-class-fits) below) instead of throwing a plain `Error`.

## Step 2: assertion helpers for transport errors

Co-locate one helpers file per backend client (e.g. `server/shopify-helper/errors.ts`). Transport-level errors (network, GraphQL syntax, malformed responses) should not be translated to canonical errors; throw an `AggregateError` so Orchestr's `errorFromUnknown` can recursively serialize the cause for dev logs:

```ts [server/shopify-helper/errors.ts]
import { ClientResponse } from '@shopify/storefront-api-client';

export function assertShopifyResponseHasData<T>(
  response: ClientResponse<T>,
): asserts response is ClientResponse<T> & { data: T } {
  if (response.errors) {
    throw new AggregateError(
      response.errors.graphQLErrors ?? [],
      response.errors.message ?? 'Shopify request failed',
    );
  }
  if (!response.data) {
    throw new Error('No data returned from Shopify');
  }
}
```

A transport failure is not a "product not found"; it is a 500. Keeping that boundary clean stops connector bugs from masquerading as user-facing errors.

## Step 3: catch helpers for response-payload errors

Many vendors return `200 OK` with an errors array inside the payload. Walk the array and translate each known code to a canonical class. Throw a plain `Error` for anything unknown so it surfaces as a 500 with a clear message instead of being silently swallowed:

```ts [server/shopify-helper/errors.ts]
import {
  ProductNotFoundError,
  ProductQuantityError,
} from '@laioutr-core/canonical-types/ecommerce';

export function catchUserErrors<T extends Record<string, any>>(
  response: ClientResponse<T>,
  field: keyof T,
): void {
  const fieldData = response.data?.[field] as any;
  const errors = fieldData?.customerUserErrors ?? fieldData?.userErrors ?? [];

  for (const error of errors) {
    const variantId = extractVariantId(error.message);

    if (error.field?.includes('merchandiseId')) {
      if (error.code === 'INVALID_MERCHANDISE_ID' || error.code === 'INVALID') {
        throw new ProductNotFoundError(variantId);
      }
    }
    if (error.field?.includes('quantity')) {
      if (error.code === 'INVALID_INCREMENT') throw new ProductQuantityError('INVALID_INCREMENT', variantId);
      if (error.code === 'MINIMUM_NOT_MET') throw new ProductQuantityError('MINIMUM_NOT_MET', variantId);
      if (error.code === 'MAXIMUM_EXCEEDED') throw new ProductQuantityError('MAXIMUM_EXCEEDED', variantId);
    }

    throw new Error(`Unhandled Shopify userError: ${error.code} (field: ${error.field?.join(',')})`);
  }
}
```

Two design choices that pay off when you scale this across actions:

1. One helper per error surface, not per error. Shopify's `cartLinesAdd`, `cartLinesUpdate`, and `cartCreate` all return errors under the same shape, so one `catchUserErrors(response, fieldName)` covers them all. The `field` argument is the GraphQL mutation name.
2. Throw on unknown codes. A silent unknown-error is worse than a loud 500: the storefront UI shows a working result while the customer's intent dropped on the floor.

Some backends also surface non-fatal warnings (Shopify ships these as `warnings` next to `userErrors`). Treat them with a separate `catchWarnings` helper that follows the same translation pattern but maps codes like `MERCHANDISE_OUT_OF_STOCK` to `ProductStockError`.

## Step 4: call the helpers from every action

Each mutation gets the assertion-then-catch sequence:

```ts [server/orchestr/cart/add-items.action.ts]
import { CartAddItemsAction } from '@laioutr-core/canonical-types/ecommerce';
import { defineShopifyAction } from '../../middleware/defineShopify';
import {
  assertShopifyResponseHasData,
  catchUserErrors,
  catchWarnings,
} from '../../shopify-helper/errors';

export default defineShopifyAction(CartAddItemsAction, async ({ input, context, event }) => {
  const response = await context.shopifyClient.request(cartLinesAddMutation, {
    variables: { cartId: getCartId(event), lines: mapLines(input) },
  });

  assertShopifyResponseHasData(response);
  catchUserErrors(response, 'cartLinesAdd');
  catchWarnings(response, 'cartLinesAdd');

  return { /* ... */ };
});
```

The order matters. The assertion runs first because the catch helpers reach into `response.data`; without the assertion, an undefined `data` would surface as a confusing TypeError instead of the actual transport failure.

## Custom errors when no canonical class fits

If your connector exposes domain-specific failures the canonical types do not cover (e.g. a B2B-only "buyer not approved"), define your own class and co-locate it with the entity it relates to:

```text
src/runtime/server/orchestr/product/
├── byId.query.ts
└── errors/
    └── product-not-found.error.ts
```

Use `@ebec/http` for the base class so the error carries an HTTP status code:

```ts [server/orchestr/product/errors/product-not-found.error.ts]
import { NotFoundError } from '@ebec/http';

/** Thrown when a product that should be added to the cart is not found. */
export class ProductNotFoundError extends NotFoundError {
  declare data: { [key: string]: string };
  static readonly code = 'PRODUCT_NOT_FOUND';

  constructor(key: string) {
    super({
      message: `Product with id ${key} not found`,
      code: ProductNotFoundError.code,
      data: { key },
    });
  }
}
```

The class name is what the frontend matches on (it survives serialization), so pick a name that describes the failure semantically rather than the vendor: `BuyerNotApprovedError`, not `ShopifyB2BError`. Whatever you put in `data` arrives intact on the client; use it for IDs, error codes, anything the UI needs to render a useful message.

Each `@ebec/http` subclass sets a `statusCode` property (`NotFoundError` → 404, `BadRequestError` → 400, `PreconditionFailedError` → 412) that the Orchestr action endpoint reads with `error.statusCode ?? 500` when re-throwing. A plain `BaseError` from `ebec` (or any error without a `statusCode`) ends up as a 500. This only matters for **action** throws; errors from query handlers, link handlers, and component resolvers travel inside a 200 OK turbo-stream as per-result error chunks, so their `statusCode` is not used as an HTTP status.

## Frontend usage

The serialized canonical error arrives on the client wrapped: `fetchTurboStream` parses the server's response body and re-throws a generic `Error` whose `cause` carries the original error's `name`, `message`, and `data`. The `name` is prefixed with `[SERVER] ` so it's obvious in stack traces where the throw originated.

A small helper keeps pattern-matching readable:

```ts [app/utils/canonical-error.ts]
export const isCanonicalError = (error: unknown, ErrorClass: { name: string }): boolean => {
  const cause = (error as Error | undefined)?.cause as { name?: string } | undefined;
  return cause?.name === `[SERVER] ${ErrorClass.name}`;
};
```

A connected component then uses `try`/`catch` around `mutateAsync` (the idiom shipping connected components in this repo follow, though most catch blocks today still surface the raw `error.cause.message` instead of branching on canonical errors):

```vue [components/ConnectedProductTileBasic.vue]
<script setup lang="ts">
import { useMutationAction, useToasterStore } from '#imports';
import { CartAddItemsAction, ProductNotFoundError } from '@laioutr-core/canonical-types/ecommerce';
import { isCanonicalError } from '~/utils/canonical-error';

const addToCartMutation = useMutationAction(CartAddItemsAction);
const toaster = useToasterStore();

const addToCart = async (variantId: string) => {
  try {
    await addToCartMutation.mutateAsync([{ type: 'product', variantId, quantity: 1 }]);
    toaster.addToast({ title: 'Added to cart', variant: 'success' });
  } catch (error) {
    if (isCanonicalError(error, ProductNotFoundError)) {
      toaster.addToast({ title: 'That product is no longer available.', variant: 'error' });
      return;
    }
    const causeMessage = ((error as Error | undefined)?.cause as { message?: string } | undefined)?.message;
    toaster.addToast({ title: 'Failed to add to cart', subline: causeMessage ?? 'Something went wrong', variant: 'error' });
  }
};
</script>
```

The storefront templates that ship with Laioutr already branch on every canonical error class, so most translations land working with no frontend changes. Custom error classes you define need their own UI handler.

## Related

- [Actions: Error Handling](/frontend/orchestr/actions#error-handling): base concepts and the `ebec` / `@ebec/http` packages.
- [Wire format](/frontend/orchestr/wire-format): what survives the round-trip to the client.
