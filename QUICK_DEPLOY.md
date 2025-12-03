# ⚡ Quick Deploy - 10 Minutes to Production

Follow these steps in order. Copy/paste commands exactly.

---

## ⏱️ Step 1: Database Setup (2 min)

### Neon PostgreSQL

1. **Open**: https://neon.tech
2. **Sign up** with GitHub
3. **Create Project**:
   - Name: `praxis-prod`
   - Region: Choose closest to you
   - Click "Create Project"
4. **Copy Connection String**:
   - Click "Connection Details"
   - Copy the full string (includes `?sslmode=require`)
   - Example: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/praxis?sslmode=require`

**✅ Save this as DATABASE_URL**

---

## ⏱️ Step 2: Redis Setup (1 min)

### Upstash Redis

1. **Open**: https://upstash.com
2. **Sign up** with GitHub
3. **Create Database**:
   - Name: `praxis-redis`
   - Type: Regional
   - Region: Same as your Neon region
   - Click "Create"
4. **Copy Redis URL**:
   - Click on database
   - Copy "UPSTASH_REDIS_REST_URL" or connection string
   - Example: `redis://default:xxx@xxx.upstash.io:6379`

**✅ Save this as REDIS_URL**

---

## ⏱️ Step 3: Generate JWT Secret (30 sec)

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**✅ Save this as JWT_SECRET**

---

## ⏱️ Step 4: Deploy Backend to Railway (3 min)

### Railway Setup

1. **Open**: https://railway.app
2. **Sign up** with GitHub
3. **New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `MarcusDavidG/praxis`
   - Click "Deploy Now"

4. **Configure Service**:
   - Railway will create a service
   - Click on the service card
   - Go to "Settings" tab
   - Change "Start Command" to:
     ```
     cd apps/backend && npm install && npx prisma generate && npx prisma migrate deploy && npm start
     ```

5. **Add Environment Variables**:
   - Click "Variables" tab
   - Click "Raw Editor"
   - Paste this (replace with YOUR values):
   
   ```env
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://YOUR_NEON_URL_HERE
   REDIS_URL=redis://YOUR_UPSTASH_URL_HERE
   JWT_SECRET=YOUR_GENERATED_SECRET_HERE
   FRONTEND_URL=https://praxis.vercel.app
   POLYMARKET_API_URL=https://gamma-api.polymarket.com
   POLYMARKET_CLOB_URL=https://clob.polymarket.com
   ```

6. **Deploy**:
   - Click "Deploy" (top right)
   - Wait 3-5 minutes for build
   - Check "Deployments" tab for status

7. **Get Backend URL**:
   - Go to "Settings" tab
   - Under "Domains", click "Generate Domain"
   - Copy the URL: `https://praxis-production-xxxx.up.railway.app`

**✅ Save this as BACKEND_URL**

---

## ⏱️ Step 5: Deploy Frontend to Vercel (2 min)

### Vercel Setup

1. **Open**: https://vercel.com
2. **Sign up** with GitHub
3. **Import Project**:
   - Click "Add New..." → "Project"
   - Select: `MarcusDavidG/praxis`
   - Click "Import"

4. **Configure Project**:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: Click "Edit" → Select `apps/frontend`
   - Build Command: Leave default (`npm run build`)
   - Output Directory: Leave default (`.next`)

5. **Environment Variables**:
   - Click "Environment Variables"
   - Add these TWO variables:
   
   **Variable 1:**
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://praxis-production-xxxx.up.railway.app` (your BACKEND_URL from Step 4)
   
   **Variable 2:**
   - Name: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - Value: `00d6a4c377c6877396eee6022f51d14f`

6. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Vercel will show success page

7. **Get Frontend URL**:
   - Copy the URL: `https://praxis-xxxx.vercel.app`

**✅ Your app is now live!**

---

## ⏱️ Step 6: Update Backend CORS (1 min)

Now that you have the real Vercel URL:

1. Go back to **Railway**
2. Click on your backend service
3. Go to "Variables" tab
4. Find `FRONTEND_URL`
5. Update it to your actual Vercel URL: `https://praxis-xxxx.vercel.app`
6. Click "Redeploy" (or it will auto-redeploy)

---

## ⏱️ Step 7: Initial Data Sync (30 sec)

Sync markets from Polymarket:

```bash
curl -X POST https://YOUR_BACKEND_URL/api/markets/sync
```

Replace `YOUR_BACKEND_URL` with your Railway URL.

You should see:
```json
{"success": true, "message": "Market sync started"}
```

Check Railway logs to see markets being synced.

---

## 🧪 Step 8: Test Production (1 min)

### Quick Tests:

1. **Backend Health**:
   ```bash
   curl https://YOUR_BACKEND_URL/api/markets
   ```
   Should return JSON with markets.

2. **Frontend**:
   - Visit: `https://praxis-xxxx.vercel.app`
   - Should see landing page
   - Click "Connect Wallet"
   - Connect your wallet (MetaMask/Rainbow)
   - Sign the message
   - Should redirect to dashboard

3. **Full Flow**:
   - Visit `/markets` - see markets
   - Search for markets
   - Click on a market
   - Visit `/leaderboard`
   - Visit `/feed`

---

## ✅ Deployment Complete!

**Your URLs:**
- Frontend: `https://praxis-xxxx.vercel.app`
- Backend: `https://praxis-production-xxxx.up.railway.app`

**Services:**
- Database: Neon (PostgreSQL)
- Cache: Upstash (Redis)
- Backend: Railway
- Frontend: Vercel

**Cost: $0/month** (all free tiers to start!)

---

## 🔄 Future Deployments

**Automatic CI/CD is now enabled!**

To update your app:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

- Vercel auto-deploys frontend (2-3 min)
- Railway auto-deploys backend (3-5 min)

No manual steps needed! ✅

---

## 🐛 Troubleshooting

### "Network Error" on frontend:
```bash
# Check backend is running:
curl https://YOUR_BACKEND_URL/api/markets

# Check CORS:
# Go to Railway → Variables → Verify FRONTEND_URL matches Vercel URL
```

### Backend won't start:
```bash
# Check Railway logs:
# Railway Dashboard → Your Service → Deployments → Click latest → View Logs

# Common issues:
# 1. DATABASE_URL missing ?sslmode=require
# 2. REDIS_URL incorrect
# 3. Missing environment variables
```

### Wallet won't connect:
```bash
# Check Vercel environment variables:
# NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is set

# Try different wallet (MetaMask, Rainbow)
```

---

## 📊 Monitor Your App

**Railway (Backend):**
- Dashboard: https://railway.app
- Metrics: CPU, Memory, Network
- Logs: Real-time application logs

**Vercel (Frontend):**
- Dashboard: https://vercel.com
- Analytics: Page views, visitors
- Logs: Build and runtime logs

**Neon (Database):**
- Dashboard: https://console.neon.tech
- Monitor: Connections, queries, storage

**Upstash (Redis):**
- Dashboard: https://console.upstash.com
- Monitor: Commands, memory, connections

---

## 🎉 You're Live!

Praxis is now running in production! Share your URL with users! 🚀

**Next Steps:**
- Share on social media
- Monitor usage and errors
- Collect user feedback
- Scale as needed

**Need help?** Check the logs in Railway/Vercel dashboards.
