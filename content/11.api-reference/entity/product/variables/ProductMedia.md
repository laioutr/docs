---
title: ProductMedia
description: declaration
---

> `const` **ProductMedia**: \{ `~schema`: \{ `images`: \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \}[]; `media`: (\{ `alt?`: `string`; `meta?`: `any`; `sources`: `any`; `type`: `string`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `height`: `number`; `length`: \{ `duration`: `string`; \}; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"video"`; \})[]; \}; \}

Product media.

Contains all images, videos, 3d models and other media of a product.

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

\{ `images`: \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \}[]; `media`: (\{ `alt?`: `string`; `meta?`: `any`; `sources`: `any`; `type`: `string`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `height`: `number`; `length`: \{ `duration`: `string`; \}; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"video"`; \})[]; \}

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.images`

</td>
<td>

\{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \}[]

</td>
<td>

All images of a product, including the cover-image on index 0.

</td>
</tr>
<tr>
<td>

`~schema.media`

</td>
<td>

(\{ `alt?`: `string`; `meta?`: `any`; `sources`: `any`; `type`: `string`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `height`: `number`; `length`: \{ `duration`: `string`; \}; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"video"`; \})[]

</td>
<td>

All media: images, videos, 3d models and other media.

</td>
</tr>
</tbody>
</table>
