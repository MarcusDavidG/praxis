# ⚡ Praxis Quick Start Guide

For impatient developers who want to get running FAST! 🚀

---

## Option 1: Docker Setup (Recommended - 5 minutes)

This is the fastest way to get started!

```bash
# 1. Run automated Docker setup
./scripts/docker-setup.sh

# 2. Install npm dependencies
npm install

# 3. Configure backend environment
cd apps/backend
cp .env.example .env

# Edit .env and set:
# DATABASE_URL="postgresql://praxis_user:praxis_secure_password_123@localhost:5432/praxis"

# 4. Configure frontend environment
cd ../frontend
cp .env.example .env.local

# Edit .env.local and add your WalletConnect Project ID:
# Get it from: https://cloud.walletconnect.com/
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id

# 5. Run database migrations
cd ../backend
npx prisma generate
npx prisma migrate dev --name init

# 6. Build shared package
cd ../../packages/shared
npm run build

# 7. Start everything!
cd ../..
npm run dev
```

**Done!** Open http://localhost:3000 🎉

---

## Option 2: Manual Setup (15-20 minutes)

Follow the complete guide: **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)**

---

## Verify Your Setup

Run the setup checker:

```bash
./scripts/check-setup.sh
```

This checks:
- ✅ Node.js & npm versions
- ✅ PostgreSQL connection
- ✅ Redis connection
- ✅ Dependencies installed
- ✅ Environment files
- ✅ Prisma migrations
- ✅ Shared package built

---

## Access Points

Once everything is running:

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:4000 |
| **Prisma Studio** | http://localhost:5555 |
| **PostgreSQL** | localhost:5432 |
| **Redis** | localhost:6379 |

---

## Test Everything Works

### 1. Test Backend API
```bash
curl http://localhost:4000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Test Frontend
- Open http://localhost:3000
- Click "Connect Wallet"
- RainbowKit modal should appear

### 3. Test Database
```bash
cd apps/backend
npx prisma studio
```
- Opens http://localhost:5555
- Browse your database tables

---

## Common Issues & Quick Fixes

### npm install is slow
```bash
# It's normal! Installs ~500MB of packages
# Takes 3-5 minutes on first run
# Go grab a coffee ☕
```

### Port already in use
```bash
# Kill process on port 3000
kill -9 $(lsof -ti:3000)

# Kill process on port 4000
kill -9 $(lsof -ti:4000)
```

### Database connection fails
```bash
# Check PostgreSQL is running
docker ps | grep praxis-postgres

# Restart if needed
docker restart praxis-postgres

# Check connection string in apps/backend/.env
```

### Module not found: @praxis/shared
```bash
# Build shared package
cd packages/shared
npm run build
```

---

## What You Get

After setup, you'll have:

- ✅ **Monorepo** with TurboRepo
- ✅ **Backend API** (Express + Prisma + BullMQ)
- ✅ **Frontend App** (Next.js 15 + RainbowKit)
- ✅ **Database** (PostgreSQL with 14 tables)
- ✅ **Cache** (Redis)
- ✅ **Wallet Auth** (RainbowKit + SIWE)
- ✅ **Type Safety** (TypeScript everywhere)

---

## Development Workflow

```bash
# Start all services at once
npm run dev

# Or start individually:

# Terminal 1: Shared package (watch mode)
cd packages/shared && npm run dev

# Terminal 2: Backend
cd apps/backend && npm run dev

# Terminal 3: Frontend  
cd apps/frontend && npm run dev
```

---

## Useful Commands

```bash
# View database in UI
cd apps/backend && npx prisma studio

# Generate Prisma client after schema changes
cd apps/backend && npx prisma generate

# Create new migration
cd apps/backend && npx prisma migrate dev --name your_migration_name

# Build everything for production
npm run build

# Lint all code
npm run lint

# Format all code
npm run format
```

---

## Stop Services

```bash
# Stop Docker containers
docker stop praxis-postgres praxis-redis

# Restart when needed
docker start praxis-postgres praxis-redis

# Remove containers (data persists)
docker stop praxis-postgres praxis-redis
docker rm praxis-postgres praxis-redis
```

---

## Next Steps - Phase 3

Once your setup is working:

1. ✅ Backend APIs (users, profiles, auth)
2. ✅ Analytics Engine (PnL, ROI, streaks)  
3. ✅ Polymarket Sync Worker
4. ✅ Social Feed Service
5. ✅ Leaderboards
6. ✅ Badge System
7. ✅ Copy Trading
8. ✅ Fantasy Contests

---

## Need More Help?

- **Full Setup Guide:** [INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)
- **Project Docs:** [SETUP.md](./SETUP.md)
- **Architecture:** [README.md](./README.md)

**Let's build! 🚀**
