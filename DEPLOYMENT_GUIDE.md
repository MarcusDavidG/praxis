# 🚀 Praxis Deployment Guide

Complete guide to deploying Praxis to production.

---

## 📋 Deployment Overview

**Architecture:**
- **Frontend**: Vercel (Next.js)
- **Backend API**: Railway or Fly.io (Node.js + Express)
- **Database**: Neon or Supabase (PostgreSQL)
- **Redis**: Upstash (Redis Cloud)
- **Background Workers**: Same server as backend

---

## 🎯 Deployment Steps

### Step 1: Set Up Database (Neon - Recommended)

1. **Create Neon Account**:
   - Visit https://neon.tech
   - Sign up with GitHub
   - Create new project: "praxis-prod"

2. **Get Connection String**:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/praxis?sslmode=require
   ```

3. **Save for later** - You'll need this for backend deployment

---

### Step 2: Set Up Redis (Upstash - Recommended)

1. **Create Upstash Account**:
   - Visit https://upstash.com
   - Sign up with GitHub
   - Create new Redis database: "praxis-redis"

2. **Get Redis URL**:
   ```
   redis://default:xxx@xxx.upstash.io:6379
   ```

3. **Save for later** - You'll need this for backend deployment

---

### Step 3: Deploy Backend to Railway

1. **Create Railway Account**:
   - Visit https://railway.app
   - Sign up with GitHub
   - Connect your GitHub repository

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `MarcusDavidG/praxis`
   - Select root directory

3. **Configure Build Settings**:
   - **Root Directory**: Leave blank (monorepo)
   - **Build Command**: `cd apps/backend && npm install && npx prisma generate`
   - **Start Command**: `cd apps/backend && npm start`
   - **Watch Paths**: `apps/backend/**`

4. **Set Environment Variables**:
   Click "Variables" tab and add:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/praxis?sslmode=require
   REDIS_URL=redis://default:xxx@xxx.upstash.io:6379
   JWT_SECRET=your-super-secure-random-string-min-32-chars
   FRONTEND_URL=https://praxis.vercel.app
   POLYMARKET_API_URL=https://gamma-api.polymarket.com
   POLYMARKET_CLOB_URL=https://clob.polymarket.com
   ```

5. **Run Database Migration**:
   - After first deployment, go to Railway project
   - Click on your service → "Connect"
   - Open terminal and run:
   ```bash
   cd apps/backend
   npx prisma migrate deploy
   ```

6. **Get Backend URL**:
   - Railway will provide: `https://praxis-backend-production.up.railway.app`
   - Save this for frontend deployment

---

### Alternative: Deploy Backend to Fly.io

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly**:
   ```bash
   fly auth login
   ```

3. **Create Fly App**:
   ```bash
   cd apps/backend
   fly launch --no-deploy
   # Name: praxis-backend
   # Region: Choose closest to you
   ```

4. **Set Environment Variables**:
   ```bash
   fly secrets set \
     NODE_ENV=production \
     DATABASE_URL="postgresql://..." \
     REDIS_URL="redis://..." \
     JWT_SECRET="your-secure-secret" \
     FRONTEND_URL="https://praxis.vercel.app"
   ```

5. **Create fly.toml** (if not exists):
   ```toml
   app = "praxis-backend"
   primary_region = "iad"

   [build]
   dockerfile = "Dockerfile"

   [http_service]
   internal_port = 3001
   force_https = true
   auto_stop_machines = false
   auto_start_machines = true
   min_machines_running = 1

   [[vm]]
   cpu_kind = "shared"
   cpus = 1
   memory_mb = 512
   ```

6. **Deploy**:
   ```bash
   fly deploy
   ```

---

### Step 4: Deploy Frontend to Vercel

1. **Create Vercel Account**:
   - Visit https://vercel.com
   - Sign up with GitHub

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import: `MarcusDavidG/praxis`
   - Framework: Next.js
   - Root Directory: `apps/frontend`

3. **Configure Build Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
   - **Root Directory**: `apps/frontend`

4. **Set Environment Variables**:
   Add in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://praxis-backend-production.up.railway.app
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=00d6a4c377c6877396eee6022f51d14f
   ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy automatically

6. **Get Frontend URL**:
   - Vercel provides: `https://praxis.vercel.app`
   - Save this URL

7. **Update Backend with Frontend URL**:
   - Go back to Railway/Fly.io
   - Update `FRONTEND_URL` environment variable
   - Redeploy backend

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

In `apps/backend/src/index.ts`, verify CORS is set to your production frontend:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
```

### 2. Run Initial Data Sync

Trigger market sync manually:
```bash
curl -X POST https://your-backend.railway.app/api/markets/sync
```

### 3. Test Background Workers

Workers should start automatically. Check Railway/Fly.io logs:
- Market sync worker (hourly)
- Analytics worker (every 10 min)
- Leaderboard worker (hourly)

---

## 🧪 Testing Production

### Test Checklist:

1. **Frontend Loads**:
   - Visit https://praxis.vercel.app
   - Check for no console errors

2. **Wallet Connection**:
   - Click "Connect Wallet"
   - Sign message
   - Should auto-register/login

3. **API Endpoints**:
   ```bash
   # Health check
   curl https://your-backend.railway.app/health
   
   # Markets
   curl https://your-backend.railway.app/api/markets
   ```

4. **Dashboard**:
   - After connecting wallet, should redirect to dashboard
   - Stats should load

5. **Markets Page**:
   - Visit /markets
   - Should see synced markets
   - Search should work

6. **Profiles**:
   - Visit your profile
   - Stats should display

7. **Feed**:
   - Visit /feed
   - Should load (may be empty initially)

8. **Leaderboards**:
   - Visit /leaderboard
   - Should display rankings

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is secure (32+ characters, random)
- [ ] DATABASE_URL uses SSL (`?sslmode=require`)
- [ ] CORS restricted to production domain
- [ ] No API keys committed to repo
- [ ] Environment variables set in hosting platforms
- [ ] Database backups enabled (Neon/Supabase auto-backup)

---

## 📊 Monitoring

### Railway Monitoring:
- Check "Metrics" tab for CPU/memory usage
- Check "Logs" for errors
- Set up alerts for downtime

### Vercel Monitoring:
- Check "Analytics" for page views
- Check "Logs" for build/runtime errors
- Monitor Core Web Vitals

### Database Monitoring:
- Neon dashboard shows connection count
- Check query performance
- Monitor storage usage

---

## 🔄 CI/CD Pipeline

Both Vercel and Railway auto-deploy on push to main:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Automatic Deployments**:
   - Vercel rebuilds frontend (2-3 min)
   - Railway rebuilds backend (3-5 min)

3. **Preview Deployments**:
   - Create PR → Vercel creates preview
   - Test before merging

---

## 🐛 Troubleshooting

### Frontend Shows API Error:
- Check `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is running
- Check CORS settings

### Backend Won't Start:
- Check Railway/Fly.io logs
- Verify DATABASE_URL is correct
- Verify REDIS_URL is correct
- Check Prisma migrations ran

### Workers Not Running:
- Check logs for BullMQ errors
- Verify REDIS_URL is reachable
- Check Redis dashboard for connections

### Database Connection Failed:
- Verify SSL mode: `?sslmode=require`
- Check Neon dashboard is active
- Test connection string locally

---

## 💰 Cost Estimates

**Free Tier (Development):**
- Neon: Free (3GB storage, 1 project)
- Upstash: Free (10K commands/day)
- Railway: $5/month credit
- Vercel: Free (hobby)
- **Total: ~$0-5/month**

**Production (With Traffic):**
- Neon Pro: $19/month
- Upstash Pro: $10/month
- Railway: ~$20/month (backend + workers)
- Vercel Pro: $20/month
- **Total: ~$70/month**

---

## 🎯 Optimization Tips

### Backend:
- Enable Redis caching for leaderboards (already done)
- Add connection pooling (Prisma handles this)
- Monitor slow queries in Neon dashboard

### Frontend:
- Enable Vercel Image Optimization
- Add Next.js ISR for market pages
- Implement service worker for offline support

### Database:
- Add indexes on frequently queried fields (already done)
- Monitor connection count
- Enable query logging in production

---

## 📝 Environment Variables Reference

### Backend (.env.production):
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
REDIS_URL=redis://default:pass@host:6379
JWT_SECRET=min-32-char-random-secret
FRONTEND_URL=https://praxis.vercel.app
POLYMARKET_API_URL=https://gamma-api.polymarket.com
POLYMARKET_CLOB_URL=https://clob.polymarket.com
```

### Frontend (.env.production):
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=00d6a4c377c6877396eee6022f51d14f
```

---

## 🚀 Quick Start Deployment (5 Minutes)

**Fastest path to production:**

1. **Neon** (2 min):
   - Sign up → Create project → Copy DATABASE_URL

2. **Upstash** (1 min):
   - Sign up → Create Redis → Copy REDIS_URL

3. **Railway** (2 min):
   - Import GitHub repo
   - Set env vars
   - Deploy
   - Run `npx prisma migrate deploy`

4. **Vercel** (1 min):
   - Import GitHub repo
   - Set NEXT_PUBLIC_API_URL
   - Deploy

**Done! Your app is live! 🎉**

---

## 📞 Support

**Issues?**
- Check Railway/Vercel logs
- Review this guide
- Check GitHub issues
- Test locally first

**Need Help?**
- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- Neon docs: https://neon.tech/docs
- Upstash docs: https://docs.upstash.com
