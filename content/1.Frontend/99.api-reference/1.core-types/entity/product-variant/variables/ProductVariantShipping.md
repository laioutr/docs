---
title: ProductVariantShipping
description: declaration
---

> `const` **ProductVariantShipping**: { `~schema`: { `forecast?`: { `cutoffTime?`: { `time`: `string`; }; `maxDays?`: `number`; `minDays?`: `number`; }; `rate`: { `amount`: `number`; `currency`: `string`; }; `required`: `boolean`; }; }

Represents the shipping information for a product variant.

## Type declaration

| Name                               | Type                                                                                                                                                                                  | Default value | Description                                                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [](){#schema} `~schema`            | { `forecast?`: { `cutoffTime?`: { `time`: `string`; }; `maxDays?`: `number`; `minDays?`: `number`; }; `rate`: { `amount`: `number`; `currency`: `string`; }; `required`: `boolean`; } | ‐             | ‐                                                                                                                                                                  |
| `~schema.forecast?`                | { `cutoffTime?`: { `time`: `string`; }; `maxDays?`: `number`; `minDays?`: `number`; }                                                                                                 | ‐             | Forecasted shipping time. Handling time + transit time.**See**<https://schema.org/ShippingDeliveryTime>                                                            |
| `~schema.forecast.cutoffTime?`     | { `time`: `string`; }                                                                                                                                                                 | ‐             | Order cutoff time allows merchants to describe the time after which they will no longer process orders received on that day.**See**<https://schema.org/cutoffTime> |
| `~schema.forecast.cutoffTime.time` | `string`                                                                                                                                                                              | ‐             | ‐                                                                                                                                                                  |
| `~schema.forecast.maxDays?`        | `number`                                                                                                                                                                              | ‐             | ‐                                                                                                                                                                  |
| `~schema.forecast.minDays?`        | `number`                                                                                                                                                                              | ‐             | ‐                                                                                                                                                                  |
| `~schema.rate`                     | { `amount`: `number`; `currency`: `string`; }                                                                                                                                         | `Money`       | The shipping cost for the product variant.                                                                                                                         |
| `~schema.rate.amount`              | `number`                                                                                                                                                                              | ‐             | Amount in smallest unit of currency. E.g. cents, pence, etc.                                                                                                       |
| `~schema.rate.currency`            | `string`                                                                                                                                                                              | ‐             | ISO 4217 currency code. E.g. 'USD', 'EUR', 'GBP', etc.                                                                                                             |
| `~schema.required`                 | `boolean`                                                                                                                                                                             | ‐             | If true, the product variant requires shipping. E.g. it is a physical good.                                                                                        |

## See

- <https://schema.org/OfferShippingDetails>
- <https://schema.org/ShippingDeliveryTime>
- <https://support.google.com/merchants/answer/14949917?hl=en&sjid=12076696190966471938-EU>
