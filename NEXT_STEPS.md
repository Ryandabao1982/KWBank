# KWBank - What's Next in Development

**Last Updated**: October 21, 2025  
**Current Status**: Backend API & UI Foundation Complete  
**Next Phase**: Frontend-Backend Integration & Feature Completion

---

## Executive Summary

KWBank has successfully completed its foundational architecture with:
- ✅ Modular backend with 8 domain modules (Import, Dedupe, Naming, Audit, Auth, Queue, Worker, Keywords)
- ✅ REST API with 30+ endpoints
- ✅ Background job processing with BullMQ
- ✅ Python NLP microservice for fuzzy matching
- ✅ Modern Next.js frontend with core screens (Dashboard, Keyword Bank, Import Wizard)
- ✅ Full containerization with Docker
- ✅ CI/CD pipelines

**The next priority is to connect the frontend to the backend and complete the remaining feature set.**

---

## Priority 1: Frontend-Backend Integration (Epic 0.5)

### Overview
Connect the existing frontend UI to the backend API to make it fully functional.

### Tasks

#### 1.1 API Client Setup
- [ ] Create API client using `fetch` or `axios`
- [ ] Set up base configuration with environment variables
- [ ] Implement request/response interceptors
- [ ] Add error handling and retry logic
- [ ] Create TypeScript types from backend DTOs

**Files to Create:**
```
frontend/
├── lib/
│   ├── api/
│   │   ├── client.ts        # Base API client
│   │   ├── brands.ts        # Brand API methods
│   │   ├── products.ts      # Product API methods
│   │   ├── keywords.ts      # Keyword API methods
│   │   ├── mappings.ts      # Mapping API methods
│   │   ├── imports.ts       # Import API methods
│   │   └── types.ts         # TypeScript interfaces
│   └── hooks/
│       ├── useBrands.ts     # React hooks for brands
│       ├── useKeywords.ts   # React hooks for keywords
│       └── useImports.ts    # React hooks for imports
```

**Estimated Effort**: 3-4 days

#### 1.2 State Management Setup
- [ ] Choose state management solution (React Query, SWR, or Zustand)
- [ ] Set up global state for user, current brand, filters
- [ ] Implement optimistic updates for mutations
- [ ] Add loading and error states
- [ ] Cache management strategy

**Recommended**: React Query for server state + Zustand for UI state

**Estimated Effort**: 2-3 days

#### 1.3 Authentication Implementation
- [ ] Create login/register pages
- [ ] Implement JWT token management
- [ ] Add protected route wrapper
- [ ] Handle token refresh
- [ ] Store user session
- [ ] Add logout functionality

**Files to Create:**
```
frontend/
├── app/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── middleware.ts        # Route protection
├── lib/
│   ├── auth/
│   │   ├── context.tsx      # Auth context provider
│   │   └── hooks.ts         # useAuth hook
```

**Estimated Effort**: 3-4 days

#### 1.4 Dashboard Integration
- [ ] Replace mock data with real API calls
- [ ] Implement metrics calculation
- [ ] Add real-time statistics
- [ ] Connect recent imports list
- [ ] Connect recent campaigns list
- [ ] Make quick actions functional

**Estimated Effort**: 2 days

#### 1.5 Keyword Bank Integration
- [ ] Connect to GET /api/keywords
- [ ] Implement server-side filtering
- [ ] Add pagination
- [ ] Connect search functionality
- [ ] Implement CRUD operations (Create, Update, Delete)
- [ ] Add bulk operations
- [ ] Connect drawer to edit functionality

**Estimated Effort**: 3-4 days

#### 1.6 Import Wizard Integration
- [ ] Implement file upload to POST /api/import/upload
- [ ] Connect preview to import job status
- [ ] Show real-time import progress
- [ ] Display actual duplicates and conflicts
- [ ] Implement commit functionality
- [ ] Add error handling for failed imports

