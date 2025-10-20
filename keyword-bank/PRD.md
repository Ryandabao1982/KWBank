# Keyword Bank — Product Requirements Document (PRD)

## tl;dr
A multi-brand Amazon PPC management web app that stores, deduplicates, maps, and exports keyword data.  
It standardizes campaign naming, prevents keyword collisions, and automates campaign creation.

---

## Problem Statement
PPC managers handle thousands of keywords across brands and ASINs.  
Spreadsheets and manual uploads cause duplication, negative conflicts, and inconsistent naming.  
The Keyword Bank fixes this by enforcing structure and intelligence into the workflow.

---

## Goals
### Business
- Cut campaign launch time by 50%
- Reduce keyword duplication by 90%
- Prevent all negative/positive keyword conflicts
- Improve ACOS/ROAS through better structure

### User
- Store and search keywords efficiently
- Map keywords to ASINs and campaigns
- Auto-generate names from brand rules
- Track keyword history and conflicts

### Non-Goals
- Bid automation
- Non-Amazon ad platforms
- Full analytics suite (MVP focus: structure)

---

## User Stories
1. Import keywords and auto-clean duplicates
2. Map keywords to ASINs visually
3. Generate campaign names with rules
4. Export Amazon-ready bulk files
5. Review and approve campaign plans

---

## Experience Flow
1. **Upload** keywords (CSV)  
2. **Preview & Clean** duplicates  
3. **Approve** cleaned list  
4. **Map** to ASINs/ad groups  
5. **Generate** campaign names  
6. **Validate** & **Export**  
7. **Review** & **Approve plan**

---

## Success Metrics
- Time from import → approval  
- % duplicate reduction  
- Conflict prevention rate  
- Plan consistency  
- Launch velocity (plans/week)

---

## Technical Considerations
- React + TypeScript frontend
- Node/NestJS backend with PostgreSQL
- Redis for caching and queues
- Workers for imports, dedupe, exports
- AWS S3 for file storage
- OpenTelemetry monitoring
