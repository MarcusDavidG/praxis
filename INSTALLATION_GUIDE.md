# 🚀 Praxis Complete Installation Guide

Follow these steps to get Praxis running on your local machine.

---

## Prerequisites

Before starting, ensure you have:
- **Node.js 18+** installed (`node --version`)
- **npm 10+** installed (`npm --version`)
- **PostgreSQL 14+** installed
- **Redis 7+** installed
- **Git** installed

---

## Step 1: Install Dependencies (5-10 minutes)

From the project root:

```bash
cd /home/marcus/praxis

# Install all workspace dependencies
npm install
```

**What this does:**
- Installs dependencies for root, backend, frontend, and shared packages
- Sets up TurboRepo
- Installs Prisma CLI
- Downloads all npm packages (~500MB)

**Wait for completion.** You should see:
```
added X packages, and audited Y packages in Zs
```

---

## Step 2: Setup PostgreSQL Database

### Option A: Local PostgreSQL Installation

**On Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

**On macOS (via Homebrew):**
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14
```

### Create Database & User

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside psql prompt, run:
CREATE DATABASE praxis;
CREATE USER praxis_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE praxis TO praxis_user;

# Exit psql
\q
```

### Option B: Docker PostgreSQL (Easier!)

```bash
# Run PostgreSQL in Docker
docker run -d \
  --name praxis-postgres \
  -e POSTGRES_DB=praxis \
  -e POSTGRES_USER=praxis_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  postgres:14

# Verify it's running
docker ps | grep praxis-postgres
```

### Test Connection

```bash
# Test the connection
psql -h localhost -U praxis_user -d praxis

# You should see:
# praxis=#

# Exit with \q
```

---

## Step 3: Setup Redis

### Option A: Local Redis Installation

**On Ubuntu/Debian:**
```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli ping
# Should return: PONG
```

**On macOS (via Homebrew):**
```bash
# Install Redis
brew install redis

# Start Redis
brew services start redis

# Test Redis
redis-cli ping
# Should return: PONG
```

### Option B: Docker Redis (Easier!)

```bash
# Run Redis in Docker
docker run -d \
  --name praxis-redis \
  -p 6379:6379 \
  redis:7-alpine

# Test Redis
docker exec praxis-redis redis-cli ping
# Should return: PONG
```

---

## Step 4: Configure Environment Variables

### Backend Configuration

```bash
cd /home/marcus/praxis/apps/backend

# Copy example file
cp .env.example .env

# Edit the .env file
nano .env  # or use your preferred editor
```

**Update these values in `apps/backend/.env`:**

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://praxis_user:your_secure_password@localhost:5432/praxis"

# Redis - Default is fine for local development
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Server
PORT=4000
NODE_ENV=development

# Polymarket (Optional for now - leave empty)
POLYMARKET_API_KEY=
POLYMARKET_BUILDER_KEY=

# JWT - Generate a secure random string
JWT_SECRET=your-very-secure-random-string-change-this-123456

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Generate a secure JWT secret:**
```bash
# Generate random string for JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend Configuration

```bash
cd /home/marcus/praxis/apps/frontend

# Copy example file
cp .env.example .env.local

# Edit the .env.local file
nano .env.local
```

**Update `apps/frontend/.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:4000

# Get your WalletConnect Project ID from: https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here
```

**Get WalletConnect Project ID:**
1. Go to https://cloud.walletconnect.com/
2. Sign in with GitHub or email
3. Create a new project
4. Copy the Project ID
5. Paste it in `.env.local`

---

## Step 5: Generate Prisma Client & Run Migrations

```bash
cd /home/marcus/praxis/apps/backend

# Generate Prisma Client (creates TypeScript types)
npx prisma generate

# Run database migrations (creates all tables)
npx prisma migrate dev --name init

# You should see:
# ✔ Generated Prisma Client
# The following migration(s) have been created and applied...
```

**What this creates:**
- 14 database tables (users, markets, positions, trades, etc.)
- Foreign keys and indexes
- Prisma client with TypeScript types

### Verify Database Tables

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This opens http://localhost:5555 where you can see all your tables!

---

## Step 6: Build Shared Package

```bash
cd /home/marcus/praxis/packages/shared

# Build the shared package
npm run build

