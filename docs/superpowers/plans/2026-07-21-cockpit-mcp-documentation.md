# Cockpit MCP Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Cockpit MCP connection guide with a reusable activity-trace component, practical workflows, safety guidance, troubleshooting, and links from related documentation.

**Architecture:** A data-driven Vue content component owns the activity-trace presentation while Markdown supplies each workflow's prompt, steps, tools, handoff, and review text through an MDC YAML prop block. One new Cockpit how-to page uses the component for the current Studio-focused capabilities, and four existing pages receive concise cross-links.

**Tech Stack:** Nuxt 4, Vue 3 `<script setup>`, Nuxt Content 3 MDC, Nuxt UI CSS variables, Vitest 3, `vue/compiler-sfc`, Markdown, Prettier.

## Global Constraints

- Name the integration **Cockpit MCP**, not Studio MCP, throughout the new documentation and component.
- Title the new guide **Connect an AI assistant to Cockpit** at `/cockpit/features/mcp`.
- State that the connector is a private alpha and that Laioutr must enable each organization.
- Describe the current Studio-focused tools as the first Cockpit capability set; do not present future asset, content, app, user, or organization tools as available.
- Cockpit MCP authenticates through OAuth with the signed-in user's Cockpit access, not an organization API key.
- Use these exact client links:
  - Claude: `https://claude.ai/directory/connectors/47f4846e-6a51-4ecb-831e-ead6b247cbcd`
  - ChatGPT: `https://chatgpt.com/plugins/Plugin_xxxxxxxxxxx`
  - Manual client setup: `https://cockpit.laioutr.cloud/o/_/api-keys`
- Publishing remains a human action outside the MCP tool surface.
- Keep tool names secondary to task outcomes. Do not add a full tool reference or raw protocol guide.
- Use second person and active voice in documentation prose.
- Do not add em dashes, en dashes, marketing language, or the banned prose from `.claude/skills/technical-writing/SKILL.md`.
- Set every changed content page's `sitemap.lastmod` to `2026-07-21`.
- Do not change the Cockpit MCP server, connector listings, or documentation MCP server code.

---

## File map

- Create `app/components/CockpitMcpWorkflow.vue`: render one data-driven Cockpit MCP activity trace.
- Create `app/components/CockpitMcpWorkflow.test.ts`: compile the SFC and enforce its semantic, state-free contract without adding a DOM test dependency.
- Create `content/8.Cockpit/1.Features/mcp.md`: connection how-to, four workflows, safety limits, and troubleshooting.
- Modify `content/8.Cockpit/0.index.md`: add Cockpit MCP to the product-area overview.
- Modify `content/8.Cockpit/1.Features/studio.md`: link Studio readers to the Cockpit MCP guide.
- Modify `content/8.Cockpit/4.Organisation-Settings/api-keys.md`: explain where to copy the MCP URL and distinguish OAuth from API keys.
- Modify `content/0.getting-started/7.mcp-server.md`: distinguish the documentation MCP from Cockpit MCP.

No `.navigation.yml` change is required. Nuxt Content discovers the new page in the existing Cockpit Features directory.

---

### Task 1: Build the reusable Cockpit MCP workflow component

**Files:**

- Create: `app/components/CockpitMcpWorkflow.test.ts`
- Create: `app/components/CockpitMcpWorkflow.vue`

**Interfaces:**

- Consumes: MDC props supplied by the guide in Task 2.
- Produces:

```ts
interface CockpitMcpWorkflowStep {
  phase: string;
  title: string;
  description: string;
  tools?: string[];
}

interface CockpitMcpWorkflowProps {
  prompt: string;
  steps: CockpitMcpWorkflowStep[];
  handoff?: string;
  review: string;
}
```

- Markdown component name: `cockpit-mcp-workflow`.
- Default `handoff`: `The edit enters Cockpit's shared Studio document.`

- [ ] **Step 1: Verify the current test baseline**

Run:

```bash
pnpm test
```

Expected: 7 test files pass, 203 tests pass, and 13 tests remain todo.

- [ ] **Step 2: Write a failing SFC contract test**

