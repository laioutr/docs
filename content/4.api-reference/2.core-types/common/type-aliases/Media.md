---
title: Media
description: declaration
---

> **Media** = \{ `alt?`: `string`; `meta?`: `any`; `sources`: `any`; `type`: `string`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `focalPoint?`: \[`number`, `number`\]; `height`: `number`; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"image"`; \} \| \{ `alt?`: `string`; `meta?`: `any`; `sources`: \{ `height`: `number`; `length`: \{ `duration`: `string`; \}; `provider`: `string`; `responsive?`: `"static"` \| `"mobile"` \| `"desktop"`; `src`: `string`; `width`: `number`; \}[]; `type`: `"video"`; \}

A Media object describes a media asset to be displayed in the browser.

Currently supported are images and videos. Future support for audio, 3D, 360° images, and other media types is planned.

You can use `type` for type-narrowing.
