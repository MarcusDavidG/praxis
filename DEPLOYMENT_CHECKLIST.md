# 🚀 Praxis Deployment Checklist

Use this checklist to deploy Praxis step-by-step.

---

## ✅ Pre-Deployment

- [ ] All code committed to GitHub
- [ ] Tests passing locally
- [ ] Backend runs without errors: `cd apps/backend && npm start`
- [ ] Frontend runs without errors: `cd apps/frontend && npm run dev`
- [ ] Environment variables documented

---

## 📊 Step 1: Database Setup

### Option A: Neon (Recommended)

- [ ] Create account at https://neon.tech
- [ ] Create new project: "praxis-prod"
- [ ] Copy connection string (includes `?sslmode=require`)
- [ ] Test connection locally:
  ```bash
  DATABASE_URL="postgresql://..." npm run --prefix apps/backend prisma:migrate
  ```
- [ ] **Save DATABASE_URL** for backend deployment

### Option B: Supabase

- [ ] Create account at https://supabase.com
- [ ] Create new project: "praxis"
- [ ] Go to Settings → Database
- [ ] Copy connection string (pooler)
- [ ] **Save DATABASE_URL** for backend deployment

---

## 🔴 Step 2: Redis Setup

### Upstash (Recommended)

- [ ] Create account at https://upstash.com
- [ ] Create new Redis database: "praxis-redis"
- [ ] Select region (closest to your backend)
- [ ] Copy Redis URL
- [ ] Test connection:
  ```bash
  npm install -g redis-cli
  redis-cli -u "redis://default:xxx@xxx.upstash.io:6379" ping
  ```
- [ ] **Save REDIS_URL** for backend deployment

---

## 🖥️ Step 3: Backend Deployment

### Option A: Railway (Easiest)

- [ ] Create account at https://railway.app
- [ ] Click "New Project" → "Deploy from GitHub"
- [ ] Select repository: `MarcusDavidG/praxis`
- [ ] Configure service:
  - **Name**: praxis-backend
  - **Root Directory**: Leave blank
- [ ] Add environment variables:
  ```
  NODE_ENV=production
  PORT=3001
  DATABASE_URL=<from Step 1>
  REDIS_URL=<from Step 2>
  JWT_SECRET=<generate random 32+ char string>
  FRONTEND_URL=https://praxis.vercel.app
  POLYMARKET_API_URL=https://gamma-api.polymarket.com
  POLYMARKET_CLOB_URL=https://clob.polymarket.com
  ```
- [ ] Update start command:
  ```
  cd apps/backend && npm install && npx prisma generate && npx prisma migrate deploy && npm start
  ```
- [ ] Click "Deploy"
- [ ] Wait for deployment (3-5 minutes)
- [ ] Check logs for errors
- [ ] Copy backend URL: `https://praxis-backend-production.up.railway.app`
- [ ] Test API: `curl https://your-backend.railway.app/api/markets`

### Option B: Fly.io

- [ ] Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
- [ ] Login: `fly auth login`
- [ ] Navigate to backend: `cd apps/backend`
- [ ] Launch: `fly launch --no-deploy`
  - Name: praxis-backend
  - Region: Choose closest
- [ ] Set secrets:
  ```bash
  fly secrets set \
    NODE_ENV=production \
    DATABASE_URL="<from Step 1>" \
    REDIS_URL="<from Step 2>" \
    JWT_SECRET="<random string>" \
    FRONTEND_URL="https://praxis.vercel.app"
  ```
- [ ] Deploy: `fly deploy`
- [ ] Check status: `fly status`
- [ ] Copy backend URL: `https://praxis-backend.fly.dev`

---

## 🎨 Step 4: Frontend Deployment

### Vercel (Recommended)

- [ ] Create account at https://vercel.com
- [ ] Click "Add New..." → "Project"
- [ ] Import: `MarcusDavidG/praxis`
- [ ] Configure project:
  - **Framework**: Next.js
  - **Root Directory**: `apps/frontend`
  - **Build Command**: `npm run build`
  - **Output Directory**: `.next`
- [ ] Add environment variables:
  ```
  NEXT_PUBLIC_API_URL=<backend URL from Step 3>
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=00d6a4c377c6877396eee6022f51d14f
  ```
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Copy frontend URL: `https://praxis.vercel.app`

---

## 🔄 Step 5: Connect Frontend & Backend

- [ ] Go back to Railway/Fly.io backend
- [ ] Update `FRONTEND_URL` environment variable with actual Vercel URL
- [ ] Redeploy backend
- [ ] Verify CORS is working

