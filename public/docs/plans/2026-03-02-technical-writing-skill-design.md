# Technical Writing Skill Design

## Overview

A Claude Code skill for writing technical documentation for the Laioutr platform's Docus-based documentation site. The skill produces markdown files that integrate seamlessly with Docus (Nuxt 4 + Nuxt Content + Nuxt UI) using existing and new MDC components.

**Scope:** Technical documentation only -- quickstarts, guides, tutorials, explanations, API references, UI component docs. Explicitly excludes READMEs, end-user guides, product explanations, and Cockpit walkthroughs.

**Skill name:** `technical-writing`

## Architecture

### Skill Hierarchy

```
technical-writing                      # Main skill -- prose documentation
├── technical-writing:code-examples    # Code example quality + twoslash
├── technical-writing:api-reference    # API/Orchestr reference docs
├── technical-writing:ui-components    # UI component documentation
├── technical-writing:structure        # Doc architecture analysis
└── technical-writing:visualization    # Interactive diagram creation
```

### Cross-Skill Dependencies

- `technical-writing:visualization` **requires** `frontend-design:frontend-design` for building new Vue components
- `technical-writing` **uses** `plain-text-hygiene` for prose quality checks
- All sub-skills share knowledge of Docus/Nuxt UI component library

### File Structure

```
technical-writing/
  skill.md                          # Core process, style rules, component quick-ref
  reference/
    docus-components.md             # Full MDC syntax reference for all components
    diataxis-templates.md           # Templates/checklists for each Diataxis type
    style-guide.md                  # Detailed writing style guide

technical-writing-code-examples/
  skill.md                          # Core rules for code example quality
  reference/
    twoslash-reference.md           # Complete twoslash annotation reference
    laioutr-mock-patterns.md        # Laioutr-specific mock type patterns

technical-writing-api-reference/
  skill.md                          # API reference patterns and templates

technical-writing-ui-components/
  skill.md                          # UI component doc patterns and templates

technical-writing-structure/
  skill.md                          # Structure analysis rules and checklists

technical-writing-visualization/
  skill.md                          # Visualization decision tree
  reference/
    diagram-libraries.md            # Vue Flow, v-network-graph, Mermaid reference
```

## Main Skill Process Flow

### 5-Step Process

```
1. Context Gathering → 2. Research → 3. Classification → 4. Writing → 5. Quality Assurance
```

### Step 1: Context Gathering (automatic)

- Read target content directory structure and `.navigation.yml`
- Identify sibling documents to understand what's already covered
- Check for existing cross-links and related content
- Understand where this document fits in the navigation hierarchy

### Step 2: Research

- Explore the Laioutr source code (`/Users/sl/src/laioutr/`) to understand the feature being documented
- Read relevant source files, types, and tests
- Identify code examples from actual implementations
- Understand edge cases and gotchas from the implementation
- Check if existing documentation covers related topics

### Step 3: Diataxis Classification (guided but flexible)

Classify the document as one of four types, applying type-specific rules:

| Type | Purpose | Key Rule |
|------|---------|----------|
| **Tutorial** | Learning by doing | Hands-on, numbered steps, builds a complete example, author is responsible for learner's success |
| **How-to guide** | Accomplish a goal | Goal-oriented, assumes competence, focused on one problem, named after the problem it solves |
| **Explanation** | Understanding concepts | Concept-first, uses analogies, answers "why?", links to related how-tos |
| **Quickstart** | First success fast | Minimal path, under 5 minutes, copy-paste friendly |

The skill suggests a classification and applies type-specific guidance but allows hybrid documents when appropriate. Warns but doesn't block.

If the content being written matches a sub-skill's domain, the skill suggests invoking it:
- API endpoint/action/query documentation → `technical-writing:api-reference`
- UI component documentation → `technical-writing:ui-components`
- Need for a visual/diagram → `technical-writing:visualization`
- Code examples need quality review → `technical-writing:code-examples`

### Step 4: Writing (with inline guidance)

Apply the writing style guide (see below) and use appropriate Docus components.

### Step 5: Quality Assurance

Combined step covering:

**Exemplar review:**
- Is the intro scenario-based (Docker pattern)?
- Are code examples copy-pasteable?
- Is progressive disclosure used?
- Are gotchas and warnings inline where the reader encounters the issue?

**Diataxis purity check:**
- Does the document stay focused on its classified type?
- If mixing types, suggest splitting

**Technical validation:**
- Verify all code examples are syntactically valid
- Check cross-links point to existing pages
- Validate MDC component syntax

