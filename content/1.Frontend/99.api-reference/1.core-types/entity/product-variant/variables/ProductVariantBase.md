---
title: ProductVariantBase
description: declaration
---

> `const` **ProductVariantBase**: { `~schema`: { `gtin?`: `string`; `name`: `string`; `sku`: `string`; }; }

Base information about a product variant.

## Type declaration

| Name                    | Type                                                      | Description                                                                                                  |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [](){#schema} `~schema` | { `gtin?`: `string`; `name`: `string`; `sku`: `string`; } | ‐                                                                                                            |
| `~schema.gtin?`         | `string`                                                  | The external product identifier (GTIN, EAN, etc.) of the product variant.**See**\* <https://schema.org/gtin> |

- <https://en.wikipedia.org/wiki/Global_Trade_Item_Number> |
  \| `~schema.name` | `string` | The variant-specific name. Complements the product name. |
  \| `~schema.sku` | `string` | The merchants internal stock keeping unit (SKU) of the product variant.**See**<https://schema.org/sku> |
