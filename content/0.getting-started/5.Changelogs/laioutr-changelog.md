---
title: Laioutr Changelog
description: Changelog for Laioutr, following Keep a Changelog.
seo:
  title: Laioutr Changelog
  description: Changelog for Laioutr, following Keep a Changelog.
sitemap:
  loc: /getting-started/changelogs/laioutr-changelog
  lastmod: 2026-11-16
  changefreq: weekly
  priority: 1.0

---

All notable changes to **Laioutr** are documented here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2026-11-16]

### Changed

- **Studio**: Where an environment's storefront runs Instant Publish, saving in Studio no longer sends content to the storefront; Studio's Publish puts the content live in seconds and shows the storefront's answer. Everywhere else, Publish deploys. Publishing this way needs the role a deployment needs.

### Fixed

- **Hosting & Deployment**: After an Instant Publish that changed content, the storefront's pages kept at the edge are cleared, so they no longer stay old until the cache expires or a deployment purges it. If the hosting refuses, Studio shows a warning.
- **Hosting & Deployment**: Instant Publish keeps the published version in a publish service, so a storefront that loses its cached copy reads it from there instead of silently falling back to the build.

## [2026-11-13]

### Added

- **Studio**: Where an environment runs Instant Publish, Studio edits go live on its storefront without a deployment.
- **Studio**: Where an environment runs Instant Publish, Studio's top bar shows which version its storefront serves now and offers Publish now, which shows what the storefront answered.

### Fixed

- **Studio**: The Studio preview keeps one size instead of switching between two.
- **MCP Server**: Studio MCP tools no longer suggest the image provider `raw`, which no storefront registers.

## [2026-11-11]

### Added

- **Larry Copilot**: Larry reads and changes agents, runs and credit settings, and previews purchases.

## [2026-11-10]

### Fixed

- **Hosting & Deployment**: The Laioutr Cloud settings no longer show the secret that Studio uses.
- **Studio**: Studio's query menu stays inside the window.
- **Hosting & Deployment**: Each hosting page names the environment it configures and links back to its Hosting page.
- **Hosting & Deployment**: Laioutr Cloud domains show their ownership record, and each DNS record is checked right.

## [2026-11-06]

### Added

- **Studio**: Visibility rules can be added and edited in the Studio panels and show in the layer tree.

### Fixed

- **Hosting & Deployment**: On Laioutr Cloud, every market can choose the project's Cloud address, also in copies.

## [2026-11-04]

### Added

- **Larry Copilot**: Larry Copilot opens beside the page, and the skill library is in the organization's menu.
- **Hosting & Deployment**: Project pages show the serving address while a project moves to another host.

### Fixed

- **Hosting & Deployment**: Markets on Laioutr Cloud can now choose the project's Cloud address as their domain.

## [2026-11-03]

### Added

- **Larry Copilot**: Larry Copilot uses skills: enable them in the library, pick one with "/", or create one.
- **MCP Server**: Platform Owners switch MCP on or off for each organization on one page.
- **MCP Server**: MCP access can be turned on per organization, for everyone, or stopped for everyone.

### Fixed

- **Larry Copilot**: Larry drafts a new skill from the first description and offers new skills at once.

## [2026-11-02]

### Fixed

- **Studio**: Studio no longer shows an error page when a section is added.

## [2026-10-31]

### Fixed

- **Hosting & Deployment**: Creating a project no longer fails when Vercel returns settings the Cockpit does not recognize yet.

## [2026-10-30]

### Added

- **Studio**: Campaign Manager shows each campaign's home page as a live preview.
- **Studio**: Campaigns can show a picture of their storefront, and the schedule shows exact times.

### Fixed

- **Studio**: Campaign Manager shows each campaign in its own colour and says where one is planned.
- **Studio**: The Environments page shows each environment's campaign as a line of its card.
- **Studio**: Studio asks before turning off path translation and lists the paths it would replace.

## [2026-10-29]

### Added

- **Studio**: Ask Larry Copilot to list, fork, schedule or roll back campaigns.
- **Studio**: Export a campaign to a file and import it as a new campaign in any project.

## [2026-10-28]

