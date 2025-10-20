#!/bin/bash

# KWBank Development Environment Startup Script
# This script helps you get the development environment running quickly

set -e

echo "🚀 KWBank Development Environment Setup"
echo "========================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Start databases
echo "🗄️  Starting PostgreSQL and Redis..."
docker-compose up -d postgres redis

# Wait for databases to be healthy
echo "⏳ Waiting for databases to be ready..."
until docker-compose ps | grep kwbank-postgres | grep "healthy" > /dev/null 2>&1; do
    echo "   Still waiting for PostgreSQL..."
    sleep 2
done
until docker-compose ps | grep kwbank-redis | grep "healthy" > /dev/null 2>&1; do
    echo "   Still waiting for Redis..."
    sleep 2
done

echo -e "${GREEN}✅ Databases are ready${NC}"
echo ""

# Setup backend
echo "🔧 Setting up backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "   Installing backend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "   Creating backend .env file..."
    cp .env.example .env
fi

echo -e "${GREEN}✅ Backend setup complete${NC}"
echo ""

# Go back to root
cd ..

# Instructions for starting services
echo "========================================"
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Start the backend API:"
echo -e "   ${YELLOW}cd backend && npm run start:dev${NC}"
echo ""
echo "2. In a new terminal, test the API:"
echo -e "   ${YELLOW}cd backend && ./test-api.sh${NC}"
echo ""
echo "3. (Optional) Use the Python CLI:"
echo -e "   ${YELLOW}pip install -e . && kwbank --help${NC}"
echo ""
echo "📚 Documentation:"
echo "   - Backend API: backend/README.md"
echo "   - Quick Start: backend/QUICKSTART.md"
echo "   - Main README: README.md"
echo ""
echo "🌐 URLs (once started):"
echo "   - Backend API: http://localhost:3001/api"
echo "   - PostgreSQL: localhost:5432 (user: kwbank, pass: kwbank, db: kwbank)"
echo "   - Redis: localhost:6379"
echo ""
echo "🛑 To stop databases:"
echo -e "   ${YELLOW}docker-compose down${NC}"
echo ""
