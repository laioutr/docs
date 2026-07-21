# Cockpit MCP Documentation Design

## Goal

Document how a developer connects an AI assistant to the Laioutr Cockpit MCP server and uses it safely for the capabilities available today.

The guide will present the server as the Cockpit MCP server, not as a Studio-only integration. Its first capability set focuses on Studio workflows, but the connector and documentation pattern must also fit future Cockpit domains such as assets, content, apps, and organization management.

## Diataxis classification

The new page is a how-to guide. It helps a reader connect a client, authenticate, verify access, and complete practical Cockpit tasks.

A complete tool contract is out of scope. Tool names appear only where they clarify an example workflow or troubleshooting step.

## Page and navigation

Create:

- `content/8.Cockpit/1.Features/mcp.md`
- Page title: `Connect an AI assistant to Cockpit`
- Canonical route: `/cockpit/features/mcp`

Add concise cross-links from:

- `content/8.Cockpit/0.index.md`
- `content/8.Cockpit/1.Features/studio.md`
- `content/8.Cockpit/4.Organisation-Settings/api-keys.md`
- `content/0.getting-started/7.mcp-server.md`

The documentation MCP page will distinguish its read-only documentation search from the authenticated Cockpit MCP server, which works with project data. The API keys page will explain that its Cockpit MCP card provides the server URL, while MCP authentication itself uses OAuth rather than an organization API key.

No new navigation group is needed. The page belongs with the existing Cockpit feature guides.

## Audience and availability

The primary reader is a developer or technical operator who wants Claude Desktop, ChatGPT, or Cursor to work with Cockpit.

The page will identify the connector as a private alpha. Laioutr must enable the reader's organization before project-scoped calls work. Installing a marketplace connector does not bypass this organization gate.

## Connection paths

Use a client-neutral setup section with three paths:

- Claude Desktop: install from `https://claude.ai/directory/connectors/47f4846e-6a51-4ecb-831e-ead6b247cbcd`.
- ChatGPT: install from `https://chatgpt.com/plugins/Plugin_xxxxxxxxxxx`.
- Cursor: open `https://cockpit.laioutr.cloud/o/_/api-keys`, copy the MCP server URL from the Cockpit MCP card, and add it as a remote MCP server.

The first connection opens the Cockpit OAuth flow. The reader signs in with the Cockpit account whose project access the assistant should use and approves the connection.

The guide will verify the connection with a client-neutral prompt such as:

> List the Laioutr projects I can access.

The expected result is a list of projects visible to the signed-in Cockpit account. The guide will not expose raw protocol output.

## Guide structure

The page will use this order:

1. Scenario-based introduction with a concrete prompt near the top.
2. Private-alpha prerequisite.
3. Client installation and OAuth connection.
4. Connection verification.
5. Current Cockpit capabilities.
6. Example workflows.
7. Safe collaboration and current limits.
8. Troubleshooting.
9. Related Cockpit and documentation MCP links.

The page will state that the current tools focus on existing pages and variants. They can inspect and edit sections, blocks, static and localized props, array items, style tokens, global-section references, and page SEO.

The page will not present future asset, content, app, user, or organization tools as available. It may state that the Cockpit MCP surface will grow beyond its initial Studio-focused capabilities.

## Example workflows

Use concise prompt-led examples rather than raw tool-call instructions. Each example will render through the reusable workflow component described below.

Cover these tasks:

1. Update a homepage hero heading in English and German.
2. Add or rearrange sections and blocks in an existing page variant.
3. Add an array item and apply a project style token.
4. Update localized page SEO.

Each workflow shows:

1. The reader's prompt.
2. Discovery and inspection activity.
3. The mutation that changes Cockpit data.
4. The live-document handoff.
5. Human review in Studio before publishing.

Tool names remain secondary metadata. They help the reader understand what the assistant is doing without turning the guide into an API reference.

## Workflow component

Create `app/components/CockpitMcpWorkflow.vue` and expose it to Markdown as `cockpit-mcp-workflow`.

The component uses the selected activity-trace design. It renders a vertical sequence of labeled phases, each with a result title, short description, and optional tool chips. A separate handoff line explains when the edit enters Cockpit's shared document. The final review panel identifies the action a human collaborator performs.

Use one data-driven component instead of hardcoded workflow variants. Its conceptual prop contract is:

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

Nuxt Content MDC will pass these values through a YAML prop block. This keeps workflow content in Markdown while the Vue component owns layout and styling.

The component will:

- use semantic `figure`, ordered-list, and caption markup;
- use Nuxt UI color variables and scoped CSS;
- support light and dark modes;
- stack cleanly in a narrow content column and on mobile;
- keep tool names visually subordinate to the workflow outcome;
- include no animation, fake controls, or client-side state;
- use Cockpit-wide naming so future non-Studio examples fit without component changes.

## Data and collaboration model

Cockpit MCP uses OAuth and the signed-in user's Cockpit access. It does not authenticate with an organization API key.

Project calls remain scoped to a project the user can access. MCP edits enter the same live collaborative document used by Studio, and human collaborators can see the agent's activity. The agent reports its result, then the reader reviews the affected page in Studio.

Publishing remains a human action outside the MCP surface.

## Current limits and safety guidance

Document these current limits:

- The MCP cannot create pages or page variants.
- The MCP cannot publish.
- The MCP cannot create or detach a global section or edit the global-section container's own props.
- The MCP cannot write query-bound prop values.
- Some moves are restricted when they would break page-scoped queries or global-section boundaries.

The guide will advise readers to:

- review changes in Studio before publishing;
- ask the assistant to inspect current values and schemas before writing;
- confirm destructive requests before deleting sections or blocks;
- make focused changes so a human collaborator can review them easily.

## Troubleshooting

Translate common server conditions into reader actions:

- `MCP_NOT_ENABLED`: contact Laioutr to join the private alpha for that organization.
- Authentication failure: reconnect and complete OAuth with the intended Cockpit account.
- Missing project: confirm that the signed-in account can access it.
- Frontend unavailable: restore or deploy the project frontend before schema-based discovery or mutations.
- Storage locked: wait for the restore or migration to finish, then retry.
- Changed component catalog: ask the assistant to refresh the installed component list before retrying.

Keep raw error codes inside troubleshooting only. The main workflow should stay task-focused.

## Validation

Run:

- Prettier checks for every changed Markdown and Vue file.
- The repository test suite.
- `pnpm build` to validate Vue, Nuxt Content, and MDC compilation.
- `git diff --check`.
- prose-hygiene scans for banned punctuation and vocabulary.
- targeted searches that confirm all external and internal links.

Review the rendered page and component in light mode, dark mode, a desktop content column, and a mobile width. Confirm that every workflow matches the current tool registry in `/Users/sl/src/laioutr/apps/cockpit/src/lib/mcp/business/McpServerRegistry.ts` and that no example suggests the MCP can publish.

## Out of scope

- A complete per-tool MCP reference.
- Documentation for unreleased Cockpit tools.
- Changes to the Cockpit MCP server or connector listings.
- Changes to the documentation-only MCP server.
- Generated CLI-style schemas or raw MCP protocol examples.
