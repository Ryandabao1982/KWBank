# Keyword Bank — Agent Events Reference

Canonical event names so services stay consistent.

---

## Import Lifecycle

- `import.created` — payload: `{importId, brandId, filename, userId}`
- `import.progress` — `{importId, percent, counts}`
- `import.completed` — `{importId, added, deduped, conflicts}`
- `import.failed` — `{importId, errorCode, message}`

---

## Deduplication & Conflicts

- `dedupe.completed` — `{importId, dupesFound, variantsLinked}`
- `conflict.scan.completed` — `{scope, conflicts}`
- `conflict.high_severity` — `{entityId, type, details}`

---

## Plans & Approvals

- `plan.created` — `{planId, brandId, createdBy}`
- `plan.validated` — `{planId, issues}`
- `plan.submitted` — `{planId, reviewers[]}`
- `plan.approved` — `{planId, approverId}`
- `plan.exported` — `{planId, urls[]}`

---

## Naming Rules

- `naming.previewed` — `{ruleId, samples}`
- `naming.applied` — `{ruleId, count}`

---

## Audit

- `audit.logged` — `{entityType, entityId, diff, userId}`

---

## Reporting

- `reporting.refresh.completed` — `{timestamp, kpis}`
