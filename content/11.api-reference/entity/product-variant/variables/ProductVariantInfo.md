---
title: ProductVariantInfo
description: declaration
---

> `const` **ProductVariantInfo**: \{ `~schema`: \{ `image?`: \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \}; \}; \}

Additional information about a product variant.

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

\{ `image?`: \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \}; \}

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.image?`

</td>
<td>

\{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \}

</td>
<td>

Image associated with the product variant.

</td>
</tr>
<tr>
<td>

`~schema.image.alt?`

</td>
<td>

`string`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.image.meta?`

</td>
<td>

`any`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.image.sources`

</td>
<td>

\{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]

</td>
<td>

Each source is a different version of the same image. Differences may be:
- mobile or desktop version
- different file-formats

</td>
</tr>
<tr>
<td>

`~schema.image.type`

</td>
<td>

`"image"`

</td>
<td>

&hyphen;

</td>
</tr>
</tbody>
</table>
