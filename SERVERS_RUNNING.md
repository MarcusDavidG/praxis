# 🚀 Praxis Servers Running!

## ✅ Both Servers Are Live!

Your development environment is fully operational.

---

## 🌐 Access Your Application

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | ✅ Running |
| **Backend API** | http://localhost:4000 | ✅ Running |
| **Health Check** | http://localhost:4000/health | ✅ Responding |

### Additional Services:
| Service | Port | Status |
|---------|------|--------|
| PostgreSQL | 5432 | ✅ Running (Docker) |
| Redis | 6379 | ✅ Running (Docker) |

---

## 🧪 Test Your Application

### 1. Frontend Web App
**Open in your browser:**
```
http://localhost:3000
```

**What you should see:**
- Beautiful Praxis landing page
- "Connect Wallet" button (RainbowKit)
- Three feature cards (Track Traders, Copy Trading, Compete)

**Test Wallet Connection:**
1. Click "Connect Wallet" button
2. RainbowKit modal appears with wallet options
3. Select MetaMask, WalletConnect, or other options
4. Connect your wallet (test on Polygon network)

---

### 2. Backend API
**Test health endpoint:**
```bash
curl http://localhost:4000/health
```

**Expected response:**
```json
{"status":"ok","timestamp":"2025-12-01T11:05:42.147Z"}
```

**API is ready for:**
- User registration
- Profile management
- Market data
- Trading analytics
- Social feed
- Leaderboards

---

### 3. Database UI
**Explore your database:**
```bash
cd /home/marcus/praxis/apps/backend
npx prisma studio
```

**Opens:** http://localhost:5555

**You can browse:**
- All 14 tables (empty for now)
- Add test data manually
- View relationships
- Run queries

---

## 📋 What to Test

### ✅ Frontend Features (Current)
- [x] Landing page loads
- [x] RainbowKit wallet connection
- [x] Responsive design
- [x] Dark/light mode (if implemented)

### 🔜 Backend Features (Coming in Phase 3)
- [ ] User registration API
- [ ] Profile management
- [ ] Market data endpoints
- [ ] Analytics endpoints
- [ ] Social feed
- [ ] Leaderboards
- [ ] Copy trading

---

## 🛠️ Development Workflow

### Making Changes

**Frontend:**
1. Edit files in `apps/frontend/src/`
2. Changes auto-reload in browser (hot reload)
3. Check terminal for any errors

**Backend:**
1. Edit files in `apps/backend/src/`
2. Server auto-restarts (watch mode)
3. Check logs: `tail -f /tmp/praxis-backend.log`

**Shared Types:**
1. Edit `packages/shared/src/`
2. Auto-rebuilds on save
3. Both frontend & backend pick up changes

---

## 📊 Server Logs

**View live backend logs:**
```bash
tail -f /tmp/praxis-backend.log
```

**View live frontend logs:**
```bash
tail -f /tmp/praxis-frontend.log
```

---

## 🔄 Restart Servers

If you need to restart:

**Stop servers:**
```bash
pkill -f "tsx watch"
pkill -f "next dev"
```

**Start again:**
```bash
cd /home/marcus/praxis
npm run dev
```

---

## 🐛 Troubleshooting

### Frontend won't load
```bash
# Check if server is running
curl http://localhost:3000

# Check logs
tail -30 /tmp/praxis-frontend.log

# Restart
pkill -f "next dev"
cd apps/frontend && npm run dev
```

### Backend not responding
```bash
# Check if server is running
curl http://localhost:4000/health

# Check logs
tail -30 /tmp/praxis-backend.log

# Restart
pkill -f "tsx watch"
cd apps/backend && npm run dev
```

### Database connection issues
```bash
# Check PostgreSQL
docker ps | grep praxis-postgres

# Restart if needed
docker restart praxis-postgres

# Wait 5 seconds, then restart backend
```

---

## 🎯 Next Steps After Testing

Once you've tested the application and everything works:

### Phase 3A: User Authentication
- Build user registration endpoint
- Implement wallet authentication (SIWE)
- Create profile management APIs
- Add follow/unfollow system

### Phase 3B: Polymarket Integration
- Market data sync worker
- Position tracking
- Trade history
- Real-time updates

### Phase 3C: Analytics Engine
- PnL calculation
- ROI, win rate, accuracy
- Trading streaks
- User statistics

---

## 💡 Tips

1. **Keep terminals open** - Servers run in background
2. **Watch logs** - Use `tail -f` to monitor
3. **Hot reload** - Changes auto-apply
4. **Prisma Studio** - Visual database browser
5. **Docker** - Services persist between restarts

---

## 🎊 You're Live!

Your Praxis development environment is fully operational and ready for Phase 3 development!

**Servers running:**
- ✅ Frontend on http://localhost:3000
- ✅ Backend on http://localhost:4000
- ✅ PostgreSQL (Docker)
- ✅ Redis (Docker)

**Ready to build the future of social trading!** 🚀