**Prose quality:**
- Invoke `plain-text-hygiene` for AI writing artifacts
- Check second person, active voice, conversational tone

**Cross-reference audit:**
- List existing pages that should link TO this new document
- Suggest specific edits to those pages (adding cross-references)
- Verify no duplication with existing content

## Writing Style Guide

### Voice & Tone

- **Second person ("you")** always -- never "the developer" or "one"
- **Active voice** -- "Laioutr generates the frontend" not "The frontend is generated by Laioutr"
- **Docker-style conversational** -- use analogies, rhetorical questions, scenario-based intros
- **Celebrate success** at key milestones ("Your storefront is now live!")
- **Honest about complexity** -- don't gloss over difficult parts

### Structure

- Front-load the most important information
- Headings every 2-4 paragraphs -- developers scan, they don't read linearly
- Paragraphs max 3-4 sentences
- Bold key terms on first use
- End sections with "Next steps" or cross-links where appropriate

### Code

- Code example within the first 3 paragraphs of any how-to or tutorial
- All examples copy-pasteable with realistic Laioutr domain values
- Use `::code-group` for multi-environment examples (npm/pnpm/yarn)
- Use twoslash for TypeScript type explanations
- Show expected output after executable examples
- Invoke `technical-writing:code-examples` for quality enforcement

### Cross-Linking

- Link to related documents using relative paths
- Use Cockpit links with the `_` placeholder pattern: `https://cockpit.laioutr.cloud/o/_/p/_/settings`
- "For more information, see [related page](/path)" at section ends
- Never explain a concept that has its own dedicated page -- link to it

### Prohibited

- No marketing language ("powerful", "seamless", "cutting-edge")
- No READMEs
- No end-user guides (billing, Cockpit UI walkthroughs)
- No passive voice unless absolutely necessary
- No walls of text without code examples
- No placeholder values (foo, bar, myVariable) -- use Laioutr domain examples

## Component Decision Matrix

| Situation | Component | MDC Syntax |
|---|---|---|
| Important warning | `::warning` | `::warning\nContent\n::` |
| Helpful tip | `::tip` | `::tip\nContent\n::` |
| Background context | `::note` | `::note\nContent\n::` |
| Dangerous action | `::caution` | `::caution\nContent\n::` |
| Sequential instructions | `::steps` | `::steps{level="3"}\n### Step 1\n...\n::` |
| Multiple install methods | `::code-group` | Code blocks with `[npm]` / `[pnpm]` labels |
| Tabbed content | `::tabs` | `:::tabs-item{label="..."}\n...\n:::` |
| Navigation cards | `::card-group` | `:::card{title="..." to="..."}\n...\n:::` |
| FAQ / collapsible | `::accordion` | `:::accordion-item{label="..."}\n...\n:::` |
| API parameters | `::field-group` | `:::field{name="..." type="..."}\n...\n:::` |
| Long code blocks | `::code-collapse` | Wraps code block with expand/collapse |
| Code with preview | `::code-preview` | Preview slot + `#code` slot |
| Feature list | `::features` | With `items: [...]` |
| Simple diagrams | `` ```mermaid `` | Flowcharts, sequence, ER diagrams |
| UI component preview | `::component-code` | With Storybook story ID |
| Component API docs | `::component-meta` | Auto-generates props/slots/events |
| Orchestr action docs | `::action-meta` | Auto-generates input/output schemas |
| Orchestr query docs | `::query-meta` | Auto-generates query documentation |
| Interactive diagrams | `::flow-diagram` | Vue Flow based (from visualization sub-skill) |

### Mermaid Diagram Types

| Type | Use When |
|------|----------|
| `flowchart` | Processes, decision trees, data flow |
| `sequenceDiagram` | API call flows, component interactions |
| `erDiagram` | Data model relationships |
| `classDiagram` | Type hierarchies |
| `stateDiagram-v2` | State machines, lifecycle |

## Sub-Skill: `technical-writing:code-examples`

### Purpose

Enforces code example quality with deep twoslash integration. Invoked by the main skill during writing and QA steps.

### Core Rules

1. **Every code example must compile** -- twoslash runs the TypeScript compiler. Non-compiling docs are bugs.

2. **Use `// ---cut---` to hide setup** -- Imports, mock declarations, and boilerplate go above the cut.

