# 🚀 Maijjd Complete Deployment Guide

## Overview
This guide will help you deploy both your backend to Railway and frontend to Vercel successfully.

## 🚂 Backend Deployment (Railway)

### Prerequisites
1. **Node.js 18+** installed
2. **Git** repository connected
3. **Railway account** at [railway.app](https://railway.app)

### Step-by-Step Deployment

#### 1. Prepare Backend
```bash
cd backend_maijjd
npm install
npm test
```

#### 2. Deploy to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project (if first time)
railway init

# Deploy
railway up
```

#### 3. Set Environment Variables in Railway Dashboard
Required variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Your JWT secret key
- `SMTP_USER` - Email for notifications
- `SMTP_PASS` - Email password/app password
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token

Optional variables:
- `NODE_ENV=production`
- `PORT=5001`
- `LOG_LEVEL=info`

#### 4. Get Your Railway URL
After deployment, note your Railway URL (e.g., `https://your-app.railway.app`)

## 🎯 Frontend Deployment (Vercel)

### Prerequisites
1. **Node.js 18+** installed
2. **Git** repository connected
3. **Vercel account** at [vercel.com](https://vercel.com)

### Step-by-Step Deployment

#### 1. Prepare Frontend
```bash
cd frontend_maijjd
npm install
npm test -- --watchAll=false
npm run build
```

#### 2. Update Configuration
Edit `vercel.json` and replace `your-railway-backend-url.railway.app` with your actual Railway URL.

#### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 🔧 Quick Deployment Scripts

### Backend (Railway)
```bash
cd backend_maijjd
chmod +x ../cloud-deployment/deploy-railway.sh
../cloud-deployment/deploy-railway.sh
```

### Frontend (Vercel)
```bash
cd frontend_maijjd
chmod +x ../cloud-deployment/deploy-vercel.sh
../cloud-deployment/deploy-vercel.sh
```

## 🚨 Common Issues & Solutions

### Railway Issues

#### 1. Build Failures
- **Problem**: Build command fails
- **Solution**: Ensure `package.json` has a `build` script
- **Fix**: Add `"build": "echo 'Build completed'"` to scripts

#### 2. Port Binding Issues
- **Problem**: App can't bind to port
- **Solution**: Use `0.0.0.0` instead of `localhost`
- **Fix**: Already implemented in `server.js`

#### 3. Environment Variables
- **Problem**: App crashes due to missing env vars
- **Solution**: Set all required variables in Railway dashboard
- **Fix**: Use the environment variables list above

#### 4. Health Check Failures
- **Problem**: Health check endpoint not found
- **Solution**: Ensure `/api/health` route exists
- **Fix**: Already implemented in your routes

### Vercel Issues

#### 1. Build Failures
- **Problem**: React build fails
- **Solution**: Check for TypeScript errors
- **Fix**: Run `npm run build` locally first

#### 2. API Routing Issues
- **Problem**: API calls fail
- **Solution**: Update `vercel.json` with correct backend URL
- **Fix**: Replace placeholder URL with actual Railway URL

#### 3. Environment Variables
- **Problem**: Frontend can't access backend
- **Solution**: Set `REACT_APP_API_URL` in Vercel
- **Fix**: Add environment variable in Vercel dashboard

## 📋 Deployment Checklist

### Backend (Railway) ✅
- [ ] Dependencies installed
- [ ] Tests passing
- [ ] Railway CLI installed
- [ ] Logged into Railway
- [ ] Project initialized
- [ ] Deployed successfully
- [ ] Environment variables set
- [ ] Health check endpoint working
- [ ] API endpoints accessible

### Frontend (Vercel) ✅
- [ ] Dependencies installed
- [ ] Tests passing
- [ ] Build successful
- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] vercel.json updated with backend URL
- [ ] Deployed successfully
- [ ] API integration working
- [ ] Frontend accessible

## 🔍 Testing Your Deployment

### Backend Testing
```bash
# Test health endpoint
curl https://your-app.railway.app/api/health

# Test API docs
curl https://your-app.railway.app/api-docs
```

### Frontend Testing
```bash
# Test frontend
curl https://your-app.vercel.app

# Test API integration
# Check browser console for API calls
```

## 🆘 Getting Help

### Railway Support
- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://discord.gg/vercel)
- [Vercel Status](https://vercel-status.com/)

## 📞 Emergency Contacts
If you continue to have issues:
1. Check the logs in both Railway and Vercel dashboards
2. Verify all environment variables are set correctly
3. Ensure your code is committed and pushed to Git
4. Try redeploying with the updated scripts

---

**Good luck with your deployment! 🚀**