**Estimated Effort**: 3-4 days

**Total Epic 0.5 Effort**: 2.5-3 weeks

---

## Priority 2: Complete Core Features (Epics 5-7)

### Epic 5: Mapping Canvas (3.5 weeks)

Visual drag-and-drop interface for mapping keywords to ASINs.

**Screens to Build:**
- [ ] Mapping Canvas page (`/app/mappings/page.tsx`)
- [ ] Drag-and-drop keyword assignment
- [ ] ASIN-based columns or cards
- [ ] Visual grouping by ad group
- [ ] Bulk mapping operations
- [ ] Mapping validation

**Technical Considerations:**
- Use `@dnd-kit/core` for drag-and-drop
- Implement canvas state management
- Real-time validation against conflicts
- Undo/redo functionality

**Backend Integration:**
- POST /api/mappings (create mapping)
- GET /api/mappings (list mappings)
- PUT /api/mappings/:id (update mapping)
- DELETE /api/mappings/:id (delete mapping)

**Estimated Effort**: 3.5 weeks

### Epic 6: Naming Engine (2 weeks)

Pattern-based campaign and ad group name generation.

**Screens to Build:**
- [ ] Naming Rules page (`/app/naming/page.tsx`)
- [ ] Pattern editor with token picker
- [ ] Live preview with sample data
- [ ] Template library
- [ ] Rule testing interface
- [ ] Apply naming to campaigns

**Features:**
- [ ] Pattern syntax validation
- [ ] Token autocomplete
- [ ] Multiple examples in preview
- [ ] Version history of rules
- [ ] Brand-specific and global rules

**Backend Integration:**
- GET /api/naming/rules (list rules)
- POST /api/naming/rules (create rule)
- POST /api/naming/generate/campaign (generate campaign name)
- POST /api/naming/generate/adgroup (generate ad group name)

**Estimated Effort**: 2 weeks

### Epic 7: Campaign Plan (3 weeks)

Campaign planning and export functionality.

**Screens to Build:**
- [ ] Campaign Planner page (`/app/campaigns/page.tsx`)
- [ ] Campaign builder wizard
- [ ] ASIN selection interface
- [ ] Strategy picker (auto/manual/exact/phrase/broad)
- [ ] Budget and bid configuration
- [ ] Negative keyword selection
- [ ] Plan preview with item count
- [ ] Export to Amazon CSV
- [ ] Plan approval workflow

**Features:**
- [ ] Multi-step campaign creation wizard
- [ ] Visual plan summary
- [ ] Validation before export
- [ ] Plan versioning
- [ ] Export history
- [ ] Download generated CSV files

**Backend Work Needed:**
- [ ] Implement campaign plan entity
- [ ] Add plan creation endpoint
- [ ] Build Amazon CSV exporter
- [ ] Add plan approval workflow
- [ ] Store export history

**Estimated Effort**: 3 weeks

**Total Priority 2 Effort**: 8.5 weeks

---

## Priority 3: Advanced Features (Epics 8-9)

### Epic 8: Audit & History (1.5 weeks)

**Screens to Build:**
- [ ] Audit Timeline page (`/app/audit/page.tsx`)
- [ ] Filterable event list
- [ ] Entity change diff viewer
- [ ] User activity tracking
- [ ] Rollback functionality

**Features:**
- [ ] Timeline view of all changes
- [ ] Filter by entity type, user, date range
- [ ] Visual diff for changed values
- [ ] Rollback selected changes
- [ ] Export audit reports

**Backend Integration:**
- GET /api/audit/entries (list audit logs)
- GET /api/audit/:id (get specific entry)
- POST /api/audit/rollback/:id (rollback change)

**Estimated Effort**: 1.5 weeks

### Epic 9: Conflict Engine (2.5 weeks)

