---
title: ProductRating
description: declaration
---

> `const` **ProductRating**: { `~schema`: { `average`: `number`; `count`: `number`; }; }

Product rating and review count.

## Type declaration

| Name                    | Type                                        | Default value | Description                                                                                                              |
| ----------------------- | ------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [](){#schema} `~schema` | { `average`: `number`; `count`: `number`; } | ‐             | ‐                                                                                                                        |
| `~schema.average`       | `number`                                    | `Rating`      | Average rating of the product.A rating between 1 and 5. No other scale is supported at the moment. Decimals are allowed. |
| `~schema.count`         | `number`                                    | ‐             | Number of ratings.                                                                                                       |

## See

<https://schema.org/AggregateRating>
