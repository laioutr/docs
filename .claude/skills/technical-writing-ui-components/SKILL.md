---
name: technical-writing-ui-components
description: Use when documenting Laioutr UI components, writing component usage guides with Storybook previews, or creating component API reference pages with props, slots, and events.
---

# UI Component Documentation

Write UI component documentation following GOV.UK Design System patterns. Uses Laioutr's existing Storybook integration and auto-generated component API documentation.

## When to Use

- Documenting a Laioutr UI component (LButton, LProductCard, etc.)
- Writing component usage guides with live previews
- Creating component variant documentation
- Adding "when to use" prescriptive guidance

## When NOT to Use

- API/endpoint documentation - use `technical-writing-api-reference`
- General technical docs - use `technical-writing`

## Key Principles

1. **Live preview before code** - show what the component looks like first (GOV.UK pattern)
2. **"When to use" guidance** - prescriptive advice on appropriate usage
3. **Variations with previews** - each variant gets its own Storybook preview
4. **Storybook integration** - use `::component-code` with story IDs from storybook.laioutr.cloud
5. **Auto-generated API** - always end with `::component-meta` for exhaustive props/slots/events

## Structure Template

```markdown
---
title: ComponentName
description: Brief description of what the component does
jiraIssueId: LUI-XX
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://figma.com/...
    target: _blank
---

## Overview

[Scenario-based intro: when and why you'd use this component. 2-3 sentences.]

## Key Business & UX Benefits

- [Benefit 1 - what value this provides]
- [Benefit 2 - what problem it solves]

:::tip
Pro-Tip from Larry: [Practical usage advice from experience.]
:::

## Usage

### [Variant Name]

::component-code
---
:name: LComponentName
:story-height: 200px
story-id: category-componentname--variant-name
title: Variant Title
---
```vue-template
<LComponentName prop="value" />
```
::

[1-2 sentences on when to use this variant.]

### [Another Variant]

::component-code
---
:name: LComponentName
:story-height: 200px
story-id: category-componentname--another-variant
title: Another Variant
---
```vue-template
<LComponentName variant="secondary" />
```
::

## When to Use

- Use [component] when [specific scenario]
- Use [component] instead of [alternative] when [condition]

## When NOT to Use

- Don't use [component] for [wrong scenario] - use [alternative] instead

## API Reference

### LComponentName

::component-meta{:name="LComponentName"}
::
```

## Available Components

### `::component-code` - Live Preview with Code

Shows a Storybook preview above the code. The preview loads the story from storybook.laioutr.cloud.

```markdown
::component-code
---
:name: LButton
:story-height: 100px
story-id: components-lbutton--primary
title: Primary Button
---
```vue-template
<LButton label="Add to cart" />
```
::
```

Props:
- `:name` - component name (used for code highlighting)
- `:story-height` - height of the preview iframe
- `story-id` - Storybook story ID (from storybook.laioutr.cloud)
- `title` - display title above the preview

### `::component-meta` - Auto-Generated API

Generates complete props, slots, and events documentation from TypeScript types.

```markdown
::component-meta{:name="LButton"}
::
```

### `:::tip` - Pro-Tips from Larry

The Laioutr docs use a "Pro-Tip from Larry" pattern for practical advice:

```markdown
:::tip
Pro-Tip from Larry: Use the `size` prop instead of custom CSS to maintain
visual consistency across your storefront.
:::
```

## Finding Story IDs

Story IDs follow the pattern: `category-componentname--variant-name`

**Best approach:** Read the `.stories.ts` file for the component in the Laioutr monorepo. The story `title` and export names determine the ID:
- File: `/Users/sl/src/laioutr/packages/ui/src/components/[Component]/[Component].stories.ts`
- Story title `UI Kit/Button` + export `Primary` = ID `ui-kit-button--primary`

**Fallback:** Go to [storybook.laioutr.cloud](https://storybook.laioutr.cloud), navigate to the component, and extract the ID from the URL.

**Read the component source.** Before documenting, always read `[Component].vue` in the monorepo to identify all props, slots, events, and variants. Don't guess — the source is the truth.

## Common Mistakes

- **Code before preview.** Show what it looks like FIRST, then the code. The GOV.UK pattern: see it, then understand it.
- **Missing "when to use" section.** Don't just show what a component does - tell the reader WHEN to choose it over alternatives.
- **No `::component-meta` at the end.** Every component page must end with the auto-generated API. It's the exhaustive reference.
- **Wrong story IDs.** Verify story IDs against storybook.laioutr.cloud. Broken previews are worse than no previews.
- **Generic benefit descriptions.** "Improves UX" means nothing. Be specific: "Reduces cart abandonment by surfacing stock levels before checkout."
