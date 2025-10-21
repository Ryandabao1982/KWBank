# KWBank Architecture

## System Overview

KWBank provides two interfaces: a Python CLI for local usage and a modern web application with a modular backend architecture.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Frontend (Next.js)                             │
│                       http://localhost:3000                             │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ REST API
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Backend API (NestJS)                               │
│                    http://localhost:3001/api                            │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Import   │  │ Dedupe   │  │ Naming   │  │  Audit   │  │  Auth   │ │
│  │ Module   │  │ Module   │  │ Module   │  │  Module  │  │ Module  │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Keywords │  │ Brands   │  │ Products │  │ Mappings │              │
│  │ Module   │  │ Module   │  │ Module   │  │  Module  │              │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │
│                                                                         │
│  ┌──────────────────────────────────────────────────────┐             │
│  │              Queue Module (BullMQ)                   │             │
│  │   - Import Queue    - Export Queue                   │             │
│  └──────────────────────────────────────────────────────┘             │
└────────┬──────────────────────────────────────┬────────────────────────┘
         │                                      │
         ▼                                      ▼
┌──────────────────────┐              ┌──────────────────────┐
│  PostgreSQL          │              │  Redis               │
│  - Entity Storage    │              │  - Queue Storage     │
│  - Relationships     │              │  - Cache Layer       │
└──────────────────────┘              └──────────────────────┘
         │                                      │
         └──────────────┬───────────────────────┘
                        ▼
         ┌──────────────────────────────────────┐
         │         Worker Processes              │
         │                                       │
         │  ┌─────────────┐  ┌────────────────┐ │
         │  │   Import    │  │     Export     │ │
         │  │  Processor  │  │   Processor    │ │
         │  └─────────────┘  └────────────────┘ │
         └───────────────┬──────────────────────┘
                         │
                         ▼
         ┌──────────────────────────────────────┐
         │   Python NLP Service (FastAPI)       │
         │   http://localhost:8000              │
         │                                       │
         │   - POST /dedupe                     │
         │   - POST /similarity                 │
         └──────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                      Legacy Python CLI                                  │
│                    (JSON File Storage)                                  │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Import   │  │ Dedupe   │  │ Campaign │  │  Audit   │              │
│  │          │  │          │  │Generator │  │          │              │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Keyword Import Flow
```
CSV File → Parse → Normalize → Deduplicate → Store → Audit Log
```

### 2. Campaign Creation Flow
```
Brand Selection → Keyword Retrieval → ASIN Mapping → 
Ad Group Creation → Campaign Generation → Name Generation → 
CSV Export → Audit Log
```

### 3. Conflict Detection Flow
```
Keyword Bank → Group by Brand → Compare Positive/Negative → 
Report Conflicts → Audit Log
```

## Core Components

### Models (models.py)
- **Keyword**: Individual keyword with metadata
- **AdGroup**: Collection of keywords for an ASIN
- **Campaign**: Collection of ad groups
- **AuditEntry**: Log entry for tracking changes

### KeywordBank (keyword_bank.py)
- Central storage for all keywords
- Handles import, deduplication, conflict detection
- Manages campaigns

### CampaignGenerator (campaign_generator.py)
- Generates campaign names
- Generates ad group names
- Supports multiple naming strategies

### AmazonBulkExporter (amazon_exporter.py)
- Exports to Amazon Advertising bulk format
- Handles all CSV sections:
  - Campaigns
  - Ad Groups
  - Product Ads
  - Keywords
  - Negative Keywords

### AuditLogger (audit_logger.py)
- Tracks all operations
- Provides query capabilities
- Generates reports

### CLI (cli.py)
- User interface via command line
- Commands for all operations
- Colorized output

## Key Features

### 1. Multi-Brand Support
Each keyword is associated with a brand, allowing:
- Separate keyword pools per brand
- Brand-specific conflict detection
- Brand-specific campaign generation

### 2. Deduplication Strategy
Deduplication key: `(normalized_text, keyword_type, brand)`
- Same keyword can exist for different brands
- Same keyword can be both positive and negative (conflict)
- Normalization: lowercase + whitespace trimming

### 3. Conflict Detection
Identifies keywords that are both positive and negative for the same brand:
- Helps avoid wasted spend
- Prevents campaign conflicts
- Brand-specific reporting

### 4. Campaign Name Generation
Automatic generation with multiple strategies:
- Format: `{Brand}_{Strategy}_{ASINCount}ASIN_{Date}`
- Example: `Nike_EXACT_3ASIN_20251020`
- Ad Group format: `AG_{ASIN}_{KeywordCount}kw`

### 5. Amazon Bulk CSV Export
Generates properly formatted CSV files ready for upload:
- Campaign settings
- Ad group configuration
- Product ads (ASINs)
- Keywords (positive)
- Negative keywords

### 6. Audit Trail
Comprehensive logging of all operations:
- Import operations
- Campaign creation
- Conflict detection
- Timestamps and details
- Queryable history

