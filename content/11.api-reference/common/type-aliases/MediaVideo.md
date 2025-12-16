---
title: MediaVideo
description: declaration
---

> **MediaVideo** = \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `height`: `number`; `length`: \{ `duration`: `string`; \}; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"video"`; \}

A MediaVideo describes a video to be displayed in the browser.

A video consists of one or more MediaSourceVideo and additional metadata.

## Type declaration

<table>
<thead>
<tr>
<th>Name</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

<a id="alt"></a> `alt?`

</td>
<td>

`string`

</td>
</tr>
<tr>
<td>

<a id="meta"></a> `meta?`

</td>
<td>

`any`

</td>
</tr>
<tr>
<td>

<a id="sources"></a> `sources`

</td>
<td>

\{ `height`: `number`; `length`: \{ `duration`: `string`; \}; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]

</td>
</tr>
<tr>
<td>

<a id="type"></a> `type`

</td>
<td>

`"video"`

</td>
</tr>
</tbody>
</table>