3. **Use Laioutr's mock type pattern** -- Import from `@laioutr-core/orchestr/types` with aliased mocks:
   ```ts
   import { defineOrchestrMock as defineOrchestr } from '@laioutr-core/orchestr/types';
   // ---cut---
   export default defineOrchestr.actionHandler(/* reader sees this */);
   ```

4. **Show types with `^?`** -- Use query annotations to display TypeScript types inline.

5. **Use `// @errors:` for intentional errors** -- Declare expected error codes for "don't do this" patterns.

6. **Code-group for multi-environment examples** -- `::code-group` with tabs for npm/pnpm/yarn or different app integrations.

7. **Realistic values only** -- Use Laioutr domain: product names, cart actions, Orchestr queries.

8. **Show expected output** -- After every executable example.

9. **Combine with `::steps`** -- Each tutorial step gets its own progressive code block.

10. **Use `// @filename:` for multi-file patterns** -- Essential for Orchestr handlers spanning multiple files.

### Twoslash Annotation Reference

| Annotation | Purpose |
|---|---|
| `// ^?` | Show inferred type of identifier above |
| `// ^|` | Show autocomplete suggestions at cursor |
| `// ^^^` | Highlight range on line above |
| `// ---cut---` | Hide all code above from output |
| `// ---cut-after---` | Hide all code below from output |
| `// ---cut-start---` / `// ---cut-end---` | Hide section between markers |
| `// @errors: 2304 2588` | Declare expected TypeScript errors |
| `// @noErrors` | Suppress all TypeScript errors |
| `// @filename: path.ts` | Create virtual file for multi-file examples |
| `// @log: message` | Custom log annotation |
| `// @warn: message` | Custom warning annotation |
| `// @strict: true` | Override compiler option per-sample |

## Sub-Skill: `technical-writing:api-reference`

### Purpose

Writing API reference documentation following Stripe-style patterns. Uses existing Laioutr doc components.

### Patterns

- **Two-panel layout concept**: Explanation left, code examples right (achieved via prose + code blocks)
- **Parameter tables**: Use `::field-group` with `:::field{name="..." type="..."}` for each parameter
- **Orchestr actions**: Use `::action-meta{:name="ActionName"}` for auto-generated docs
- **Orchestr queries**: Use `::query-meta{:name="QueryName"}` for auto-generated docs
- **Entity components**: Use `::entity-component-meta{entity="..." component="..."}` for schema docs
- **Request/response examples**: Show curl + SDK examples in `::code-group`
- **Error documentation**: Document every error code with cause and resolution

### Structure Template

```
## [Endpoint/Action Name]

Brief description of what this does.

### Parameters

::field-group
  :::field{name="param" type="string"}
  Description. Default: `value`.
  :::
::

### Example

::code-group
```bash [curl]
curl -X POST ...
```

```typescript [TypeScript]
const result = await action({...});
```
::

### Response

```json
{ "status": "success" }
```

### Errors

| Code | Description | Resolution |
|------|-------------|------------|
| ... | ... | ... |
```

## Sub-Skill: `technical-writing:ui-components`

### Purpose

Writing UI component documentation following GOV.UK Design System patterns. Uses existing Laioutr doc components.

### Structure Template

```
---
title: ComponentName
description: Brief description
jiraIssueId: LUI-XX
links:
  - label: Figma
    icon: i-simple-icons-figma
    to: https://figma.com/...
    target: _blank
---

## Overview

What this component does and when to use it. Scenario-based intro.

## Key Business & UX Benefits

- Benefit 1
- Benefit 2

:::tip
Pro-Tip from Larry: Practical usage advice.
:::

## Usage

### Variant 1

::component-code
---
:name: ComponentName
:story-height: 100px
story-id: category-component--variant
title: Variant Title
---
```vue-template
<LComponentName />
```
::

### Variant 2
[... more variants ...]

## API Reference

### ComponentName

::component-meta{:name="ComponentName"}
::
```

### Key Principles

- **Live preview before code** -- show what it looks like first (GOV.UK pattern)
- **"When to use" guidance** -- prescriptive advice on appropriate usage
- **Variations with previews** -- each variant gets its own Storybook preview
- **Storybook integration** -- use `::component-code` with story IDs from storybook.laioutr.cloud
- **Auto-generated API** -- always end with `::component-meta` for exhaustive props/slots/events

## Sub-Skill: `technical-writing:structure`

### Purpose

Audits documentation information architecture. Invoked explicitly for doc tree analysis.

### Analysis Checklist

1. **Gap analysis** -- Compare Laioutr source code packages/features against existing documentation. Flag undocumented features.

