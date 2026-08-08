# GoldPay ERP - System Architecture

## Architecture Overview

The system follows a modern **Monolithic + Modular** architecture using Next.js 14 App Router, combining frontend and API routes in a single deployment while maintaining clean separation of concerns.

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
├─────────────────────────────────────────────────────────┤
│                   Next.js Application                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │              React App (Frontend)                 │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌───────────────┐   │  │
│  │  │Pages │ │Compts│ │Forms │ │State Mgmt     │   │  │
│  │  └──────┘ └──────┘ └──────┘ └───────────────┘   │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │            API Layer (Server-side)                 │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │  │
│  │  │ Auth   │ │Invntry │ │Billing │ │ Reports  │  │  │
│  │  └────────┘ └────────┘ └────────┘ └──────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Service Layer                         │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │  │
│  │  │AuthSvc │ │ProdSvc │ │InvSvc  │ │ReportSvc │  │  │
│  │  └────────┘ └────────┘ └────────┘ └──────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────┐  │
│  │           Database Layer                           │  │
│  │  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │   PostgreSQL  │  │    Redis     │              │  │
│  │  └──────────────┘  └──────────────┘              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Layer Architecture

### 1. Presentation Layer (Frontend)
- **Pages**: Next.js App Router pages with layouts
- **Components**: Reusable UI components (shadcn/ui based)
- **Forms**: React Hook Form with Zod validation
- **State**: Zustand for global state, React Query for server state
- **Styling**: Tailwind CSS with CSS variables for theming

### 2. API Layer
- Next.js Route Handlers (app/api/)
- Input validation with Zod
- Rate limiting via Redis
- JWT authentication middleware

### 3. Service Layer
- Business logic in services/
- Repository pattern for data access
- Caching strategies
- File processing (PDF, Excel, Barcode)

### 4. Data Layer
- Prisma ORM for PostgreSQL
- Redis for caching and rate limiting
- Prisma migrations for schema management

## Data Flow

```
User Request → Next.js Route Handler → Auth Middleware → Service Layer → Prisma → PostgreSQL
                                                          ↕
                                                       Redis Cache
```

## Security Architecture
- Passwords: bcryptjs (12 rounds)
- JWT: jose library for token handling
- CSRF: Next.js built-in protection
- XSS: Input sanitization + CSP headers
- Rate Limiting: Redis-based sliding window
- SQL Injection: Prisma parameterized queries

## Performance Optimizations
- Redis caching for frequent queries
- Next.js Image optimization (sharp)
- React Server Components where possible
- Lazy loading for heavy components
- Pagination for all list endpoints
- Database indexes on all foreign keys
