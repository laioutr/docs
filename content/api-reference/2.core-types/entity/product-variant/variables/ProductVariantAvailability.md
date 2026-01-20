---
title: ProductVariantAvailability
description: declaration
---

> `const` **ProductVariantAvailability**: { `~schema`: { `availabilityDate?`: `Date`; `quantity`: `number`; `status`: `"inStock"` | `"outOfStock"` | `"backorder"` | `"preorder"`; }; }

Represents the current availability of a product variant.

## Type declaration

| Name                        | Type                                                                                                                             | Description                                                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [](){#schema} `~schema`     | { `availabilityDate?`: `Date`; `quantity`: `number`; `status`: `"inStock"` \| `"outOfStock"` \| `"backorder"` \| `"preorder"`; } | ‐                                                                                                                                 |
| `~schema.availabilityDate?` | `Date`                                                                                                                           | Date when the product is available again.**See**<https://support.google.com/merchants/answer/6324470?sjid=8908944638393652594-EU> |
| `~schema.quantity`          | `number`                                                                                                                         | The current approximate inventory level for the variant.**See**<https://schema.org/inventoryLevel>                                |
| `~schema.status`            | `"inStock"` \| `"outOfStock"` \| `"backorder"` \| `"preorder"`                                                                   | **See**\* <https://schema.org/ItemAvailability>                                                                                   |

- <https://support.google.com/merchants/answer/6324448?sjid=8908944638393652594-EU> |
