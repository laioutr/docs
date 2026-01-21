---
title: ReviewReviewer
description: declaration
---

> `const` **ReviewReviewer**: { `~schema`: { `avatar?`: { `alt?`: `string`; `meta?`: `any`; `sources`: { `focalPoint?`: \[`number`, `number`]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` | `"mobile"` | `"desktop"`; `src`: `string`; `width`: `number`; } [] ; `type`: `"image"`; }; `isAnonymous?`: `boolean`; `name`: `string`; }; }

Information about the author of a review, e.g. the reviewer.

## Type declaration

| Name                     | Type                                                                                                                                                                                                                                                                                                                  | Description                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [](){#schema} `~schema`  | { `avatar?`: { `alt?`: `string`; `meta?`: `any`; `sources`: { `focalPoint?`: \[`number`, `number`]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; } [] ; `type`: `"image"`; }; `isAnonymous?`: `boolean`; `name`: `string`; } | ‐                                                                                                     |
| `~schema.avatar?`        | { `alt?`: `string`; `meta?`: `any`; `sources`: { `focalPoint?`: \[`number`, `number`]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; } [] ; `type`: `"image"`; }                                                              | The avatar-image of the reviewer.                                                                     |
| `~schema.avatar.alt?`    | `string`                                                                                                                                                                                                                                                                                                              | ‐                                                                                                     |
| `~schema.avatar.meta?`   | `any`                                                                                                                                                                                                                                                                                                                 | ‐                                                                                                     |
| `~schema.avatar.sources` | { `focalPoint?`: \[`number`, `number`]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; } []                                                                                                                                    | Each source is a different version of the same image. Differences may be:\* mobile or desktop version |

- different file-formats |
  \| `~schema.avatar.type` | `"image"` | ‐ |
  \| `~schema.isAnonymous?` | `boolean` | Whether the reviewer is anonymous. |
  \| `~schema.name` | `string` | The name of the reviewer. If anonymous, this may be an empty string. |