### Added

- **Hosting & Deployment**: A market's domains are chosen from the domains set up on the Domains page.

### Fixed

- **Hosting & Deployment**: The domains list shows where a redirecting domain sends visitors.
- **Hosting & Deployment**: Domains set up at the hosting show their DNS records and apex redirect target.

## [2026-10-27]

### Added

- **Hosting & Deployment**: Own domains are connected on the new Domains page, which sets them up and checks them.

## [2026-10-26]

### Added

- **Hosting & Deployment**: "Check again" asks Cloudflare to check a pending Cloud domain right away.

## [2026-10-22]

### Fixed

- **Studio**: Studio menus, fields and dialogs are readable in the dark theme.

## [2026-10-21]

### Fixed

- Opening a deployment, or going back to Deployments, keeps the environment you chose.

## [2026-10-20]

### Fixed

- **Hosting & Deployment**: Deploying from the Deployments page asks for confirmation and names the environment.
- **Hosting & Deployment**: After a hosting cutover, the deployments list marks the build the new provider serves.
- **Hosting & Deployment**: The deployments list marks the build a staged hosting serves and links its address.

## [2026-10-16]

### Added

- **Hosting & Deployment**: An app in Package Management can follow latest and update on every deployment.

## [2026-10-15]

### Added

- **Larry Copilot**: Ask Larry's question field now takes several lines; press Shift+Enter for a new line.
- **Larry Copilot**: Ask Larry runs several changes it proposed with one confirmation, in order.

## [2026-10-14]

### Added

- **Hosting & Deployment**: A redirect can now apply to one language, set on the redirect page or in the CSV.

## [2026-10-12]

### Fixed

- **Hosting & Deployment**: An organization's own private apps now appear in its projects' Package Management.

## [2026-10-11]

### Added

- **Hosting & Deployment**: Open any traced request as a waterfall that marks its slowest path and its errors.
- **Hosting & Deployment**: See an environment's slowest and failed requests, and open the trace of each.
- **Hosting & Deployment**: Protect a Laioutr Cloud storefront with a password, and give machines bypass secrets.
- **Hosting & Deployment**: Logs follow new lines live, with colours, expandable JSON and links to traces.
- **Hosting & Deployment**: Metrics charts now mark deployments and open logs or slow requests for the time you pick.

## [2026-10-10]

### Added

- **Hosting & Deployment**: Make an earlier Laioutr Cloud deployment live again without a new build.
- **Hosting & Deployment**: Settings now lists what still accepts the old preview token after a rotation.

### Fixed

- **Hosting & Deployment**: The cutover dialog now says that visitors move only once your domains point there.
- **Hosting & Deployment**: A named preview no longer changes the versions its environment's cards show.
- **Hosting & Deployment**: After a rollback, the version cards show the versions of the live build.
- **Hosting & Deployment**: The rollback message now says which Cloud deployments stay ready.
- **Hosting & Deployment**: Switch to a recent Laioutr Cloud deployment and back, without a new build.
- **Hosting & Deployment**: The rotation notice lists named previews; Laioutr deploys a staged hosting.
- **Hosting & Deployment**: Rotating the preview token ends rollbacks to earlier Laioutr Cloud deployments.

## [2026-10-08]

### Fixed

- **Larry Copilot**: Ask Larry answers questions about your own reports and feeds, such as how many are open.
- **Hosting & Deployment**: Build logs now show for staging and other non-production environments.
- **Larry Copilot**: Ask Larry remembers the changes he made in a conversation and can list your reports.
- **Larry Copilot**: Ask Larry checks that a product feed is ready and says what is missing before a run.
- **Larry Copilot**: Ask Larry tells you where to ask him to act, and links what he made for you.

## [2026-10-07]

### Added

- **Larry Copilot**: Ask Larry can send a problem to support for you, once you agree.
- **Larry Copilot**: Ask Larry sets up and checks product feeds for you, showing each change first.

## [2026-10-06]

### Added

- **Larry Copilot**: Ask Larry answers greetings and follow-ups in your language, from the documentation.
- **Larry Copilot**: Ask Larry answers questions from the Laioutr documentation, in the header of every page.

