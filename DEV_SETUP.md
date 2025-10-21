# KWBank Development Setup Guide

Quick guide to get KWBank up and running on your local machine.

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development without Docker)
- Python 3.11+ (for python-nlp service without Docker)

## Quick Start (Docker)

### 1. Clone the Repository
```bash
git clone https://github.com/Ryandabao1982/KWBank.git
cd KWBank
```

### 2. Start All Services
```bash
docker-compose up
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 3001)
- Frontend (port 3000)
- Python NLP Service (port 8000)

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Python NLP Docs**: http://localhost:8000/docs

## Local Development (Without Docker)

### Backend Setup

```bash
cd backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start PostgreSQL and Redis with Docker
docker-compose -f ../docker-compose.yml up postgres redis -d

# Run migrations (if needed)
npm run migration:run

# Start backend in dev mode
npm run start:dev
```

Backend will be available at http://localhost:3001/api

### Frontend Setup

```bash
cd frontend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start frontend in dev mode
npm run dev
```

Frontend will be available at http://localhost:3000

### Python NLP Service Setup

```bash
cd python-nlp

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run service
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Service will be available at http://localhost:8000

## Testing the Setup

### 1. Check Service Health

```bash
# Backend
curl http://localhost:3001/api

# Python NLP
curl http://localhost:8000/health
```

### 2. Test Import Flow

```bash
# Upload a CSV file
curl -X POST http://localhost:3001/api/import/upload \
  -F "file=@test.csv" \
  -F "brand_id=nike"
```

### 3. Test Authentication

```bash
# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Test Deduplication

```bash
# Find exact duplicates
curl http://localhost:3001/api/dedupe/exact?brand_id=nike

# Find fuzzy duplicates
curl http://localhost:3001/api/dedupe/fuzzy?brand_id=nike&threshold=0.85
```

## Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=kwbank
DB_PASSWORD=kwbank
DB_NAME=kwbank
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key-change-in-production
PYTHON_NLP_URL=http://localhost:8000
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Python NLP (.env)
```env
PORT=8000
HOST=0.0.0.0
```

## Common Issues

### Port Already in Use
```bash
# Find and kill process
lsof -i :3001
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Redis Connection Failed
```bash
# Check if Redis is running
docker-compose ps redis

# Test Redis connection
redis-cli ping
```

## Development Workflow

### 1. Create a New Feature
```bash
git checkout -b feature/my-feature
```

### 2. Make Changes
Edit code in your preferred editor

### 3. Test Locally
```bash
# Backend
cd backend
npm run lint
npm run build
npm test

# Frontend
cd frontend
npm run lint
npm run build
```

### 4. Commit and Push
```bash
git add .
git commit -m "Add my feature"
git push origin feature/my-feature
```

### 5. Create Pull Request
Go to GitHub and create a PR from your feature branch

## Running Tests

### Backend Tests
```bash
cd backend
npm test                  # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Python NLP Tests
```bash
cd python-nlp
pytest                    # If tests are added
```

## Building for Production

### Build All Services
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build

# Python NLP (no build needed, just install deps)
cd python-nlp && pip install -r requirements.txt
```

### Build Docker Images
```bash
docker build -t kwbank-backend ./backend
docker build -t kwbank-frontend ./frontend
docker build -t kwbank-python-nlp ./python-nlp
```

## Useful Commands

### Backend
```bash
npm run start:dev        # Development mode with hot reload
npm run start:prod       # Production mode
npm run lint            # Run linter
npm run format          # Format code
npm run build           # Build application
```

### Frontend
```bash
npm run dev             # Development mode
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run linter
```

### Docker
```bash
docker-compose up       # Start all services
docker-compose down     # Stop all services
docker-compose logs -f  # View logs
docker-compose ps       # Check service status
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## API Documentation

See [backend/README.md](./backend/README.md) for API documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

MIT License - See LICENSE file for details
