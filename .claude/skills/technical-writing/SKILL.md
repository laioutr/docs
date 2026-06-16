---
name: technical-writing
description: Use when writing or editing technical documentation for the Laioutr Docus-based docs site - quickstarts, guides, tutorials, explanations, API references, UI component docs. Use when creating new content pages or improving existing documentation quality.
---

# Technical Writing

Write technical documentation for the Laioutr platform's Docus-based documentation site. Produces markdown files that integrate with Docus (Nuxt 4 + Nuxt Content + Nuxt UI) using MDC components.

**Scope:** Technical docs only. Excludes READMEs, end-user guides, product explanations, Cockpit walkthroughs.

## When to Use

- Writing new documentation pages for the Laioutr docs site
- Editing existing technical documentation
- Creating quickstarts, tutorials, how-to guides, explanations, or API references
- Documenting Laioutr features, Orchestr actions/queries, UI components

## When NOT to Use

- README files or changelogs - use `plain-text-hygiene` instead
- End-user documentation (billing, Cockpit UI walkthroughs)
- Marketing copy or product descriptions

## Delegating doc writing to subagents

Subagents do not have access to skills. If you dispatch a subagent to write or edit documentation, you must include **both** the style rules and the prose hygiene rules in its prompt. Otherwise it will produce em dashes, banned vocabulary, and structural tells in every file.

Include this block verbatim in every doc-writing subagent prompt:

```
## Prose hygiene (mandatory, apply DURING writing)

These rules apply to every sentence you write. Do not write prose that violates them and fix it later.

No em dashes in any form. Never write the em dash character or -- (double hyphen) as a pause or aside. Restructure the sentence using a period, semicolon, colon, or parentheses. Zero tolerance.

Banned words (replace on sight): delve, tapestry, landscape, crucial, pivotal, leverage, harness, navigate (metaphor), embark, endeavor, multifaceted, robust, streamline, foster, vibrant, nestled, compelling, furthermore, additionally, notably, importantly, comprehensive, facilitate, utilize, implement (verb in prose).

Banned phrases: "It's worth noting", "Whether you're X or Y", "Not just X, but Y", "In order to" (use "to"), "serves as" (use "is"), "When it comes to", "plays a crucial role".

Structural tells to avoid: Do not always group items in threes. Do not end paragraphs with a sentence that restates the paragraph. Do not use the **Bold:** description pattern for every list item.
```

After subagents return, scan their output with:

```bash
grep -n ' -- \|—\|–' <file>
grep -inE '\b(robust|crucial|comprehensive|leverage|utilize|facilitate|delve|compelling|streamline|foster|additionally|furthermore)\b' <file>
```

## Process

```
1. Context Gathering → 2. Research → 3. Classification → 4. Writing → 5. Quality Assurance
```

### Step 1: Context Gathering (automatic)

- Read target content directory structure and `.navigation.yml` files
- Identify sibling documents to understand existing coverage
- Check for existing cross-links and related content
- Understand where this document fits in the navigation hierarchy
- If editing, read the source code behind the documented feature

Docs site: `/Users/sl/src/docs/content/` (numbered prefix sections: 0.getting-started through 6.offering)
Source code: `/Users/sl/src/laioutr/` (check `packages/` and `apps/` for implementations)

### Step 2: Research

- Explore Laioutr source code (`/Users/sl/src/laioutr/`) to understand the feature
- Read relevant source files, types, and tests
- Identify code examples from actual implementations
- Understand edge cases and gotchas from the implementation
- Check if existing documentation covers related topics

### Step 3: Diataxis Classification

Classify the document BEFORE writing. State the classification explicitly. Warn but don't block if hybrid is genuinely needed.

| Type | Purpose | Key Rule |
|------|---------|----------|
| **Tutorial** | Learning by doing | Numbered steps, builds a complete example, author responsible for learner's success |
| **How-to guide** | Accomplish a goal | Goal-oriented, assumes competence, focused on one problem |
| **Explanation** | Understanding concepts | Concept-first, analogies, answers "why?", links to related how-tos |
| **Quickstart** | First success fast | Minimal path, under 5 minutes, ONE path, no optional steps |

**Quickstart vs Tutorial trap:** If your quickstart takes >5 minutes or includes optional branches, you are writing a tutorial. Strip it down or reclassify. A quickstart defers everything non-essential to linked reference docs.

Full templates and checklists: see `reference/diataxis-templates.md`

**Sub-skill routing** - suggest invoking when content matches:
- API endpoint/action/query docs -> `technical-writing-api-reference`
- UI component docs -> `technical-writing-ui-components`
- Visual/diagram needed -> `technical-writing-visualization`
- Code examples need review -> `technical-writing-code-examples`

### Step 4: Writing

