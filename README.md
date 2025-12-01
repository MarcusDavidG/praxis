# Praxis - Social Trading Network for Polymarket

Praxis is a social trading layer built on top of Polymarket that turns prediction market trading into a social game.

## Features

- **Trader Profiles** - Track PnL, ROI, accuracy, streaks, and more
- **Leaderboards** - Daily/weekly/all-time rankings
- **Copy Trading** - Follow top traders and mirror their positions (non-custodial)
- **Social Feed** - Real-time updates on whale trades, streaks, and market movements
- **Challenges & Badges** - Gamification with achievements
- **Fantasy Contests** - Weekly free-to-play virtual trading competitions

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS + shadcn/ui
- RainbowKit + Wagmi
- Zustand

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + Prisma
- BullMQ (workers)
- Redis

### Blockchain
- Polymarket APIs (Markets, Trades, CLOB)
- Polygon network

## Project Structure

```
praxis/
├── apps/
│   ├── frontend/          # Next.js 15 app
│   └── backend/           # Express API server
├── packages/
│   └── shared/            # Shared types & constants
└── turbo.json
```

## 🚀 Quick Start

Choose your adventure:

### ⚡ Option 1: Automated Setup (5 minutes)
```bash
./scripts/auto-setup.sh
npm run dev
```

### 🐳 Option 2: Docker Only (2 minutes)
```bash
./scripts/docker-setup.sh
# Then follow steps in QUICKSTART.md
```

### 📖 Option 3: Manual Setup (15 minutes)
See **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** for detailed instructions.

### 📋 Documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Fast setup for impatient devs
- **[INSTALLATION_GUIDE.md](./INSTALLATION_GUIDE.md)** - Complete step-by-step guide
- **[SETUP.md](./SETUP.md)** - Project overview and architecture

### 🔍 Verify Setup
```bash
./scripts/check-setup.sh
```

## Prerequisites

- Node.js 18+
- npm 10+
- PostgreSQL 14+ (or Docker)
- Redis 7+ (or Docker)

## Development

```bash
npm run dev  # Starts all workspaces
```

## License

MIT
