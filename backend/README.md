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