Create `app/components/CockpitMcpWorkflow.test.ts`:

```ts
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { compileScript, compileTemplate, parse } from 'vue/compiler-sfc';
import { describe, expect, it } from 'vitest';

const filename = fileURLToPath(new URL('./CockpitMcpWorkflow.vue', import.meta.url));

function compileComponent() {
  expect(existsSync(filename), 'CockpitMcpWorkflow.vue should exist').toBe(true);

  const source = readFileSync(filename, 'utf8');
  const parsed = parse(source, { filename });

  expect(parsed.errors).toEqual([]);
  expect(parsed.descriptor.scriptSetup).not.toBeNull();
  expect(parsed.descriptor.template).not.toBeNull();

  const script = compileScript(parsed.descriptor, { id: 'cockpit-mcp-workflow' });
  const template = compileTemplate({
    id: 'cockpit-mcp-workflow',
    filename,
    source: parsed.descriptor.template?.content ?? '',
    compilerOptions: { bindingMetadata: script.bindings },
  });

  return { source, script, template };
}

describe('CockpitMcpWorkflow', () => {
  it('compiles as a Vue SFC', () => {
    const { template } = compileComponent();

    expect(template.errors).toEqual([]);
  });

  it('exposes the data-driven workflow contract', () => {
    const { script } = compileComponent();

    expect(script.content).toContain('prompt: { type: String, required: true }');
    expect(script.content).toContain('steps: { type: Array, required: true }');
    expect(script.content).toContain(
      `handoff: { type: String, required: false, default: "The edit enters Cockpit's shared Studio document." }`,
    );
    expect(script.content).toContain('review: { type: String, required: true }');
  });

  it('uses semantic, state-free activity markup', () => {
    const { source } = compileComponent();

    expect(source).toContain('<figure');
    expect(source).toContain('<figcaption');
    expect(source).toContain('<ol');
    expect(source).toContain('<li');
    expect(source).not.toContain('@click');
    expect(source).not.toMatch(/\bref\s*\(/);
  });
});
```

- [ ] **Step 3: Run the component test and verify that it fails**

Run:

```bash
pnpm exec vitest run app/components/CockpitMcpWorkflow.test.ts
```

Expected: FAIL with `CockpitMcpWorkflow.vue should exist` because the component does not exist.

- [ ] **Step 4: Create the minimal data-driven Vue component**

Create `app/components/CockpitMcpWorkflow.vue`:

```vue
<script setup lang="ts">
interface CockpitMcpWorkflowStep {
  phase: string;
  title: string;
  description: string;
  tools?: string[];
}

withDefaults(
  defineProps<{
    prompt: string;
    steps: CockpitMcpWorkflowStep[];
    handoff?: string;
    review: string;
  }>(),
  {
    handoff: "The edit enters Cockpit's shared Studio document.",
  },
);
</script>

<template>
  <figure class="cockpit-mcp-workflow">
    <figcaption class="cockpit-mcp-workflow__prompt">
      <span class="cockpit-mcp-workflow__eyebrow">Example prompt</span>
      <blockquote>{{ prompt }}</blockquote>
    </figcaption>

    <ol class="cockpit-mcp-workflow__trace" aria-label="Cockpit MCP activity">
      <li v-for="(step, index) in steps" :key="`${step.phase}-${index}`" class="cockpit-mcp-workflow__step">
        <div class="cockpit-mcp-workflow__phase">{{ step.phase }}</div>
        <div class="cockpit-mcp-workflow__activity">
          <div class="cockpit-mcp-workflow__title">
            <span class="cockpit-mcp-workflow__status" aria-hidden="true" />
            {{ step.title }}
          </div>
          <p>{{ step.description }}</p>
          <div v-if="step.tools?.length" class="cockpit-mcp-workflow__tools" aria-label="Tools used">
            <code v-for="tool in step.tools" :key="tool">{{ tool }}</code>
          </div>
        </div>
      </li>
    </ol>

    <div class="cockpit-mcp-workflow__handoff">
      <span aria-hidden="true" />
      <strong>{{ handoff }}</strong>
      <span aria-hidden="true" />
    </div>

    <div class="cockpit-mcp-workflow__review">
      <UIcon name="i-lucide-user-check" aria-hidden="true" />
      <div>
        <strong>Human review</strong>
        <p>{{ review }}</p>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.cockpit-mcp-workflow {
  margin-block: 1.5rem;
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 0.75rem;
  background: var(--ui-bg);
}

.cockpit-mcp-workflow__prompt {
  padding: 1rem 1.125rem;
  border-bottom: 1px solid var(--ui-border);
  background: var(--ui-bg-muted);
}

.cockpit-mcp-workflow__eyebrow,
.cockpit-mcp-workflow__phase {
  color: var(--ui-text-dimmed);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.cockpit-mcp-workflow__prompt blockquote {
  margin: 0.5rem 0 0;
  padding: 0;
  border: 0;
  color: var(--ui-text-highlighted);
  font-size: 0.875rem;
  font-style: normal;
  line-height: 1.6;
}

.cockpit-mcp-workflow__trace {
  margin: 0;
  padding: 0;
  list-style: none;
}

.cockpit-mcp-workflow__step {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  border-top: 1px solid var(--ui-border-muted);
}

.cockpit-mcp-workflow__step:first-child {
  border-top: 0;
}

.cockpit-mcp-workflow__phase {
  padding: 1rem;
  background: var(--ui-bg-muted);
}

.cockpit-mcp-workflow__activity {
  min-width: 0;
  padding: 0.875rem 1rem;
}

.cockpit-mcp-workflow__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--ui-text-highlighted);
  font-size: 0.875rem;
  font-weight: 700;
}

.cockpit-mcp-workflow__status {
  width: 0.4375rem;
  height: 0.4375rem;
  flex: none;
  border-radius: 9999px;
  background: var(--ui-primary);
}

.cockpit-mcp-workflow__activity p,
.cockpit-mcp-workflow__review p {
  margin: 0.375rem 0 0;
  color: var(--ui-text-muted);
  font-size: 0.8125rem;
  line-height: 1.55;
}

.cockpit-mcp-workflow__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.625rem;
}

.cockpit-mcp-workflow__tools code {
  max-width: 100%;
  overflow: hidden;
  padding: 0.1875rem 0.4375rem;
  border: 1px solid var(--ui-border-muted);
  border-radius: 0.25rem;
  color: var(--ui-text-muted);
  background: var(--ui-bg-muted);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.6875rem;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cockpit-mcp-workflow__handoff {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem 0.75rem;
  color: var(--ui-primary);
  font-size: 0.75rem;
  text-align: center;
}

.cockpit-mcp-workflow__handoff span {
  height: 1px;
  flex: 1;
  background: color-mix(in srgb, var(--ui-primary) 35%, transparent);
}

.cockpit-mcp-workflow__review {
  display: flex;
  gap: 0.75rem;
  margin: 0 1rem 1rem;
  padding: 0.875rem;
  border: 1px dashed var(--ui-border-accented);
  border-radius: 0.5rem;
}

.cockpit-mcp-workflow__review > svg {
  width: 1rem;
  height: 1rem;
  flex: none;
  margin-top: 0.125rem;
  color: var(--ui-primary);
}

.cockpit-mcp-workflow__review strong {
  color: var(--ui-text-highlighted);
  font-size: 0.8125rem;
}

@media (max-width: 40rem) {
  .cockpit-mcp-workflow__step {
    grid-template-columns: 1fr;
  }

  .cockpit-mcp-workflow__phase {
    padding: 0.75rem 1rem 0;
    background: var(--ui-bg);
  }

  .cockpit-mcp-workflow__activity {
    padding-top: 0.5rem;
  }
}
</style>
```

- [ ] **Step 5: Run the focused test and format check**

Run:

```bash
pnpm exec vitest run app/components/CockpitMcpWorkflow.test.ts
pnpm exec prettier --check app/components/CockpitMcpWorkflow.vue app/components/CockpitMcpWorkflow.test.ts
```

Expected: 1 test file and 3 tests pass; Prettier reports both files use its code style.

If Prettier reports differences, run:

