---
title: MediaImage
description: declaration
---

> **MediaImage** = { `alt?`: `string`; `meta?`: `any`; `sources`: { `focalPoint?`: \[`number`, `number`]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` | `"mobile"` | `"desktop"`; `src`: `string`; `width`: `number`; } [] ; `type`: `"image"`; }

A MediaImage describes an image to be displayed in the browser.

An image consists of one or more MediaSourceImage and additional metadata.

## Type declaration

| Name                     | Type                                                                                                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [](){#alt} `alt?`        | `string`                                                                                                                                                                           |
| [](){#meta} `meta?`      | `any`                                                                                                                                                                              |
| [](){#sources} `sources` | { `focalPoint?`: \[`number`, `number`]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; } [] |
| [](){#type} `type`       | `"image"`                                                                                                                                                                          |
