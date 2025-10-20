# Keyword Bank

A web-based platform to manage, deduplicate, and structure PPC keywords across multiple brands and ASINs.  
Think "Notion + Airtable for keyword management."

---

## Overview
Keyword Bank centralizes keyword operations — import, deduplication, mapping, and campaign generation — into one intuitive tool.  
It helps brands scale Amazon PPC campaigns without duplication, confusion, or wasted spend.

---

### Core Features
- Multi-brand keyword storage
- Automated deduplication and normalization
- Conflict detection (negative/positive overlap)
- ASIN → Ad Group → Campaign mapping canvas
- Auto campaign name generation
- Export-ready Amazon bulk CSVs
- Audit trail and plan approvals

---

### Tech Highlights
- **Frontend:** Next.js (React + TypeScript)
- **Backend:** NestJS + PostgreSQL + Redis
- **Infra:** AWS ECS, S3, RDS
- **Processing:** BullMQ async job pipeline
- **Optional:** Python NLP microservice (deduplication)
- **UI:** Tailwind + shadcn/ui + Framer Motion

---

### Documentation Index
- [PRD](./PRD.md)
- [Technical Development Plan](./TECHNICAL_PLAN.md)
- [Work Breakdown Structure (WBS)](./WBS.md)
- [UI/UX Plan](./UI_UX_PLAN.md)
- [Agents & Responsibilities](./agents.md)
