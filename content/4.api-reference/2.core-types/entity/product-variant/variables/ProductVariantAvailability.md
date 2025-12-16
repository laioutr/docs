---
title: ProductVariantAvailability
description: declaration
---

> `const` **ProductVariantAvailability**: \{ `~schema`: \{ `availabilityDate?`: `Date`; `quantity`: `number`; `status`: `"inStock"` \| `"outOfStock"` \| `"backorder"` \| `"preorder"`; \}; \}

Represents the current availability of a product variant.

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

\{ `availabilityDate?`: `Date`; `quantity`: `number`; `status`: `"inStock"` \| `"outOfStock"` \| `"backorder"` \| `"preorder"`; \}

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.availabilityDate?`

</td>
<td>

`Date`

</td>
<td>

Date when the product is available again.

**See**

https://support.google.com/merchants/answer/6324470?sjid=8908944638393652594-EU

</td>
</tr>
<tr>
<td>

`~schema.quantity`

</td>
<td>

`number`

</td>
<td>

The current approximate inventory level for the variant.

**See**

https://schema.org/inventoryLevel

</td>
</tr>
<tr>
<td>

`~schema.status`

</td>
<td>

`"inStock"` \| `"outOfStock"` \| `"backorder"` \| `"preorder"`

</td>
<td>

**See**

 - https://schema.org/ItemAvailability
 - https://support.google.com/merchants/answer/6324448?sjid=8908944638393652594-EU

</td>
</tr>
</tbody>
</table>
