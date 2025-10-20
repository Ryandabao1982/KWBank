# Keyword Bank — UI/UX Plan

## 1. Design Philosophy
Fast, fluid, and spreadsheet-friendly.  
Inspired by Notion, Airtable, and Figma — optimized for speed and structure.

---

## 2. Layout
**Top Bar:** Brand switcher, breadcrumbs, user avatar  
**Sidebar:** Dashboard, Bank, Imports, Mappings, Campaigns, Reports, Settings  
**Main Area:** Dynamic workspace (list or canvas)  
**Right Drawer:** Contextual detail (keyword, campaign)

---

## 3. Key Screens
### A. Keyword Intake
1. Upload CSV  
2. Preview + Clean  
3. Commit to Bank  

Highlights duplicates, variants, conflicts visually.

### B. Keyword Bank
Interactive grid view:
- Columns: Keyword, Match Type, Intent, Tags, ASINs, Status  
- Inline editing  
- Right drawer for detail and history

### C. Mapping Canvas
Drag-drop ASINs → Ad Groups → Campaigns  
Visual flow with validation on drop.  
Zoom + auto-layout options.

### D. Naming Rule Editor
Pattern field + live preview  
Insert tokens, transforms (Upper, Lower, Kebab).  
Validates syntax.

### E. Campaign Planner
List + diff view  
Reviewer comments and approvals  
Exports Amazon SP/SB/SBV files

### F. Conflict Center
Tabs for Duplicates / Variants / Negatives  
Bulk resolution UI.

### G. Audit Timeline
Chronological edits, filters by entity type.

### H. Reporting Dashboard
Charts: active keywords, duplicates prevented, plan velocity.

---

## 4. Design System
- Tailwind + shadcn/ui components  
- Primary: Indigo  
- Secondary: Slate  
- Semantic: Emerald (success), Amber (warn), Red (error)
- Inter / IBM Plex Sans fonts  

---

## 5. Interaction Design
- Inline edits  
- Keyboard shortcuts (⌘+K search, ⌘+E edit, ⌘+Shift+M mapping)  
- Real-time save feedback  
- Undo (⌘+Z)  
- Tooltips for acronyms  
- Toast notifications for job progress  
- Dark mode support  

---

## 6. Accessibility
- WCAG AA contrast  
- ARIA roles  
- Keyboard navigable grids  

---

## 7. UX Success Metrics
- <15 min import-to-approval  
- 0 duplicate conflicts  
- >80% inline actions  
- <2s latency for grid ops  
- User CSAT >8/10  

---

## 8. Future Enhancements
- AI assistant sidebar  
- Team cursors for collaboration  
- Workflow templates per brand  
- Command palette for power users
