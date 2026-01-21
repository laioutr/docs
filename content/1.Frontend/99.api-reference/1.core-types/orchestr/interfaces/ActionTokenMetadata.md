---
title: ActionTokenMetadata
description: declaration
---

## Type Parameters

| Type Parameter                 | Default type |
| ------------------------------ | ------------ |
| `TName` *extends* `string`     | `string`     |
| `TInput` *extends* `z.Schema`  | `z.Schema`   |
| `TOutput` *extends* `z.Schema` | `z.Schema`   |

## Properties

| Property               | Type      | Description                         |
| ---------------------- | --------- | ----------------------------------- |
| [](){#input} `input`   | `TInput`  | Input provided to the token on call |
| [](){#name} `name`     | `TName`   | ‐                                   |
| [](){#output} `output` | `TOutput` | Return type of the token            |