2. **Focus audit** -- For each document, check if it stays within one Diataxis type. Suggest splits for documents mixing types.

3. **Order analysis** -- Review numbered prefixes in content directories. Suggest reordering based on user journey and progressive complexity.

4. **Duplication detection** -- Find concepts explained in multiple places. Suggest consolidation with cross-links.

5. **Cross-link completeness** -- Check that related documents reference each other. Flag orphaned pages with no incoming links.

6. **Navigation depth** -- Warn if sections nest deeper than 2 levels.

7. **Missing document types** -- For each feature area, check if all relevant Diataxis types exist (e.g., a feature with a how-to but no explanation page).

### Output Format

```markdown
## Documentation Structure Audit

### Gaps Found
- [ ] Feature X has no tutorial
- [ ] Package Y is undocumented

### Focus Issues
- [ ] `content/1.frontend/topic.md` mixes tutorial + reference → split into two docs

### Ordering Suggestions
- [ ] Move "Local Setup" before "Deploy" in getting-started section

### Duplication
- [ ] Webhook concept explained in both `/frontend/webhooks.md` and `/apps/webhooks.md` → consolidate

### Missing Cross-Links
- [ ] `/apps/shopify.md` should link to `/frontend/data-model.md`

### Navigation Depth Issues
- [ ] `/frontend/orchestr/handlers/actions/advanced/` is 4 levels deep → flatten
```

## Sub-Skill: `technical-writing:visualization`

### Purpose

Creates interactive documentation visualizations when Mermaid or existing components aren't sufficient. Bridges documentation needs with the `frontend-design:frontend-design` skill.

### Decision Tree

```
Need a visual?
├── Simple flowchart/sequence/ER → Use Mermaid (already available)
├── Data model relationships → Use Mermaid erDiagram
├── Static architecture overview → Use Mermaid flowchart
├── Interactive architecture (click → navigate) → Vue Flow component
├── Dependency graph (connections between packages) → v-network-graph
├── Comparison table → Standard markdown table or ::field-group
├── Feature list → ::features component
├── State progression → ::steps component
└── Something entirely new → Invoke frontend-design:frontend-design
```

### Recommended Libraries

| Library | Use Case | Bundle Size |
|---|---|---|
| **Vue Flow** (`@vue-flow/core`) | Interactive node-based diagrams, architecture diagrams with clickable nodes | ~60-70 kB gzipped |
| **v-network-graph** | Dependency graphs, package relationship visualization | Lighter than Vue Flow |
| **D3.js** (modular) | Highly custom one-off visualizations | ~15-80 kB depending on modules |
| **Markmap** | Mind maps from markdown headings | ~100 kB |

### Vue Flow Integration Pattern

Components live in `app/components/content/` and are usable via MDC:

```markdown
::flow-diagram
---
nodes:
  - id: frontend
    label: Laioutr Frontend
    type: custom
  - id: orchestr
    label: Orchestr
    type: custom
edges:
  - source: frontend
    target: orchestr
layout: dagre
---
::
```

### What This Skill Does NOT Do

- Build generic diagrams that Mermaid handles fine
- Create visualizations for aesthetics
- Build interactive widgets unrelated to documentation comprehension

## Research Sources

### Documentation Best Practices
- Diataxis Framework (tutorials, how-to guides, reference, explanation)
- Google Developer Documentation Style Guide (voice, tone, active voice)
- Chris Nicholas: How to Write Exceptional Documentation

### Exemplary Documentation Sites Analyzed
- GOV.UK Design System -- prescriptive component documentation, research-backed
- Stripe Docs -- two-panel API reference, language-persisting code tabs, "Copy for LLM"
- GitHub Actions Docs -- progressive complexity, structured term definitions
- Docker Docs -- scenario-based concept intros, dual-track Try It Out
- Anthropic Platform API -- deep schema nesting, exhaustive type definitions

### Technology Stack
- Docus (Nuxt documentation theme)
- Nuxt Content (MDC markdown components)
- Nuxt UI (component library, prose/typography components)
- Twoslash (TypeScript type-driven code examples)
- Vue Flow (interactive diagrams)
- v-network-graph (dependency visualization)
- Mermaid (static diagrams)

### Laioutr Platform Context
- Composable Frontend Management Platform (Nuxt 3 based)
- Orchestr data composition framework
- Apps ecosystem (Nuxt modules: Shopify, Adobe Commerce, etc.)
- Cockpit management interface
- Studio visual editor
- Laioutr UI component library (40+ components documented)
