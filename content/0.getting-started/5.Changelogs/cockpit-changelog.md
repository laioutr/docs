---
title: Cockpit Changelog
description: Changelog for Cockpit, following Keep a Changelog.
seo:
  title: Cockpit Changelog
  description: Changelog for Cockpit, following Keep a Changelog.
sitemap:
  loc: /getting-started/changelogs/cockpit-changelog
  lastmod: 2026-11-17
  changefreq: weekly
  priority: 1.0

---

All notable changes to **Cockpit** are documented here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Studio and Hosting changes are on the [Laioutr changelog](/getting-started/changelogs/laioutr-changelog).

## [2026-11-17]

### Added

- **Plans & Onboarding**: A project holding a size of a product can buy any of that product's sizes once as extra volume for the month, at its monthly price, by card through Checkout or by the invoice shown first. Owners are told when the paid volume is added.
- **Plans & Onboarding**: Translatr statistics and Image CDN traffic offer Add volume once 80 % of a monthly limit is used; it opens the sizes on sale once for this month.

### Changed

- **Marketplace**: Grouped app settings show each value as its own field; only secrets stay hidden.
- **Marketplace**: The bookings CSV adds the customer's address, their message and one column per field of the booking form, headed by the field's label. The nine existing columns keep their order.
- **Insights & Support**: A reply sent from the platform inbox to a feedback report can be corrected by its author; the project sees the corrected reply.

## [2026-11-13]

### Fixed

- **Marketplace**: The environment's Configuration page names apps by their catalog titles, as Package Management and the Apps page do.

## [2026-11-12]

### Added

- **Marketplace**: Customers cancel a calendar booking themselves from the link in their emails.

## [2026-11-11]

### Added

- An applied agent change can be reverted from its card in the Operations Center.
- An agent's proposed change shows what it changes, and a rejection can say why.
- Dismissed findings can be reopened, and "Run all analyses" says it is paid.

### Changed

- Requests to the Laioutr team are confirmed before they are sent.
- The SEO agent does not start, and costs nothing, where the storefront has no sitemap.

### Fixed

- Larry's confirmation cards name the agent again instead of its id.
- **Marketplace**: The Marketplace's note on adopting agents shows only while one can be adopted.
- **Operations Center**: Default agents are named in the reader's language everywhere in the Operations Center.

## [2026-11-10]

### Added

- **Operations Center**: Agents' values can be measured for free, and the SEO agent can fix missing page titles.
- **Operations Center**: The Performance agent can measure any public https address entered when starting a run.

### Changed

- **Workspace & Access**: Inside an organization the breadcrumb starts with the organization; the home icon is gone.

### Fixed

- **Operations Center**: An empty signal card's text is no longer cut off.
- **Operations Center**: History and Measure say when a measurement read nothing.
- **Operations Center**: Repeated agent findings are now one finding, and findings that are gone close.
- **Operations Center**: Values agents do not measure yet are shown as grey examples, with a way to ask for them.
- **Marketplace**: The calendar's forms end with Save.
- **Operations Center**: Measuring an environment's own address fills the Performance cards; agents list a problem once.
- **Marketplace**: Calendar hours stay as typed instead of closing the week.

## [2026-11-09]

### Fixed

- Performance and SEO agents can check a test environment on its own address.
- At a safety limit the message now says how long to wait, not to ask for a bigger license.
- When an own mailbox refuses the login, the message now names the app-specific password and the usual username.

## [2026-11-07]

### Fixed

- **Operations Center**: An agent that lacks data it needs no longer starts or uses credits; it says what.
- The CLI's fetch-rc now names a missing project or environment, not an unavailable API.

## [2026-11-06]

### Added

- The Operations Center's Findings, Actions and History tabs now show each finding's detail, a board of proposed changes from proposal to decision, and a day-by-day record with a report export.

## [2026-11-05]

### Added

- **Marketplace**: Installing an app from npm warns when it needs another platform version.
- **Marketplace**: Laioutr apps published on npm can follow their latest version in Package Management too.

### Fixed

- The project sidebar stays as it was left, also after a reload or a visit to Studio.

## [2026-11-04]

### Added

- **Workspace & Access**: Rename a project straight from its card on the organization overview.

## [2026-11-03]

### Added

- **Credits**: Owners can give each member a monthly limit of AI credits on the AI Usage page.
- **Credits**: AI is counted in credits; Larry Copilot is included up to the licenses' shared quota.
- **Credits**: AI credits can be bought on Billing & Usage.
- **Marketplace**: An app's configuration can be edited as JSON when its version declares no settings.

