# KWBank Backend API

REST API backend for Keyword Bank built with NestJS, PostgreSQL, and TypeORM.

## Features

- **Brand Management**: Create and manage multiple brands
- **Product/ASIN Management**: Track products and ASINs per brand
- **Keyword Management**: Store, search, and categorize keywords
- **Mapping Management**: Create keyword-to-ASIN mappings
- **Duplicate Detection**: Find exact duplicates across keywords
- **Conflict Detection**: Identify positive/negative keyword conflicts
- **Statistics**: Get keyword statistics by brand, type, intent, etc.

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Language**: TypeScript
- **Caching**: Redis (ready for implementation)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker and Docker Compose (for local database)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Start PostgreSQL and Redis with Docker:
```bash
docker-compose up -d
```

4. Run the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3001/api`

### Running in Production

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## API Endpoints

### Brands

- `GET /api/brands` - List all brands
- `GET /api/brands/:id` - Get a brand by ID
- `POST /api/brands` - Create a new brand
- `PUT /api/brands/:id` - Update a brand
- `DELETE /api/brands/:id` - Delete a brand

### Products

- `GET /api/products` - List all products (optional: ?brand_id=xxx)
- `GET /api/products/:asin` - Get a product by ASIN
- `POST /api/products` - Create a new product
- `PUT /api/products/:asin` - Update a product
- `DELETE /api/products/:asin` - Delete a product

### Keywords

- `GET /api/keywords` - List keywords (supports filtering)
- `GET /api/keywords/stats` - Get keyword statistics
- `GET /api/keywords/duplicates` - Find duplicate keywords
- `GET /api/keywords/conflicts` - Find keyword conflicts
- `GET /api/keywords/:id` - Get a keyword by ID
- `POST /api/keywords` - Create a new keyword
- `POST /api/keywords/batch` - Create multiple keywords
- `PUT /api/keywords/:id` - Update a keyword
- `DELETE /api/keywords/:id` - Delete a keyword

Query parameters for filtering:
- `brand_id` - Filter by brand
- `keyword_type` - Filter by type (positive/negative)
- `match_type` - Filter by match type (exact/phrase/broad)
- `intent` - Filter by intent (awareness/consideration/conversion/unknown)
- `status` - Filter by status (active/paused/archived/pending)
- `search` - Search in normalized text

### Mappings

- `GET /api/mappings` - List all mappings (optional: ?asin=xxx or ?keyword=xxx)
- `GET /api/mappings/:id` - Get a mapping by ID
- `POST /api/mappings` - Create a new mapping
- `PUT /api/mappings/:id` - Update a mapping
- `DELETE /api/mappings/:id` - Delete a mapping

## Database Schema

See the entities in `src/entities/` for complete schema definitions.

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Code Formatting

```bash
# Format code
npm run format

# Lint code
npm run lint
```

## Environment Variables

See `.env.example` for all available environment variables.

## License

MIT

## New Modules

### Import Module
Handles CSV file uploads and import processing.

**Endpoints:**
- `POST /api/import/upload` - Upload CSV file for import
- `GET /api/import` - List all imports
- `GET /api/import/:id` - Get import details
- `GET /api/import/:id/status` - Get import status

**Usage:**
```bash
curl -X POST http://localhost:3001/api/import/upload \
  -F "file=@keywords.csv" \
  -F "brand_id=nike"
```

### Dedupe Module
Find and manage duplicate keywords using exact and fuzzy matching.

**Endpoints:**
- `GET /api/dedupe/exact?brand_id=nike` - Find exact duplicates
- `GET /api/dedupe/fuzzy?brand_id=nike&threshold=0.85` - Find fuzzy duplicates
- `GET /api/dedupe/conflicts?brand_id=nike` - Find conflicts (positive/negative)
- `POST /api/dedupe/merge` - Merge duplicate keywords

**Usage:**
```bash
curl http://localhost:3001/api/dedupe/exact?brand_id=nike
curl http://localhost:3001/api/dedupe/fuzzy?brand_id=nike&threshold=0.85
```

### Naming Module
Generate campaign and ad group names using customizable patterns.

**Endpoints:**
- `POST /api/naming/generate/campaign` - Generate campaign name
- `POST /api/naming/generate/adgroup` - Generate ad group name
- `POST /api/naming/preview` - Preview pattern with sample data
- `GET /api/naming/rules` - List naming rules
- `POST /api/naming/rules` - Create naming rule

**Usage:**
```bash
curl -X POST http://localhost:3001/api/naming/generate/campaign \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "nike",
    "strategy": "exact",
    "asin_count": 3
  }'
