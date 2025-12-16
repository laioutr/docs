---
title: UnitPrice
description: declaration
---

> `const` **UnitPrice**: `z.ZodObject`\<\{ `price`: `z.ZodObject`\<\{ `amount`: `z.ZodNumber`; `currency`: `z.ZodString`; \}, `z.core.$strip`\>; `quantity`: `z.ZodObject`\<\{ `unit`: `z.ZodCustom`\<[`MeasurementUnit`](/api-reference/common/type-aliases/measurementunit), [`MeasurementUnit`](/api-reference/common/type-aliases/measurementunit)\>; `value`: `z.ZodNumber`; \}, `z.core.$strip`\>; `reference`: `z.ZodObject`\<\{ `unit`: `z.ZodCustom`\<[`MeasurementUnit`](/api-reference/common/type-aliases/measurementunit), [`MeasurementUnit`](/api-reference/common/type-aliases/measurementunit)\>; `value`: `z.ZodNumber`; \}, `z.core.$strip`\>; \}, `z.core.$strip`\>

This object descibes a unit-price, e.g. 13.99 EUR / 100g

## See

 - https://support.google.com/merchants/answer/6324455?hl=en&sjid=12076696190966471938-EU
 - https://schema.org/UnitPriceSpecification
 - https://shopify.dev/docs/api/storefront/2025-01/objects/ProductVariant#field-ProductVariant.fields.unitPrice
