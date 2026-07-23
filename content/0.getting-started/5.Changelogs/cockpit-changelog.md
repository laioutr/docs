---
title: Cockpit Changelog
description: Changelog for the Laioutr Cockpit (Studio) product following Keep a Changelog and Semantic Versioning.
seo:
  title: Cockpit Changelog
  description: Changelog for the Laioutr Cockpit (Studio) product following Keep a Changelog and Semantic Versioning.
sitemap:
  loc: /getting-started/changelogs/cockpit-changelog
  lastmod: 2026-05-14
  changefreq: monthly
  priority: 1.0

---

All notable changes to **Cockpit (Studio)** — the visual editor and project management UI — will be documented in this file.

## [2026-07-22]

### Fixed

- **Studio**: Fix connecting AI agents to the Studio MCP server — the OAuth discovery URL the server advertised pointed at a page that did not exist, so authorization could never complete.

## [2026-07-18]

### Added

- **Studio**: Studio AI agents build more complete pages, guided by production composition patterns.

## [2026-07-17]

### Added

- **Studio**: Add a Section groups sections into package tabs and filters them by kit.

### Fixed

- **Studio**: Missing or broken preview images in the section/block pickers now show a placeholder.

## [2026-07-14]

### Fixed

- **Studio**: Media fields show clearer file details and remain reliable across frontend versions.
- **Studio**: Uploads refresh immediately, failed uploads can be retried, and SVGs render safely.
- **Studio**: Media picker dropdowns no longer flash a focus ring; nameless libraries show their id.

## [2026-07-13]

### Added

- **Studio**: The focal-point picker now works for video sources, not just images.
- **Studio**: The media library picker shows each library's icon next to its name.

### Fixed

- **Studio**: SVG media previews now render at their container size instead of collapsing.
- **Studio**: Logging in from a link to a specific page (such as a Studio URL) now takes you to that page instead of showing a "not found" error.

## [2026-07-10]

### Fixed

- **Studio**: The dynamic data source picker now shows the icon of the app that actually provides each value, even when multiple apps provide the same data.

## [2026-07-09]

### Changed

- **Studio**: **Breaking:** MCP tool studio_set_static_prop is now studio_set_static_props (batch writes).

### Fixed

- **Studio**: The market domain field no longer shows a misleading "www." prefix.

## [2026-07-02]

### Changed

- **Hosting**: Project settings now links to your organization API keys for npm registry access.
- **Hosting**: Expired API keys are now dimmed in the organization API keys table.

## [2026-07-01]

### Added

- **Hosting**: Log in to the npm registry from your terminal with npm login --auth-type=web.
- **Hosting**: See and revoke your registry web-login sessions from account security settings.

### Changed

- **Hosting**: The npm registry login screen now matches the app's sign-in look.

## [2026-06-30]

### Fixed

- **Studio**: Studio rejects an invalid dropdown value at write time instead of saving a broken page.

## [2026-06-29]

### Changed

- **Studio**: The buttons for inserting live query data into a page's SEO title, description, and robots are now enabled only when your connected frontend supports it, with an upgrade hint otherwise.

### Fixed

- **Studio**: Props set when adding a section or block now persist instead of rendering empty.

## [2026-06-26]

### Added

- **Studio**: Set a page's robots tag from a preset (index/noindex/nofollow) or bind it to live query data, so a connected system can drive per-page indexability.
- **Studio**: Insert live query data (like a product title) into a page's SEO title and description as inline variables.

## [2026-06-25]

### Added

- **Studio**: AI agents can now set a page's SEO title and description (and rename a page variant).

## [2026-06-24]

### Added

- **Studio**: A restore point is saved before each translation import, so a bad import can be undone.

### Fixed

- **Studio**: Media fields now survive a translations export and re-import.
- **Studio**: Importing translations no longer disconnects editors; images now import correctly.

## [2026-06-23]

### Added

- **Studio**: Agents can now place an existing global section onto a page from the Studio MCP server.
- **Studio**: Agents can now move or reorder a section between header, body, and footer or onto another page from the Studio MCP server.
- **Studio**: Agents can now move or reorder a block between local sections from the Studio MCP server, keeping its content and settings.
- **Studio**: AI agents can now discover a project's reusable global sections.

### Fixed

- **Studio**: Section and block reordering is now reflected in the MCP page tree.

## [2026-06-22]