### Fixed

- **Credits**: AI Usage shows the credits still held for members, never more than the balance.
- **Marketplace**: An app setting that holds a list is shown and saved in the environment's Configuration.
- **Marketplace**: Apps from our open-source packages can now be added from the Apps page.

## [2026-11-02]

### Added

- **Marketplace**: Calendar emails show price and place, and templates follow the market languages.
- **Marketplace**: Calendar emails get their own header and footer, and services can be translated.
- **Marketplace**: Services can show an approximate price; email templates preview each language.

### Fixed

- **Marketplace**: Booking emails show the organization's logo or name instead of the Laioutr logo.
- **Workspace & Access**: Logging in right after the page opens no longer fails while the security check is still loading.

## [2026-10-30]

### Added

- **Marketplace**: Customers book appointments on the website, synced with each person's own calendar.

### Fixed

- The deployments list and other tables that read from the database load again.

## [2026-10-29]

### Added

- **Marketplace**: Customers get a reminder before appointments; services and time off are set per person.
- **Marketplace**: Customers and staff receive booking emails with a calendar invitation.
- **Marketplace**: The calendar shows a week or a day of bookings, requests and busy times.
- **Marketplace**: Calendar bookings and requests are managed in the Cockpit, with settings on six tabs.
- **Marketplace**: Calendar services are managed in the Cockpit, and the calendar sits under Apps.

## [2026-10-27]

### Added

- **Workspace & Access**: Creating a project's API key now points to where organization-wide keys are made.
- Products in the project menu start folded; one opens when its pages are visited.

### Fixed

- The product group in the project menu lines up with the entries below it.

## [2026-10-24]

### Added

- **Plans & Onboarding**: Licence details name who bought a licence; the Licenses page shows its size.

### Fixed

- **Workspace & Access**: The language chosen on My account now stays when moving to other pages.

## [2026-10-23]

### Added

- **Credits**: Agents can run on Laioutr's keys or the organization's own; spend limits count both.
- Products are set up step by step, and API keys for deploying belong to one project.
- Every product and agent in the Marketplace is added or requested from its offer.
- **Credits**: Owners set a monthly AI spend limit; agents on the organization's own keys pause when it is reached.
- Notifications can be sent by email and to a Slack channel through Laioutr's bot.

### Fixed

- **Workspace & Access**: Branding offers a custom color and previews it as the Cockpit shows it.
- A product's offer shows its description and leads back to the Marketplace.
- **Workspace & Access**: Invite on the organization's Overview opens Members & Roles.
- **Plans & Onboarding**: The platform's licence pages name every feature in words.
- A product's offer in the Marketplace shows the product's own icon.
- **Workspace & Access**: Times in the Cockpit show in the reader's own time zone; My account can switch them to UTC.

## [2026-10-22]

### Added

- Every product, add-on and service in the Marketplace now carries its own icon and text.
- **Marketplace**: Find and add apps in the Marketplace, for the project and environment you choose.
- Products not built yet can be requested at the size you need; Laioutr gets back to you.
- **Workspace & Access**: People without a picture now show their llama on the dashboard and member pages too.
- **Workspace & Access**: You can upload your own picture on My account; it shows wherever the Cockpit shows you.
- Products not yet available can be requested from the Marketplace instead of bought.
- Organizations can upload their own logo for the sidebar, the switcher and member emails.
- **Workspace & Access**: My account now opens inside your organization, and roles sit as a tab under Members & Roles.

### Fixed

- **Operations Center**: In the Operation Center preview, your own entries show your picture, or your llama.
- **Workspace & Access**: The members page shows each member's picture, or their llama when they have none.
- **Plans & Onboarding**: The Licenses menu entry shows how many of your licenses are not on a project yet.

## [2026-10-21]

### Added

- Billing & Usage shows the AI spend limit beside services and the plan.
- AI Usage, the Marketplace's Apps tab and app configuration follow the new design.
- The organization pages match the new design; the partner portal opens on its own address.
- Buy products from inside a project, start on your organization, and see AI Usage set up.
- Organizations on Enterprise can store their own AI provider keys for add-on agents.

### Fixed

- **Plans & Onboarding**: Translatr and Distributr apply only through their own licence.
- AI Usage is marked Soon in the organization menu until add-on agents are available.
- **Plans & Onboarding**: Dark mode follows your organization color; members can leave one awaiting a plan.
- **Marketplace**: Removing several apps at once in Package Management no longer stops half-way.
- **Plans & Onboarding**: Assigning a license to a project now asks you to confirm it, as it cannot be moved.

