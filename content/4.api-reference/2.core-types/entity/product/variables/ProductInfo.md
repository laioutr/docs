---
title: ProductInfo
description: declaration
---

> `const` **ProductInfo**: \{ `~schema`: \{ `brand?`: `string`; `brandLink?`: `string`; `cover`: \{ `alt?`: `string`; `meta?`: `any`; `sources`: `any`; `type`: `string`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `height`: `number`; `length`: \{ `duration`: `string`; \}; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"video"`; \}; `shortDescription?`: `string`; \}; \}

Extended product-information.

Useful for product-tiles and product-pages.

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Default value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="schema"></a> `~schema`

</td>
<td>

\{ `brand?`: `string`; `brandLink?`: `string`; `cover`: \{ `alt?`: `string`; `meta?`: `any`; `sources`: `any`; `type`: `string`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `height`: `number`; `length`: \{ `duration`: `string`; \}; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"video"`; \}; `shortDescription?`: `string`; \}

</td>
<td>

&hyphen;

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.brand?`

</td>
<td>

`string`

</td>
<td>

&hyphen;

</td>
<td>

Brand of the product. Can also be used for manufacturer or vendor name.

</td>
</tr>
<tr>
<td>

`~schema.brandLink?`

</td>
<td>

`string`

</td>
<td>

&hyphen;

</td>
<td>

Link to the brand-page.

</td>
</tr>
<tr>
<td>

`~schema.cover`

</td>
<td>

\{ `alt?`: `string`; `meta?`: `any`; `sources`: `any`; `type`: `string`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `height`: `number`; `length`: \{ `duration`: `string`; \}; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"video"`; \}

</td>
<td>

`Media`

</td>
<td>

Main product image.

</td>
</tr>
<tr>
<td>

`~schema.shortDescription?`

</td>
<td>

`string`

</td>
<td>

&hyphen;

</td>
<td>

Short product description. This may be used as subtitle on product-tiles.
Not to be confused with the description-component which is the full html-description of a product.

</td>
</tr>
</tbody>
</table>
