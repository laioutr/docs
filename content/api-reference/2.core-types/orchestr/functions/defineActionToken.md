---
title: defineActionToken
description: declaration
---

> **defineActionToken**<`TName`, `TInput`, `TOutput`>(`action`: `TName`, `meta`: { `input?`: `TInput`; `output?`: `TOutput`; }): [`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)<{ `input`: `TInput`; `name`: `TName`; `output`: `TOutput`; }>

Define an action-token.

Returns a tagged string that can be used to identify the action.

It is recommended to use a namespaced name like `my-package/newsletter/custom-action` to avoid conflicts with other packages.

## Type Parameters

| Type Parameter                                                                                 | Default type   |
| ---------------------------------------------------------------------------------------------- | -------------- |
| `TName` *extends* `string`                                                                     | ‐              |
| `TInput` *extends* `ZodType`<`unknown`, `unknown`, `$ZodTypeInternals`<`unknown`, `unknown`>>  | `ZodUndefined` |
| `TOutput` *extends* `ZodType`<`unknown`, `unknown`, `$ZodTypeInternals`<`unknown`, `unknown`>> | `ZodVoid`      |

## Parameters

| Parameter      | Type                                          |
| -------------- | --------------------------------------------- |
| `action`       | `TName`                                       |
| `meta`         | { `input?`: `TInput`; `output?`: `TOutput`; } |
| `meta.input?`  | `TInput`                                      |
| `meta.output?` | `TOutput`                                     |

## Returns

[`ActionToken`](/api-reference/orchestr/type-aliases/actiontoken)<{ `input`: `TInput`; `name`: `TName`; `output`: `TOutput`; }>