## [2026-10-05]

### Fixed

- **Studio**: Typing in the middle of a text area or link URL in Studio keeps the cursor in place.

## [2026-10-02]

### Fixed

- **Hosting & Deployment**: Package Management no longer marks apps "Not recorded" or asks you to record them.

## [2026-10-01]

### Fixed

- **Hosting & Deployment**: Someone allowed into Studio on one environment can pick media there.
- **Hosting & Deployment**: An organization without a logo shows its initial, as the design has it.
- **Hosting & Deployment**: Package Management lists an app's unchecked risks and asks you to accept them first.
- **Hosting & Deployment**: The Apps card now says when you cannot change an environment's apps, and who can.
- **Hosting & Deployment**: Production environments are marked green by default.
- **Hosting & Deployment**: The dashboard's storefront tile shows the platform version and the app count on one line.
- **Hosting & Deployment**: The environment switcher no longer calls an unpublished production live.

## [2026-09-30]

### Added

- **Hosting & Deployment**: Configure an installed app's settings in Package Management, with secrets encrypted.

### Fixed

- **Hosting & Deployment**: Saving versions on production shows what changes and warns before a version goes down.

## [2026-09-25]

### Fixed

- **Studio**: The page switcher finds every page, and Studio searches take typing right after opening.

## [2026-09-24]

### Added

- **Hosting & Deployment**: Staff can attach a project's own domains to Laioutr Cloud and see their DNS status.
- **Hosting & Deployment**: Laioutr staff can prepare Laioutr Cloud beside a project's current hosting, deploy to it, and cut over — from the hosting page.
- **Hosting & Deployment**: Build logs now appear for Laioutr Cloud deployments.
- **Hosting & Deployment**: An environment can be deleted, with its hosting and its content. The live one cannot.
- **Hosting & Deployment**: An environment can be renamed; its address stays as it was.

### Changed

- **Hosting & Deployment**: A new environment starts building as soon as it is created.
- **Hosting & Deployment**: Creating an environment now shows what it is doing step by step, and opens the finished environment instead of reporting that it does not exist.
- **Hosting & Deployment**: Undo now asks first and states what it will not bring back, and says when it is done. A missing environment explains itself instead of showing a bare line.
- **Hosting & Deployment**: Copying into an environment says when app versions cannot move yet.
- **Hosting & Deployment**: Copying an environment now updates its recorded apps, including ones the copy removed.
- **Hosting & Deployment**: How many environments a project may have now comes from its plan.

### Fixed

- **Hosting & Deployment**: Renaming an environment opens its page under the new name straight away.
- **Hosting & Deployment**: Deploying an environment straight after creating it no longer fails, so its address starts answering once the first build finishes.
- **Hosting & Deployment**: Adding the same domain twice to one market is refused with an explanation, instead of discarding the market's other domains.
- **Hosting & Deployment**: Deleting a project now removes every environment's hosting, not only production's.

## [2026-09-23]

### Added

- **Studio**: The Studio now shows which environment you are editing, with the live one marked.
- **Studio**: Picking a page-index entry in a link field now fills every language.
- **Hosting & Deployment**: An environment's apps can be added, removed and re-versioned together, then saved once.
- **Hosting & Deployment**: An environment's History now lists every deploy, copy and migration with who ran it.
- **Hosting & Deployment**: An environment can now be pinned to any published platform version.
- **Hosting & Deployment**: An environment now lists its risks and delivery history.
- **Hosting & Deployment**: A deployment now shows which package versions the build installed.

### Changed

- **Hosting & Deployment**: An environment's history now says which way a copy went, from the page you are on.
- **Hosting & Deployment**: Copying app versions between environments now carries what the source last built.
- **Hosting & Deployment**: A test environment now deploys as a preview rather than as a production release, and the warning that it shares production's connections appears only while it actually does.

### Fixed

- **Hosting & Deployment**: Adding an app that is already installed no longer records it twice.
- **Hosting & Deployment**: Invalid input now explains what was wrong instead of failing as a server error.

## [2026-09-22]

### Added