```bash
pnpm exec prettier --write app/components/CockpitMcpWorkflow.vue app/components/CockpitMcpWorkflow.test.ts
```

Then rerun both checks.

- [ ] **Step 6: Commit the component**

```bash
git add app/components/CockpitMcpWorkflow.vue app/components/CockpitMcpWorkflow.test.ts
git commit -m "feat(docs): add Cockpit MCP workflow component"
```

---

### Task 2: Write the Cockpit MCP connection guide

**Files:**

- Create: `content/8.Cockpit/1.Features/mcp.md`

**Interfaces:**

- Consumes: `cockpit-mcp-workflow` from Task 1 with `prompt`, `steps`, optional `handoff`, and `review` props.
- Produces: the canonical `/cockpit/features/mcp` how-to page used by the cross-links in Task 3.

- [ ] **Step 1: Create the complete how-to page**

Create `content/8.Cockpit/1.Features/mcp.md`:

```md
---
title: Connect an AI assistant to Cockpit
description: Connect Claude Desktop, ChatGPT, or Cursor to Cockpit through MCP, then inspect and edit project content with human review.
seo:
  title: Connect an AI assistant to Cockpit | Laioutr
  description: Install the private-alpha Cockpit MCP connector, authenticate with OAuth, and use safe prompt-based workflows for your Laioutr projects.
sitemap:
  loc: /cockpit/features/mcp
  lastmod: 2026-07-21
  changefreq: monthly
  priority: 0.8
---

You need to update localized hero copy, rearrange a page, or revise its SEO without clicking through every Studio panel. Connect your AI assistant to **Cockpit MCP** and describe the result you want:

```text
List the Laioutr projects I can access.
```

Cockpit authenticates the assistant with your account, exposes the projects you can access, and lets the assistant work in the same collaborative document as Studio.

::warning
Cockpit MCP is in private alpha. Contact Laioutr to enable it for your organization before connecting a client. Installing a marketplace connector does not enable project access by itself.
::

## Connect your client

Choose the setup for your assistant. Each path opens the same Cockpit OAuth flow on first use.

::tabs
  :::tabs-item{label="Claude Desktop"}
  Open the [Laioutr Cockpit connector](https://claude.ai/directory/connectors/47f4846e-6a51-4ecb-831e-ead6b247cbcd) in Claude's connector directory and follow the connection flow.
  :::

  :::tabs-item{label="ChatGPT"}
  Open the [Laioutr Cockpit plugin](https://chatgpt.com/plugins/Plugin_xxxxxxxxxxx) in ChatGPT and follow the connection flow.
  :::

  :::tabs-item{label="Cursor"}
  Open your organization's [API keys page](https://cockpit.laioutr.cloud/o/_/api-keys). Find the Cockpit MCP card, copy its server URL, then add that URL as a remote MCP server in Cursor.

  Cockpit shows the MCP card only after Laioutr enables the private alpha for your organization.
  :::
::

When your client opens Cockpit, sign in with the account whose project access you want the assistant to use. Review the OAuth request and approve the connection.

Cockpit MCP uses OAuth. You do not need to create or paste an organization API key.

## Verify the connection

Ask your assistant:

```text
List the Laioutr projects I can access.
```

The response should list the projects available to your Cockpit account. If the assistant can identify the project you want, the connection is ready.

## Current capabilities

Cockpit MCP is a Cockpit-wide integration whose first tools focus on Studio. Today, your assistant can inspect existing pages and variants, discover installed sections and blocks, read schemas and style tokens, and edit page content in the live Studio document.

The current tools cover sections, blocks, static and localized props, array items, global-section references, visibility, layout order, and page SEO. Future Cockpit tools can use the same connection without changing the client setup.

## Example workflows

The examples below show what happens between your prompt and the result in Studio. Tool names appear as supporting detail so you can see when the assistant discovers, inspects, and changes project data.

### Update localized hero content

::cockpit-mcp-workflow
---
prompt: Update the homepage hero heading to “Summer starts here” in English and “Der Sommer beginnt hier” in German.
steps:
  - phase: Discover
    title: Homepage variant found
    description: The assistant selects the project and homepage variant.
    tools:
      - project_list
      - studio_list_pages
  - phase: Inspect
    title: Hero field verified
    description: The assistant reads the page tree, current heading, and field schema before writing.
    tools:
      - studio_get_page_tree
      - studio_get_component_schema
      - studio_get_prop
  - phase: Edit
    title: Two locale values written
    description: One atomic mutation updates English and German without replacing other locales.
    tools:
      - studio_set_static_props
review: Open the homepage in Studio and check both languages in context before publishing.
---
::

### Add and rearrange page sections

::cockpit-mcp-workflow
---
prompt: Add a hero section to the top of the homepage body and move the existing promotion grid directly below it.
steps:
  - phase: Discover
    title: Available sections loaded
    description: The assistant finds the homepage and reads the installed component catalog instead of guessing component names.
    tools:
      - studio_list_pages
      - studio_list_components
  - phase: Inspect
    title: Layout and hero schema checked
    description: The assistant reads the current page tree and the selected hero component schema.
    tools:
      - studio_get_page_tree
      - studio_get_component_schema
  - phase: Edit
    title: Section added and layout reordered
    description: The assistant adds the hero and moves the promotion grid while preserving existing section data.
    tools:
      - studio_add_section
      - studio_move_section
review: Check the homepage at desktop and mobile widths in Studio before publishing.
---
::

### Add array content with a style token

::cockpit-mcp-workflow
---
prompt: Add a “Free returns” item to the homepage benefits list and use the project's primary accent color.
steps:
  - phase: Discover
    title: Benefits field and palette found
    description: The assistant reads the component schema and project style tokens.
    tools:
      - studio_get_component_schema
      - studio_get_style_tokens
  - phase: Inspect
    title: Existing array items checked
    description: The assistant reads the section before appending a new item.
    tools:
      - studio_get_section
  - phase: Edit
    title: Benefit item added and styled
    description: The assistant creates the array item, then writes its localized text and color token.
    tools:
      - studio_add_array_item
      - studio_set_static_props
review: Review the new benefit in every required language and confirm that its color matches the storefront theme.
---
::

### Update localized page SEO

::cockpit-mcp-workflow
---
prompt: Set the homepage SEO title to “Summer collection” in English and “Sommerkollektion” in German.
steps:
  - phase: Discover
    title: Homepage variant selected
    description: The assistant finds the page variant that owns the SEO fields.
    tools:
      - studio_list_pages
  - phase: Inspect
    title: Current SEO values read
    description: The assistant checks the existing localized title and description maps.
    tools:
      - studio_get_page_tree
  - phase: Edit
    title: Localized SEO title updated
    description: The assistant merges both title values without clearing other locales.
    tools:
      - studio_update_page_variant
review: Check the page metadata in Studio and confirm the result for both locales before publishing.
---
::

## Work safely with live edits

Cockpit MCP writes to the same shared document that Studio uses. A collaborator can see the agent's activity and review its changes without importing a generated file or applying a separate patch.

Follow these practices:

- Ask the assistant to inspect current values and schemas before changing them.
- Keep each request focused so you can review the result in context.
- Confirm destructive requests before deleting sections or blocks.
- Review every change in Studio before publishing.

::note
Cockpit MCP cannot publish. Publishing remains a human action in Studio.
::

## Current limits

The first Cockpit MCP tools focus on existing Studio content. They cannot:

- create a page or page variant;
- publish changes;
- create or detach a global section;
- edit the global-section container's own props;
- write a prop value that is bound to a query.

Cockpit also rejects moves that would break a page-scoped query or cross an unsupported global-section boundary. Ask the assistant to preserve the existing structure when it reports one of these constraints.

## Troubleshooting

::accordion
  :::accordion-item{label="Cockpit reports MCP_NOT_ENABLED"}
  Laioutr has not enabled the private alpha for that organization. Contact Laioutr and provide the organization name or slug.
  :::

  :::accordion-item{label="The client cannot authenticate"}
  Disconnect the Cockpit connector, reconnect it, and complete OAuth with the intended Cockpit account. Make sure your browser is not signed in with a different account.
  :::

  :::accordion-item{label="The assistant cannot find a project"}
  Open Cockpit with the same account and confirm that the project appears there. MCP cannot expose a project that the signed-in account cannot access.
  :::

  :::accordion-item{label="The project frontend is unavailable"}
  Component catalogs, schemas, style tokens, and mutations need a reachable project frontend. Restore or deploy the frontend, then ask the assistant to retry.
  :::

  :::accordion-item{label="Studio storage is locked"}
  A restore or migration is running. Wait for the operation to finish, then retry the same request.
  :::

  :::accordion-item{label="A component changed after deployment"}
  Ask the assistant to refresh the installed component list before retrying. A frontend deployment can change component names, schemas, and slot rules.
  :::
::

## Related documentation

- [Studio](/cockpit/features/studio)
- [Organization API keys](/cockpit/organisation/api-keys)
- [Documentation MCP server](/getting-started/mcp-server)
```

