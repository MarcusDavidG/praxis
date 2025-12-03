# 🚂 Railway All-in-One Deploy (Simplest!)

Use Railway for everything - no need for external services!

---

## ⚡ Total Time: ~8 Minutes

### Prerequisites:
- GitHub account
- GitHub repo: `MarcusDavidG/praxis` (✅ you have this)

---

## 🚀 Step 1: Deploy Everything to Railway (5 min)

### 1.1 Sign Up & Create Project
1. **Open**: https://railway.app (if this doesn't load, try https://railway.app/login)
2. **Click**: "Login" → "Login with GitHub"
3. **Authorize** Railway
4. **Click**: "New Project"

### 1.2 Add PostgreSQL Database
1. **Click**: "New" → "+ Database" → "Add PostgreSQL"
2. Railway creates database automatically
3. **Copy DATABASE_URL**:
   - Click on "Postgres" service card
   - Go to "Variables" tab
   - Copy the `DATABASE_URL` value
   - **SAVE THIS** (looks like: `postgresql://postgres:pass@host:5432/railway`)

### 1.3 Add Redis Database
1. **Click**: "New" → "+ Database" → "Add Redis"
2. Railway creates Redis automatically
3. **Copy REDIS_URL**:
   - Click on "Redis" service card
   - Go to "Variables" tab
   - Copy the `REDIS_URL` value
   - **SAVE THIS** (looks like: `redis://default:pass@host:6379`)

### 1.4 Generate JWT Secret
On your local machine, run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**SAVE THIS SECRET**

### 1.5 Deploy Backend
1. **Click**: "New" → "+ GitHub Repo"
2. **Select**: `MarcusDavidG/praxis`
3. **Click**: "Add variables" or skip for now
4. Railway detects your repo and starts deploying

### 1.6 Configure Backend
1. **Click** on your service card (praxis)
2. **Go to "Settings" tab**
3. **Root Directory**: Leave blank (monorepo auto-detected)
4. **Start Command**: 
   ```
   cd apps/backend && npm install && npx prisma generate && npx prisma migrate deploy && npm start
   ```
5. **Click "Deploy"**

### 1.7 Add Environment Variables
1. **Still in your backend service**
2. **Click "Variables" tab**
3. **Click "Raw Editor"**
4. **Paste this** (replace with YOUR values):

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
JWT_SECRET=YOUR_GENERATED_SECRET_FROM_STEP_1.4
FRONTEND_URL=https://praxis.vercel.app
POLYMARKET_API_URL=https://gamma-api.polymarket.com
POLYMARKET_CLOB_URL=https://clob.polymarket.com
```

**NOTE**: The `${{Postgres.DATABASE_URL}}` and `${{Redis.REDIS_URL}}` are Railway's way to reference other services. Or you can paste the actual URLs you copied.

5. **Click outside the editor** to save
6. Railway will **auto-redeploy** (wait 3-5 minutes)

### 1.8 Generate Backend Domain
1. **Settings tab** → Scroll to "Networking"
2. **Click "Generate Domain"**
3. **Copy the URL**: `https://praxis-production-xxxx.up.railway.app`
4. **SAVE THIS** - you need it for Vercel!

---

## 🎨 Step 2: Deploy Frontend to Vercel (2 min)

### 2.1 Sign Up & Import
1. **Open**: https://vercel.com
2. **Click**: "Sign Up" → "Continue with GitHub"
3. **Click**: "Add New..." → "Project"
4. **Select**: `MarcusDavidG/praxis`
5. **Click**: "Import"

### 2.2 Configure Project
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: 
   - Click "Edit"
   - Select `apps/frontend`
3. **Build Settings**: Leave defaults

### 2.3 Environment Variables
Click "Environment Variables" and add **TWO** variables:

**Variable 1:**
- **Name**: `NEXT_PUBLIC_API_URL`
- **Value**: Your Railway backend URL from Step 1.8 (e.g., `https://praxis-production-xxxx.up.railway.app`)

**Variable 2:**
- **Name**: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- **Value**: `00d6a4c377c6877396eee6022f51d14f`