## Modular Backend Architecture

### Core Modules

#### Import Module
- **Purpose**: Handle CSV file uploads and import processing
- **Endpoints**: POST /api/import/upload, GET /api/import, GET /api/import/:id/status
- **Features**: File upload, import tracking, job queueing

#### Dedupe Module
- **Purpose**: Find and manage duplicate keywords
- **Endpoints**: GET /api/dedupe/exact, GET /api/dedupe/fuzzy, GET /api/dedupe/conflicts
- **Features**: Exact matching, fuzzy matching (Jaro-Winkler, Levenshtein), conflict detection

#### Naming Module
- **Purpose**: Generate campaign and ad group names using patterns
- **Endpoints**: POST /api/naming/generate/campaign, POST /api/naming/generate/adgroup
- **Features**: Token-based patterns, date formatting, preview mode

#### Audit Module
- **Purpose**: Comprehensive audit logging for all operations
- **Endpoints**: POST /api/audit, GET /api/audit, GET /api/audit/stats
- **Features**: Entity tracking, filtering, statistics, history queries

#### Auth Module
- **Purpose**: User authentication and authorization
- **Endpoints**: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
- **Features**: JWT tokens, RBAC, guards, role-based access

#### Queue Module
- **Purpose**: Background job processing with BullMQ
- **Features**: Import queue, export queue, job status tracking, retry logic

### Background Processing

#### Workers
- **Import Processor**: Processes CSV imports asynchronously
- **Export Processor**: Generates CSV exports in background
- **Integration**: Calls Python NLP service for advanced deduplication

### Python NLP Microservice

**Technology**: FastAPI + Jellyfish
**Endpoints**:
- POST /dedupe: Fuzzy keyword deduplication
- POST /similarity: Calculate similarity scores
- GET /health: Health check

**Algorithms**:
- Jaro-Winkler similarity (default)
- Levenshtein distance

## Data Flow

### 1. Modern Import Flow (Web App)
```
User Upload CSV → Backend API → Create Import Record → Enqueue Job
                                                            ↓
Worker → Read CSV → Parse → Normalize → Call Python NLP → Dedupe
                                                            ↓
                              Insert Keywords → Update Status → Audit Log
```

### 2. Legacy Import Flow (CLI)
```
CSV File → Parse → Normalize → Deduplicate → Store JSON → Audit Log
```

### 3. Campaign Generation Flow
```
Frontend → Backend API → Naming Service → Generate Names → Return to Frontend
```

### 4. Deduplication Flow
```
Backend → Dedupe Service → Python NLP Service → Return Duplicates
```

## Deployment

### Development
```bash
docker-compose up
```

Starts all services:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 3001)
- Frontend (port 3000)
- Python NLP Service (port 8000)

### Production
Each service can be deployed independently:
- Backend: Docker image `ghcr.io/ryandabao1982/kwbank-backend`
- Frontend: Docker image `ghcr.io/ryandabao1982/kwbank-frontend`
- Python NLP: Docker image `ghcr.io/ryandabao1982/kwbank-python-nlp`

## CI/CD

### GitHub Actions Workflows

#### test-and-build.yml
- Runs on: push to main/develop, PRs
- Jobs: Backend tests, Frontend tests, Python NLP tests, OpenAPI generation
- Services: PostgreSQL, Redis

#### build-and-push-images.yml
- Runs on: push to main, tags, manual trigger
- Jobs: Build and push Docker images to GitHub Container Registry
- Images: backend, frontend, python-nlp

## Technology Stack

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript
- **ORM**: TypeORM
- **Queue**: BullMQ
- **Auth**: JWT + Passport

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI**: React + Tailwind CSS

### Database
- **Primary**: PostgreSQL 16
- **Cache/Queue**: Redis 7

### Python Service
- **Framework**: FastAPI
- **Libraries**: Jellyfish (fuzzy matching), Pydantic

## Migration Path

### From CLI to Web App
1. Both interfaces can coexist
2. CLI continues to use JSON storage
3. Web app uses PostgreSQL
4. Future: Migration utility to import JSON data to PostgreSQL

### Adding New Modules
1. Create module directory in `backend/src/`
2. Add controller, service, module files
3. Register in `app.module.ts`
4. Add DTOs for validation
5. Write tests

## Security Considerations

### Current Implementation
- JWT-based authentication
- Role-based access control (RBAC)
- Input validation with class-validator
- CORS configuration
- SQL injection prevention via TypeORM

### Production Requirements
- Enable HTTPS/TLS
- Add rate limiting
- Implement audit logging for all operations
- Use environment-specific secrets
- Enable database encryption at rest
- Set up monitoring and alerting

## Performance

### Optimization Strategies
- Redis caching for frequently accessed data
- Background job processing for heavy operations
- Database indexing on commonly queried fields
- Connection pooling for database
- Horizontal scaling of workers

### Monitoring
- Track job queue metrics
- Monitor API response times
- Database query performance
- Error rates and logging