- [ ] **Step 2: Format the guide**

Run:

```bash
pnpm exec prettier --write content/8.Cockpit/1.Features/mcp.md
pnpm exec prettier --check content/8.Cockpit/1.Features/mcp.md
```

Expected: Prettier reports that the new page uses its code style.

- [ ] **Step 3: Validate the guide's required content**

Run:

```bash
rg -n 'title: Connect an AI assistant to Cockpit|private alpha|OAuth|claude.ai/directory/connectors/47f4846e-6a51-4ecb-831e-ead6b247cbcd|chatgpt.com/plugins/Plugin_xxxxxxxxxxx|cockpit.laioutr.cloud/o/_/api-keys|::cockpit-mcp-workflow|studio_set_static_props|studio_add_section|studio_add_array_item|studio_update_page_variant|cannot publish' content/8.Cockpit/1.Features/mcp.md
```

Expected: every required phrase appears. There are four `::cockpit-mcp-workflow` opening markers.

Run:

```bash
rg -c '^::cockpit-mcp-workflow$' content/8.Cockpit/1.Features/mcp.md
```

Expected: `4`.

- [ ] **Step 4: Compile the component and MDC usage together**

Run:

```bash
pnpm build
```

Expected: Nuxt completes the production build with no Vue, TypeScript, Nuxt Content, or MDC errors.

