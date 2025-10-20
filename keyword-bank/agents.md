# Keyword Bank — Agents & Responsibilities

## Purpose
This document defines every **agent** (human or system) that interacts with the Keyword Bank platform.  
Agents represent roles, automations, or external systems that perform discrete actions inside the product ecosystem.

Each agent has:
- **Role:** What it's responsible for
- **Actions:** What it can perform
- **Triggers:** When it acts
- **Data Access:** What it can see or modify
- **Dependencies:** Systems or agents it relies on

---

## 1. Human Agents

### 🧍 Product Manager (PM)
**Role:** Oversees feature definition, rollout sequencing, and approval flows.  
**Actions:**
- Creates brands/workspaces
- Defines naming conventions and approval rules
- Monitors plan statuses and reports
- Reviews plan diffs and approvals
**Triggers:**
- New campaign cycle
- Brand onboarding
**Data Access:** Full (workspace-level)
**Dependencies:** Backend API, Reporting module

---

### 👩‍💻 PPC Manager / Operator
**Role:** Primary user; manages keyword ingestion, cleaning, and mapping.  
**Actions:**
- Imports keyword lists
- Reviews deduplication results
- Maps keywords to ASINs/ad groups
- Generates and exports campaign plans
**Triggers:**
- New ASIN launch or product category expansion
**Data Access:** Brand-level
**Dependencies:** Import worker, Deduplication engine, Mapping UI

---

### 👨‍💼 Reviewer / Approver
**Role:** Validates campaign plans before launch.  
**Actions:**
- Reviews proposed plan diffs
- Adds comments or rejections
- Approves final campaign export
**Triggers:** Plan status = "Pending Review"
**Data Access:** Read/Write access to plans, read-only for keywords
**Dependencies:** Campaign Plan module, Notification system

---

### 🧑‍💻 Developer / Engineer
**Role:** Builds and maintains the system.  
**Actions:**
- Develops backend & frontend modules
- Writes tests and deployment scripts
- Monitors system performance and logs
**Triggers:** Deployment cycles or bug reports
**Data Access:** Full (admin)
**Dependencies:** CI/CD, AWS infra, Monitoring services

---

## 2. System Agents

### 🤖 Import Worker (Async)
**Role:** Handles all keyword ingestion and cleaning asynchronously.  
**Actions:**
- Pulls uploaded files from S3
- Streams data into Postgres
- Normalizes text (lowercase, trim, remove punctuation)
- Runs deduplication + fuzzy matching
- Sends progress updates via WebSocket
**Triggers:** New import job in Redis queue
**Data Access:** Temporary read/write on `keywords_temp`, then commit to `keywords`
**Dependencies:** BullMQ queue, S3, Normalization library

---

### ⚙️ Deduplication Engine
**Role:** Detects and resolves duplicate or conflicting keywords.  
**Actions:**
- Performs normalization + stemming
- Compares terms with fuzzy string match
- Flags potential duplicates or negatives
- Writes conflict records for review
**Triggers:** Import completion or "Recheck Conflicts" command
**Data Access:** `keywords`, `mappings`, `negatives`
**Dependencies:** Redis cache, Python NLP service (optional)

---

### 🔄 Conflict Detection Engine
**Role:** Continuously monitors for negative/positive keyword conflicts.  
**Actions:**
- Scans mappings and campaign structures
- Detects cross-campaign overlaps
- Suggests auto-resolutions
**Triggers:** Plan approval or scheduled nightly scan
**Data Access:** `mappings`, `campaigns`, `negatives`
**Dependencies:** Deduplication Engine, Notification Service

---

### 🧮 Naming Rule Engine
**Role:** Enforces and generates campaign naming consistency.  
**Actions:**
- Parses brand naming patterns
- Validates against forbidden tokens
- Outputs campaign names
**Triggers:** Campaign creation or "Generate Names" command
**Data Access:** `naming_rules`, `campaigns`
**Dependencies:** None (standalone micro-module)

---

### 🗂️ Campaign Exporter
**Role:** Converts structured data into Amazon bulk upload files.  
**Actions:**
- Compiles keywords/ad groups/campaigns
- Maps to Amazon bulk CSV format
- Generates downloadable CSV or JSON
**Triggers:** Plan approval
**Data Access:** `plans`, `plan_items`, `mappings`
**Dependencies:** S3 (for exports), Approval workflow

---