## [2026-10-20]

### Added

- **Credits**: Organization Owners see their AI usage per agent and model, with an estimated cost.
- Every organization can choose its own brand color for the Cockpit and Studio.
- The Licences page shows which apps each project's licenses include and where they run.
- Edit redirects in place, see every unsaved change, and save or discard them all at once.
- **Partner Portal**: Owners choose the server emails are sent through; partners find registration at login.
- Plans can include add-ons, shown on the Licences page as included in the plan.
- The Marketplace shows which licensed apps a project has and where to get the rest.
- Every organization has a Marketplace that shows what each project has and can add.
- HubSpot fields are mapped with two dropdowns; invitation emails show only buttons.

### Fixed

- The Marketplace no longer offers purchases a partner makes for the organization.
- Studio's layer tree is readable in the dark theme, which Studio can now switch to.
- **Partner Portal**: The SMTP settings show only the fields the chosen sending server needs.

## [2026-10-19]

### Added

- Agencies and freelancers can register as Laioutr partners from a campaign link.
- **Workspace & Access**: A new account accepts the terms and the privacy policy before its registration finishes.
- The German Cockpit says "du" everywhere, with consistent terms and correct plurals.
- **Marketplace**: Apps can follow their latest version, and Package Management lists only installable apps.
- **Plans & Onboarding**: A new organization starts with one month of Laioutr for €1, then chooses a plan.

### Fixed

- **Partner Portal**: A White Label partner's logo shows again at the top of its clients' organization menu.
- German and English Cockpit texts are consistent, with correct plurals and dates.
- The Markets table shows each market's flag again, with its slug below the name.

## [2026-10-16]

### Added

- **Workspace & Access**: The audit log shows the last 30 days by outcome and filters to problems with one click.

### Fixed

- **Marketplace**: Package Management shows the name and description an app has in the catalog.
- Long names in the project sidebar end in an ellipsis, and Collections reads Content.
- **Plans & Onboarding**: Buying a larger size from a licence notice closes the notice and says what is charged.

## [2026-10-15]

### Added

- **Plans & Onboarding**: When a licence includes no more, the Cockpit offers the next size and buys it in place.
- **Plans & Onboarding**: Buy Enterprise yourself and pay services such as onboarding by invoice in Billing.

## [2026-10-14]

### Added

- The Members & Roles page shows each member's role and projects, with a new invite dialog.
- Enter your billing details and request services from Billing & Usage.
- A project's Apps page shows the apps connected to it; Browse opens the full catalogue.
- Pay by bank transfer where your plan allows it, and see each invoice before it is sent.
- **Plans & Onboarding**: License details show billing and renewal; a license can be canceled to its period end.
- Organizations have their own menu and an Overview of their projects, licenses and team.

### Fixed

- Opening an organization's Licenses or Custom roles no longer takes almost a minute.

## [2026-10-13]

### Added

- **Plans & Onboarding**: Platform admins can bill every new subscription on the 1st of the month.
- **Plans & Onboarding**: Enterprise covers every project of an organization; a package can include everything.
- **Plans & Onboarding**: Choosing a plan now shows what it includes, how it is billed and how to cancel.
- **Plans & Onboarding**: An unpaid or removed license keeps its plan 7 days, then the own domain goes offline.
- **Plans & Onboarding**: Buy licenses for the organization and assign them to projects on its Licenses page.
- **Plans & Onboarding**: Choose a Laioutr plan for a project and pay by card; it is active when you are back.
- **Plans & Onboarding**: A project without a license runs on the free Starter plan from its first day.
- **Plans & Onboarding**: A project whose license is no longer paid for sees until when it keeps its own domain.

## [2026-10-12]

### Added

- **Plans & Onboarding**: A project without a license shows when its trial ends; an own domain then needs one.
- **Marketplace**: An app's settings appear under Configuration as soon as its version is installed.
- **Marketplace**: Platform Owners can share an organization's private app with further organizations.

### Fixed

- **Partner Portal**: The partner area shows each partner type's own rates: a license discount for White Label, a license kickback for every other type, and an add-on kickback for all.
- **Workspace & Access**: Password reset and email confirmation links work again.
- **Insights & Support**: The help button in Studio opens the feedback form for the page you are editing.

## [2026-10-09]

### Added