- [ ] **Step 5: Commit the guide**

```bash
git add content/8.Cockpit/1.Features/mcp.md
git commit -m "docs(cockpit): add MCP connection guide"
```

---

### Task 3: Add entry-point cross-links

**Files:**

- Modify: `content/8.Cockpit/0.index.md`
- Modify: `content/8.Cockpit/1.Features/studio.md`
- Modify: `content/8.Cockpit/4.Organisation-Settings/api-keys.md`
- Modify: `content/0.getting-started/7.mcp-server.md`

**Interfaces:**

- Consumes: canonical guide route `/cockpit/features/mcp` from Task 2.
- Produces: discovery links from Cockpit overview, Studio, API keys, and the documentation MCP guide.

- [ ] **Step 1: Link from the Cockpit overview**

In `content/8.Cockpit/0.index.md`, update `sitemap.lastmod` from `2026-04-09` to `2026-07-21`.

Add this bullet to `### What you can do here` immediately after the Studio bullet:

```md
- **Cockpit MCP** — [connect an AI assistant](/cockpit/features/mcp) to inspect and edit project content through your Cockpit account.
```

- [ ] **Step 2: Link from the Studio guide**

In `content/8.Cockpit/1.Features/studio.md`, update `sitemap.lastmod` from `2026-04-09` to `2026-07-21`.

Add this paragraph after the opening Studio paragraph and before `### Layout`:

```md
To inspect and edit Studio content from Claude Desktop, ChatGPT, or Cursor, [connect an AI assistant to Cockpit](/cockpit/features/mcp).
```

- [ ] **Step 3: Explain the MCP card on the API keys page**

In `content/8.Cockpit/4.Organisation-Settings/api-keys.md`, update `sitemap.lastmod` from `2026-04-09` to `2026-07-21`.

