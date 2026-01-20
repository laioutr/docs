---
title: ProductVariantInfo
description: declaration
---

> `const` **ProductVariantInfo**: { `~schema`: { `image?`: { `alt?`: `string`; `meta?`: `any`; `sources`: { `focalPoint?`: \[`number`, `number`]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` | `"mobile"` | `"desktop"`; `src`: `string`; `width`: `number`; } [] ; `type`: `"image"`; }; }; }

Additional information about a product variant.

## Type declaration

| Name                    | Type                                                                                                                                                                                                                                                                    | Description                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [](){#schema} `~schema` | { `image?`: { `alt?`: `string`; `meta?`: `any`; `sources`: { `focalPoint?`: \[`number`, `number`]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; } [] ; `type`: `"image"`; }; } | ‐                                                                                                     |
| `~schema.image?`        | { `alt?`: `string`; `meta?`: `any`; `sources`: { `focalPoint?`: \[`number`, `number`]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; } [] ; `type`: `"image"`; }                | Image associated with the product variant.                                                            |
| `~schema.image.alt?`    | `string`                                                                                                                                                                                                                                                                | ‐                                                                                                     |
| `~schema.image.meta?`   | `any`                                                                                                                                                                                                                                                                   | ‐                                                                                                     |
| `~schema.image.sources` | { `focalPoint?`: \[`number`, `number`]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; } []                                                                                      | Each source is a different version of the same image. Differences may be:\* mobile or desktop version |

- different file-formats |
  \| `~schema.image.type` | `"image"` | ‐ |
