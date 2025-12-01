# 🎯 START HERE - Praxis Setup

Welcome to Praxis! This guide will get you up and running in minutes.

---

## 📦 What You Have

Your repository includes:

✅ **Complete Monorepo Structure**
- Backend API (Express + Prisma + BullMQ)
- Frontend App (Next.js 15 + RainbowKit)
- Shared TypeScript package
- TurboRepo configuration

✅ **Database Schema**
- 14 Prisma models ready to go
- Full schema for users, markets, positions, trades, etc.

✅ **Setup Automation**
- 3 helper scripts to automate setup
- Comprehensive documentation

---

## 🚀 Choose Your Setup Path

### ⚡ Path 1: Automated (FASTEST - 5 min)
**Best for: Quick start with Docker**

```bash
cd /home/marcus/praxis
./scripts/auto-setup.sh
```

This script will:
1. ✅ Check prerequisites
2. ✅ Install npm dependencies
3. ✅ Setup PostgreSQL & Redis (Docker)
4. ✅ Configure environment files
5. ✅ Run database migrations
6. ✅ Build shared package

Then just:
```bash
npm run dev
```

---

### 🐳 Path 2: Docker Services Only (2 min)
**Best for: You want to install npm manually**

```bash
cd /home/marcus/praxis
./scripts/docker-setup.sh
```

Then follow the remaining steps in **[QUICKSTART.md](./QUICKSTART.md)**

---

### 📖 Path 3: Manual Setup (15 min)
**Best for: Learning the full setup process**

Follow **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** step by step.

---

## 📋 All Documentation

| Document | Purpose |
|----------|---------|
| **[START_HERE.md](./START_HERE.md)** | You are here! Quick decision guide |
| **[QUICKSTART.md](./QUICKSTART.md)** | Fast reference for impatient devs |
| **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** | Complete step-by-step guide |
| **[SETUP.md](./SETUP.md)** | Project overview & architecture |
| **[README.md](./README.md)** | Project description |

---

## 🛠️ Helper Scripts

Located in `scripts/`:

| Script | Purpose |
|--------|---------|
| `auto-setup.sh` | Full automated setup |
| `docker-setup.sh` | Setup Docker containers only |
| `check-setup.sh` | Verify your setup is correct |

---

## ⚡ Quick Start Commands

After setup is complete:

```bash
# Start all services at once
npm run dev

# Or start individually:
cd packages/shared && npm run dev    # Terminal 1
cd apps/backend && npm run dev       # Terminal 2
cd apps/frontend && npm run dev      # Terminal 3
```

---

## 🌐 Access Points

Once running:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web app |
| Backend API | http://localhost:4000 | REST API |
| Health Check | http://localhost:4000/health | API status |
| Prisma Studio | http://localhost:5555 | Database UI |

---

## ✅ Verify Setup

Run this after setup:

```bash
./scripts/check-setup.sh
```

This checks:
- ✅ Node.js & npm
- ✅ PostgreSQL connection
- ✅ Redis connection
- ✅ Dependencies installed
- ✅ Environment files exist
- ✅ Database migrations run
- ✅ Shared package built

---

## 🔑 Important: WalletConnect Setup

You'll need a WalletConnect Project ID for the frontend:

1. Go to https://cloud.walletconnect.com/
2. Sign in (GitHub/email)
3. Create new project
4. Copy Project ID
5. Add to `apps/frontend/.env.local`:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here
   ```

---

## 🎬 What Happens After Setup?

Once your environment is running, we'll move to **Phase 3: Backend Development**

We'll build:
1. ✅ User & Profile APIs
2. ✅ Analytics Engine (PnL, ROI, streaks)
3. ✅ Polymarket Sync Worker
4. ✅ Social Feed Service
5. ✅ Leaderboards System
6. ✅ Badge Achievement Engine
7. ✅ Copy Trading Module
8. ✅ Fantasy Contests

---

## 🆘 Need Help?

### Common Issues

**npm install is slow**
- This is normal! It installs ~500MB of packages
- Takes 3-5 minutes on first run

**Port already in use**
```bash
kill -9 $(lsof -ti:3000)  # Kill process on port 3000
kill -9 $(lsof -ti:4000)  # Kill process on port 4000
```

**Database connection fails**
```bash
docker ps | grep praxis-postgres      # Check if running
docker restart praxis-postgres        # Restart container
```

### Full Troubleshooting

See **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - Section "Troubleshooting"

---

## 📝 Your Next Steps

1. **Choose a setup path** (automated/docker/manual)
2. **Run the setup**
3. **Get WalletConnect Project ID**
4. **Start dev servers** (`npm run dev`)
5. **Verify everything works** (`./scripts/check-setup.sh`)
6. **Let me know you're ready for Phase 3!**

---

## 💡 Pro Tips

- Use the automated script if you have Docker installed
- Run `./scripts/check-setup.sh` after any setup step
- Open Prisma Studio to explore your database: `cd apps/backend && npx prisma studio`
- Use `npm run dev` from root to start everything at once

---

**Ready to build? Let's go! 🚀**