**Screens to Build:**
- [ ] Conflict Center page (`/app/conflicts/page.tsx`)
- [ ] Tabs for different conflict types
  - Positive/Negative keyword conflicts
  - Duplicate keywords across brands
  - Budget conflicts
  - ASIN conflicts
- [ ] Conflict resolution wizard
- [ ] Batch resolution actions
- [ ] Conflict prevention rules

**Features:**
- [ ] Real-time conflict detection
- [ ] Severity scoring
- [ ] Quick fix suggestions
- [ ] Auto-resolve options
- [ ] Conflict notification system

**Backend Integration:**
- GET /api/keywords/conflicts (get conflicts)
- GET /api/dedupe/exact (exact duplicates)
- GET /api/dedupe/fuzzy (fuzzy duplicates)
- POST /api/conflicts/resolve (resolve conflicts)

**Estimated Effort**: 2.5 weeks

**Total Priority 3 Effort**: 4 weeks

---

## Priority 4: Reporting & Analytics (Epic 11)

### Epic 11: Reporting Dashboard (2 weeks)

**Screens to Build:**
- [ ] Reports page (`/app/reports/page.tsx`)
- [ ] Keyword performance metrics
- [ ] Import statistics over time
- [ ] Campaign distribution charts
- [ ] Brand comparison views
- [ ] Deduplication impact report
- [ ] Export capabilities

**Charts Needed:**
- [ ] Keyword volume by brand (bar chart)
- [ ] Import activity over time (line chart)
- [ ] Intent distribution (pie chart)
- [ ] Match type distribution (donut chart)
- [ ] Campaign count by strategy (bar chart)
- [ ] Duplicate prevention stats (metric cards)

**Library Recommendation**: Recharts or Chart.js

**Backend Work:**
- [ ] Add analytics endpoints
- [ ] Aggregate statistics calculation
- [ ] Time-series data endpoints
- [ ] Export report data

**Estimated Effort**: 2 weeks

---

## Priority 5: Enhancement & Polish (Epic 12-13)

### Epic 12: Testing (4 weeks - parallel with development)

**Unit Tests:**
- [ ] Backend service tests (Jest)
- [ ] Frontend component tests (Jest + React Testing Library)
- [ ] API endpoint tests
- [ ] Utility function tests

**Integration Tests:**
- [ ] API integration tests with test database
- [ ] Frontend integration tests
- [ ] Import workflow tests
- [ ] Campaign generation tests

**E2E Tests:**
- [ ] Complete user workflows (Playwright or Cypress)
- [ ] Import → Dedupe → Map → Export flow
- [ ] Multi-brand management flow
- [ ] Conflict detection and resolution

**Test Coverage Goals:**
- Backend: 80%+ coverage
- Frontend: 70%+ coverage
- Critical paths: 95%+ coverage

**Estimated Effort**: 4 weeks (parallel)

### Epic 13: Performance & Optimization (2 weeks)

**Backend Optimization:**
- [ ] Add database indexes for frequent queries
- [ ] Implement Redis caching for read-heavy operations
- [ ] Optimize N+1 queries
- [ ] Add query result pagination
- [ ] Implement database connection pooling
- [ ] Add rate limiting

**Frontend Optimization:**
- [ ] Implement virtual scrolling for large lists
- [ ] Add lazy loading for routes
- [ ] Optimize bundle size
- [ ] Implement service worker for caching
- [ ] Add image optimization
- [ ] Implement code splitting

**Monitoring:**
- [ ] Add application performance monitoring (APM)
- [ ] Set up error tracking (Sentry)
- [ ] Add logging aggregation
- [ ] Create performance dashboards
- [ ] Set up alerts for critical issues

**Estimated Effort**: 2 weeks

---

## Priority 6: Production Readiness (Epic 14)

### Epic 14: Beta Launch Preparation (2 weeks)

**Deployment:**
- [ ] Production environment setup (AWS/DigitalOcean/Vercel)
- [ ] Database migration strategy
- [ ] Secrets management
- [ ] SSL/TLS configuration
- [ ] CDN setup for static assets
- [ ] Backup and disaster recovery plan

