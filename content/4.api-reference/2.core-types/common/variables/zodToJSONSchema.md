---
title: zodToJSONSchema
description: declaration
---

> `const` **zodToJSONSchema**: (`schema`: `z.ZodTypeAny`, `io?`: `"input"` \| `"output"`) => `z.core.JSONSchema.JSONSchema`

Transform a zod-schema to a JSON-schema with sensible defaults.

## Parameters

<table>
<thead>
<tr>
<th>Parameter</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td>

`schema`

</td>
<td>

`z.ZodTypeAny`

</td>
</tr>
<tr>
<td>

`io?`

</td>
<td>

`"input"` \| `"output"`

</td>
</tr>
</tbody>
</table>

## Returns

`z.core.JSONSchema.JSONSchema`
