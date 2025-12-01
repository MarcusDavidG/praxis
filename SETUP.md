# Praxis Setup Guide

## 🎉 Phase 2 Complete - Monorepo Scaffolding Done!

The full project structure has been created with:
- ✅ TurboRepo monorepo setup
- ✅ Shared package with TypeScript types & constants
- ✅ Express backend with Prisma, BullMQ, Redis
- ✅ Next.js 15 frontend with RainbowKit, shadcn/ui, TailwindCSS
- ✅ Complete Prisma schema with all models
- ✅ All configuration files

## 📦 Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies and all workspaces
npm install

# If the above times out, install individually:
cd packages/shared && npm install
cd ../../apps/backend && npm install
cd ../frontend && npm install
```

### 2. Setup Environment Variables

#### Backend (`apps/backend/.env`)
```bash
cd apps/backend
cp .env.example .env
```

Edit `.env` with your values:
- Set up a PostgreSQL database
- Set up Redis
- Add Polymarket API keys (optional for MVP)
- Update JWT secret

#### Frontend (`apps/frontend/.env.local`)
```bash
cd apps/frontend
cp .env.example .env.local
```

Get a WalletConnect Project ID from: https://cloud.walletconnect.com/

### 3. Database Setup

```bash
cd apps/backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates tables)
npm run prisma:migrate

# (Optional) Open Prisma Studio to view DB
npm run prisma:studio
```

### 4. Start Development

Open 3 terminals:

**Terminal 1 - Shared package**
```bash
cd packages/shared
npm run dev
```

**Terminal 2 - Backend**
```bash
cd apps/backend
npm run dev
```

**Terminal 3 - Frontend**
```bash
cd apps/frontend
npm run dev
```

Or use TurboRepo (from root):
```bash
npm run dev
```

## 📁 Project Structure

```
praxis/
├── apps/
│   ├── backend/              # Express API
│   │   ├── src/
│   │   │   ├── api/          # API routes
│   │   │   ├── services/     # Business logic
│   │   │   ├── workers/      # BullMQ workers
│   │   │   ├── jobs/         # Cron jobs
│   │   │   ├── db/           # Prisma client
│   │   │   ├── utils/        # Helpers
│   │   │   └── index.ts      # Entry point
│   │   └── prisma/
│   │       └── schema.prisma # Database schema
│   │
│   └── frontend/             # Next.js app
│       ├── src/
│       │   ├── app/          # App router pages
│       │   ├── components/   # React components
│       │   ├── lib/          # Utilities
│       │   ├── hooks/        # Custom hooks
│       │   ├── services/     # API clients
│       │   ├── store/        # Zustand stores
│       │   └── styles/       # Global CSS
│       └── components.json   # shadcn config
│
└── packages/
    └── shared/               # Shared code
        └── src/
            ├── types.ts      # TypeScript types
            ├── constants.ts  # Constants
            └── utils.ts      # Shared utilities
```

## 🔗 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Prisma Studio**: http://localhost:5555

## 🚀 Next Steps - Phase 3

Now we build the core backend services:

1. **User/Profile API** - Wallet auth, profile CRUD
2. **Analytics Engine** - Calculate PnL, ROI, streaks
3. **Polymarket Sync Worker** - Fetch & sync market data
4. **Feed Service** - Real-time social feed events
5. **Leaderboard Jobs** - Periodic recalculation
6. **Badge Engine** - Auto-assign achievements
7. **Copy Trading Module** - Track & suggest trades
8. **Contest Engine** - Virtual trading competitions

## 📚 Key Technologies

### Backend
- **Express** - Web framework
- **Prisma** - ORM for PostgreSQL
- **BullMQ** - Job queue (Redis-based)
- **Winston** - Logging
- **SIWE** - Wallet authentication
- **Axios** - HTTP client for Polymarket APIs

### Frontend
- **Next.js 15** - React framework (App Router)
- **RainbowKit** - Wallet connection
- **Wagmi** - Ethereum hooks
- **Zustand** - State management
- **shadcn/ui** - UI components
- **TailwindCSS** - Styling

### Polymarket Integration
- **CLOB API** - Order book & trading
- **Gamma API** - Market data
- **Data API** - User positions & trades
- **Builder Program** - Gasless txns & attribution

## 🛠️ Useful Commands

```bash
# Build all packages
npm run build

# Lint all packages
npm run lint

# Clean build artifacts
npm run clean

# Format code
npm run format

# Run Prisma migrations
cd apps/backend && npm run prisma:migrate

# Generate Prisma client
cd apps/backend && npm run prisma:generate
```

## 📖 Documentation

- [Polymarket Docs](https://docs.polymarket.com)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [RainbowKit Docs](https://www.rainbowkit.com)
- [shadcn/ui Docs](https://ui.shadcn.com)
