---
name: technical-writing-structure
description: Use when auditing documentation structure, analyzing content gaps, reviewing doc organization or navigation ordering, planning new documentation sections, or detecting duplicate content across the Laioutr docs site.
---

# Documentation Structure Analysis

Audit documentation information architecture for the Laioutr docs site. Identifies gaps, duplication, ordering issues, and missing cross-links.

## When to Use

- Auditing the entire docs site or a section for structural issues
- Planning where a new document should live
- Detecting duplicate content across sections
- Reviewing navigation ordering after adding new pages
- Checking cross-link completeness

## When NOT to Use

- Writing or editing individual documents - use `technical-writing`
- Checking prose quality - use `plain-text-hygiene`

## Laioutr Docs Context

- Content: `/Users/sl/src/docs/content/` with numbered prefix sections
- Source code: `/Users/sl/src/laioutr/` (compare features against docs coverage)
- Navigation: `.navigation.yml` files in each section
- Current sections:
  - `0.getting-started/` - Onboarding
  - `1.frontend/` - Frontend core + API reference
  - `2.apps/` - Third-party integrations (Shopify, Adobe Commerce, etc.)
  - `3.laioutr-ui/` - UI component library (40+ components)
  - `4.hosting/` - Hosting and deployment
  - `5.checkout/` - Checkout solution
  - `6.offering/` - SLAs and compliance

## Analysis Checklist

### 1. Gap Analysis

Compare Laioutr source code packages and features against existing documentation. Flag undocumented features.

- Read package directories in `/Users/sl/src/laioutr/packages/`
- Check each package has at least one documentation page
- Flag features with source code but no docs

### 2. Focus Audit

For each document, check if it stays within one Diataxis type. Suggest splits for documents mixing types.

- Tutorial mixed with reference -> split into tutorial + reference page
- How-to guide with long explanation sections -> extract explanation page

### 3. Order Analysis

Review numbered prefixes in content directories. Suggest reordering based on user journey and progressive complexity.

- Getting started should flow: install -> configure -> first result
- Feature docs should go: overview -> common tasks -> advanced topics

### 4. Duplication Detection

Find concepts explained in multiple places. Suggest consolidation with cross-links.

- Search for the same term defined/explained in multiple files
- Pick one canonical location and link from others

### 5. Cross-Link Completeness

Check that related documents reference each other. Flag orphaned pages with no incoming links.

- Every how-to guide should link to its concept explanation
- Every explanation should link to related how-to guides
- Related features in different sections should cross-reference

### 6. Navigation Depth

Warn if sections nest deeper than 2 levels. Deep nesting makes content hard to discover. Always suggest restructuring if it improves information architecture, even if it changes URLs. Include redirects for any moved pages (see Redirect Requirements below).

### 7. Missing Document Types

For each feature area, check if all relevant Diataxis types exist. A feature with a how-to but no explanation page is incomplete.

## Output Format

```markdown
## Documentation Structure Audit

### Gaps Found
- [ ] Feature X has no tutorial
- [ ] Package Y is undocumented

### Focus Issues
- [ ] `content/1.frontend/topic.md` mixes tutorial + reference -> split into two docs

### Ordering Suggestions
- [ ] Move "Local Setup" before "Deploy" in getting-started section

### Duplication
- [ ] Webhook concept explained in both `/frontend/webhooks.md` and `/apps/webhooks.md` -> consolidate

### Missing Cross-Links
- [ ] `/apps/shopify.md` should link to `/frontend/data-model.md`

### Navigation Depth Issues
- [ ] `/frontend/orchestr/handlers/actions/advanced/` is 4 levels deep -> flatten
```

## `.navigation.yml` Requirements

**Every file move or reorder suggestion MUST mention the `.navigation.yml` impact.** These files control sidebar navigation titles and ordering. Read all `.navigation.yml` files in the audited section before reporting.

For prefix-only reorders (e.g., swapping `2.components/` and `4.tokens/`), state that no `.navigation.yml` edit is needed since prefixes control ordering. For slug renames or title changes, include the exact `.navigation.yml` edit.

The **only** supported properties in `.navigation.yml` are: `title`, `icon`, `description`, `collapsed`, and `navigation.defaultOpen`. Do NOT invent properties like `to`, `path`, `items`, or `children` — these do not exist. Most Laioutr nav files currently use only `title`. Suggest adding `collapsed: true` for reference sections that overwhelm the sidebar.

## Redirect Requirements

**Always suggest restructuring when it improves information architecture.** URL changes are not a reason to avoid restructuring. Instead, include redirects for every moved page.

When a restructuring suggestion changes a page's URL slug (not just its numbered prefix), include a `routeRules` entry for `nuxt.config.ts`:

```typescript
// In nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/old-path': { redirect: '/new-path' },
    '/old-section/**': { redirect: '/new-section/**' },
  },
})
```

Note: Nuxt Content strips numbered prefixes from URLs. Renumbering files (e.g., `3.entities/` to `6.entities/`) does NOT change URLs and does NOT need redirects. Redirects are only needed when the slug itself changes (e.g., renaming `entities/` to `data-models/`).

In audit output, list redirects alongside the restructuring suggestion:

```markdown
### Restructuring
- [ ] Move `/frontend/orchestr/advanced/` to `/frontend/orchestr-advanced/`
  - Redirect: `/frontend/orchestr/advanced/**` → `/frontend/orchestr-advanced/**`
```

## Common Mistakes

- **Auditing without reading source code.** The gap analysis requires comparing docs against actual features in the Laioutr monorepo.
- **Avoiding restructuring because of URL changes.** Restructure when it makes sense. Add redirects for any URL changes. Numbered prefix changes don't affect URLs.
- **Ignoring `.navigation.yml` files.** These control nav ordering and titles. Suggestions must include `.navigation.yml` updates.
- **Not reading `.navigation.yml` first.** You must read every `.navigation.yml` in the section to understand how the nav renders before suggesting structural changes.
- **Inventing `.navigation.yml` properties.** Only `title`, `icon`, `description`, `collapsed`, and `navigation.defaultOpen` exist. Never fabricate properties like `to`, `path`, `items`, or `children`.