Apply writing style rules, Docus components, and prose hygiene constraints below. All three apply during writing, not after.

**Voice:** Second person ("you"), active voice, Docker-style conversational. Scenario-based intros. Celebrate milestones. Honest about complexity.

**Structure:** Front-load important info. Headings every 2-4 paragraphs. Max 3-4 sentence paragraphs. Bold key terms on first use.

**Code:** Example within first 3 paragraphs. Copy-pasteable with realistic Laioutr values. `::code-group` for multi-env. Twoslash for TypeScript. Show expected output.

**Cross-linking:** Relative paths. Cockpit links with `_` placeholder (`https://cockpit.laioutr.cloud/o/_/p/_/settings`). Link don't explain - never explain a concept that has its own page.

**Prohibited:** Marketing language, passive voice, walls of text without code, placeholder values (foo/bar/myVariable).

Full style guide: see `reference/style-guide.md`

#### Prose hygiene (mandatory, apply DURING writing)

These rules apply to every sentence you write. Do not write prose that violates them and fix it later.

**No em dashes in any form.** Never write `—` (U+2014) or `--` (double hyphen) as a pause or aside. Restructure the sentence using a period, semicolon, colon, or parentheses. Zero tolerance; one instance is enough to flag the text.

**Banned words (replace on sight):** delve, tapestry, landscape, crucial, pivotal, leverage, harness, navigate (metaphor), embark, endeavor, multifaceted, robust, streamline, foster, vibrant, nestled, compelling, furthermore, additionally, notably, importantly, comprehensive, facilitate, utilize, implement (verb in prose).

**Banned phrases:** "It's worth noting", "Whether you're X or Y", "Not just X, but Y", "In order to" (use "to"), "serves as" (use "is"), "When it comes to", "plays a crucial role".

**Structural tells to avoid:** Do not always group items in threes. Do not end paragraphs with a sentence that restates the paragraph. Do not use the `**Bold:** description` pattern for every list item.

Full rules with replacement tables: see `plain-text-hygiene` skill.

### Step 5: Quality Assurance

**Exemplar review:**
- Is the intro scenario-based (Docker pattern)?
- Are code examples copy-pasteable?
- Is progressive disclosure used?
- Are gotchas/warnings inline where the reader encounters the issue?

**Diataxis purity:** Does it stay focused on its classified type? If mixing, suggest splitting.

**Technical validation:** Verify code examples are syntactically valid. Check cross-links point to existing pages. Validate MDC component syntax.

**Prose quality:** Invoke `plain-text-hygiene` for AI writing artifacts. Check second person, active voice, conversational tone.

**Cross-reference audit:**
- List existing pages that should link TO this new document
- Suggest specific edits to those pages
- Verify no duplication with existing content

## Component Quick Reference

| Situation | Component |
|---|---|
| Warning/tip/note/caution | `::warning` / `::tip` / `::note` / `::caution` |
| Sequential instructions | `::steps{level="3"}` with `### Step N` headings |
| Multiple install methods | `::code-group` with `[npm]`/`[pnpm]` labels |
| Tabbed content | `::tabs` with `:::tabs-item{label="..."}` |
| Navigation cards | `::card-group` with `:::card{title="..." to="..."}` |
| FAQ / collapsible | `::accordion` with `:::accordion-item{label="..."}` |
| API parameters | `::field-group` with `:::field{name="..." type="..."}` |
| Long code blocks | `::code-collapse` |
| Simple diagrams | ` ```mermaid ` (flowchart, sequence, ER, class, state) |
| UI component preview | `::component-code` with Storybook story ID |
| Component API docs | `::component-meta{:name="ComponentName"}` |
| Orchestr action docs | `::action-meta{:name="ActionName"}` |
| Orchestr query docs | `::query-meta{:name="QueryName"}` |

Full MDC syntax reference: see `reference/docus-components.md`

## Common Mistakes

- **Starting with definition instead of scenario.** Don't open with "X is a Y that..." - open with a scenario showing why the reader needs this.
- **Explaining concepts that have their own page.** Link to the concept page instead. One source of truth.
- **Placeholder values in examples.** Use realistic Laioutr domain values (product names, cart actions, Orchestr queries).
- **Missing code in first 3 paragraphs.** Every how-to and tutorial needs code early.
- **Forgetting cross-reference audit.** After writing, always check what existing pages should link to this new document.
- **Calling a tutorial a quickstart.** If it has optional steps, branches, or takes >5 minutes, it is a tutorial. Classify honestly.
- **Not reading source code.** Don't document from imagination. Read the implementation in `/Users/sl/src/laioutr/` to find actual APIs, types, and edge cases.
- **Ignoring `.navigation.yml`.** When suggesting structural changes, always include the corresponding `.navigation.yml` updates.
