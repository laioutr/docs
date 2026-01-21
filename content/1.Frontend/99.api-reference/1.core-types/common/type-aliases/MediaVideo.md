---
title: MediaVideo
description: declaration
---

> **MediaVideo** = { `alt?`: `string`; `meta?`: `any`; `sources`: { `height`: `number`; `length`: { `duration`: `string`; }; `provider`: `string`; `responsive?`: `"static"` | `"mobile"` | `"desktop"`; `src`: `string`; `width`: `number`; } [] ; `type`: `"video"`; }

A MediaVideo describes a video to be displayed in the browser.

A video consists of one or more MediaSourceVideo and additional metadata.

## Type declaration

| Name                     | Type                                                                                                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [](){#alt} `alt?`        | `string`                                                                                                                                                                          |
| [](){#meta} `meta?`      | `any`                                                                                                                                                                             |
| [](){#sources} `sources` | { `height`: `number`; `length`: { `duration`: `string`; }; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; } [] |
| [](){#type} `type`       | `"video"`                                                                                                                                                                         |