- **Insights & Support**: The feedback board uses the whole window, and you choose which columns it shows.
- **Insights & Support**: Support can offer paid work in hours on a report, and you approve or decline it there.
- **Plans & Onboarding**: Checkout asks for your billing address and company details and adds VAT to the invoice.
- Partners see what blocks them, pay by card and keep their documents while paused.
- **Partner Portal**: Open any partner's portal from its page on the platform, joining as Owner in one click.
- **Partner Portal**: Platform Owners join an organization at once, with a reason, and can leave again.

## [2026-10-08]

### Fixed

- Re-sending an invitation now helps someone whose first link a mail filter used up.
- Invitation emails keep working when a company mail filter opens their links first.
- **Partner Portal**: The partner Earnings page shows the licence and add-on rates under your rate again.
- Opening the partners host without a partner area now says why instead of failing.

## [2026-10-07]

### Added

- Members are invited and changed with one role each, chosen from the roles you hold.
- Support sees whom a new report is for, and Ask Larry answers how-to reports.
- **Partner Portal**: Partners work on partners.laioutr.cloud, with API keys and CLI tokens for CI.

### Fixed

- Deal registration asks for the contact's first and last name separately.
- **Partner Portal**: Self-billing invoices for partners now look like Laioutr's other invoices.
- **Partner Portal**: A partner's organization is deleted only once no customer organizations are under it.
- **Workspace & Access**: Expired invitation and password reset links now say so and tell you what to do next.
- Links in mails to partners open in the partner area, so they stay signed in.
- **Partner Portal**: New customer organisations show at once; white-label sidebars show the brand.
- Pages keep one width, and dark mode reads cleanly on Package Management.

## [2026-10-06]

### Added

- **Partner Portal**: White Label partners prove their own domain by DNS and get quarterly self-billing PDFs.
- **Partner Portal**: Partners see their quarter’s kickback by organisation and product, and preview their brand.
- White Label partners see their licence pool, partner fee and invoices under Billing.
- The organization's plan and team now sit in their own row under the service offer.
- Partners register deals in their partner area and follow each through the CRM.
- **Plans & Onboarding**: The project dashboard shows its licence and bookings, and the service offer below.
- **Partner Portal**: A partner's people can go back from a customer organisation to their partner area.
- Partners see their customer organisations; a client changes or revokes partner access.

### Fixed

- Media previews keep small images at their size; selections open a floating action bar.

## [2026-10-05]

### Added

- **Plans & Onboarding**: The service offer spans the dashboard, and Laioutr can move, reword or hide it.
- **Marketplace**: The project menu is grouped by product, with unbooked add-ons offered beneath it.
- **Partner Portal**: The partner area has its own pages and look, apart from the organization's settings.
- Partners complete company details, tax status, payout account and consent in Settings.
- Partners see their tier, what it earns and the program's terms in the partner area.
- **Partner Portal**: The partner's team now lives under Settings → Team, with each member's role and status.
- Partners give their team a role in a customer, and take it back, from their Team page.
- **Partner Portal**: Partners see their partner area's menu in the sidebar of their own organization.

## [2026-10-02]

### Added

- **Marketplace**: Package Management shows when an app's settings have not reached the Cockpit yet.
- Platform pages show a loading layout instead of a blank page.
- **Marketplace**: Releasing your app with your own API key now shows its settings in your environments.
- **Plans & Onboarding**: Organizations can now choose a professional service plan from their project dashboard.
- **Marketplace**: App settings accept JSON groups, and connecting an AI client via MCP works again.
- Platform Owners set up Jira, Slack and notification addresses in one Configuration area.

### Fixed

- Fixes an error that sometimes stopped a page from loading.
- **Marketplace**: Choosing a new version of an app marked "Not recorded" in Package Management saves again.
- Professional service plans say they cover every project of the organization.
- **Plans & Onboarding**: Changing a plan from Billing works again for subscriptions that include add-ons.

## [2026-10-01]

### Added

- **Marketplace**: Installed apps' settings get a Configuration page per environment, with connection tests.
- White-label partners can send their customers' emails from their own mail server.
- **Marketplace**: Apps that declare their settings show them in a form, prefilled with stored values.
- **Marketplace**: Installing an app asks, checks compatibility, then links to its settings and to deploy.
- **Marketplace**: Installing an app asks first and says whether it fits the environment.
- Partners can set their website, terms, privacy and docs links in the partner portal.
- The Content menu entry is marked as shared by every environment, the live shop included.

### Fixed

