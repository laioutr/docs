---
title: ProductVariantQuantityPrices
description: declaration
---

> `const` **ProductVariantQuantityPrices**: { `~schema`: { `price`: { `amount`: `number`; `currency`: `string`; }; `quantity`: `number`; `savingsPercent`: `number`; } [] ; }

Represents the quantity-based pricing for a product variant.

Useful if a product gets cheaper the more a customer buys.

E.g. Save 5% when buying 10 items.

## Type declaration

| Name                    | Type                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [](){#schema} `~schema` | { `price`: { `amount`: `number`; `currency`: `string`; }; `quantity`: `number`; `savingsPercent`: `number`; } [] |

## See

eligibleQuantity on <https://schema.org/Offer>
