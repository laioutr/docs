---
title: zodToJSONSchema
description: declaration
---

> `const` **zodToJSONSchema**: (`schema`: `z.ZodTypeAny`, `io?`: `"input"` | `"output"`) => `z.core.JSONSchema.JSONSchema`

Transform a zod-schema to a JSON-schema with sensible defaults.

## Parameters

| Parameter | Type                    |
| --------- | ----------------------- |
| `schema`  | `z.ZodTypeAny`          |
| `io?`     | `"input"` \| `"output"` |

## Returns

`z.core.JSONSchema.JSONSchema`