- **Marketplace**: An app that does not fit the environment shows a greyed add button with the reason.
- **Marketplace**: Every app category on the Apps page is visible without scrolling sideways.
- Hosting is available in the menu for every organization, demo organizations included.
- **Workspace & Access**: Menu entries and pages your role cannot use are hidden or read-only.
- **Insights & Support**: An urgent report can be sent from an organization page by naming the project.
- **Partner Portal**: A white-label partner's customers reach the partner from the header's Contact button.

## [2026-09-30]

### Added

- **Marketplace**: App descriptions on the Apps page are in English when the Cockpit is.
- Grant a restricted key permission to delete media with the new media:delete scope.
- **Workspace & Access**: The member list shows each member's own roles and where they hold them.
- The "Worth knowing" count includes every note on the card, paused feeds too.
- The dashboard shows how many apps a build installs and when feeds last ran.
- **Workspace & Access**: Organization Owners can define custom roles and give them on a project or environment.
- Projects open in their live environment, with a new dashboard and Package Management.
- **Insights & Support**: Reports shows a green dot when Laioutr answers, and each report reads as a conversation.
- **Insights & Support**: Reports are a searchable, sortable list with tabs for open, waiting and closed ones.
- **Insights & Support**: Report a problem at its support level, follow answers under Reports, and reply in place.
- **Partner Portal**: Partners can send Laioutr new leads from their partner portal.

### Fixed

- **Marketplace**: Pages your role does not reach say so, and license limits are named as such.
- Custom roles open under the organization's tabs.
- **Marketplace**: A newer app version that needs another platform version is flagged on its own row.
- **Workspace & Access**: Settings tabs you cannot use are hidden; Studio access on one environment opens it.
- A white-label partner's customers see their partner on the Billing tab, not Laioutr.
- **Partner Portal**: The partner portal keeps the organization's tabs; manual feeds run from the list again.

## [2026-09-29]

### Added

- **Partner Portal**: A white-label partner uploads its own logo in the partner portal.
- **Partner Portal**: A white-label partner's customers see the partner's logo, colour and product name.
- **Marketplace**: The Apps page follows the new design and adds an app in one click; add-ons get a page.
- **Partner Portal**: Partners are listed in a grid with their owners; a partner sets its own domain.
- **Partner Portal**: Partners find a Partner portal in their agency's organization, with customers and tier.
- **Marketplace**: New apps published to the registry now appear on your project's Apps page.
- **Workspace & Access**: Pages your role does not include now say so and tell you which Owners can help.
- **Insights & Support**: Ask Laioutr for help from the feedback button when you don't know how to do something.
- **Marketplace**: App names and descriptions can be translated for each Cockpit language.
- **Marketplace**: App names and descriptions can be written per language, shown on the Apps page.
- **Insights & Support**: A project's feedback reports open as pages; the duplicate Feedback menu entry is gone.
- Platform owners can export the app catalog and import it on another platform.
- **Marketplace**: Apps are grouped into categories in the project menu and can be filtered by shop system.
- **Marketplace**: The Apps page groups apps into tabs arranged by Laioutr, and hides apps for other shops.

### Changed

- **Marketplace**: The Apps page shows categories as tabs, installable apps only, and your license for each.

### Fixed

- **Insights & Support**: Feedback reports in a project are laid out like the project's other pages.
- Platform invitation links work from Gmail and can be re-sent to an unfinished account.
- **Workspace & Access**: Content Managers can open Studio again; pages a role cannot use say so.
- Pages fit a phone screen, and license limits explain themselves.

## [2026-09-28]

### Added

- **Insights & Support**: A new Feedback page shows every report you sent, its status and Laioutr's answer.
- **Workspace & Access**: Buttons and menu entries for actions your role cannot use are no longer shown.

### Fixed

- **Marketplace**: The Apps page lists every available app again, with search and a category filter.
- Bug reports clear the sent screenshot and explain a refused image or the hourly limit.
- **Plans & Onboarding**: Adding markets and languages works again on projects without a license.
- The "Refetching…" notice no longer stacks up and covers the top of the page.

## [2026-09-27]

### Added

- **Insights & Support**: Report a bug or an idea from the bug icon in the header, and read the answer there.

## [2026-09-26]

### Added

- **Workspace & Access**: Project Managers no longer create or delete projects; Owners do.

### Fixed

- A page you have no access to now says so at once, instead of loading for a long time.
- **Workspace & Access**: Projects no longer appear twice on the dashboard for people who hold more than one role.