**Security:**
- [ ] Security audit
- [ ] Penetration testing
- [ ] Rate limiting implementation
- [ ] CORS configuration
- [ ] Input validation hardening
- [ ] SQL injection prevention verification
- [ ] XSS protection

**Documentation:**
- [ ] API documentation with Swagger/OpenAPI
- [ ] User guide
- [ ] Admin guide
- [ ] Deployment guide
- [ ] Troubleshooting guide
- [ ] Video tutorials

**Beta Program:**
- [ ] Beta user invitation system
- [ ] Feedback collection mechanism
- [ ] Usage analytics
- [ ] Bug reporting workflow
- [ ] Feature request tracking

**Estimated Effort**: 2 weeks

---

## Development Timeline

### Phase 1: Foundation Complete ✅ (Weeks 1-8)
- ✅ Backend modularization
- ✅ Frontend UI foundation
- ✅ Containerization & CI/CD

### Phase 2: Integration & Core Features (Weeks 9-20) 
**Next Immediate Priority**

| Week | Focus | Deliverable |
|------|-------|------------|
| 9-11 | Frontend-Backend Integration | Functional Dashboard, Bank, Import |
| 12-14 | Mapping Canvas | Visual keyword-ASIN mapping |
| 15-16 | Naming Engine | Pattern-based name generation |
| 17-19 | Campaign Planner | Full campaign export workflow |
| 20 | Integration Testing | End-to-end workflow tests |

### Phase 3: Advanced Features (Weeks 21-24)
| Week | Focus | Deliverable |
|------|-------|------------|
| 21-22 | Audit System | Timeline and rollback UI |
| 23-24 | Conflict Center | Multi-type conflict resolution |

### Phase 4: Analytics & Polish (Weeks 25-28)
| Week | Focus | Deliverable |
|------|-------|------------|
| 25-26 | Reporting Dashboard | Charts and analytics |
| 27-28 | Performance & Testing | Optimization and test coverage |

### Phase 5: Beta Launch (Weeks 29-30)
| Week | Focus | Deliverable |
|------|-------|------------|
| 29-30 | Production Deployment | Beta launch with real users |

**Total Estimated Timeline**: 30 weeks from start (22 weeks remaining)

---

## Immediate Next Steps (This Sprint)

### Week 9 Action Items:

1. **API Client Setup** (2 days)
   - Create `/frontend/lib/api/client.ts` with base configuration
   - Add environment variables for API URL
   - Implement error handling and interceptors

2. **State Management** (2 days)
   - Install React Query: `npm install @tanstack/react-query`
   - Set up QueryClientProvider in layout
   - Create custom hooks for data fetching

3. **Authentication** (3 days)
   - Build login/register pages
   - Implement JWT storage and refresh
   - Add protected route middleware

**By End of Week 9**: Users can log in and see real data on dashboard

---

## Technical Debt to Address

### High Priority:
- [ ] Replace TypeORM `synchronize: true` with proper migrations
- [ ] Add comprehensive error handling in workers
- [ ] Implement proper logging infrastructure
- [ ] Add API rate limiting
- [ ] Set up monitoring and alerting

### Medium Priority:
- [ ] Add Redis caching layer
- [ ] Optimize database queries with indexes
- [ ] Implement request validation on all endpoints
- [ ] Add API versioning strategy
- [ ] Create TypeScript client from OpenAPI spec

### Low Priority:
- [ ] Add GraphQL endpoint (optional)
- [ ] Implement WebSocket for real-time updates
- [ ] Add file storage with S3
- [ ] Implement advanced search with Elasticsearch
- [ ] Add internationalization (i18n)

---

## Dependencies & Prerequisites

### For Frontend-Backend Integration:
- Backend API running on `http://localhost:3001`
- PostgreSQL database initialized
- Redis for session/cache management
- Auth endpoints functional