### Added

- **Studio**: Write different translations for several languages in a single edit.
- **Studio**: AI agents can now add items to list props (slides, cards, rows).

### Fixed

- **Studio**: AI agents connected over MCP can list the Studio tools again, and the tool and data-model descriptions now accurately reflect what the server supports.

## [2026-06-19]

### Added

- **Studio**: MCP mutation results report the catalog version; catalog errors point you at the catalog.
- **Studio**: AI agents now see one component-catalog entry per project they can access in MCP resources/list, plus the Studio data-model docs entry.
- **Studio**: AI agents connecting via MCP now receive a Studio primer on initialize and can fetch the deeper data-model reference from laioutr://docs/studio/data-model.

### Changed

- **Studio**: **Breaking:** project_list now lists each project's locales; the locales resource is removed.
- **Studio**: Setting a translatable field via the MCP server now requires you to specify locales; extra locales on a non-translatable field are ignored with a warning.
- **Studio**: Editing actions now wait safely during a project restore, with a retryable lock error.

### Fixed

- **Studio**: Retrying a Studio action after a transient error now re-attempts instead of replaying it.

## [2026-06-18]

### Added

- **Studio**: Snapshot and restore project versions from Studio; auto-snapshot before each migration.
- **Studio**: Add the Studio MCP server panel under Organization → API Keys so AI assistants like Claude Desktop and Cursor can connect.

### Changed

- **Studio**: Translations export now covers only translatable fields and needs a published frontend.

### Fixed

- **Studio**: The studio no longer shows a save when you just open a project.

## [2026-06-17]

### Added

- **Studio**: Import a translations JSON on the Translations page to bulk-update text translations.

### Fixed

- **Studio**: Fix an occasional "statement timeout" error when loading your organizations and projects.

## [2026-05]

### Added

- **Studio**: Migration batcher — a Studio debug UI that plans and runs batches of section/block migrations and surfaces per-op results in a BatchReport.
- **Studio**: Read-only data view for sections and blocks that have no registered Studio definition. The bare "No schema found" alert is now paired with a collapsible inspector that walks the stored prop tree (static / static-localized / object / array / entity-set, including link, media, color, and JSON subtypes) and offers a "Show as JSON" toggle.
- **Studio**: Schema-condition engine widened with `arrayOperators` (`in`, `arr-of`, `slice`, `join`, `map`) and `typeOperators` (`bool`, `num`, `str`, `type`) alongside the defaults, so section and block authors can write more expressive `if` rules that hide schema fields irrelevant to the current configuration.
- **Studio Devtools**: New host picker for connecting the editor to arbitrary URLs and deployments — supports remote hosts, localhost, recent successful deployments, or any pasted URL. Replaces the previous localhost-only override and routes Studio error-screen host swaps through the same modal.

### Fixed

- **Hosting**: Deployments now respect the UI app version selected for the project. Generated `package.json` files pin `@laioutr-core/ui` and `@laioutr-core/ui-kit` to the version configured under `@laioutr-app/ui` in `apps_enabled`, instead of always using `latest`.
- **Studio**: Block and section names are now preserved after cloning.
- **Studio**: Publish button is disabled while an autosave is pending (`syncStatus === 'changed'`), preventing stale snapshots from being shipped to the deployment pipeline. It re-enables once the save reaches `'synced'`.
- **Studio**: Adding a section via the preview iframe now lands at the visible click target even when hidden sections or global-section references sit between siblings. The visible `atIndex` reported by the preview is translated to the full-list index before insertion.
- **Studio**: `ToggleButtonInput` UX improvements.
- **Studio Devtools**: Replace and Batch Replace now preserve the target's slot instead of appending the copy to the end of the destination.
- **Studio**: Migration walker isolates per-iteration errors so partial migrations now surface in the BatchReport. A throw inside a visitor (validation crash, malformed node, expression-eval bug) used to silently abort every later op and page within the failing walk; failures are now captured with the offending `nodeId` in the op's report and iteration continues.

## [2026-04]

### Added

