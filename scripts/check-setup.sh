#!/bin/bash

echo "🔍 Checking Praxis Setup..."
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "  ✅ Node.js installed: $NODE_VERSION"
else
    echo "  ❌ Node.js not found. Please install Node.js 18+"
fi

# Check npm
echo ""
echo "✓ Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "  ✅ npm installed: $NPM_VERSION"
else
    echo "  ❌ npm not found"
fi

# Check PostgreSQL
echo ""
echo "✓ Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    echo "  ✅ PostgreSQL installed: $PSQL_VERSION"
    
    # Test connection
    if psql -h localhost -U praxis_user -d praxis -c "SELECT 1;" &> /dev/null; then
        echo "  ✅ Database connection successful"
    else
        echo "  ⚠️  Cannot connect to database (check credentials)"
    fi
else
    echo "  ⚠️  PostgreSQL not found (Docker is OK)"
fi

# Check Redis
echo ""
echo "✓ Checking Redis..."
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo "  ✅ Redis running"
    else
        echo "  ❌ Redis not running"
    fi
else
    echo "  ⚠️  redis-cli not found (Docker is OK)"
fi

# Check Docker (if using Docker)
echo ""
echo "✓ Checking Docker (optional)..."
if command -v docker &> /dev/null; then
    echo "  ✅ Docker installed"
    
    # Check for Praxis containers
    if docker ps | grep -q "praxis-postgres"; then
        echo "  ✅ praxis-postgres container running"
    fi
    
    if docker ps | grep -q "praxis-redis"; then
        echo "  ✅ praxis-redis container running"
    fi
else
    echo "  ⚠️  Docker not found (not required)"
fi

# Check node_modules
echo ""
echo "✓ Checking dependencies..."
if [ -d "node_modules" ]; then
    echo "  ✅ Root dependencies installed"
else
    echo "  ❌ Root dependencies missing. Run: npm install"
fi

if [ -d "apps/backend/node_modules" ]; then
    echo "  ✅ Backend dependencies installed"
else
    echo "  ❌ Backend dependencies missing"
fi

if [ -d "apps/frontend/node_modules" ]; then
    echo "  ✅ Frontend dependencies installed"
else
    echo "  ❌ Frontend dependencies missing"
fi

# Check .env files
echo ""
echo "✓ Checking environment files..."
if [ -f "apps/backend/.env" ]; then
    echo "  ✅ Backend .env exists"
else
    echo "  ❌ Backend .env missing. Run: cp apps/backend/.env.example apps/backend/.env"
fi

if [ -f "apps/frontend/.env.local" ]; then
    echo "  ✅ Frontend .env.local exists"
else
    echo "  ❌ Frontend .env.local missing. Run: cp apps/frontend/.env.example apps/frontend/.env.local"
fi

# Check Prisma
echo ""
echo "✓ Checking Prisma..."
if [ -d "apps/backend/node_modules/@prisma/client" ]; then
    echo "  ✅ Prisma client installed"
    
    # Check if migrations exist
    if [ -d "apps/backend/prisma/migrations" ]; then
        echo "  ✅ Database migrations exist"
    else
        echo "  ⚠️  No migrations yet. Run: cd apps/backend && npx prisma migrate dev"
    fi
else
    echo "  ❌ Prisma client not generated. Run: cd apps/backend && npx prisma generate"
fi

# Check shared package build
echo ""
echo "✓ Checking shared package..."
if [ -d "packages/shared/dist" ]; then
    echo "  ✅ Shared package built"
else
    echo "  ⚠️  Shared package not built. Run: cd packages/shared && npm run build"
fi

echo ""
echo "================================================"
echo "Setup check complete!"
echo ""
echo "Next steps:"
echo "  1. Install dependencies: npm install"
echo "  2. Setup database: See INSTALLATION_GUIDE.md Step 2"
echo "  3. Setup Redis: See INSTALLATION_GUIDE.md Step 3"
echo "  4. Configure .env files: See INSTALLATION_GUIDE.md Step 4"
echo "  5. Run migrations: cd apps/backend && npx prisma migrate dev"
echo "  6. Start dev servers: npm run dev"
echo ""
echo "📖 Full guide: INSTALLATION_GUIDE.md"
echo "================================================"
