# KWBank Backend Quick Start Guide

This guide will help you get the KWBank backend API up and running quickly.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL and Redis)
- Git

## Quick Start (5 minutes)

### 1. Start the Database

Start PostgreSQL and Redis using Docker Compose:

```bash
cd backend
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment (Optional)

Copy the example environment file:

```bash
cp .env.example .env
```

Default configuration works out of the box with Docker Compose.

### 4. Start the Backend

Development mode with hot reload:

```bash
npm run start:dev
```

The API will be available at: **http://localhost:3001/api**

## Verify Installation

### Check API Health

```bash
curl http://localhost:3001/api/brands
```

Should return an empty array `[]` (no brands yet).

### Create a Test Brand

```bash
curl -X POST http://localhost:3001/api/brands \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "nike",
    "name": "Nike",
    "prefix": "NIKE",
    "default_budget": 50.0,
    "default_bid": 1.25
  }'
```

### List Brands

```bash
curl http://localhost:3001/api/brands
```

You should see your Nike brand in the response.

## API Endpoints

All endpoints are prefixed with `/api`:

### Brands
- `GET /api/brands` - List all brands
- `POST /api/brands` - Create a brand
- `GET /api/brands/:id` - Get brand details
- `PUT /api/brands/:id` - Update a brand
- `DELETE /api/brands/:id` - Delete a brand

### Products
- `GET /api/products` - List products (filter: ?brand_id=nike)
- `POST /api/products` - Create a product
- `GET /api/products/:asin` - Get product details
- `PUT /api/products/:asin` - Update a product
- `DELETE /api/products/:asin` - Delete a product

### Keywords
- `GET /api/keywords` - List keywords (supports filtering)
- `POST /api/keywords` - Create a keyword
- `POST /api/keywords/batch` - Create multiple keywords
- `GET /api/keywords/stats` - Get keyword statistics
- `GET /api/keywords/duplicates` - Find duplicate keywords
- `GET /api/keywords/conflicts` - Find keyword conflicts
- `GET /api/keywords/:id` - Get keyword details
- `PUT /api/keywords/:id` - Update a keyword
- `DELETE /api/keywords/:id` - Delete a keyword

### Mappings
- `GET /api/mappings` - List mappings (filter: ?asin=B07X9C8N6D)
- `POST /api/mappings` - Create a mapping
- `GET /api/mappings/:id` - Get mapping details
- `PUT /api/mappings/:id` - Update a mapping
- `DELETE /api/mappings/:id` - Delete a mapping

## Example: Complete Workflow

```bash
# 1. Create a brand
curl -X POST http://localhost:3001/api/brands \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "nike",
    "name": "Nike",
    "prefix": "NIKE",
    "default_budget": 50.0,
    "default_bid": 1.25
  }'

# 2. Add a product
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "asin": "B07X9C8N6D",
    "brand_id": "nike",
    "product_name": "Nike Air Max 270",
    "category": "Shoes"
  }'

# 3. Add keywords
curl -X POST http://localhost:3001/api/keywords/batch \
  -H "Content-Type: application/json" \
  -d '[
    {
      "text": "nike air max",
      "brand_id": "nike",
      "match_type": "exact",
      "keyword_type": "positive",
      "intent": "conversion"
    },
    {
      "text": "running shoes",
      "brand_id": "nike",
      "match_type": "phrase",
      "keyword_type": "positive",
      "intent": "consideration"
    }
  ]'

# 4. Create a mapping
curl -X POST http://localhost:3001/api/mappings \
  -H "Content-Type: application/json" \
  -d '{
    "asin": "B07X9C8N6D",
    "keyword": "nike air max",
    "bid_override": 1.75
  }'

# 5. Get keyword statistics
curl http://localhost:3001/api/keywords/stats?brand_id=nike
```

## Development Commands

```bash
# Start development server (with hot reload)
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Run linter
npm run lint

# Format code
npm run format
```

## Database Management

### View Database Logs

```bash
docker-compose logs -f postgres
```

### Connect to PostgreSQL

```bash
docker exec -it kwbank-postgres psql -U kwbank -d kwbank
```

### Stop Database

```bash
docker-compose down
```

### Reset Database (WARNING: Deletes all data)

```bash
docker-compose down -v
docker-compose up -d
```

## Troubleshooting

### Port Already in Use

If port 3001 is already in use:

1. Edit `.env` file and change `PORT=3001` to another port
2. Or stop the process using port 3001

### Database Connection Error

Make sure PostgreSQL is running:

```bash
docker-compose ps
```

If not running, start it:

```bash
docker-compose up -d postgres
```

### Can't Connect from Frontend

Make sure CORS is properly configured in `src/main.ts`. The backend allows connections from `http://localhost:3000` and `http://localhost:3001` by default.

## Next Steps

- Read the full [Backend README](README.md) for detailed documentation
- Explore the API endpoints using a tool like Postman or Insomnia
- Check the [Main Project README](../README.md) for overall system documentation
- Consider adding Swagger/OpenAPI documentation for interactive API docs

## Production Deployment

For production:

1. Set `synchronize: false` in `src/app.module.ts` (line 35)
2. Use proper database migrations
3. Set strong passwords in environment variables
4. Enable HTTPS
5. Add authentication/authorization
6. Set up proper logging and monitoring

See [Backend README](README.md) for more details on production deployment.