- **Hosting & Deployment**: An environment can now be copied onto another in either direction — promote work into production, or reset a test environment from it — choosing what moves and confirming before anything is replaced.

### Changed

- **Hosting & Deployment**: An environment stops following the newest platform release once its project has more than one environment, so what you test is what goes live. Its page shows which version it is on and whether a newer one exists.
- **Hosting & Deployment**: A project with more than one environment keeps the whole menu inside the environment you are working in, marked with its own colour, and deploys from each environment's own card after confirming which one.

### Fixed

- **Hosting & Deployment**: The breadcrumb now names the environment you are actually looking at on its own page.

## [2026-09-17]

### Added

- **Studio**: Rotate the phone and tablet preview in Studio to check your page in landscape.
- **Hosting & Deployment**: Hosting settings now take the deployment's protection bypass key, so a storefront behind bot protection still answers Studio and the feed generator.
- **Studio**: Meta, AWIN and idealo gain feeds built to each vendor's own published specification.
- **Studio**: A feed column can now carry a fallback value for facts your shop has no field for, and eBay and idealo read delivery and shipping details from your market settings.

### Changed

- **Studio**: Every channel built to a vendor specification is now checked against that specification.

### Fixed

- **Studio**: A feed now fails with a clear reason when the storefront blocks it, instead of retrying quietly and appearing to still be generating.
- **Studio**: eBay feeds now use the column name eBay documents for the listing title.

## [2026-09-16]

### Added

- **Studio**: New Google Shopping channel built to Google's own specification.
- **Studio**: A feed now warns when its columns no longer match its channel.
- **Studio**: Feeds can now set their own price bands, new-product window and top-seller threshold.
- **Studio**: A feed column can take a per-product override.
- **Studio**: A feed can now be told the address its products are served at.
- **Studio**: A feed can now exclude categories, brands and SKUs by list, not only by filter rule.
- **Studio**: A feed can be written as CSV or TSV whatever its channel defaults to, and its links start from the storefront rather than a bare product key.
- **Studio**: A feed can be exported in a currency of its own, and follows its market's when it is not set.
- **Studio**: Feeds export a whole catalogue rather than the first thousand products, filter it with conditions on any field, and report each run step by step.

### Changed

- **Studio**: Generating a feed now asks first, and the list shows how far a running feed has got.
- **Studio**: Feeds now use each market's own wording and formats, and link to real product pages.
- **Studio**: Feeds on one market now read the shop's catalogue together, once per market.
- **Studio**: Generating a feed starts immediately when you press the button, and scheduled feeds now run on their own.
- **Studio**: Generating a feed no longer blocks on the browser — the run continues on the server, and its progress and log survive closing the tab.
- **Studio**: A feed's address opens in the browser and is shown on the feed itself, and every column a channel asks for is filled.

### Fixed

- **Studio**: A throttled storefront no longer fails a run, and Meta feeds always carry an id.
- **Studio**: The generation dialog no longer carries a file link that opened slowly in a new tab.
- **Studio**: The mapping editor now offers every transform the generator implements.
- **Studio**: Product links in feeds are now built on the storefront the catalogue was read from.
- **Studio**: Feeds of one project no longer read its shop at the same time, a filter that cannot apply says so, and the download link works again.
- **Studio**: A feed that cannot be published now fails with the reason instead of reporting success.

## [2026-09-15]

### Added

- **Studio**: Publish your catalogue to Google Shopping, Meta, AWIN and Idealo as scheduled feeds.
- **Studio**: Translate a page's URL per language with the new translate button next to the URL field.
- **Studio**: Duplicate page variants that use queries — the copy gets its own queries and keeps the source's SEO.

## [2026-09-08]

### Added

- **Studio**: Create a scoped, revocable API key that lets an outside app use one project's media.

## [2026-09-07]

### Added

- **Studio**: The editor now reaches a deployment protected by its hosting provider.

## [2026-08-27]

### Changed

- **Hosting & Deployment**: A managed-Vercel deploy publishes its redirects to the Vercel edge, which answers them before any route in the deployment, so an old URL no longer costs a function invocation.

### Fixed

