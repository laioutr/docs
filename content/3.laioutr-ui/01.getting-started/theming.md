---
title: Theming
description: The laioutr UI Kit uses a sophisticated variable architecture to handle themes. By leveraging Figma Variables, you can change the entire visual identity of your project from colors to typography, with just a few clicks.
---

## How Themes Work

Themes are managed within the Local Variables of the Core UI Kit. To ensure maximum flexibility and reduced maintenance, our theme variables use aliasing (linking variables to other variables).

## Smart Color & Text Linking

Certain variables, such as color / text, are dynamically linked to other theme variables.

- Example: If you set a specific brand color as your "Accent" in the theme settings, the corresponding text color variable automatically updates to ensure contrast and readability.
- Benefit: You only ever need to use one variable (e.g., color / text / accent) in your designs; the system handles the logic of which specific shade is displayed based on your active theme.

## Color System & Logic

Our color system is built on a scale of 12 steps, ensuring consistency across different hues. All colors are available in four variants: Solid, Alpha, Dark Solid, and Dark Alpha.

## The 12-Step Scale

To maintain a harmonious UI, we follow a standardized numbering logic for all color scales:

::card
Subtle tints for section backgrounds or card fills.

#title
**1 – 3 Pale Backgrounds**
::

::card
Backgrounds for buttons, toggles, and hover states.

#title
3 - 5 Interactive Elements
::

::card
Lines, strokes, and UI dividers.

#title
6 - 8 Borders & Separators
::

::card
The core brand/functional color.

#title
9 - 10 Solid Colors
::

::card
High-contrast shades for readability.

#title
11 - 12 Accessible Text
::

**Note:** Standard White is strictly defined as #FFFFFF across the entire system.

## Color Groups

::card-group
  :::card
  Neutral scales where step 12 represents main black. Designed for **white text** overlays at **step 9**.

  #title
  Greys
  :::

  :::card
  Standard theme colors designed for **white text** overlays at **step 9**. Ideal for primary accents, Success, or Error states.

  #title
  Normal Colors
  :::

  :::card
  High-vibrancy/Neon colors designed for black text overlays at step 9

  #title
  Bright Colors
  :::

  :::card
  Specific White and Black Alpha (transparency) scales for modals and overlays.

  #title
  Overlays
  :::
::

**Dark Mode:** Every color group includes a built-in dark mode equivalent that triggers automatically when the mode is switched.

## Customizing Themes

You have total control over the "Look & Feel" of your project. There are two ways to customize your theme in the Figma UI Kit:

1. Quick Swap (Base Theme) - If you want to change the primary brand color quickly, you can simply swap the color values in the Base Theme Variables. This is the fastest way to align the kit with a brand's primary color palette.
2. Full Specification (Detailed Variables) - For more complex brand identities, you can go "full spec." By editing the Detailed Theme Variables, you can fine-tune specific font families, font weights, individual background shades, and specific border radii. This allows for deep customization while keeping the underlying component logic intact.
