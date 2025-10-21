# Week 9 Development Checklist

**Sprint Goal**: Connect frontend to backend API and implement authentication

**Duration**: 5 working days  
**Team**: 2 Frontend Engineers + 1 Backend Engineer

---

## 🎯 Daily Goals

### Day 1: API Client Foundation

**Morning (4 hours)**
- [ ] Create `frontend/lib/api/client.ts` base API client
- [ ] Add environment variable configuration
- [ ] Implement GET, POST, PUT, DELETE methods
- [ ] Add error handling and logging

**Afternoon (4 hours)**
- [ ] Create `frontend/lib/api/types.ts` with TypeScript interfaces
- [ ] Create `frontend/lib/api/brands.ts` endpoint functions
- [ ] Create `frontend/lib/api/keywords.ts` endpoint functions
- [ ] Test API client with backend using browser console

**Deliverable**: Working API client that can call backend endpoints

---

### Day 2: State Management Setup

**Morning (4 hours)**
- [ ] Install React Query: `npm install @tanstack/react-query`
- [ ] Install DevTools: `npm install @tanstack/react-query-devtools`
- [ ] Create `frontend/lib/providers/query-provider.tsx`
- [ ] Wrap app with QueryClientProvider in `app/layout.tsx`
- [ ] Configure React Query DevTools

**Afternoon (4 hours)**
- [ ] Create `frontend/lib/hooks/useBrands.ts`
- [ ] Create `frontend/lib/hooks/useKeywords.ts`
- [ ] Create `frontend/lib/hooks/useProducts.ts`
- [ ] Test hooks in browser DevTools
- [ ] Verify data fetching and caching works

**Deliverable**: State management infrastructure with custom hooks

---

### Day 3: Authentication Implementation

**Morning (4 hours)**
- [ ] Install JWT library: `npm install jose`
- [ ] Create `frontend/lib/auth/context.tsx` auth context
- [ ] Create `frontend/lib/auth/hooks.ts` with useAuth hook
- [ ] Implement token storage (localStorage or httpOnly cookies)
- [ ] Add token to API client headers

**Afternoon (4 hours)**
- [ ] Create `frontend/app/login/page.tsx` login page
- [ ] Create `frontend/app/register/page.tsx` register page
- [ ] Implement login form with validation
- [ ] Implement register form with validation
- [ ] Test auth flow: register → login → token storage

**Deliverable**: Working authentication with login/register pages

---

### Day 4: Dashboard Integration

**Morning (4 hours)**
- [ ] Update Dashboard to use `useBrands()` hook
- [ ] Update Dashboard to use `useKeywords()` hook for stats
- [ ] Replace mock metrics with real API data
- [ ] Add loading states with skeleton loaders
- [ ] Add error states with retry buttons

**Afternoon (4 hours)**
- [ ] Connect Recent Imports list to API
- [ ] Connect Recent Campaigns list to API
- [ ] Make Quick Action buttons functional
- [ ] Test Dashboard with different data scenarios
- [ ] Verify all loading and error states work

**Deliverable**: Fully functional Dashboard with live data

---

### Day 5: Keyword Bank Integration

**Morning (4 hours)**
- [ ] Update Keyword Bank to fetch data from API
- [ ] Implement search functionality with debouncing
- [ ] Add server-side filtering
- [ ] Implement pagination
- [ ] Add loading states for table

**Afternoon (4 hours)**
- [ ] Connect drawer to real keyword data
- [ ] Implement edit keyword mutation
- [ ] Implement delete keyword mutation
- [ ] Add success/error notifications
- [ ] Test full CRUD workflow
- [ ] Document any issues or blockers

**Deliverable**: Keyword Bank with working CRUD operations

---

## 📋 Detailed Task Breakdown

### API Client Tasks

**File: `frontend/lib/api/client.ts`**
```typescript
// TODO: Implement base API client class
// TODO: Add authentication header handling
// TODO: Add error handling with custom Error classes
// TODO: Add request/response logging in dev mode
// TODO: Add retry logic for failed requests
```

**File: `frontend/lib/api/types.ts`**
```typescript
// TODO: Define Brand interface
// TODO: Define Product interface
// TODO: Define Keyword interface
// TODO: Define Mapping interface
// TODO: Define API response types
// TODO: Define error response types
```

**File: `frontend/lib/api/brands.ts`**
```typescript
// TODO: getBrands() - GET /api/brands
// TODO: getBrand(id) - GET /api/brands/:id
// TODO: createBrand(data) - POST /api/brands
// TODO: updateBrand(id, data) - PUT /api/brands/:id
// TODO: deleteBrand(id) - DELETE /api/brands/:id
```

### State Management Tasks

**File: `frontend/lib/providers/query-provider.tsx`**
```typescript
// TODO: Create QueryClient with default options
// TODO: Add QueryClientProvider wrapper
// TODO: Configure staleTime and cacheTime
// TODO: Add ReactQueryDevtools component
// TODO: Add error boundary for query errors
```

**File: `frontend/lib/hooks/useBrands.ts`**
```typescript
// TODO: Implement useBrands() for listing
// TODO: Implement useBrand(id) for single brand
// TODO: Implement useCreateBrand() mutation
// TODO: Implement useUpdateBrand() mutation
// TODO: Implement useDeleteBrand() mutation
```

**File: `frontend/lib/hooks/useKeywords.ts`**
```typescript
// TODO: Implement useKeywords(filters) for listing
// TODO: Implement useKeyword(id) for single keyword
// TODO: Implement useCreateKeyword() mutation
// TODO: Implement useUpdateKeyword() mutation
// TODO: Implement useDeleteKeyword() mutation
// TODO: Implement useKeywordStats() for statistics
```