- **Hosting**: Deployment detail page now auto-refreshes and auto-scrolls to the latest build log entries.
- **Studio**: Expanded the StudioIcon set with 50+ new icons covering pages (calendar, plane, video, cart, heart), alignment (justify, layout-align, distribute), borders, box styles (margin, padding, none), and more.
- **Studio**: Added typography icons (heading1–6, bold, italic, case variants), layout column/row icons, aspect ratio icons (1x1, 16x9, etc.), image fit icons, and corner radius icons.
- **Studio**: Query fields in the section editor now highlight which queries are bound to page-level queries, making data wiring more visible.
- **Studio**: The locale switcher now works correctly on routes that include dynamic path parameters.
- **Studio**: Real-time preview now uses `valtio-json-patch` for more reliable state synchronization during live editing, replacing `fast-json-patch`.
- **Studio**: Common built-in listing page types (product listing, product search, blog) now use root queries by default, so newly created pages get cleaner URL params (e.g., `?p=2` instead of `?queryId[p]=2`) out of the box.

### Fixed

- **i18n Settings**: Fixed a permissions issue where users with the `projectMarketsManagement` role could not create, update, or delete markets — the market management endpoints were incorrectly requiring the broader `projects` permission instead of the more specific `projectMarketsManagement` permission.
- **Security**: Mitigated three minor security vulnerabilities — an open-redirect bypass via `//`-prefixed URLs, an organization deletion endpoint that previously accepted a full org object instead of a plain ID, and an incorrect last-admin check that could allow an organization to be left without any admin.
- **Hosting**: Fixed a Safari incompatibility in duration formatting — duration values are now displayed correctly in Safari, which does not support the `Temporal` API.
- **Hosting**: Fixed broken snackbar link after triggering a deployment from Studio.
- **Studio**: Fixed duplicate sections appearing in the section list.
- **Studio**: Improved search in the Studio section/block picker.
- **Studio**: Hidden the localized field indicator when the project has only a single language configured.
- **Project Settings**: Removed a no-op translate button from project settings.

## [2026-03]

### Added

- **API Keys & App Releases**:
  - API key domain module with validator, repository and scopes.
  - API Keys tRPC router for full CRUD operations.
  - API Keys tab in organization settings.
  - `POST /api/v1/app/release` route with API key authentication for automated app publishing.
  - Domain events for API key and app release lifecycle.
- **i18n & Localization**:
  - Localized field indicators and improved debug tools in Studio.
  - Market-aware language switcher in Studio.
  - Language selector in the project creation form.
  - Migration script harness and `ALL_LOCALES` rename migration for transitioning to explicit locale codes.
  - Enforce field translatability in `setStaticProp`.
- **Project management**:
  - Create project button added to the organization projects tab.
  - Generate proper domain name for default market on project creation.
- **Miscellaneous**:
  - Screensharing guard for collaborative sessions.
  - Consolidated organization routes under `/o/<slug>`.
  - Re-orderable currencies.

### Changed

- Removed `ALL_LOCALES` wildcard throughout Studio in favor of explicit locale codes, including Yjs CRDT key migration with backup support and circular fallback chain prevention.
- Improved markets UI, settings, and related components (CircleFlag, SearchableSelect).
- Simplified deployment waiting page.
- Made pricing table hideable via feature flag.

### Fixed

- Fixed Yjs CRDT key deletion and added migration backup support.
- Fixed empty string not being converted to `undefined` in studio field `onChange`.
- Fixed languages/markets marked unavailable when no i18n config is present.
- Inlined core-types into Nitro bundle for Vercel compatibility.
- **Studio**: Hidden market name in the language switcher for single-market projects.
- **Studio**: Increased Studio connection timeout to 10 s for slower network conditions.
- **Studio**: Fixed stale frontend context reads after HMR reload by reading the valtio proxy lazily at call time.

## [2026-02]

### Added

- **Markets & translations**:
  - **Markets**: Overview page with empty state and create dialog, settings page with edit form, MarketGeneralSettings and MarketDomainsEditor components, market tRPC router and MarketRepository with CRUD operations.
  - **Translations**: Overview page with language management, AddLanguageDialog with BCP 47 combobox, flags and keyboard navigation, LanguageCard component, language tRPC router (list/create/delete).
  - Domain events for language/market CRUD; RcLanguage from core-types for type safety.
- **BYOS webhook hosting**:
  - WebhookHostingAdapter, WebhookSetupService (JWT-based setup flow), WebhookCallbackHandler and ByosWebhookClient for **Bring-Your-Own-Server (BYOS)** hosting integrations.
  - WebhookSender with **Standard Webhooks** signing, WebhookCallbackVerifier for secure callback authentication and a dedicated webhook callback API route for deployment status updates.
  - BudgetedRetry utility and DeploymentStatusMachine to handle **idempotent status transitions** and time-constrained retries.
  - tRPC router and hosting module wiring for BYOS webhook hosting, plus registration with well-known hosting providers and signing/callback key constants.

