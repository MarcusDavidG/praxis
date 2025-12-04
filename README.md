# Praxis - Social Trading Network for Polymarket

Praxis is a social trading overlay built on Polymarket that enables users to track top traders, analyze market performance, and engage with prediction markets through a social lens.

## Live Application

- **Frontend:** https://praxismarket.vercel.app
- **Backend API:** https://praxisbackend-production.up.railway.app

## Overview

Praxis transforms prediction market trading into a social experience by providing analytics, leaderboards, and social features on top of Polymarket. Users can discover top traders, follow market trends, and compete on performance rankings while maintaining full control of their assets through non-custodial wallet integration.

## Implemented Features

### Core Features
- **Wallet Authentication** - Sign in with Web3 wallets using signature-based authentication
- **Market Browser** - Browse and search through 100+ Polymarket markets with pagination
- **Market Details** - View comprehensive market information including volume, liquidity, and outcomes
- **User Profiles** - Display trader statistics, follow/unfollow functionality
- **Social Feed** - Stream of trading activity with filters for Global, Following, and Whale Trades
- **Leaderboard System** - Rankings across 15 different timeframes and metrics
- **Dashboard** - Personal statistics and portfolio overview



### Backend Services
- **40 REST API Endpoints** - Complete CRUD operations for all features
- **Authentication System** - JWT-based auth with wallet signature verification
- **Polymarket Integration** - Market and position syncing services
- **Analytics Engine** - User performance metrics calculation
- **Leaderboard Workers** - Automated ranking updates with caching
- **Database Layer** - 14 Prisma models for comprehensive data management

## Tech Stack

### Frontend
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS with custom design system
- **Web3:** RainbowKit + Wagmi for wallet connections
- **State Management:** Zustand for global state

- **UI Components:** Custom components with shadcn/ui base

 
- **HTTP Client:** Axios with interceptors

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 14+ with Prisma ORM
- **Background Jobs:** BullMQ (optional, requires Redis)
- **Authentication:** JWT tokens with wallet signature verification
- **Logging:** Winston
- **Validation:** Express validators
- **CORS:** Configured for production frontend

### Infrastructure
- **Frontend Hosting:** Vercel (automatic deployments from GitHub)
- **Backend Hosting:** Railway (automatic deployments from GitHub)
- **Database:** Railway PostgreSQL
- **Version Control:** GitHub with main branch auto-deploy

### Blockchain Integration
- **Platform:** Polymarket (Polygon network)
- **APIs:** CLOB API, Gamma API, Data API
- **Wallet Support:** MetaMask, WalletConnect, Coinbase Wallet, and more via RainbowKit

## Project Structure

```
praxis/
├── apps/
│   ├── frontend/              # Next.js application
│   │   ├── src/
│   │   │   ├── app/           # App router pages
│   │   │   ├── components/    # React components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── services/      # API services
│   │   │   ├── store/         # Zustand stores
│   │   │   ├── lib/           # Utilities and config
│   │   │   └── styles/        # Global styles
│   │   └── package.json
│   └── backend/               # Express API server
│       ├── src/
│       │   ├── api/           # Route handlers
│       │   ├── services/      # Business logic
│       │   ├── workers/       # Background jobs
│       │   ├── db/            # Database and Prisma
│       │   ├── middlewares/   # Express middlewares
│       │   ├── utils/         # Helper functions
│       │   └── config/        # Configuration
│       └── package.json
├── packages/
│   └── shared/                # Shared TypeScript types
├── scripts/                   # Setup and utility scripts
├── turbo.json                 # TurboRepo configuration
└── package.json               # Root package.json
```

## Database Schema

The application uses 14 Prisma models:

- **User** - User accounts and profiles
- **Market** - Polymarket markets data
- **Position** - User trading positions
- **Trade** - Individual trade records
- **Follow** - User follow relationships
- **FeedEvent** - Social feed entries
- **UserAnalytics** - Computed user statistics
- **MarketAnalytics** - Market performance metrics
- **LeaderboardEntry** - Ranking data
- **Badge** - Achievement badges
- **UserBadge** - User badge assignments
- **CopyTrade** - Copy trading relationships
- **Contest** - Fantasy trading contests
- **ContestEntry** - Contest participation

## API Architecture

### Authentication Endpoints
- POST `/api/auth/nonce` - Generate signature message
- POST `/api/auth/verify` - Verify signature and login
- POST `/api/auth/register-and-verify` - Register new user and login

### User Endpoints
- GET `/api/users/me` - Get current user
- PATCH `/api/users/me` - Update profile
- GET `/api/users/:id` - Get user by ID
- POST `/api/users/:id/follow` - Follow user
- DELETE `/api/users/:id/follow` - Unfollow user

### Market Endpoints
- GET `/api/markets` - List markets with pagination
- GET `/api/markets/top` - Get top markets by volume
- GET `/api/markets/search` - Search markets
- GET `/api/markets/:id` - Get market details
- POST `/api/markets/sync` - Trigger market sync
- GET `/api/markets/:id/analytics` - Get market analytics

### Analytics Endpoints
- GET `/api/analytics/user/:id` - Get user analytics
- GET `/api/analytics/leaderboard` - Get leaderboard data

### Feed Endpoints
- GET `/api/feed` - Get social feed
- GET `/api/feed/following` - Get following feed
- GET `/api/feed/whales` - Get whale trades

### Position Endpoints
- GET `/api/positions` - Get user positions
- GET `/api/positions/:id` - Get position details
- POST `/api/positions/sync` - Sync positions

## Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://praxisbackend-production.up.railway.app
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Backend (.env)
```bash
# Server
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://praxismarket.vercel.app

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your-secret-key

# Polymarket (optional)
POLYMARKET_API_KEY=your-api-key
POLYMARKET_BUILDER_KEY=your-builder-key

# Redis (optional - for background workers)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm 10 or higher
- PostgreSQL 14+ (or Railway account)
- Git

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/MarcusDavidG/praxis.git
cd praxis
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Frontend
cp apps/frontend/.env.example apps/frontend/.env.local
# Edit with your values

# Backend
cp apps/backend/.env.example apps/backend/.env
# Edit with your values
```

4. Set up database:
```bash
cd apps/backend
npx prisma generate
npx prisma db push
```

5. Run development servers:
```bash
# From root directory
npm run dev
```

This starts:
- Frontend at http://localhost:3000
- Backend at http://localhost:4000


### Background Workers

Background workers (market sync, analytics, leaderboards) are optional and require Redis:

- Currently disabled in production deployment
- Can be enabled by adding Redis service to Railway
- Workers will auto-start when Redis connection is detected





## Contributing

This is a personal project. For major changes, please open an issue first to discuss proposed changes.

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built on top of Polymarket infrastructure
Uses RainbowKit for wallet connectivity
Inspired by social trading platforms
