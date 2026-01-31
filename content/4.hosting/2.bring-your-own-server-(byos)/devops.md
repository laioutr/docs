---
title: DevOps Components
description: DevOps components are the components that are required to successfully host a Laioutr frontend on your own infrastructure.
---

## Caching Layer: Redis

Redis is a critical component for optimal performance of Laioutr Frontends:

- **Purpose**: Redis serves as a caching layer for:
  - API response caching
  - Session management
  - Rate limiting
- **Requirements**:
  - Redis version 6.0 or higher recommended
  - Persistent storage configuration for production environments
  - High availability setup (Redis Sentinel or Redis Cluster) for production deployments
  - Sufficient memory allocation based on your caching needs (typically 512MB to 2GB+)
- **Configuration**: Your deployment pipeline must configure Redis connection settings and ensure the Redis instance is accessible from your frontend runtime environment.

## CI/CD Pipeline

- **Webhook Endpoint**: A secure endpoint that receives deployment webhooks from the Laioutr Cockpit
- **Build Automation**: Automated build processes triggered by webhook events
- **Deployment Automation**: Automated deployment workflows to move built artifacts to your runtime environment
- **Rollback Capability**: Ability to quickly revert to previous deployments if needed

## Monitoring & Observability

- **Application Monitoring**: Tools to monitor frontend performance, error rates, and availability
- **Infrastructure Monitoring**: Server resource monitoring (CPU, memory, disk, network)
- **Log Aggregation**: Centralized logging system for build and runtime logs
- **Alerting**: Notification systems for deployment failures, performance degradation, or infrastructure issues

## Security

- **Access Control**: Proper authentication and authorization for deployment processes
- **Network Security**: Firewall rules, DDoS protection, and network isolation as needed

## Backup & Disaster Recovery

- **Disaster Recovery Plan**: Procedures for recovering from infrastructure failures
- **Data Retention**: Policies for retaining build artifacts and logs