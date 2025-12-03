# Praxis Demo Guide

## 🚀 Quick Demo Setup

### Step 1: Check Backend is Running

1. Go to your Railway dashboard
2. Check that the backend deployment succeeded (should show green/running)
3. Get your backend URL (e.g., `https://praxis-backend-production.up.railway.app`)
4. Test health endpoint:
   ```bash
   curl https://YOUR-RAILWAY-URL.railway.app/health
   ```
   Should return: `{"status":"ok","timestamp":"...","redis":"disabled","workers":"disabled"}`

### Step 2: Sync Initial Market Data

Since Redis workers are disabled, you need to manually sync markets first:

```bash
# Sync markets from Polymarket (get 20 markets)
curl -X POST https://YOUR-RAILWAY-URL.railway.app/api/markets/sync?limit=20
```

This will fetch and store markets from Polymarket so you have data to browse.

### Step 3: Open the Frontend

1. Visit: **https://praxismarket.vercel.app**
2. Click "Connect Wallet" in the top right
3. Connect your wallet using RainbowKit

### Step 4: Demo Features

#### Browse Markets
- Navigate to "Markets" page
- See the synced markets from Polymarket
- Use search to filter markets
- Click on any market to see details

#### View Your Profile
- After connecting wallet, you'll be auto-registered
- Click your address in the header to see your profile
- Initially you'll have no stats (need to link a Polymarket wallet)

#### Social Feed
- Navigate to "Feed" page
- Will be empty initially (need real trading activity)

## 🎯 Full Demo Flow (With Real Data)

To get a full demo with real data:

### 1. Sync More Markets
```bash
curl -X POST https://YOUR-RAILWAY-URL.railway.app/api/markets/sync?limit=100
```

### 2. Link Your Polymarket Wallet (if you have one)

If you have a Polymarket wallet with actual trades:

```bash
curl -X POST https://YOUR-RAILWAY-URL.railway.app/api/positions/sync/YOUR_WALLET_ADDRESS \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Get your JWT token from browser localStorage after connecting wallet.

### 3. Manually Trigger Analytics

```bash
# Update analytics for your user
curl -X POST https://YOUR-RAILWAY-URL.railway.app/api/analytics/user/YOUR_USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Calculate Leaderboards

```bash
curl -X POST https://YOUR-RAILWAY-URL.railway.app/api/leaderboard/calculate
```

## 📱 Demo Walkthrough

### For Someone Without Polymarket Activity:

1. **Connect Wallet** → Auto-registers your address
2. **Browse Markets** → See real Polymarket markets
3. **View Market Details** → Stats, volume, recent trades
4. **Check Feed** → See global trading activity (once synced)
5. **View Leaderboards** → Top traders by various metrics

### For Someone With Polymarket Activity:

1. **Connect Wallet** → Auto-registers
2. **Sync Your Positions** → Via API or wait for periodic sync
3. **View Dashboard** → See your PnL, ROI, Win Rate, etc.
4. **Browse Your Trades** → See your trading history
5. **Check Your Rank** → See where you stand on leaderboards

## 🔧 Useful API Endpoints for Demo

```bash
# Get all markets
curl https://YOUR-RAILWAY-URL.railway.app/api/markets

# Get specific market
curl https://YOUR-RAILWAY-URL.railway.app/api/markets/MARKET_ID

# Get leaderboard
curl https://YOUR-RAILWAY-URL.railway.app/api/leaderboard/allTime/pnl?limit=10

# Search markets
curl https://YOUR-RAILWAY-URL.railway.app/api/markets/search?q=election

# Get user profile (need auth)
curl https://YOUR-RAILWAY-URL.railway.app/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎨 Demo Tips

1. **First Time**: Sync at least 20-50 markets so there's browsable content
2. **Testing**: Use a wallet that has Polymarket activity for best demo
3. **Feed**: Will show real trades from synced users
4. **Leaderboards**: Need multiple users with synced positions to be interesting

## 🔄 Adding Redis Later (For Auto-Sync)

When you're ready to enable automatic background workers:

1. Add Redis to Railway project
2. Set `REDIS_URL` environment variable in Railway
3. Redeploy - workers will automatically start
4. Background jobs will run:
   - Market sync: Every hour
   - Position sync: On-demand per user
   - Analytics: Every 10 minutes
   - Leaderboards: Every hour

## 🐛 Troubleshooting

**Frontend shows errors:**
- Check Railway backend is running
- Verify CORS is configured with Vercel URL
- Check browser console for specific errors

**No markets showing:**
- Run market sync endpoint first
- Check Railway logs for errors

**Can't connect wallet:**
- Check wallet browser extension is installed
- Try refreshing the page
- Check browser console for errors

**API returns 401:**
- You need to be authenticated
- Connect wallet first to get JWT token
- Token is stored in localStorage
