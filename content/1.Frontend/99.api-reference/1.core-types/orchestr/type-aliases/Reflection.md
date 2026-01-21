---
title: Reflection
description: declaration
---

> **Reflection** = { `actions`: [`ReflectedAction`](/api-reference/orchestr/type-aliases/reflectedaction)[] ; `entities`: `Record`<`string`, [`ReflectedComponent`](/api-reference/orchestr/type-aliases/reflectedcomponent)[] >; `links`: `Record`<`string`, [`ReflectedLink`](/api-reference/orchestr/type-aliases/reflectedlink)[] >; `queries`: [`ReflectedQuery`](/api-reference/orchestr/type-aliases/reflectedquery)[] ; }

## Properties

| Property                   | Type                                                                                                   | Description                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| [](){#actions} `actions`   | [`ReflectedAction`](/api-reference/orchestr/type-aliases/reflectedaction)[]                            | ‐                                        |
| [](){#entities} `entities` | `Record`<`string`, [`ReflectedComponent`](/api-reference/orchestr/type-aliases/reflectedcomponent)[] > | { [entityType] : ReflectedComponent [] } |
| [](){#links} `links`       | `Record`<`string`, [`ReflectedLink`](/api-reference/orchestr/type-aliases/reflectedlink)[] >           | { [entityType] : ReflectedLink [] }      |
| [](){#queries} `queries`   | [`ReflectedQuery`](/api-reference/orchestr/type-aliases/reflectedquery)[]                              | ‐                                        |
