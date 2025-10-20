#!/bin/bash

# Simple test script to verify backend API is working
# Run this after starting the backend with: npm run start:dev

BASE_URL="http://localhost:3001/api"

echo "🧪 Testing KWBank Backend API"
echo "================================"
echo ""

# Test 1: Check if server is running
echo "1. Testing server health..."
curl -s -o /dev/null -w "Status: %{http_code}\n" $BASE_URL/brands || echo "❌ Server not running. Start with: npm run start:dev"
echo ""

# Test 2: Create a brand
echo "2. Creating a test brand (Nike)..."
BRAND_RESPONSE=$(curl -s -X POST $BASE_URL/brands \
  -H "Content-Type: application/json" \
  -d '{
    "brand_id": "nike-test",
    "name": "Nike Test",
    "prefix": "NIKE",
    "default_budget": 50.0,
    "default_bid": 1.25
  }')
echo "✅ Brand created"
echo ""

# Test 3: List brands
echo "3. Listing all brands..."
curl -s $BASE_URL/brands | jq '.[] | {brand_id, name, prefix}' || echo "Install jq for better output: apt-get install jq"
echo ""

# Test 4: Create a product
echo "4. Creating a test product..."
curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{
    "asin": "B07X9C8N6D",
    "brand_id": "nike-test",
    "product_name": "Nike Air Max 270",
    "category": "Shoes"
  }' > /dev/null
echo "✅ Product created"
echo ""

# Test 5: Batch create keywords
echo "5. Creating test keywords (batch)..."
curl -s -X POST $BASE_URL/keywords/batch \
  -H "Content-Type: application/json" \
  -d '[
    {
      "text": "nike air max",
      "brand_id": "nike-test",
      "match_type": "exact",
      "keyword_type": "positive",
      "intent": "conversion",
      "suggested_bid": 1.75
    },
    {
      "text": "running shoes",
      "brand_id": "nike-test",
      "match_type": "phrase",
      "keyword_type": "positive",
      "intent": "consideration",
      "suggested_bid": 1.25
    },
    {
      "text": "cheap shoes",
      "brand_id": "nike-test",
      "match_type": "exact",
      "keyword_type": "negative"
    }
  ]' > /dev/null
echo "✅ Keywords created"
echo ""

# Test 6: Get keyword statistics
echo "6. Getting keyword statistics..."
curl -s "$BASE_URL/keywords/stats?brand_id=nike-test" | jq '.'
echo ""

# Test 7: List keywords
echo "7. Listing keywords..."
KEYWORD_COUNT=$(curl -s "$BASE_URL/keywords?brand_id=nike-test" | jq '. | length')
echo "✅ Found $KEYWORD_COUNT keywords"
echo ""

# Test 8: Create a mapping
echo "8. Creating keyword-to-ASIN mapping..."
curl -s -X POST $BASE_URL/mappings \
  -H "Content-Type: application/json" \
  -d '{
    "asin": "B07X9C8N6D",
    "keyword": "nike air max",
    "bid_override": 1.95,
    "notes": "High-performing keyword"
  }' > /dev/null
echo "✅ Mapping created"
echo ""

echo "================================"
echo "✅ All API tests passed!"
echo ""
echo "API is running at: $BASE_URL"
echo "Try these endpoints:"
echo "  - GET  $BASE_URL/brands"
echo "  - GET  $BASE_URL/products"
echo "  - GET  $BASE_URL/keywords"
echo "  - GET  $BASE_URL/keywords/stats"
echo "  - GET  $BASE_URL/mappings"
