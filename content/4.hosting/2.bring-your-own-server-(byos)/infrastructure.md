---
title: Infrastructure Requirements
description: To successfully host a Laioutr frontend on your own infrastructure, you'll need to provision the required components.
seo:
  title: Infrastructure Requirements | Laioutr
  description: To successfully host a Laioutr frontend on your own infrastructure, you'll need to provision the required components.
---


## Compute Resources

- **Build Environment**: A build server or CI/CD runner capable of executing Node.js build processes. The build process requires sufficient CPU and memory to compile the Nuxt-based frontend application.
- **Runtime Environment**: A server or container platform to host the built frontend application. This can be:
  - A Node.js runtime environment for server-side rendering (SSR)
  - Edge computing platforms for optimal global distribution
- **Scaling Capability**: Infrastructure that can scale horizontally to handle traffic spikes and ensure high availability.

## Storage

- **Build Artifacts**: Storage for build outputs, which can range from a few hundred megabytes to several gigabytes depending on your frontend size, dependencies and asset optimization.
- **Static Assets**: CDN or object storage for serving static assets (images, fonts, compiled CSS/JS). Optional but recommended.
- **Deployment History**: Optional storage for maintaining deployment artifacts for rollback capabilities.

## Networking

- **Public Internet Access**: Your infrastructure must be accessible from the public internet to receive webhook calls from the Laioutr Cockpit.
- **HTTPS Support**: SSL/TLS certificates for secure communication and proper content delivery.
- **DNS Configuration**: Ability to configure DNS records for your frontend domain(s).
- **Firewall Rules**: Properly configured firewall rules to allow webhook traffic from Laioutr Cockpit IP ranges.

## Geographic Distribution

For optimal performance, consider deploying to multiple regions or using edge computing platforms to reduce latency for global audiences.
