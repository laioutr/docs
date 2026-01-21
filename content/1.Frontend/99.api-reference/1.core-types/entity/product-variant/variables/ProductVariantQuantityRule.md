---
title: ProductVariantQuantityRule
description: declaration
---

> `const` **ProductVariantQuantityRule**: { `~schema`: { `increment`: `number`; `max?`: `number`; `min`: `number`; }; }

Represents the quantity rule for a product variant.

## Type declaration

| Name                    | Type                                                          | Description                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| [](){#schema} `~schema` | { `increment`: `number`; `max?`: `number`; `min`: `number`; } | ‐                                                                                                                                                |
| `~schema.increment`     | `number`                                                      | The quantity increment between min and max. All valid quantities must be divisible by this value.&#xA;Must be less than or equal to min and max. |
| `~schema.max?`          | `number`                                                      | If set, must be lower than or equal to the minimum. Must be a multiple of the increment.                                                         |
| `~schema.min`           | `number`                                                      | Minimum quantity a user has to purchase. Must be a multiple of the increment.                                                                    |

## See

<https://shopify.dev/docs/api/storefront/2025-01/objects/quantityrule>
