---
title: EntityComponentType
description: declaration
---

> **EntityComponentType**<`TToken`> = `EntityComponentType`<`TToken`>

Get the type of a component from a component-definition.

## Type Parameters

| Type Parameter                                                                                         |
| ------------------------------------------------------------------------------------------------------ |
| `TToken` *extends* [`EntityComponentToken`](/api-reference/orchestr/type-aliases/entitycomponenttoken) |

## Example

```ts
const ProductVariantPrices = defineEntityComponentToken('prices', {
  entityType: 'ProductVariant',
  schema: z.object({
    price: z.number(),
  }),
});

type ProductVariantPrices = EntityComponentType<typeof ProductVariantPrices>;
// => { price: number }
```