Add this paragraph after the opening paragraph and before `### What API keys are for`:

```md
The same page shows the server URL for [Cockpit MCP](/cockpit/features/mcp) when Laioutr has enabled the private alpha for your organization. Cockpit MCP uses OAuth with your user account, not an organization API key.
```

- [ ] **Step 4: Distinguish the two MCP servers**

In `content/0.getting-started/7.mcp-server.md`, update `sitemap.lastmod` from `2026-04-24` to `2026-07-21`.

Add this note after the sentence `This server only exposes the documentation site. It does not connect to your project, your Cockpit, or your data.`:

```md
To let an assistant work with project data, [connect it to Cockpit MCP](/cockpit/features/mcp) instead.
```

- [ ] **Step 5: Format and verify all cross-links**

Run:

```bash
pnpm exec prettier --write \
  content/8.Cockpit/0.index.md \
  content/8.Cockpit/1.Features/studio.md \
  content/8.Cockpit/4.Organisation-Settings/api-keys.md \
  content/0.getting-started/7.mcp-server.md

pnpm exec prettier --check \
  content/8.Cockpit/0.index.md \
  content/8.Cockpit/1.Features/studio.md \
  content/8.Cockpit/4.Organisation-Settings/api-keys.md \
  content/0.getting-started/7.mcp-server.md
```

Expected: all four files use Prettier code style.

Run:

```bash
rg -l '/cockpit/features/mcp' \
  content/8.Cockpit/0.index.md \
  content/8.Cockpit/1.Features/studio.md \
  content/8.Cockpit/4.Organisation-Settings/api-keys.md \
  content/0.getting-started/7.mcp-server.md
```

Expected: all four file paths print.

- [ ] **Step 6: Run tests and compile the linked content**

Run:

```bash
pnpm test
pnpm build
```

Expected: 8 test files pass after Task 1, 206 tests pass, 13 tests remain todo, and the production build completes successfully.

- [ ] **Step 7: Commit the cross-links**

```bash
git add \
  content/8.Cockpit/0.index.md \
  content/8.Cockpit/1.Features/studio.md \
  content/8.Cockpit/4.Organisation-Settings/api-keys.md \
  content/0.getting-started/7.mcp-server.md
git commit -m "docs(cockpit): link Cockpit MCP guide"
```

---

### Task 4: Run final content, visual, and repository verification

**Files:**

- Verify: `app/components/CockpitMcpWorkflow.vue`
- Verify: `app/components/CockpitMcpWorkflow.test.ts`
- Verify: `content/8.Cockpit/1.Features/mcp.md`
- Verify: `content/8.Cockpit/0.index.md`
- Verify: `content/8.Cockpit/1.Features/studio.md`
- Verify: `content/8.Cockpit/4.Organisation-Settings/api-keys.md`
- Verify: `content/0.getting-started/7.mcp-server.md`

**Interfaces:**

- Consumes: all deliverables from Tasks 1 through 3.
- Produces: evidence that the guide, component, cross-links, and repository remain valid.

- [ ] **Step 1: Check all changed files with Prettier**

Run:

```bash
pnpm exec prettier --check \
  app/components/CockpitMcpWorkflow.vue \
  app/components/CockpitMcpWorkflow.test.ts \
  content/8.Cockpit/1.Features/mcp.md \
  content/8.Cockpit/0.index.md \
  content/8.Cockpit/1.Features/studio.md \
  content/8.Cockpit/4.Organisation-Settings/api-keys.md \
  content/0.getting-started/7.mcp-server.md
```

Expected: all seven files use Prettier code style.

- [ ] **Step 2: Scan added prose for prohibited punctuation and vocabulary**

Run:

```bash
git diff --unified=0 34a27b3..HEAD -- \
  app/components/CockpitMcpWorkflow.vue \
  content/8.Cockpit/1.Features/mcp.md \
  content/8.Cockpit/0.index.md \
  content/8.Cockpit/1.Features/studio.md \
  content/8.Cockpit/4.Organisation-Settings/api-keys.md \
  content/0.getting-started/7.mcp-server.md \
  | grep '^+' \
  | grep -v '^+++' \
  | grep -nE ' -- |—|–|\b(delve|tapestry|landscape|crucial|pivotal|leverage|harness|navigate|embark|endeavor|multifaceted|robust|streamline|foster|vibrant|nestled|compelling|furthermore|additionally|notably|importantly|comprehensive|facilitate|utilize)\b' \
  && exit 1 || true
```

