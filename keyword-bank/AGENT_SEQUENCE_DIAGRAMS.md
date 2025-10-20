# Keyword Bank — Agent Sequence & Message Flows

This document visualizes how human and system agents interact across the main workflows.  
All diagrams use **PlantUML**. Copy-paste into any PlantUML renderer to generate images.

---

## 1) Keyword Import → Normalize → Deduplicate → Commit

```plantuml
@startuml
title Import → Normalize → Deduplicate → Commit

actor "PPC Manager" as User
participant "Web UI" as UI
participant "Backend API" as API
queue "Redis/BullMQ" as Q
database "S3" as S3
participant "Import Worker" as Worker
participant "Dedupe Engine" as Dedupe
database "PostgreSQL" as DB
participant "WebSocket" as WS

User -> UI: Upload CSV
UI -> API: POST /imports (metadata)
API -> S3: PUT file (signed URL)
API -> Q: Enqueue ImportJob{id}
API -> UI: 202 Accepted {jobId}

== Async ==
Q -> Worker: ImportJob{id}
Worker -> S3: GET file stream
Worker -> Worker: Normalize (trim, lower, punctuation)
Worker -> DB: COPY -> keywords_temp
Worker -> Dedupe: Run exact/variant/fuzzy
Dedupe -> DB: Mark duplicates/conflicts
Worker -> DB: Commit to keywords (clean set)
Worker -> WS: Publish progress + completion

== Frontend Updates ==
WS -> UI: job:progress 0..100
WS -> UI: job:complete {counts, conflicts}
UI -> User: Show summary (added, deduped, conflicts)
@enduml
```

---

## 2) Mapping Canvas (ASIN ↔ Ad Group ↔ Campaign) with Live Validation

```plantuml
@startuml
title Mapping Canvas with Live Validation

actor "PPC Manager" as User
participant "Web UI (Canvas)" as Canvas
participant "Backend API" as API
database "PostgreSQL" as DB
participant "Validation Service" as Val

User -> Canvas: Drag keyword → Ad Group
Canvas -> API: POST /mappings (keywordId, adGroupId, matchType, bid)
API -> Val: Validate (duplicate? neg conflict? limits?)
Val -> DB: Lookups (existing mappings, negatives)
Val --> API: Result {ok|errors[]}
API --> Canvas: 200 OK or 409 with error codes
Canvas -> User: Inline badge (✅ or ⚠ details)
note right of Canvas
Real-time counters update:
- Keywords/ad group
- Conflicts found
end note
@enduml
```

---

## 3) Naming Rule Engine (Generate & Apply)

```plantuml
@startuml
title Naming Rule Generation & Bulk Apply

actor "PM" as PM
participant "Web UI" as UI
participant "Backend API" as API
database "PostgreSQL" as DB
participant "Naming Engine" as NE

PM -> UI: Edit pattern {BrandPrefix}_{ASIN}_{Goal}_{MatchType}_{Date:yyyyMMdd}
UI -> API: POST /naming-rules/preview
API -> NE: Compile + Render sample set
NE --> API: Sample outputs
API --> UI: Samples for review

PM -> UI: Save rule + Apply to campaigns
UI -> API: POST /campaigns/bulk-rename {ruleId, scope}
API -> DB: UPDATE campaigns SET name=NE.generate(...)
API --> UI: Result {renamedCount, collisionsResolved}
@enduml
```

---

## 4) Plan Create → Validate → Review → Approve → Export

```plantuml
@startuml
title Plan Lifecycle: Create → Validate → Review → Approve → Export

actor "PPC Manager" as PMgr
actor "Reviewer" as Rev
participant "Web UI" as UI
participant "Backend API" as API
participant "Conflict Engine" as CE
database "PostgreSQL" as DB
participant "Exporter" as EXP
database "S3" as S3

PMgr -> UI: Create plan from mappings
UI -> API: POST /plans
API -> DB: INSERT plan + plan_items

PMgr -> UI: Validate plan
UI -> API: POST /plans/{id}/validate
API -> CE: Scan plan_items (dups/negatives/completeness)
CE -> DB: Lookup references
CE --> API: Validation report
API --> UI: Show issues/resolutions

PMgr -> UI: Submit for review
UI -> API: POST /plans/{id}/submit
API -> DB: status = PENDING_REVIEW
API -> UI: Notify reviewers

Rev -> UI: Open diff view
UI -> API: GET /plans/{id}/diff
API -> DB: Compute JSON diff vs last approved
API --> UI: Diff payload

Rev -> UI: Approve
UI -> API: POST /plans/{id}/approve
API -> DB: Snapshot (status=APPROVED)
API -> EXP: Generate Amazon CSVs (SP/SB/SBV)
EXP -> S3: PUT export files
EXP --> API: {downloadURLs}
API --> UI: Links to exports
@enduml
```

