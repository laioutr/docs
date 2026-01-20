---
title: LinkTokenMetadata
description: declaration
---

## Type Parameters

| Type Parameter                                                                          | Default type                                                          |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `TName` *extends* `string`                                                              | `string`                                                              |
| `TSourceEntity` *extends* `string`                                                      | `string`                                                              |
| `TTargetEntity` *extends* `string`                                                      | `string`                                                              |
| `TType` *extends* [`LinkTokenType`](/api-reference/orchestr/type-aliases/linktokentype) | [`LinkTokenType`](/api-reference/orchestr/type-aliases/linktokentype) |
| `TInput` *extends* `z.Schema`                                                           | `z.Schema`                                                            |

## Properties

| Property                            | Type            |
| ----------------------------------- | --------------- |
| [](){#defaultlimit} `defaultLimit?` | `number`        |
| [](){#description} `description?`   | `string`        |
| [](){#input} `input?`               | `TInput`        |
| [](){#label} `label`                | `string`        |
| [](){#name} `name`                  | `TName`         |
| [](){#source} `source`              | `TSourceEntity` |
| [](){#target} `target`              | `TTargetEntity` |
| [](){#type} `type`                  | `TType`         |