Expected: no matching added lines.

- [ ] **Step 3: Verify product naming and current limits**

Run:

```bash
rg -n 'Cockpit MCP|private alpha|OAuth|cannot publish|cannot create' content/8.Cockpit/1.Features/mcp.md
! rg -n 'Studio MCP server|asset management tool|user management tool|content management tool|install apps' content/8.Cockpit/1.Features/mcp.md app/components/CockpitMcpWorkflow.vue
```

Expected: required Cockpit MCP wording appears, and no Studio-only name or unreleased tool claim appears.

- [ ] **Step 4: Verify every internal target exists**

Run:

```bash
test -f content/8.Cockpit/1.Features/mcp.md
test -f content/8.Cockpit/1.Features/studio.md
test -f content/8.Cockpit/4.Organisation-Settings/api-keys.md
test -f content/0.getting-started/7.mcp-server.md
rg -n '/cockpit/features/mcp|/cockpit/features/studio|/cockpit/organisation/api-keys|/getting-started/mcp-server' \
  content/8.Cockpit/1.Features/mcp.md \
  content/8.Cockpit/0.index.md \
  content/8.Cockpit/1.Features/studio.md \
  content/8.Cockpit/4.Organisation-Settings/api-keys.md \
  content/0.getting-started/7.mcp-server.md
```

Expected: every `test` exits successfully and every route appears in the intended files.

- [ ] **Step 5: Compare workflow tools with the current Cockpit registry**

Run:

```bash
for tool in \
  project_list \
  studio_list_pages \
  studio_list_components \
  studio_get_page_tree \
  studio_get_component_schema \
  studio_get_prop \
  studio_get_section \
  studio_get_style_tokens \
  studio_set_static_props \
  studio_add_section \
  studio_move_section \
  studio_add_array_item \
  studio_update_page_variant; do
  rg -q "'$tool'" /Users/sl/src/laioutr/apps/cockpit/src/lib/mcp/business/McpServerRegistry.ts || {
    echo "Missing tool: $tool"
    exit 1
  }
done
```

Expected: the command exits successfully without printing a missing tool.

- [ ] **Step 6: Run the complete automated verification**

Run:

```bash
pnpm test
pnpm build
git diff --check 34a27b3..HEAD
git status --short
```

Expected:

- 8 test files pass.
- 206 tests pass and 13 remain todo.
- Nuxt completes the production build.
- `git diff --check` prints nothing.
- `git status --short` prints nothing.

- [ ] **Step 7: Review the rendered guide**

Run the development server:

```bash
pnpm dev
```

Open `http://localhost:3000/cockpit/features/mcp` and verify:

- the page appears under Cockpit Features;
- Claude, ChatGPT, and Cursor tabs render correctly;
- all four activity traces render their prompt, phase labels, descriptions, tool chips, handoff, and review panel;
- long tool names do not overflow the content column;
- the trace stacks cleanly at a mobile width;
- light and dark modes preserve readable contrast;
- no workflow displays a publish control or suggests that MCP publishes.

Stop the development server after the review.

- [ ] **Step 8: Inspect the final diff**

Run:

```bash
git diff --stat 34a27b3..HEAD
git diff 34a27b3..HEAD -- \
  app/components/CockpitMcpWorkflow.vue \
  app/components/CockpitMcpWorkflow.test.ts \
  content/8.Cockpit/1.Features/mcp.md \
  content/8.Cockpit/0.index.md \
  content/8.Cockpit/1.Features/studio.md \
  content/8.Cockpit/4.Organisation-Settings/api-keys.md \
  content/0.getting-started/7.mcp-server.md
```

Expected: the diff contains one reusable component, one component contract test, one guide, and four concise cross-link edits. No unrelated content or source code changes appear.