- **Hosting & Deployment**: Importing a redirect CSV with more than 256 rows now works.
- **Hosting & Deployment**: Projects with more than 1000 redirects now deploy every redirect, export the full list to CSV, and re-import without creating duplicates.

## [2026-08-24]

### Added

- **Studio**: Link fields can now take their target from a query result, the same way media fields already can.

## [2026-08-21]

### Added

- **Studio**: Set a sorting on a query in the query editor to change the default order of its results.
- **Studio**: A rejected project secret now offers a link to the project your host actually serves.
- **Studio**: A new Abandoned Props panel reports stored props whose field a section or block no longer defines, or whose value no longer fits it, and can prune them.

### Fixed

- **Studio**: Editing a query's limit, label, URL alias and input rules in Studio now saves.
- **Studio**: Studio now reports a rejected project secret and names the project the host serves.

## [2026-08-20]

### Changed

- **Studio**: The preview now opens at the desktop frame (1920) instead of stretching to the width of the editor window.

## [2026-08-11]

### Added

- **Studio**: The selected market and language are kept in the URL, so a reload or a shared link opens the same market and language instead of the project default.

## [2026-08-10]

### Added

- **Hosting & Deployment**: Markets have a status of Draft or Active, new markets start as Draft, and the market cards show Draft and Default badges.
- **Hosting & Deployment**: A project can choose its default market from its active markets, and the selector names the fallback used when none is chosen.

### Fixed

- **Hosting & Deployment**: Billing settings are now always available, so you can open the billing portal before a payment method has been added.

## [2026-08-03]

### Fixed

- **Studio**: Clearing a number field now resets it to its default, and a field set to 0 shows the 0.

## [2026-08-01]

### Added

- **Studio**: Studio now remembers your open page, selection, and preview in the URL — reload or share a link to return exactly where you were.

## [2026-07-29]

### Added

- **Studio**: Pick a concrete page right in the link picker; manual parameter entry stays available.

### Changed

- **Studio**: The preview and link page pickers now say "page" instead of "instance".

### Fixed

- **Studio**: Preview data now follows on-page links that carry a query string or an accented URL.

## [2026-07-27]

### Added

- **Studio**: The Preview Data selector now shows the source app's icon and name.

### Changed

- **Studio**: The Preview Data selector now names the product being previewed instead of showing its raw URL parameters.
- **Studio**: The Preview Data selector names the page you picked immediately, instead of briefly showing its raw URL parameters.

### Fixed

- **Studio**: The Preview Data selector now tracks the previewed page on stores whose product URLs span several path segments.
- **Studio**: Clicking a link in the preview now updates the Preview Data selector to that page.

## [2026-07-24]

### Added

- **Hosting & Deployment**: Project settings has an "open preview" link that opens the live storefront in content-preview mode in a new tab, shown once the project has a deployed host.
- **Studio**: The Preview Data selector now marks the exact product shown in the preview.

### Fixed

- **Studio**: The Preview Data selector now reflects the product you open via an in-preview link.

## [2026-07-23]

### Added

- **Studio**: Generate a content preview token in project settings, then use the "Show Preview Content" command in Studio to preview unpublished content.
- **Hosting & Deployment**: New projects come with a content preview token already generated.

### Changed

- **Studio**: The studio's "Show preview content" command is disabled, with the required version in a tooltip, when the project's deployed frontend-core is too old to honour it.
- **Hosting & Deployment**: New content-preview tokens carry a "pvtk_" prefix; already-issued tokens keep working.
- **Hosting & Deployment**: Project settings now links to the docs and lets you copy the project secret key.

### Fixed

- **Studio**: Data-source options in the query picker now match the market selected in Studio.

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

- **Hosting & Deployment**: Project settings now links to your organization API keys for npm registry access.
- **Hosting & Deployment**: Expired API keys are now dimmed in the organization API keys table.

## [2026-07-01]

### Added

- **Hosting & Deployment**: Log in to the npm registry from your terminal with npm login --auth-type=web.
- **Hosting & Deployment**: See and revoke your registry web-login sessions from account security settings.

### Changed

- **Hosting & Deployment**: The npm registry login screen now matches the app's sign-in look.

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

## Before 2026-06-17

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
