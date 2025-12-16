---
title: ProductVariantBase
description: declaration
---

> `const` **ProductVariantBase**: \{ `~schema`: \{ `gtin?`: `string`; `name`: `string`; `sku`: `string`; \}; \}

Base information about a product variant.

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="schema"></a> `~schema`

</td>
<td>

\{ `gtin?`: `string`; `name`: `string`; `sku`: `string`; \}

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.gtin?`

</td>
<td>

`string`

</td>
<td>

The external product identifier (GTIN, EAN, etc.) of the product variant.

**See**

 - https://schema.org/gtin
 - https://en.wikipedia.org/wiki/Global_Trade_Item_Number

</td>
</tr>
<tr>
<td>

`~schema.name`

</td>
<td>

`string`

</td>
<td>

The variant-specific name. Complements the product name.

</td>
</tr>
<tr>
<td>

`~schema.sku`

</td>
<td>

`string`

</td>
<td>

The merchants internal stock keeping unit (SKU) of the product variant.

**See**

https://schema.org/sku

</td>
</tr>
</tbody>
</table>