### 🧾 Audit Logger
**Role:** Captures all entity changes and user actions.  
**Actions:**
- Listens to backend events (create/update/delete)
- Writes audit records to `audits`
- Provides diff snapshots for UI
**Triggers:** Any write operation
**Data Access:** All entities (read-only listener)
**Dependencies:** Backend event bus

---

### 📊 Reporting Engine
**Role:** Aggregates and visualizes operational data.  
**Actions:**
- Builds daily metrics (duplicates, approvals, conflicts)
- Refreshes materialized views
- Serves data to dashboard UI
**Triggers:** Scheduled job (daily at 2 AM)
**Data Access:** All read-only summary tables
**Dependencies:** Postgres, Redis cache

---

## 3. Optional / Future Agents

### 🧠 AI Keyword Assistant (Planned)
**Role:** Suggests new keyword variants and clusters.  
**Actions:**
- Analyzes existing keyword corpus
- Suggests expansion terms
- Flags low-performing variants
**Triggers:** Manual request ("Suggest keywords")
**Data Access:** Keywords, Performance metrics
**Dependencies:** OpenAI API or in-house model

---

### 🔗 Amazon Ads API Agent
**Role:** Syncs live campaign data from Amazon Advertising API.  
**Actions:**
- Pulls performance metrics
- Updates keyword spend and impressions
- Validates structural consistency
**Triggers:** Scheduled nightly sync
**Data Access:** External Amazon API + internal campaign tables
**Dependencies:** OAuth tokens, Reporting engine

---

## 4. Interaction Diagram (Textual)

```
[User Upload]
      ↓
[Import Worker] → [Deduplication Engine] → [Keyword Bank DB]
      ↓                     ↓
[Conflict Engine] ← [Mappings + Naming Engine] → [Campaign Plan Exporter]
      ↓                                                    ↓
[Reviewer Approves] → [Audit Logger] → [Reporting Engine]
```

---

## 5. Permissions Matrix

| Agent | Read | Write | Approve | Admin | Notes |
|--------|------|--------|----------|--------|-------|
| PM | ✅ | ✅ | ✅ | ✅ | Workspace-level control |
| PPC Manager | ✅ | ✅ | ❌ | ❌ | Operates per brand |
| Reviewer | ✅ | ❌ | ✅ | ❌ | Approval-only access |
| Import Worker | ✅ | ✅ | ❌ | ❌ | Writes to temp tables only |
| Deduplication Engine | ✅ | ✅ | ❌ | ❌ | Runs automatically |
| Conflict Engine | ✅ | ✅ | ❌ | ❌ | Async scanner |
| Naming Engine | ✅ | ✅ | ❌ | ❌ | Stateless generator |
| Campaign Exporter | ✅ | ✅ | ✅ | ❌ | Triggered post-approval |
| Audit Logger | ✅ | ✅ | ❌ | ❌ | Listener only |
| Reporting Engine | ✅ | ❌ | ❌ | ❌ | Read-only aggregates |

---

## 6. Agent Event Lifecycle

| Event | Trigger | Agent | Result |
|--------|----------|--------|--------|
| File uploaded | User action | Import Worker | Creates import job |
| Import complete | Worker finished | Deduplication Engine | Clean + dedupe |
| Dedupe complete | Auto | Conflict Engine | Conflict analysis |
| Plan created | User action | Naming Rule Engine | Generates names |
| Plan approved | Reviewer | Campaign Exporter | Bulk CSV export |
| Change detected | Any | Audit Logger | Writes audit entry |
| Daily schedule | Cron | Reporting Engine | Updates metrics |

---

## 7. Monitoring Responsibilities

- **Import Worker:** Job metrics (success/fail, processing time)
- **Deduplication Engine:** Duplicate % over time
- **Conflict Engine:** # conflicts auto-resolved
- **Exporter:** Export success rate
- **Audit Logger:** Event volume per day
- **Reporting Engine:** Dashboard freshness timestamp

---

## 8. Notes
Each agent should be implemented as a separate service or module with a well-defined API surface and independent error handling.  
The system should allow partial degradation (e.g., conflict engine can fail without blocking imports).

---

## 9. Future Evolution
- Agents can move toward an **event-driven microservice** model using Kafka or NATS.
- Introduce an **Agent Registry** API endpoint to manage health, version, and logs.
- Add a **policy-based permissions layer** for fine-grained control of automation agents.