# You should see dist/ folder created with:
# - index.js
# - index.d.ts
# - types.js, constants.js, utils.js, etc.
```

---

## Step 7: Start Development Servers

Open **3 separate terminal windows/tabs:**

### Terminal 1: Shared Package (Watch Mode)

```bash
cd /home/marcus/praxis/packages/shared
npm run dev
```

**Expected output:**
```
Watching for file changes.
```

### Terminal 2: Backend Server

```bash
cd /home/marcus/praxis/apps/backend
npm run dev
```

**Expected output:**
```
[timestamp] [info]: Database connected
[timestamp] [info]: Redis connected
[timestamp] [info]: Server running on port 4000
[timestamp] [info]: Environment: development
```

### Terminal 3: Frontend Server

```bash
cd /home/marcus/praxis/apps/frontend
npm run dev
```

**Expected output:**
```
  ▲ Next.js 15.0.3
  - Local:        http://localhost:3000
  - Environments: .env.local

 ✓ Ready in 2.5s
```

**Alternative: Use TurboRepo (Single Command)**

```bash
# From project root, run all 3 at once
cd /home/marcus/praxis
npm run dev
```

---

## Step 8: Verify Everything Works

### Test Backend API

```bash
# Test health endpoint
curl http://localhost:4000/health

# Expected response:
# {"status":"ok","timestamp":"2024-12-01T..."}
```

### Test Frontend

1. Open browser: http://localhost:3000
2. You should see the Praxis landing page
3. Click "Connect Wallet" button
4. RainbowKit modal should appear

### Test Database Connection

```bash
cd /home/marcus/praxis/apps/backend

# Open Prisma Studio
npx prisma studio
```

Browse to http://localhost:5555 and explore your empty database tables!

---

## 🎉 Setup Complete!

You should now have:
- ✅ All npm dependencies installed
- ✅ PostgreSQL database running with Praxis schema
- ✅ Redis running
- ✅ Environment variables configured
- ✅ Backend API running on port 4000
- ✅ Frontend running on port 3000
- ✅ Prisma Studio available on port 5555

---

## 🐛 Troubleshooting

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock files
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json

# Reinstall
npm install
```

### Issue: PostgreSQL connection fails

**Error:** `Connection refused` or `password authentication failed`

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Or for Docker:
docker ps | grep postgres

# Test connection manually
psql -h localhost -U praxis_user -d praxis

# Check your DATABASE_URL in apps/backend/.env matches your credentials
```

### Issue: Redis connection fails

**Error:** `Redis connection error`

**Solution:**
```bash
# Check Redis is running
redis-cli ping

# Or for Docker:
docker ps | grep redis

# Start Redis if stopped
sudo systemctl start redis-server

# Or for Docker:
docker start praxis-redis
```

### Issue: Prisma migrate fails

**Error:** `Environment variable not found: DATABASE_URL`

**Solution:**
```bash
# Make sure .env file exists in apps/backend/
cd apps/backend
ls -la .env

# Check DATABASE_URL is set correctly
cat .env | grep DATABASE_URL

# Retry migration
npx prisma migrate dev
```

### Issue: Frontend build fails

**Error:** `Module not found: @praxis/shared`

**Solution:**
```bash
# Build shared package first
cd packages/shared
npm run build

# Then start frontend
cd ../../apps/frontend
npm run dev
```

### Issue: Port already in use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using the port
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or change port in apps/frontend/package.json:
# "dev": "next dev -p 3001"
```

---

## 📚 Useful Commands Reference

```bash
# Root commands (run from /home/marcus/praxis)
npm run dev           # Start all workspaces
npm run build         # Build all packages
npm run lint          # Lint all code
npm run clean         # Clean build artifacts

# Backend commands (run from apps/backend)
npm run dev           # Start backend dev server
npm run build         # Build for production
npx prisma studio     # Open database UI
npx prisma generate   # Generate Prisma client
npx prisma migrate dev # Run new migration

# Frontend commands (run from apps/frontend)
npm run dev           # Start frontend dev server
npm run build         # Build for production
npm run start         # Start production server

# Shared commands (run from packages/shared)
npm run build         # Build shared package
npm run dev           # Watch mode for development
```

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a secure random string
- [ ] Use strong PostgreSQL password
- [ ] Set Redis password (REDIS_PASSWORD)
- [ ] Never commit `.env` or `.env.local` files
- [ ] Update CORS_ORIGIN to your production domain
- [ ] Get real Polymarket API keys
- [ ] Enable Prisma query logging only in development

---

## 🚀 Next Steps

Once everything is running:
1. Create your first user via wallet connection
2. Sync Polymarket data (Phase 3)
3. Build out the API endpoints (Phase 3)
4. Develop the frontend UI (Phase 4)

---

## 📞 Need Help?

If you encounter issues not covered here:
1. Check logs in terminal for specific error messages
2. Verify all services are running (PostgreSQL, Redis, Backend, Frontend)
3. Double-check environment variables match your setup
4. Review the main SETUP.md for additional context

---

**Happy Building! 🎉**
