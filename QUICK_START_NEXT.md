# Quick Start Guide - Next Development Phase

**Goal**: Connect the frontend to the backend API and make the application fully functional.

---

## 🚀 Getting Started (Developers)

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone & Install

```bash
git clone https://github.com/Ryandabao1982/KWBank.git
cd KWBank
```

### 2. Start Backend Services

```bash
# Start PostgreSQL and Redis
cd backend
docker-compose up -d

# Install backend dependencies
npm install

# Copy environment file
cp .env.example .env

# Start backend API
npm run start:dev
```

**Backend will run on**: http://localhost:3001/api

### 3. Start Frontend

```bash
# In a new terminal
cd frontend
npm install
npm run dev
```

**Frontend will run on**: http://localhost:3000

### 4. Verify Setup

**Test Backend:**
```bash
curl http://localhost:3001/api
# Should return: {"message":"KWBank API is running"}
```

**Test Frontend:**
- Open http://localhost:3000 in browser
- You should see the Dashboard (currently with mock data)

---

## 🎯 Immediate Tasks (Week 9)

### Day 1-2: API Client Setup

**Create API client structure:**

```bash
cd frontend
mkdir -p lib/api
touch lib/api/client.ts
touch lib/api/brands.ts
touch lib/api/keywords.ts
touch lib/api/products.ts
touch lib/api/mappings.ts
touch lib/api/types.ts
```

**File: `lib/api/client.ts`**
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options?.headers,
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

**Environment file:**
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Day 2-3: State Management

**Install React Query:**
```bash
cd frontend
npm install @tanstack/react-query @tanstack/react-query-devtools
```

**Create query provider:**

```bash
mkdir -p lib/providers
touch lib/providers/query-provider.tsx
```

**File: `lib/providers/query-provider.tsx`**
```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Update layout:**
```typescript
// app/layout.tsx
import { QueryProvider } from '@/lib/providers/query-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
```

### Day 3-5: Authentication

**Install dependencies:**
```bash
npm install jose # For JWT handling
```

**Create auth structure:**
```bash
mkdir -p lib/auth
touch lib/auth/context.tsx
touch lib/auth/hooks.ts
mkdir -p app/login
touch app/login/page.tsx
```

**Create login page and integrate with backend `/api/auth/login`**

### Day 5: Connect Dashboard

**Create hooks for dashboard data:**
```bash
mkdir -p lib/hooks
touch lib/hooks/useBrands.ts
touch lib/hooks/useKeywords.ts
touch lib/hooks/useStats.ts
```

**Example hook:**
```typescript
// lib/hooks/useBrands.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { Brand } from '@/lib/api/types';

export function useBrands() {
  return useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: () => apiClient.get<Brand[]>('/brands'),
  });
}
```

**Update Dashboard to use real data:**
```typescript
// app/page.tsx
import { useBrands } from '@/lib/hooks/useBrands';

export default function Dashboard() {
  const { data: brands, isLoading, error } = useBrands();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading brands</div>;
  
  // Use real brands data...
}
```

---

## 📋 Week 9 Checklist

### API Client
- [ ] Create base API client with fetch wrapper
- [ ] Add authentication header handling
- [ ] Implement error handling
- [ ] Create environment configuration
- [ ] Add TypeScript types for API responses

### State Management
- [ ] Install React Query
- [ ] Set up QueryClientProvider
- [ ] Configure default query options
- [ ] Add React Query DevTools
- [ ] Create custom hooks for each resource

### Authentication
- [ ] Create login page
- [ ] Create register page
- [ ] Implement JWT storage (localStorage/cookies)
- [ ] Add auth context provider
- [ ] Create useAuth hook
- [ ] Add protected route middleware
- [ ] Handle token refresh

### Dashboard Integration
- [ ] Connect metrics to real API
- [ ] Replace mock brands with API data
- [ ] Connect recent imports list
- [ ] Connect recent campaigns list
- [ ] Make quick actions functional
- [ ] Add loading states
- [ ] Add error handling

### Testing
- [ ] Test API client with backend
- [ ] Verify authentication flow
- [ ] Test dashboard with real data
- [ ] Verify error handling
- [ ] Test loading states

---

## 🧪 Testing Your Changes

### Test API Connection
```bash
# From frontend directory
npm run dev

# In browser console:
fetch('http://localhost:3001/api/brands')
  .then(r => r.json())
  .then(console.log)
```

### Test Authentication
```bash
# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test with Postman/Insomnia
Import this collection to test all endpoints:
- GET http://localhost:3001/api/brands
- GET http://localhost:3001/api/keywords
- GET http://localhost:3001/api/products
- POST http://localhost:3001/api/keywords/batch

---

## 📖 Reference Documentation

### Backend API
- [Backend README](./backend/README.md)
- [Backend Quick Start](./backend/QUICKSTART.md)
- API Docs: http://localhost:3001/api/docs (when implemented)

### Frontend
- [Frontend Implementation Summary](./frontend/IMPLEMENTATION_SUMMARY.md)
- [UI/UX Plan](./keyword-bank/UI_UX_PLAN.md)

### Architecture
- [Architecture Overview](./ARCHITECTURE.md)
- [Next Steps (Detailed)](./NEXT_STEPS.md)

---

## 🎨 UI Components to Reuse

The following components are already built and ready to use:

- `Button` - Primary UI component with variants
- `Sidebar` - Navigation menu
- `TopBar` - Top navigation with search
- Card layout patterns
- Table layout patterns
- Form input patterns

---

## 🐛 Common Issues & Solutions

### Issue: CORS errors when calling API
**Solution**: 
```typescript
// backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### Issue: API calls fail with 401
**Solution**: 
- Check if JWT token is being sent in headers
- Verify token is not expired
- Ensure auth middleware is configured correctly

### Issue: TypeScript errors with API types
**Solution**:
- Generate types from backend DTOs
- Use `unknown` type and validate at runtime initially
- Add proper type definitions incrementally

### Issue: Data not refreshing after mutation
**Solution**:
```typescript
const mutation = useMutation({
  mutationFn: createKeyword,
  onSuccess: () => {
    queryClient.invalidateQueries(['keywords']);
  },
});
```

---

## 🚢 Next Steps After Week 9

Once the basic integration is complete:

1. **Week 10**: Complete Keyword Bank CRUD operations
2. **Week 11**: Complete Import Wizard integration
3. **Week 12-14**: Build Mapping Canvas
4. **Week 15-16**: Build Naming Engine
5. **Week 17-19**: Build Campaign Planner

See [NEXT_STEPS.md](./NEXT_STEPS.md) for detailed roadmap.

---

## 💡 Tips for Success

1. **Start Small**: Connect one page at a time
2. **Test Frequently**: Verify each change immediately
3. **Handle Errors**: Add error states from the beginning
4. **Loading States**: Always show loading indicators
5. **Type Safety**: Use TypeScript for API responses
6. **Console Logs**: Use React Query DevTools to debug
7. **Commit Often**: Small commits are easier to review

---

## 🙋 Getting Help

- Check backend logs: `docker-compose logs -f`
- Use React Query DevTools for debugging
- Check browser Network tab for API calls
- Review existing implementations in backend
- Refer to NestJS and Next.js documentation

---

**Ready to start? Begin with the API client setup and work through the Week 9 checklist!**