### Authentication Tasks

**File: `frontend/lib/auth/context.tsx`**
```typescript
// TODO: Create AuthContext
// TODO: Implement AuthProvider component
// TODO: Add user state management
// TODO: Add token state management
// TODO: Implement login function
// TODO: Implement logout function
// TODO: Implement register function
// TODO: Add token refresh logic
```

**File: `frontend/app/login/page.tsx`**
```typescript
// TODO: Create login form with email/password
// TODO: Add form validation
// TODO: Connect to useAuth hook
// TODO: Handle login success (redirect to dashboard)
// TODO: Handle login errors (show error message)
// TODO: Add "Remember me" checkbox
// TODO: Add "Forgot password" link
```

### Dashboard Integration Tasks

**File: `frontend/app/page.tsx`**
```typescript
// TODO: Replace mock brands with useBrands()
// TODO: Replace mock stats with useKeywordStats()
// TODO: Fetch recent imports from API
// TODO: Fetch recent campaigns from API
// TODO: Add loading skeleton for all sections
// TODO: Add error states with retry
// TODO: Add empty states when no data
```

### Keyword Bank Integration Tasks

**File: `frontend/app/bank/page.tsx`**
```typescript
// TODO: Fetch keywords with useKeywords()
// TODO: Add search input with debounce
// TODO: Implement filter state management
// TODO: Add pagination controls
// TODO: Connect drawer to useKeyword(id)
// TODO: Implement edit with useUpdateKeyword()
// TODO: Implement delete with useDeleteKeyword()
// TODO: Add optimistic updates
// TODO: Add toast notifications
```

---

## 🧪 Testing Checklist

### API Client Tests
- [ ] Test successful GET request
- [ ] Test successful POST request
- [ ] Test error handling (404, 500)
- [ ] Test authentication header injection
- [ ] Test request timeout
- [ ] Test concurrent requests

### Authentication Tests
- [ ] Test successful registration
- [ ] Test registration with existing email
- [ ] Test successful login
- [ ] Test login with wrong password
- [ ] Test token storage
- [ ] Test token refresh
- [ ] Test logout
- [ ] Test protected route access

### Dashboard Tests
- [ ] Test dashboard loads with data
- [ ] Test loading states appear
- [ ] Test error states appear when API fails
- [ ] Test empty states when no data
- [ ] Test metrics calculation
- [ ] Test brand switcher

### Keyword Bank Tests
- [ ] Test keyword list loads
- [ ] Test search functionality
- [ ] Test filtering by brand
- [ ] Test filtering by type/match type
- [ ] Test pagination
- [ ] Test edit keyword
- [ ] Test delete keyword
- [ ] Test drawer open/close

---

## 🐛 Bug Tracking

### Known Issues
| Issue | Severity | Status | Assigned To | Notes |
|-------|----------|--------|-------------|-------|
| CORS errors in development | High | 🔄 In Progress | Backend | Need to configure CORS in NestJS |
| - | - | - | - | - |

### Blockers
| Blocker | Impact | Resolution | ETA |
|---------|--------|-----------|-----|
| - | - | - | - |

---

## 📊 Progress Tracking

### Overall Progress: 0% Complete

- [ ] **Day 1 - API Client**: 0/2 tasks
- [ ] **Day 2 - State Management**: 0/2 tasks
- [ ] **Day 3 - Authentication**: 0/2 tasks
- [ ] **Day 4 - Dashboard**: 0/2 tasks
- [ ] **Day 5 - Keyword Bank**: 0/2 tasks

### Story Points Completed: 0/13

---

## 🚨 Daily Standup Notes

### Monday (Day 1)
**What we did**:
- 

**What we're doing today**:
- Creating API client and base infrastructure

**Blockers**:
- None

---

### Tuesday (Day 2)
**What we did**:
- 

**What we're doing today**:
- Setting up React Query and state management

**Blockers**:
- 

---

### Wednesday (Day 3)
**What we did**:
- 

**What we're doing today**:
- Implementing authentication flow

**Blockers**:
- 

---

### Thursday (Day 4)
**What we did**:
- 

**What we're doing today**:
- Connecting Dashboard to backend

**Blockers**:
- 

---

### Friday (Day 5)
**What we did**:
- 

**What we're doing today**:
- Connecting Keyword Bank with CRUD

**Blockers**:
- 

---

## 📝 End of Sprint Retrospective

### What Went Well
- 

### What Could Be Improved
- 

### Action Items for Next Sprint
- [ ] 
- [ ] 
- [ ] 

---

## 📚 Reference Links

- [Backend API Docs](../backend/README.md)
- [React Query Docs](https://tanstack.com/query/latest)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🎓 Learning Resources

### For API Integration
- [Fetching Data in React](https://react.dev/learn/synchronizing-with-effects)
- [React Query Tutorial](https://tkdodo.eu/blog/practical-react-query)
- [Error Handling Best Practices](https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react)

### For Authentication
- [JWT Authentication Guide](https://jwt.io/introduction)
- [Secure JWT Storage](https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/)
- [Next.js Authentication](https://nextjs.org/docs/authentication)

---

## ✅ Definition of Done

A task is considered "Done" when:
- [ ] Code is written and tested locally
- [ ] Code is committed with clear commit message
- [ ] Code is pushed to feature branch
- [ ] No console errors or warnings
- [ ] Loading states are implemented
- [ ] Error states are handled
- [ ] Code is reviewed by peer
- [ ] Tests are passing (if applicable)

---

**Remember**: 
- Commit frequently with clear messages
- Push to remote at least once per day
- Ask for help when blocked
- Update this checklist as you go
- Celebrate small wins! 🎉
