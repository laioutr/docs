---
title: Surface Tone
description: How Laioutr UI components inherit the tone of the surface they sit on (light, dark, or bright) and how to override it with OnSurface.
seo:
  title: Surface Tone | Laioutr UI
  description: How Laioutr UI components inherit the tone of the surface they sit on (light, dark, or bright) and how to override it with OnSurface.
sitemap:
  loc: /laioutr-ui/getting-started/surface-tone
  lastmod: 2026-05-14
  changefreq: monthly
  priority: 1
---

## What surface tone is

Most Laioutr UI components need to know what kind of surface they sit on so they can pick legible text colors, icons, borders, and focus rings. That signal is **surface tone**: a single value that describes the surface, not the foreground.

| Tone     | When to use                                                                                                 |
| -------- | ----------------------------------------------------------------------------------------------------------- |
| `light`  | Default. White-ish surfaces with dark text.                                                                 |
| `dark`   | Dark surfaces with white text.                                                                              |
| `bright` | Saturated brand-color surfaces (yellow, lime, electric blue) that want always-black text rather than white. |

The type lives in `@laioutr-core/ui-kit`:

```ts
type SurfaceTone = 'light' | 'dark' | 'bright';
```

Every component that styles itself against the surface accepts an optional `surfaceTone` prop. When omitted, it inherits from the nearest ancestor, so most of the time you set the tone once at the section boundary and the rest of the tree picks it up.

## Setting the tone with `<OnSurface>`

`<OnSurface>` is the only way to set tone publicly. It renders a wrapper element, applies the right `.on-light` / `.on-dark` / `.on-bright` class, and provides the tone to descendants via context.

```vue twoslash
<template>
  <OnSurface tone="dark">
    <Text>White text on a dark surface.</Text>
    <Button variant="primary">Inherits dark</Button>
  </OnSurface>
</template>
```

## Reading the tone from a component

Components that render differently per tone read the resolved value with `useSurfaceTone(props)`:

```ts twoslash
import { useSurfaceTone, type SurfaceTone } from '@laioutr-core/ui-kit/types'

interface MyProps {
  surfaceTone?: SurfaceTone;
  // … your other props
}

const props = defineProps<MyProps>()
const tone = useSurfaceTone(props)
// tone.value is 'light' | 'dark' | 'bright'
```

Resolution order:

1. The explicit `surfaceTone` prop on the component, if set.
2. The nearest ancestor `<OnSurface>`'s tone.
3. `'light'` as the implicit default.

`SurfaceToneAware` is an exported interface that adds the optional prop with the right type, so component authors don't redeclare it on every component.

## Auto-deriving the tone from a color

When a component accepts an arbitrary background color (`Backdrop`, `MediaStage`), it can pick a tone automatically with `colorToSurfaceTone`:

```ts twoslash
import { colorToSurfaceTone } from '@laioutr-core/ui-kit/types'

colorToSurfaceTone('#000000') // 'dark'
colorToSurfaceTone('#FFFFFF') // 'light'
colorToSurfaceTone('#FFEB3B') // 'bright'  (saturated yellow)

<OnSurface :tone="colorToSurfaceTone(backgroundColor)" />
```

The helper takes hex values and uses WCAG relative luminance plus a saturation check. Non-hex inputs (`var(--token)`, `rgb(...)`, `hsl(...)`, `light-dark(...)`) fall through to `'light'`, so pass `:surface-tone="…"` explicitly when the color isn't a literal hex.

## CSS tokens and the `.on-*` classes

Each tone owns a namespace of CSS custom properties. They're declared on `:root` as the originals and re-bound by the `.on-light` / `.on-dark` / `.on-bright` classes that `<OnSurface>` applies:

| Token namespace | Drives                                               |
| --------------- | ---------------------------------------------------- |
| `--on-light-*`  | text + icon colors against light surfaces            |
| `--on-dark-*`   | text + icon colors against dark surfaces             |
| `--on-bright-*` | text + icon colors against saturated bright surfaces |

Inside any `.on-light` (etc.) subtree, the canonical `--font-color-*` and `--icon-color` tokens are rebound to the namespace, so `<Text>`, `<Icon>`, and any consumer that emits `color: var(--font-color-body-text)` inherits the right color automatically.

## Related

- [`OnSurface`](/laioutr-ui/ui-kit/general/on-surface): the primitive that sets the tone.
- [`MediaPreview`](/laioutr-ui/ui-kit/general/media-preview), [`MediaStage`](/laioutr-ui/ui-kit/general/media-stage), [`Backdrop`](/laioutr-ui/ui-kit/general/backdrop): auto-derive tone from a configured color.
- [`SwatchChip`](/laioutr-ui/ui-kit/general/swatch-chip), [`Pagination`](/laioutr-ui/ui-kit/form/pagination), [`Select`](/laioutr-ui/ui-kit/form/select): render differently per tone.
