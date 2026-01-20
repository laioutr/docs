---
title: reflectComponent
description: declaration
---

> **reflectComponent**(`component`: [`EntityComponentTokenMetadata`](/api-reference/orchestr/type-aliases/entitycomponenttokenmetadata), `implementations`: [`ReflectedComponentResolverImplementation`](/api-reference/orchestr/interfaces/reflectedcomponentresolverimplementation)[] ): { `entityType`: `string`; `implementations`: [`ReflectedComponentResolverImplementation`](/api-reference/orchestr/interfaces/reflectedcomponentresolverimplementation)[] ; `name`: `string`; `schema`: `JSONSchema`; }

## Parameters

| Parameter         | Type                                                                                                                        | Default value |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `component`       | [`EntityComponentTokenMetadata`](/api-reference/orchestr/type-aliases/entitycomponenttokenmetadata)                         | `undefined`   |
| `implementations` | [`ReflectedComponentResolverImplementation`](/api-reference/orchestr/interfaces/reflectedcomponentresolverimplementation)[] | `[]`          |

## Returns

{ `entityType`: `string`; `implementations`: [`ReflectedComponentResolverImplementation`](/api-reference/orchestr/interfaces/reflectedcomponentresolverimplementation)[] ; `name`: `string`; `schema`: `JSONSchema`; }

| Name              | Type                                                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `entityType`      | `string`                                                                                                                    |
| `implementations` | [`ReflectedComponentResolverImplementation`](/api-reference/orchestr/interfaces/reflectedcomponentresolverimplementation)[] |
| `name`            | `string`                                                                                                                    |
| `schema`          | `JSONSchema`                                                                                                                |
