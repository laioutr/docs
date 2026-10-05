---
title: Backups
seo:
  title: Backups
sitemap:
  loc: /offering/service-level-agreement/backups
  lastmod: 2026-10-05
  changefreq: monthly
  priority: 1.0

---

## Overview

Persistent data of Laioutr products, such as content, pages, sections, blocks, configuration and project settings managed in the Cockpit and in Studio, is stored in a managed PostgreSQL database in the EU region Frankfurt, Germany. The database is operated by Supabase (see [Subprocessors](/offering/trust-center/subprocessors)), and Laioutr backups follow the backup model of this database platform.

## Backup cycle

The database is backed up automatically every day as a physical backup. Backups are performed in accordance with common industry standards for the purposes of the data's safety, continuity and integrity.

| Data                                                         | Backup frequency | Retention |
| ------------------------------------------------------------ | ---------------- | --------- |
| Cockpit and Studio data (content, pages, configuration, projects) | Every 24 hours   | 7 days    |

Backups are retained for 7 days and deleted on day 8.

Because backups are taken once a day, a restore returns the data to the state of the most recent daily backup. Changes made after that backup are not contained in it.

## What is not part of the database backup

- **Media files:** images, videos and other files are stored in the Laioutr media storage and delivered through the CDN. The database only holds their metadata, so media files are not part of the database backup.
- **Deployments:** every frontend deployment on Laioutr Cloud is versioned and can be rolled back to a previous deployment within seconds. Deployments are therefore not restored from database backups.

## Restoration requests

If a Customer wishes to use a backup, for example to restore data, Laioutr will use commercially reasonable efforts to fulfill such requests. Depending on the data volume, a restoration can take several hours, and editing in the affected project may be paused during that time. This service is subject to any fees that might apply during the restoration process.

Customers interested in restoring data, including data from projects deleted within the backup retention period, can submit a restoration request through [Customer Support](/offering/customer-support/standard-customer-support) in the Cockpit Inbox.

The backup processes of Laioutr comply with common industry standards and with the obligations under the GDPR and other applicable privacy regulations.