---

## 5) Nightly Conflict Scan & Reporting Refresh

```plantuml
@startuml
title Nightly Conflict Scan & Reporting Refresh

participant "Scheduler (Cron)" as Cron
participant "Conflict Engine" as CE
database "PostgreSQL" as DB
participant "Reporting Engine" as RE
participant "Notifier" as N

Cron -> CE: Run cross-brand conflict scan
CE -> DB: Read mappings, negatives, campaigns
CE -> DB: Upsert conflicts table
CE -> N: Notify owners for high-severity issues

Cron -> RE: Refresh aggregates/materialized views
RE -> DB: Build KPIs (duplicates, approvals, velocity)
RE -> N: Emit dashboard freshness ping
@enduml
```

---

## 6) Audit Logger (Event Sourcing Lite)

```plantuml
@startuml
title Audit Logger — Change Capture

participant "Backend API" as API
participant "Event Bus" as Bus
participant "Audit Logger" as Audit
database "PostgreSQL" as DB

API -> Bus: emit(entity, action, before, after, userId)
Bus -> Audit: onMessage(event)
Audit -> DB: INSERT audits(entity_type,id,user,delta,timestamp)
Audit --> Bus: ack
@enduml
```

---

## 7) Optional: NLP Dedupe Microservice (Python)

```plantuml
@startuml
title NLP Microservice in Dedupe Flow

participant "Import Worker" as Worker
participant "Python Dedupe Service" as Py
database "Redis Cache" as Cache
database "PostgreSQL" as DB

Worker -> Cache: GET normalized corpus hash, size
alt cache stale or large delta
  Worker -> DB: SELECT normalized keywords batch
  Worker -> Cache: SET corpus snapshot
end

Worker -> Py: POST /dedupe {batch, corpusRef, threshold}
Py --> Worker: {pairs: [candidateId, similarity], suggestions}
Worker -> DB: UPDATE keywords (conflict flags, variant links)
@enduml
```

---

## 8) Error & Retry Flow (Resiliency Pattern)

```plantuml
@startuml
title Error Handling & Retry in Import Pipeline

queue "Redis/BullMQ" as Q
participant "Import Worker" as Worker
database "S3" as S3
database "PostgreSQL" as DB
participant "Notifier" as N

Q -> Worker: ImportJob{id}
Worker -> S3: GET file
... network error ...
Worker --> Q: Retry (exponential backoff, max=5)
alt max retries exceeded
  Worker -> DB: INSERT imports(status=FAILED, reason)
  Worker -> N: Notify owner with error report
else success on retry
  Worker -> DB: Commit keywords
end
@enduml
```

---

## 9) Permissions Guard (Policy Check)

```plantuml
@startuml
title Policy Enforcement on Sensitive Writes

actor "User" as U
participant "Web UI" as UI
participant "Backend API" as API
participant "Policy Guard" as PG
database "PostgreSQL" as DB

U -> UI: Attempt delete campaign
UI -> API: DELETE /campaigns/{id}
API -> PG: canDelete(user, workspace, brand, entity)?
PG -> DB: Read roles + ownership
PG --> API: {allow|deny, reason}
alt allow
  API -> DB: DELETE campaigns/{id}
  API --> UI: 204 No Content
else deny
  API --> UI: 403 Forbidden (policy reason)
end
@enduml
```

---

## Notes

- Keep sequence steps tight: one intent per call.
- Emit structured error codes for UI to show precise, actionable messages.
- Prefer idempotent endpoints for async operations and retries.