```

### Audit Module
Comprehensive audit logging for all operations.

**Endpoints:**
- `POST /api/audit` - Create audit entry
- `GET /api/audit` - List audit entries with filters
- `GET /api/audit/recent?limit=50` - Get recent entries
- `GET /api/audit/stats` - Get audit statistics
- `GET /api/audit/entity/:type/:id` - Get entity history

**Usage:**
```bash
curl http://localhost:3001/api/audit/recent?limit=20
curl http://localhost:3001/api/audit/stats
```

### Auth Module
JWT-based authentication with role-based access control.

**Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (requires auth)

**Usage:**
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get current user (use token from login)
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Background Jobs

### Queue System
The application uses BullMQ for background job processing.

**Import Jobs**: Process CSV imports asynchronously
**Export Jobs**: Generate CSV exports in background

**Queue Management:**
```typescript
// Add import job
await queueService.addImportJob({
  import_id: 'uuid',
  file_path: '/path/to/file.csv',
  brand_id: 'nike'
});

// Check job status
const status = await queueService.getImportJobStatus('job-id');
```

### Workers
Worker processes consume jobs from the queue:

- **Import Processor**: Reads CSV, parses, normalizes, deduplicates, and stores keywords
- **Export Processor**: Queries keywords, generates CSV, uploads to storage

Workers automatically integrate with the Python NLP service for advanced deduplication.

## Python NLP Service Integration

The backend integrates with a Python NLP microservice for advanced fuzzy matching.

**Service URL**: http://localhost:8000

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Dedupe Endpoint:**
```bash
curl -X POST http://localhost:8000/dedupe \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": [
      {"id": "1", "text": "running shoes", "normalized_text": "running shoes"},
      {"id": "2", "text": "runing shoes", "normalized_text": "runing shoes"}
    ],
    "threshold": 0.85,
    "algorithm": "jaro_winkler"
  }'
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=kwbank
DB_PASSWORD=kwbank
DB_NAME=kwbank

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-change-in-production

# External Services
PYTHON_NLP_URL=http://localhost:8000
```

## Docker Deployment

### Build Image
```bash
docker build -t kwbank-backend .
```

### Run Container
```bash
docker run -p 3001:3001 \
  -e DB_HOST=postgres \
  -e REDIS_HOST=redis \
  kwbank-backend
```

### Docker Compose
```bash
docker-compose up
```

This starts all services: PostgreSQL, Redis, Backend, Frontend, and Python NLP service.

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## Database Migrations

Currently using TypeORM's `synchronize: true` for development. For production:

1. Disable synchronize in `app.module.ts`
2. Generate migrations:
```bash
npm run typeorm migration:generate -- -n MigrationName
```

3. Run migrations:
```bash
npm run typeorm migration:run
```

## API Documentation

### OpenAPI/Swagger
To add Swagger documentation:

1. Install dependencies:
```bash
npm install @nestjs/swagger
```

2. Configure in `main.ts`:
```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('KWBank API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

3. Access at: http://localhost:3001/api/docs

## Monitoring and Logging

### Application Logs
Logs are output to console. For production, integrate with:
- Winston for structured logging
- ELK stack for log aggregation
- Sentry for error tracking

### Queue Monitoring
Use BullBoard for queue visualization:
```bash
npm install @bull-board/api @bull-board/express
```

## Security Best Practices

1. **Authentication**: Use JWT tokens with short expiration
2. **Authorization**: Implement role-based access control
3. **Input Validation**: Use class-validator for all DTOs
4. **Rate Limiting**: Add rate limiting middleware
5. **CORS**: Configure appropriate CORS origins
6. **Secrets**: Never commit secrets, use environment variables
7. **Database**: Use parameterized queries (TypeORM does this)
8. **HTTPS**: Always use HTTPS in production

## Performance Tips

1. **Caching**: Use Redis for frequently accessed data
2. **Indexing**: Add database indexes for common queries
3. **Connection Pooling**: Configure TypeORM connection pool
4. **Background Jobs**: Offload heavy operations to workers
5. **Pagination**: Always paginate large result sets
6. **Compression**: Enable gzip compression
7. **Static Assets**: Use CDN for static files

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check connection
psql -h localhost -U kwbank -d kwbank
```

### Redis Connection Issues
```bash
# Check if Redis is running
docker-compose ps redis

# Test connection
redis-cli ping
```

### Queue Not Processing Jobs
```bash
# Check worker logs
docker-compose logs -f backend

# Check Redis queue
redis-cli KEYS "bull:*"
```

### Port Already in Use
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>
```

