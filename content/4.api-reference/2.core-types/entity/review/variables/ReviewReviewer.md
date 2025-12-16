---
title: ReviewReviewer
description: declaration
---

> `const` **ReviewReviewer**: \{ `~schema`: \{ `avatar?`: \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \}; `isAnonymous?`: `boolean`; `name`: `string`; \}; \}

Information about the author of a review, e.g. the reviewer.

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

\{ `avatar?`: \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \}; `isAnonymous?`: `boolean`; `name`: `string`; \}

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.avatar?`

</td>
<td>

\{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \}

</td>
<td>

The avatar-image of the reviewer.

</td>
</tr>
<tr>
<td>

`~schema.avatar.alt?`

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

`~schema.avatar.meta?`

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

`~schema.avatar.sources`

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

`~schema.avatar.type`

</td>
<td>

`"image"`

</td>
<td>

&hyphen;

</td>
</tr>
<tr>
<td>

`~schema.isAnonymous?`

</td>
<td>

`boolean`

</td>
<td>

Whether the reviewer is anonymous.

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

The name of the reviewer. If anonymous, this may be an empty string.

</td>
</tr>
</tbody>
</table>