### For Production Deployment:
- Cloud provider account (AWS/DigitalOcean/Vercel)
- Domain name and SSL certificate
- Environment variables configured
- Database backup strategy
- Monitoring tools set up

---

## Success Metrics

### Phase 2 (Integration):
- [ ] All frontend pages connected to backend
- [ ] User authentication working
- [ ] Import workflow functional end-to-end
- [ ] Keyword CRUD operations working
- [ ] API response time < 200ms (p95)

### Phase 3 (Advanced Features):
- [ ] Mapping canvas supports 1000+ keywords
- [ ] Campaign generation < 5 seconds
- [ ] Conflict detection runs in real-time
- [ ] Audit trail captures all changes
- [ ] All critical paths tested

### Phase 4 (Launch):
- [ ] 10 beta users onboarded
- [ ] Zero security vulnerabilities (critical/high)
- [ ] 99% uptime
- [ ] Page load time < 2 seconds
- [ ] Test coverage > 80%

---

## Team Recommendations

For optimal velocity, consider this team structure:

**Current Phase (Integration):**
- 1 Backend Engineer (API endpoints, auth)
- 2 Frontend Engineers (integration, state management)
- 1 QA Engineer (test plans, integration tests)
- 1 DevOps (deployment, monitoring)

**Later Phases (Features):**
- 2 Full-stack Engineers (feature development)
- 1 UI/UX Designer (polish, user feedback)
- 1 QA Engineer (E2E tests, beta support)

---

## Risk Management

### Technical Risks:
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|---------|-----------|
| Performance issues with large datasets | High | High | Implement pagination, indexing, caching early |
| Complex drag-and-drop bugs | Medium | Medium | Use well-tested library (@dnd-kit), add tests |
| Auth token management issues | Medium | High | Use proven patterns (httpOnly cookies) |
| API versioning challenges | Low | Medium | Plan API structure carefully upfront |

### Schedule Risks:
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|---------|-----------|
| Integration takes longer than estimated | High | Medium | Start with MVP integration, add features iteratively |
| Third-party dependencies break | Low | High | Lock dependency versions, have fallback plans |
| Testing uncovers major issues | Medium | High | Test continuously, not at end |

---

## Questions to Resolve

### Product Questions:
1. Should we support multiple workspaces/tenants now or later?
2. What's the target number of keywords per brand? (affects UI decisions)
3. Do we need real-time collaboration features?
4. Should exports be asynchronous for large campaigns?
5. What level of audit granularity is needed?

### Technical Questions:
1. Preferred hosting platform (AWS, DigitalOcean, Vercel, Railway)?
2. Do we need a staging environment?
3. What's the backup frequency requirement?
4. Should we implement API rate limiting per user or globally?
5. Need for horizontal scaling (multiple backend instances)?

---

## Resources & References

### Documentation:
- [Backend API Documentation](./backend/README.md)
- [Frontend Implementation Summary](./frontend/IMPLEMENTATION_SUMMARY.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Work Breakdown Structure](./keyword-bank/WBS.md)
- [Product Requirements](./keyword-bank/PRD.md)

### External Resources:
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeORM Migrations Guide](https://typeorm.io/migrations)
- [AWS Deployment Best Practices](https://aws.amazon.com/architecture/well-architected/)

---

## Conclusion

KWBank has a solid foundation and is ready for the next phase of development. The immediate priority is **frontend-backend integration** to make the application fully functional. Following that, completing the core features (Mapping, Naming, Campaign Planning) will provide a complete MVP ready for beta testing.

**Recommended Next Action**: Start with Week 9 action items to connect the frontend to the backend API, beginning with the API client setup and authentication implementation.

The project is well-positioned for success with clear milestones, realistic timelines, and comprehensive planning.

---

**For questions or clarifications, refer to the technical plan documents or reach out to the development team.**
