# Python NLP Service for KWBank

Natural Language Processing microservice for keyword deduplication and analysis.

## Features

- **Fuzzy Deduplication**: Find similar keywords using Jaro-Winkler or Levenshtein similarity
- **Similarity Calculation**: Calculate similarity scores between keyword pairs
- **FastAPI**: Modern, fast web framework with automatic API documentation

## Installation

```bash
pip install -r requirements.txt
```

## Running the Service

### Development
```bash
cd python-nlp
python -m app.main
```

Or using uvicorn directly:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Deduplicate Keywords
```bash
POST /dedupe
Content-Type: application/json

{
  "keywords": [
    {
      "id": "1",
      "text": "running shoes",
      "normalized_text": "running shoes"
    },
    {
      "id": "2",
      "text": "runing shoes",
      "normalized_text": "runing shoes"
    }
  ],
  "threshold": 0.85,
  "algorithm": "jaro_winkler"
}
```

### Calculate Similarity
```bash
POST /similarity?text1=running%20shoes&text2=runing%20shoes&algorithm=jaro_winkler
```

## API Documentation

Once the service is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Docker

Build and run with Docker:
```bash
docker build -t kwbank-nlp .
docker run -p 8000:8000 kwbank-nlp
```

## Integration with Backend

The NestJS backend worker can call this service for advanced deduplication:

```typescript
const response = await axios.post('http://python-nlp:8000/dedupe', {
  keywords: keywordsToCheck,
  threshold: 0.85,
  algorithm: 'jaro_winkler'
});
```

## Environment Variables

- `PORT`: Server port (default: 8000)
- `HOST`: Server host (default: 0.0.0.0)
- `LOG_LEVEL`: Logging level (default: info)
