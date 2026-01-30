---
title: Introduction
description: The Bring Your Own Server (BYOS) approach allows you to host and deploy Laioutr frontends on your own infrastructure while maintaining full integration with the Laioutr Cockpit for frontend management. This gives you complete control over your deployment pipeline, runtime environment, and operational processes, while still leveraging Laioutr as the central management layer for your frontend configuration and content.
---

## Overview

When using BYOS, you maintain full ownership of your hosting infrastructure, build processes, and deployment workflows. The Laioutr Cockpit communicates with your infrastructure through webhooks, enabling seamless integration between frontend management in Laioutr and your custom deployment pipeline.

This approach is ideal for organizations that:
* Have existing DevOps standards and infrastructure requirements
* Need to comply with specific security or compliance regulations
* Want to integrate with internal tooling and monitoring systems
* Require custom scaling strategies or geographic distribution
* Need to maintain full control over runtime configuration

## Infrastructure Requirements

To successfully host a Laioutr frontend on your own infrastructure, you'll need to provision the following components:

### Compute Resources

- **Build Environment**: A build server or CI/CD runner capable of executing Node.js build processes. The build process requires sufficient CPU and memory to compile the Nuxt-based frontend application.
- **Runtime Environment**: A server or container platform to host the built frontend application. This can be:
  - A Node.js runtime environment for server-side rendering (SSR)
  - A static file server for static site generation (SSG) deployments
  - Edge computing platforms for optimal global distribution
- **Scaling Capability**: Infrastructure that can scale horizontally to handle traffic spikes and ensure high availability.

### Storage

- **Build Artifacts**: Storage for build outputs, which can range from a few hundred megabytes to several gigabytes depending on your frontend size and asset optimization.
- **Static Assets**: CDN or object storage for serving static assets (images, fonts, compiled CSS/JS) with global distribution capabilities.
- **Deployment History**: Optional storage for maintaining deployment artifacts for rollback capabilities.

### Networking

- **Public Internet Access**: Your infrastructure must be accessible from the public internet to receive webhook calls from the Laioutr Cockpit.
- **HTTPS Support**: SSL/TLS certificates for secure communication and proper content delivery.
- **DNS Configuration**: Ability to configure DNS records for your frontend domain(s).
- **Firewall Rules**: Properly configured firewall rules to allow webhook traffic from Laioutr Cockpit IP ranges.

### Geographic Distribution

For optimal performance, consider deploying to multiple regions or using edge computing platforms to reduce latency for global audiences.

## Software Requirements

### Runtime Environment

- **Node.js**: Version 22.12 or higher is required for building and running Laioutr frontends. Ensure your build and runtime environments use compatible Node.js versions.
- **Package Manager**: pnpm is the recommended package manager for Laioutr projects, though npm and yarn are also supported.

### Build Tools

- **Build System**: Your infrastructure must support executing Node.js build scripts, typically via `pnpm build` or `npm run build`.
- **Environment Variables**: Capability to securely manage and inject environment variables during the build process, including:
  - Laioutr project configuration
  - API endpoints and authentication tokens
  - Feature flags and environment-specific settings

### Web Server / Runtime

Depending on your deployment strategy:

- **Static Hosting**: A web server capable of serving static files (Nginx, Apache, or cloud storage with CDN)
- **SSR Hosting**: A Node.js runtime capable of running Nuxt in SSR mode, with proper process management (PM2, systemd, or container orchestration)
- **Edge Runtime**: Support for edge computing runtimes if deploying to edge platforms

## DevOps Components

### Caching Layer: Redis

Redis is a critical component for optimal performance of Laioutr Frontends:

- **Purpose**: Redis serves as a caching layer for:
  - API response caching
  - Session management
  - Rate limiting
  - Temporary data storage for build processes
- **Requirements**:
  - Redis version 6.0 or higher recommended
  - Persistent storage configuration for production environments
  - High availability setup (Redis Sentinel or Redis Cluster) for production deployments
  - Sufficient memory allocation based on your caching needs (typically 512MB to 2GB+)
- **Configuration**: Your deployment pipeline must configure Redis connection settings and ensure the Redis instance is accessible from your frontend runtime environment.

### CI/CD Pipeline

- **Webhook Endpoint**: A secure endpoint that receives deployment webhooks from the Laioutr Cockpit
- **Build Automation**: Automated build processes triggered by webhook events
- **Deployment Automation**: Automated deployment workflows to move built artifacts to your runtime environment
- **Rollback Capability**: Ability to quickly revert to previous deployments if needed

### Monitoring & Observability

- **Application Monitoring**: Tools to monitor frontend performance, error rates, and availability
- **Infrastructure Monitoring**: Server resource monitoring (CPU, memory, disk, network)
- **Log Aggregation**: Centralized logging system for build and runtime logs
- **Alerting**: Notification systems for deployment failures, performance degradation, or infrastructure issues

### Security

- **Secrets Management**: Secure storage and injection of API keys, tokens, and sensitive configuration
- **Access Control**: Proper authentication and authorization for deployment processes
- **Vulnerability Scanning**: Regular scanning of dependencies and container images
- **Network Security**: Firewall rules, DDoS protection, and network isolation as needed

### Backup & Disaster Recovery

- **Configuration Backups**: Regular backups of deployment configurations and environment settings
- **Disaster Recovery Plan**: Procedures for recovering from infrastructure failures
- **Data Retention**: Policies for retaining build artifacts and logs

## Integration with Laioutr Cockpit

The BYOS approach integrates with the Laioutr Cockpit through webhooks. When you configure a webhook endpoint in your Laioutr project settings, the Cockpit will send deployment-related events to your infrastructure, allowing you to:

- Trigger builds automatically when frontend configurations change
- Receive deployment status updates
- Handle deployment promotions and rollbacks
- Monitor deployment progress and logs

See the [Webhook Configuration](/hosting/bring-your-own-server-(byos)/webhook-config) documentation for detailed information on setting up and handling webhook events.
