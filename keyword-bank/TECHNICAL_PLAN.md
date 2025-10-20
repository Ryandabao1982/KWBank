# Keyword Bank — Technical Development Plan

## 1. System Overview
Multi-tenant SaaS tool for Amazon PPC management with keyword storage, deduplication, mapping, and naming automation.

---

## 2. Architecture
**Frontend:** Next.js, TypeScript, Tailwind  
**Backend:** NestJS + PostgreSQL + Redis + BullMQ  
**Infra:** AWS ECS, S3, RDS, CloudFront  
**Optional Microservice:** Python + FastAPI for NLP deduplication

---

## 3. Core Modules
- Auth & Role Management
- Keyword Import Pipeline
- Normalization + Deduplication
- Keyword Bank CRUD
- Mapping Canvas
- Naming Rule Engine
- Campaign Plan Exporter
- Conflict Detection
- Audit System
- Reporting Dashboard

---

## 4. Data Schema
(workspaces, brands, products, keywords, keyword_variants, mappings, campaigns, naming_rules, plans, plan_items, audits)

---

## 5. Milestones
**Phase 0:** Setup + Auth  
**Phase 1:** Imports + Bank  
**Phase 2:** Mapping + Naming  
**Phase 3:** Export + Conflicts  
**Phase 4:** Reporting + Beta

---

## 6. Scalability
- Async imports  
- DB sharding by workspace  
- Read replicas  
- Caching with Redis

---

## 7. Deployment
- GitHub Actions → ECS  
- Dev/Staging/Prod environments  
- Canary deploys and rollback

---

## 8. Monitoring
- Datadog + OpenTelemetry  
- Structured JSON logs  
- Daily performance checks

---

## 9. Future Enhancements
- Amazon Ads API sync  
- AI keyword suggestions  
- Semantic clustering  
- Shared negative lists
