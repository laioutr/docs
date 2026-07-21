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
  :::tabs-item{label="Claude Desktop" icon="i-simple-icons-anthropic"}
  Open the [Laioutr Cockpit connector](https://claude.ai/directory/connectors/47f4846e-6a51-4ecb-831e-ead6b247cbcd) in Claude's connector directory and follow the connection flow.
  :::

  :::tabs-item{label="ChatGPT" icon="i-simple-icons-openai"}
  Open the [Laioutr Cockpit plugin](https://chatgpt.com/plugins/Plugin_xxxxxxxxxxx) in ChatGPT and follow the connection flow.
  :::

  :::tabs-item{label="Cursor" icon="i-simple-icons-cursor"}
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
- [Documentation MCP server](/getting-started/documentation-mcp-server)
