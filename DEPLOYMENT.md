# 🚀 Deployment Guide - Beulrock SS

## Railway Deployment

### Prerequisites
- Railway Account (https://railway.app)
- GitHub repository connected
- Node.js 18+ (untuk local testing)

### Automatic Deployment (Recommended)

#### Option 1: Railway Dashboard (Easiest)
1. Go to https://railway.app/dashboard
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select **nexuswrf-star/FROTEND-2**
4. Railway automatically detects Next.js and deploys
5. Add environment variables (see below)

#### Option 2: Railway CLI
```bash
npm install -g @railway/cli
railway login
cd /workspaces/FROTEND-2
railway init
railway up
```

### Environment Variables

Set these in Railway Dashboard → Your Project → Variables:

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-key-here
DATABASE_URL=file:./db/custom.db
NEXTAUTH_URL=https://your-railway-domain.railway.app
```

### Build Configuration

The deployment uses:
- **Builder**: Nixpacks (auto-detected)
- **Build Command**: `npm run build` (from package.json)
- **Start Command**: `node .next/standalone/server.js`
- **Health Check**: `GET /` every 30s

### Files Used

- `railway.toml` - Railway configuration
- `Procfile` - Process type definition
- `.env.railway` - Environment template
- `next.config.ts` - Next.js standalone output

### Post-Deployment

After deployment:
1. Visit your Railway domain (provided in dashboard)
2. Verify demon logo appears in navbar
3. Check health status in Railway logs
4. Monitor performance in Railway metrics

### Troubleshooting

**Build fails**: Check `npm run build` locally first
```bash
npm install
npm run build
```

**Logs**: View in Railway Dashboard → Deployments → Logs

**Database**: SQLite file stored at `./db/custom.db`

**Port**: Railway auto-assigns port via `PORT` env var

### Domain Setup

Railway provides free domain: `yourapp.railway.app`

To use custom domain:
1. Go to Railway Project Settings
2. Add custom domain
3. Update DNS records per Railway instructions

