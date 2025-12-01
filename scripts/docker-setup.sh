#!/bin/bash

echo "🐳 Setting up Praxis with Docker..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✓ Docker found"
echo ""

# Setup PostgreSQL
echo "📦 Setting up PostgreSQL..."
if docker ps -a | grep -q "praxis-postgres"; then
    echo "  Container 'praxis-postgres' already exists"
    docker start praxis-postgres
    echo "  ✅ PostgreSQL started"
else
    docker run -d \
      --name praxis-postgres \
      -e POSTGRES_DB=praxis \
      -e POSTGRES_USER=praxis_user \
      -e POSTGRES_PASSWORD=praxis_secure_password_123 \
      -p 5432:5432 \
      postgres:14
    echo "  ✅ PostgreSQL created and running"
fi

# Wait for PostgreSQL to be ready
echo "  ⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Setup Redis
echo ""
echo "📦 Setting up Redis..."
if docker ps -a | grep -q "praxis-redis"; then
    echo "  Container 'praxis-redis' already exists"
    docker start praxis-redis
    echo "  ✅ Redis started"
else
    docker run -d \
      --name praxis-redis \
      -p 6379:6379 \
      redis:7-alpine
    echo "  ✅ Redis created and running"
fi

# Wait for Redis to be ready
echo "  ⏳ Waiting for Redis to be ready..."
sleep 2

# Test connections
echo ""
echo "🔍 Testing connections..."

if docker exec praxis-postgres pg_isready -U praxis_user &> /dev/null; then
    echo "  ✅ PostgreSQL is ready"
else
    echo "  ❌ PostgreSQL connection failed"
fi

if docker exec praxis-redis redis-cli ping &> /dev/null; then
    echo "  ✅ Redis is ready"
else
    echo "  ❌ Redis connection failed"
fi

echo ""
echo "================================================"
echo "🎉 Docker setup complete!"
echo ""
echo "Your services are running:"
echo "  PostgreSQL: localhost:5432"
echo "  Redis: localhost:6379"
echo ""
echo "Database credentials:"
echo "  Database: praxis"
echo "  User: praxis_user"
echo "  Password: praxis_secure_password_123"
echo ""
echo "Connection string:"
echo "  postgresql://praxis_user:praxis_secure_password_123@localhost:5432/praxis"
echo ""
echo "Useful commands:"
echo "  docker ps                    # View running containers"
echo "  docker logs praxis-postgres  # View PostgreSQL logs"
echo "  docker logs praxis-redis     # View Redis logs"
echo "  docker stop praxis-postgres  # Stop PostgreSQL"
echo "  docker stop praxis-redis     # Stop Redis"
echo "  docker start praxis-postgres # Start PostgreSQL"
echo "  docker start praxis-redis    # Start Redis"
echo ""
echo "Next steps:"
echo "  1. Update apps/backend/.env with the connection string above"
echo "  2. Run: cd apps/backend && npx prisma migrate dev"
echo "  3. Run: npm run dev"
echo "================================================"
