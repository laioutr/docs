---
name: technical-writing-entity-reference
description: Use when creating or updating entity reference pages in the Laioutr canonical-types documentation. Use when documenting entity components, queries, links, and related actions for connector app developers.
---

# Entity Reference Documentation

Create entity reference pages for the Laioutr canonical-types docs. Each page documents an entity's components, queries, links, and related actions so connector developers understand the data shapes they need to implement.

**Sub-skill of:** `technical-writing` and `technical-writing-api-reference`

## When to Use

- Creating a new entity reference page under `6.entities/`
- Updating an existing entity page with missing sections
- Documenting a newly added entity in the canonical-types package

## When NOT to Use

- Documenting actions or queries themselves - use `technical-writing-api-reference`
- Writing tutorials about entities - use `technical-writing`

## Source Code Locations

```
Entity definitions:  /Users/sl/src/laioutr/packages/canonical-types/src/entity/{EntityName}/
Query definitions:   /Users/sl/src/laioutr/packages/canonical-types/src/lib/{domain}/**/*.query.ts
Link definitions:    /Users/sl/src/laioutr/packages/canonical-types/src/lib/{domain}/**/*.link.ts
Action definitions:  /Users/sl/src/laioutr/packages/canonical-types/src/lib/{domain}/**/*.action.ts
Doc output:          /Users/sl/src/docs/content/1.Frontend/99.api-reference/2.canonical-types/6.entities/
```

## Process

### Step 1: Discover Entity Components

Read the entity's `index.ts` barrel file to get the full list of exported components:

```
/Users/sl/src/laioutr/packages/canonical-types/src/entity/{EntityName}/index.ts
```

Then read each component file to understand its schema fields and JSDoc comments. Every exported component becomes a `### Heading` with a one-liner description and an `::entity-component-meta` directive.

### Step 2: Find Queries

Search for queries that return this entity:

```
grep -r "entity: '{EntityName}'" --include="*.query.ts" /Users/sl/src/laioutr/packages/canonical-types/src/lib/
```

Link each query to its anchor on the canonical queries page, not to the core-types generated page.

Link format: `[QueryExportName](/api-reference/canonical-types/{domain}/canonical-queries#{anchor}) - Description.`

### Step 3: Find Links

Search for links where this entity is the **source** (outgoing links):

```
grep -r "source: '{EntityName}'" --include="*.link.ts" /Users/sl/src/laioutr/packages/canonical-types/src/lib/
```

Read each matching file to get: export name, target entity, type (single/multi), label, description.

Link format: `[ExportName](/api-reference/core-types/{domain}/variables/{lowercase-name}) \`TargetEntity\` \`type\`{color="info"} - Description.`

Also search for incoming links (where this entity is the **target**) to understand the entity's role in the graph, but only list outgoing links in the Links section.

### Step 4: Find Related Actions

Actions do NOT have an explicit `entity` field. Determine relationships by:
1. Directory proximity - actions in the same domain subdirectory (e.g., `ecommerce/cart/*.action.ts` for Cart)
2. Input/output schemas - actions that accept or return entity-related fields (e.g., `productId`)

**If the relationship between an action and entity is ambiguous, ask the user.** Do not guess.

### Step 5: Find Related Entities

List entities in the **same domain** that are not already referenced in the Links section. These provide navigational context within the domain.

1. Identify the entity's domain (ecommerce, blog, suggested-search, etc.)
2. List all other entities in that domain
3. Exclude entities already listed in the Links section (they're already cross-linked)
4. For each remaining entity, write a one-line relationship description

Domain-to-entity mapping:
- **ecommerce**: Product, ProductVariant, Category, Cart, CartItem, Review, BreadcrumbItem, MenuItem
- **blog**: BlogPost, BlogCollection, Comment
- **suggested-search**: SuggestedSearch, SuggestedSearchEntry

Omit the section if all domain siblings are already covered by Links, or if the entity is the only one in its domain.

### Step 6: Write the Page

**Ask the user** for:
- The intro paragraph context (what role does this entity play in a storefront?) if it cannot be clearly inferred from the entity name, JSDoc comments, and component schemas
- Any related actions whose relationship to the entity is not obvious from source code
- The file numbering prefix (check existing files in `6.entities/` for the next available number)

## Page Template

```markdown
---
title: {EntityName}
description: {EntityName} entity - components, queries, links, and related actions
---

{Scenario-based intro: "Your storefront encounters the **{EntityName}** entity when..." followed by what it represents and how it relates to other entities.}

::entity-overview{entity="{EntityName}"}
::

## Components

### {ComponentDisplayName}

{One-liner description from JSDoc or schema fields.}

:entity-component-meta{component="{component-slug}" entity="{EntityName}"}

{Repeat for each component from the entity's index.ts}

## Queries

- [{QueryExportName}](/api-reference/canonical-types/{domain}/canonical-queries#{anchor}) - {Description}.

{Repeat for each query. Omit section if no queries return this entity.}

## Links

- [{LinkExportName}](/api-reference/core-types/{domain}/variables/{lowercase}) `{TargetEntity}` `{type}`{color="info"} - {Description}.

{Repeat for each outgoing link. Omit section if no outgoing links.}

## Related actions

- [{ActionName}](/api-reference/canonical-types/{domain}/canonical-actions#{section-anchor}) - {Description}.

{Repeat for each related action. Omit section if none.}

## Related Entities

- [{EntityName}](/api-reference/canonical-types/entities/{slug}) - {One-line relationship description}.

{Repeat for each domain sibling not already in Links. Omit section if all siblings are covered or entity is alone in its domain.}
```

## Component Description Guidelines

Each component gets a one-liner between the heading and the `::entity-component-meta` directive. Write it from source:

| Source | Description approach |
|--------|---------------------|
| JSDoc comment on the component | Condense to one sentence |
| Schema field names are self-explanatory | Summarize what the fields represent together |
| Schema is a single field (e.g., HtmlFragment) | State what it contains |
| Neither JSDoc nor fields are clear | **Ask the user** |

Keep descriptions factual. No marketing language. State what the data is, not why it matters.

## Cross-Link Verification

After writing, verify every link target exists:
1. **Canonical queries anchors** - the `::query-meta` component renders a `ProseH3` heading. The anchor is derived from the query name with `/` replaced by `-` (e.g., `ecommerce/cart/get-current` becomes `#ecommerce-cart-get-current`).
2. **Core-types variable pages** - check the file exists at the lowercase path. If it does not exist, still include the link using the canonical path pattern (`/api-reference/core-types/{domain}/variables/{lowercase-export-name}`). These pages are auto-generated and may need rebuilding.
3. **Canonical actions anchors** - use the `## Section` heading anchor (e.g., `#cart`, `#review`), not the `::action-meta`-generated heading. Multiple actions may share the same section anchor; this is expected.
4. **Sibling entity pages** - verify the target entity page exists. If it does not, note the gap to the user so they can decide whether to create it.

## Common Mistakes

- **Listing only entity-component-meta directives with no descriptions.** Every component needs a one-liner above the directive.
- **Missing the entity-overview diagram.** Always include `::entity-overview{entity="..."}` after the intro.
- **Linking queries to core-types variable pages.** Link to the canonical-types queries page instead.
- **Guessing action relationships.** Actions lack an `entity` field. Ask when uncertain.
- **Missing components.** Always read the entity's `index.ts` to get the complete list. Do not copy from another entity page.
- **Omitting sections.** If an entity has no queries, links, or actions, omit that section entirely rather than leaving it empty.
