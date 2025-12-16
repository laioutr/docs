---
title: EntityComponentType
description: declaration
---

> **EntityComponentType**\<`TToken`\> = `EntityComponentType`\<`TToken`\>

Get the type of a component from a component-definition.

## Type Parameters

<table>
<thead>
<tr>
<th>Type Parameter</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`TToken` *extends* [`EntityComponentToken`](/api-reference/orchestr/type-aliases/entitycomponenttoken)

</td>
</tr>
</tbody>
</table>

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