### Changed

- Switched Cockpit’s webhook handling to use the shared **standardwebhooks** library and brought the implementation in line with Standard Webhooks compliance.
- Improved hosting adapter behaviour: pass `providerData` to `disconnect` and `getCapabilities` for more flexible, dynamic hosting capabilities.

### Fixed

- Fixed a **config race condition** in Cockpit’s hosting setup.
- Fixed **defaultDomainId** being retained when its domain is removed.
- Addressed unhandled rejection warnings in BudgetedRetry tests.
- Improved fetch-rc and sidebar behaviour when filtering projects.
- Fixed a bug when removing a user from an organisation.

## [2026-01]

### Added

- **Project creation & management**:
  - Project creation wizard for guided project setup.
  - SupabaseDataTable for better data inspection and management in Cockpit.
  - Ability to delete projects from the project settings page, including disconnecting hosting adapters when projects are removed.
- **Hosting & infrastructure**:
  - Managed Vercel hosting now supports **foreign team access-data**.
  - Introduced a **domain event-bus** and OpenTelemetry instrumentation for Cockpit events, improving observability and decoupling internal services.

### Changed

- Restructured Cockpit into a **feature-based folder structure** (`features/auth`, `features/account`, `features/organization`, `features/studio`, etc.) for clearer ownership and modularity.
- Improved legacy deployment handling and hosting-adapter capabilities, including better clean-up on project deletion.

### Fixed

- Various small fixes during the feature-based restructuring (routing, imports, and type issues).

## [2025-12]

### Added

- **Hosting & infrastructure**:
  - Implemented **managed Vercel hosting** support.
  - Added support for Vercel runtime cache and Redis cache when a `redisUrl` is provided.
- **Studio features & UX**:
  - Migrated real-time collaboration from Jamsocket to **Liveblocks** for better stability and performance.
  - New Studio capabilities:
    - Move sections to other page-variants.
    - Copy-page action and improved edit-query modal.
    - Path validation and page path field (including params).
    - JSON field type and JSON-input with safe parsing on external value changes.
    - Loading/unloading screens and improved loading state visuals.
    - Query field “select link” support.

### Changed

- Replaced legacy HTTP calls with **tRPC** in Cockpit, aligning with the rest of the stack.
- Refactored integrations UI:
  - Replaced hardcoded integrations with dynamic ones.
  - Implemented an integration details modal and rendered integration descriptions as Markdown.

### Fixed

- Fixed various Studio stability issues:
  - React Query offline state by upgrading TanStack Query and tRPC.
  - Type errors and excessively deep TypeScript types.
  - AppProvider issues (ensured it is a client component and does not break organisation pages).
  - Studio media source logo aspect ratio.
  - Correct cloning of static props and array-items.
  - Unknown page types no longer throw errors in Studio.

## [2025-11 – 2025-10]

### Added

- **Studio editor & sections**:
  - Section tags and enhanced add-section modal, including support for double-click to add blocks/sections.
  - Newsletter sections (LUI-214) for richer marketing content.
  - Per-query-reference limit support in Cockpit for finer control over query results.
  - Page path field and validation in Studio, improving URL management.
- **Project & deployment**:
  - `projectSlug` added to `laioutrrc` and Cockpit’s deployment tooling.

### Changed

- Billing page overhaul with improved date formatting via `next-intl`.
- Multiple small tweaks in menus, variable menus and organisation/account flows to improve usability.

### Fixed

- Various small Cockpit bugs:
  - Using field fallback values when no default is given and honouring `labelSingular` in array fields.
  - JSON-input reacting correctly to external value changes.
  - Variable menu and organisation UI fixes.

## [Earlier]

### Added

- Initial versions of Cockpit and Studio:
  - **Project overview and management** (organisations, projects, environments).
  - **Studio page editor** with sections, blocks, and page variants for building frontends visually.
  - Early hosting integrations, deployment workflows and basic billing/usage views.

### Changed

- Iterative improvements to navigation, editor UX, and integration management as Cockpit evolved from an internal tool to a productised Studio experience.
