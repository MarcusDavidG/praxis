#!/bin/bash

set -e  # Exit on error

echo "🚀 Praxis Automated Setup"
echo "=========================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "1️⃣  Checking prerequisites..."
echo ""

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found. Please install npm first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version)${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker not found. You'll need to install PostgreSQL and Redis manually.${NC}"
    USE_DOCKER=false
else
    echo -e "${GREEN}✅ Docker found${NC}"
    USE_DOCKER=true
fi

echo ""
echo "2️⃣  Installing npm dependencies..."
echo ""

# Install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
else
    echo -e "${GREEN}✅ Root dependencies already installed${NC}"
fi

echo ""
echo "3️⃣  Setting up Docker services..."
echo ""

if [ "$USE_DOCKER" = true ]; then
    # Run Docker setup
    ./scripts/docker-setup.sh
else
    echo -e "${YELLOW}⚠️  Skipping Docker setup. Make sure PostgreSQL and Redis are running!${NC}"
fi

echo ""
echo "4️⃣  Configuring environment files..."
echo ""

# Backend .env
if [ ! -f "apps/backend/.env" ]; then
    cp apps/backend/.env.example apps/backend/.env
    
    # Update DATABASE_URL if using Docker
    if [ "$USE_DOCKER" = true ]; then
        sed -i 's|postgresql://user:password@localhost:5432/praxis|postgresql://praxis_user:praxis_secure_password_123@localhost:5432/praxis|g' apps/backend/.env
    fi
    
    # Generate JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    sed -i "s|your-secret-key-change-this|${JWT_SECRET}|g" apps/backend/.env
    
    echo -e "${GREEN}✅ Created apps/backend/.env${NC}"
else
    echo -e "${GREEN}✅ apps/backend/.env already exists${NC}"
fi

# Frontend .env.local
if [ ! -f "apps/frontend/.env.local" ]; then
    cp apps/frontend/.env.example apps/frontend/.env.local
    echo -e "${GREEN}✅ Created apps/frontend/.env.local${NC}"
    echo -e "${YELLOW}⚠️  Don't forget to add your WalletConnect Project ID!${NC}"
    echo "   Get it from: https://cloud.walletconnect.com/"
else
    echo -e "${GREEN}✅ apps/frontend/.env.local already exists${NC}"
fi

echo ""
echo "5️⃣  Building shared package..."
echo ""

cd packages/shared
if [ ! -d "dist" ]; then
    npm run build
    echo -e "${GREEN}✅ Shared package built${NC}"
else
    echo -e "${GREEN}✅ Shared package already built${NC}"
fi
cd ../..

echo ""
echo "6️⃣  Setting up database..."
echo ""

cd apps/backend

# Generate Prisma client
if [ ! -d "node_modules/@prisma/client" ]; then
    npx prisma generate
    echo -e "${GREEN}✅ Prisma client generated${NC}"
else
    echo -e "${GREEN}✅ Prisma client already generated${NC}"
fi

# Run migrations
if [ ! -d "prisma/migrations" ]; then
    # Wait for database to be ready
    if [ "$USE_DOCKER" = true ]; then
        echo "Waiting for PostgreSQL to be ready..."
        sleep 5
    fi
    
    npx prisma migrate dev --name init
    echo -e "${GREEN}✅ Database migrations complete${NC}"
else
    echo -e "${GREEN}✅ Database already migrated${NC}"
fi

cd ../..

echo ""
echo "================================================"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "================================================"
echo ""
echo "Your development environment is ready:"
echo ""
echo "  ✅ Dependencies installed"
echo "  ✅ PostgreSQL running (Docker)"
echo "  ✅ Redis running (Docker)"
echo "  ✅ Environment variables configured"
echo "  ✅ Database schema created"
echo "  ✅ Shared package built"
echo ""
echo "Next steps:"
echo ""
echo "  1. Add WalletConnect Project ID to apps/frontend/.env.local"
echo "     Get it from: https://cloud.walletconnect.com/"
echo ""
echo "  2. Start development servers:"
echo "     ${GREEN}npm run dev${NC}"
echo ""
echo "  3. Open your browser:"
echo "     Frontend:  http://localhost:3000"
echo "     Backend:   http://localhost:4000/health"
echo "     Database:  npx prisma studio (in apps/backend/)"
echo ""
echo "Useful commands:"
echo "  ./scripts/check-setup.sh    # Verify setup"
echo "  docker ps                   # View running containers"
echo "  npm run dev                 # Start all services"
echo ""
echo "Documentation:"
echo "  QUICKSTART.md              # Quick reference"
echo "  INSTALLATION_GUIDE.md      # Detailed guide"
echo "  SETUP.md                   # Project overview"
echo ""
echo "================================================"
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo "================================================"