### 2.4 Deploy
1. **Click "Deploy"**
2. **Wait 2-3 minutes** for build
3. **Copy your Vercel URL**: `https://praxis-xxxx.vercel.app`

---

## 🔄 Step 3: Update Backend CORS (30 sec)

1. **Go back to Railway**
2. **Click your backend service**
3. **Variables tab**
4. **Find `FRONTEND_URL`**
5. **Change from** `https://praxis.vercel.app` **to** your actual Vercel URL
6. **Railway auto-redeploys**

---

## 🧪 Step 4: Test Everything (1 min)

### 4.1 Test Backend
```bash
curl https://YOUR_RAILWAY_BACKEND_URL/api/markets
```

Should return JSON (might be empty initially).

### 4.2 Sync Initial Data
```bash
curl -X POST https://YOUR_RAILWAY_BACKEND_URL/api/markets/sync
```

Should return: `{"success": true, "message": "Market sync started"}`

### 4.3 Test Frontend
1. **Visit your Vercel URL**
2. **Click "Connect Wallet"**
3. **Connect MetaMask/Rainbow**
4. **Sign the message**
5. **Should redirect to dashboard** ✅

---

## ✅ You're Live!

**Your Production URLs:**
- Frontend: `https://praxis-xxxx.vercel.app`
- Backend: `https://praxis-production-xxxx.up.railway.app`
- Database: Railway PostgreSQL (internal)
- Redis: Railway Redis (internal)

**All services in one place!** 🎉

---

## 💰 Cost

**Railway Pricing:**
- Free: $5 credit/month (good for development)
- If you exceed: ~$5-20/month depending on usage
- All 3 services (DB + Redis + Backend) share the credit

**Vercel:**
- Free tier (unlimited for hobby projects)

**Total: $0-5/month to start**

---

## 📊 Monitor Your App

**Railway Dashboard**: https://railway.app/dashboard
- See all 3 services (Postgres, Redis, Backend)
- View logs for each service
- Monitor CPU/memory/network
- Check database connections

**Vercel Dashboard**: https://vercel.com/dashboard
- View deployments
- Check analytics
- Monitor errors

---

## 🔄 Future Updates

**Automatic CI/CD enabled!**

```bash
git add .
git commit -m "Update feature"
git push origin main
```

- Railway auto-deploys backend (3-5 min)
- Vercel auto-deploys frontend (2-3 min)

---

## 🐛 Troubleshooting

### Railway won't load:
- Try: https://railway.app/login
- Try: Use mobile hotspot to bypass firewall
- Try: Use VPN
- Alternative: Use Render.com (similar service)

### Backend build fails:
**Check Railway logs:**
1. Click backend service
2. "Deployments" tab
3. Click latest deployment
4. View logs

**Common issues:**
- Missing environment variables
- DATABASE_URL format wrong
- Start command incorrect

### Frontend shows "Network Error":
1. Check `NEXT_PUBLIC_API_URL` in Vercel
2. Verify backend is running (check Railway)
3. Test backend directly: `curl YOUR_BACKEND_URL/api/markets`
4. Check CORS: Verify `FRONTEND_URL` matches Vercel URL

### Database connection error:
1. Railway Postgres should work out of the box
2. Check `DATABASE_URL` format
3. Ensure it starts with `postgresql://`
4. Try using Railway's variable reference: `${{Postgres.DATABASE_URL}}`

---

## 🎉 Success Checklist

- [ ] Railway project created
- [ ] PostgreSQL added to Railway
- [ ] Redis added to Railway
- [ ] Backend deployed to Railway
- [ ] Backend domain generated
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set correctly
- [ ] Backend FRONTEND_URL updated
- [ ] Markets synced (curl command worked)
- [ ] Wallet connects successfully
- [ ] Dashboard loads with stats
- [ ] Can browse markets
- [ ] Can view profiles
- [ ] Can see feed
- [ ] Can see leaderboards

---

## 🚀 You're Done!

Share your app with the world! 🌍

**Your live app**: `https://praxis-xxxx.vercel.app`

**Next steps:**
- Share on Twitter/X
- Share on Farcaster
- Join Polymarket community
- Monitor usage
- Collect feedback
- Build new features!
