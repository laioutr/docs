---
title: EntityComponentCollection
description: declaration
---

> **EntityComponentCollection**<`TComponentDefinitions`> = `Simplify`<`{ [K in TComponentDefinitions as EntityComponentTokenNameOf<K>]: EntityComponentType<K> }`>

An object containing all component-values of an entity.
When passed a EntityComponentToken-union, will infer the type of the component-values.
If not passed, will return a Record\<string, any>.

## Type Parameters

| Type Parameter                                                                                                        | Default type                                                                        |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `TComponentDefinitions` *extends* [`EntityComponentToken`](/api-reference/orchestr/type-aliases/entitycomponenttoken) | [`EntityComponentToken`](/api-reference/orchestr/type-aliases/entitycomponenttoken) |
