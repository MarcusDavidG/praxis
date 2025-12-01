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

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 7+

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

## License

MIT