---

## 🧪 Step 6: Testing

### Health Checks:

- [ ] Backend health: `curl https://your-backend.railway.app/health`
- [ ] Markets API: `curl https://your-backend.railway.app/api/markets`
- [ ] Frontend loads: Visit `https://praxis.vercel.app`

### Functionality Tests:

- [ ] Connect wallet (MetaMask/Rainbow)
- [ ] Sign authentication message
- [ ] Auto-redirect to dashboard
- [ ] Dashboard stats load
- [ ] Visit `/markets` - markets display
- [ ] Search markets
- [ ] Click market details
- [ ] Visit `/profile/[username]`
- [ ] Visit `/feed`
- [ ] Visit `/leaderboard`

### Background Workers:

- [ ] Check Railway/Fly logs for worker startup
- [ ] Trigger manual sync: `curl -X POST https://your-backend.railway.app/api/markets/sync`
- [ ] Verify markets updated in database
- [ ] Check Redis for cached leaderboards

---

## 🔐 Step 7: Security Review

- [ ] JWT_SECRET is secure (32+ random characters)
- [ ] DATABASE_URL includes `?sslmode=require`
- [ ] REDIS_URL uses TLS
- [ ] No secrets in GitHub repo
- [ ] CORS only allows production frontend domain
- [ ] Rate limiting enabled (if applicable)
- [ ] Database backups enabled (Neon auto-backups)

---

## 📊 Step 8: Monitoring Setup

### Railway:

- [ ] Check "Metrics" tab (CPU, memory, network)
- [ ] Review "Logs" for errors
- [ ] Set up email alerts for downtime

### Vercel:

- [ ] Check "Analytics" for traffic
- [ ] Review "Logs" for errors
- [ ] Monitor Core Web Vitals

### Database (Neon):

- [ ] Check connection count
- [ ] Monitor query performance
- [ ] Review storage usage

### Redis (Upstash):

- [ ] Check command count
- [ ] Monitor memory usage
- [ ] Review connection stability

---

## 🎉 Step 9: Go Live!

- [ ] Share frontend URL with users
- [ ] Announce on social media
- [ ] Monitor for first hour
- [ ] Check error rates
- [ ] Verify user registrations working
- [ ] Confirm data syncing from Polymarket

---

## 🐛 Troubleshooting

### Frontend shows "Network Error":
- [ ] Check NEXT_PUBLIC_API_URL is correct
- [ ] Verify backend is running
- [ ] Check browser console for CORS errors
- [ ] Test backend URL directly: `curl https://your-backend.railway.app/api/markets`

### Backend won't start:
- [ ] Check Railway/Fly logs for error messages
- [ ] Verify DATABASE_URL is correct
- [ ] Verify REDIS_URL is correct
- [ ] Check Prisma migrations: `npx prisma migrate status`

### Database connection failed:
- [ ] Ensure SSL enabled: `?sslmode=require`
- [ ] Check Neon dashboard shows "Active"
- [ ] Test connection string locally
- [ ] Verify no IP restrictions

### Workers not running:
- [ ] Check logs for BullMQ errors
- [ ] Verify REDIS_URL is reachable
- [ ] Check Redis dashboard for connections
- [ ] Manually trigger: `curl -X POST https://your-backend/api/markets/sync`

### "Wallet connection failed":
- [ ] Verify NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is set
- [ ] Check browser wallet extension is installed
- [ ] Test with different wallet (MetaMask, Rainbow)
- [ ] Check browser console for errors

---

## 📝 Post-Deployment Notes

**Deployed URLs:**
- Frontend: ________________________________
- Backend: ________________________________
- Database: ________________________________
- Redis: ________________________________

**Admin Access:**
- Railway: ________________________________
- Vercel: ________________________________
- Neon: ________________________________
- Upstash: ________________________________

**Deployment Date:** ________________________________

**First User:** ________________________________

---

## 🔄 Future Deployments

### Automatic (CI/CD):
1. Push to `main` branch
2. Vercel auto-deploys frontend (2-3 min)
3. Railway auto-deploys backend (3-5 min)
4. No manual steps needed! ✅

### Manual Updates:
1. Test locally
2. Commit changes
3. Push to GitHub
4. Monitor deployment logs
5. Test production

---

## ✅ All Done!

Congratulations! Praxis is now live in production! 🎉

**Next Steps:**
- Monitor usage and errors
- Collect user feedback
- Plan feature enhancements
- Scale as needed

**Need help?** Check Railway, Vercel, Neon, and Upstash documentation.
