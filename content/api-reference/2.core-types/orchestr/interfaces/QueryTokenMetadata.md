---
title: QueryTokenMetadata
description: declaration
---

## Type Parameters

| Type Parameter                                                                            | Default type                                                            |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `TName` *extends* `string`                                                                | `string`                                                                |
| `TEntityType` *extends* `string`                                                          | `string`                                                                |
| `TType` *extends* [`QueryTokenType`](/api-reference/orchestr/type-aliases/querytokentype) | [`QueryTokenType`](/api-reference/orchestr/type-aliases/querytokentype) |
| `TInput` *extends* `z.Schema`                                                             | `z.Schema`                                                              |

## Properties

| Property                            | Type          |
| ----------------------------------- | ------------- |
| [](){#defaultlimit} `defaultLimit?` | `number`      |
| [](){#description} `description?`   | `string`      |
| [](){#entity} `entity`              | `TEntityType` |
| [](){#input} `input`                | `TInput`      |
| [](){#label} `label`                | `string`      |
| [](){#name} `name`                  | `TName`       |
| [](){#type} `type`                  | `TType`       |
