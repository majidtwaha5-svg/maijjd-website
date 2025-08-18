# 🚨 Deployment Troubleshooting Guide

## Quick Fixes for Common Issues

### 🚂 Railway Backend Issues

#### 1. Build Failures
**Error**: `Build failed` or `Command not found`
**Solution**: 
```bash
cd backend_maijjd
npm install
npm run build
```

#### 2. Port Binding Issues
**Error**: `EADDRINUSE` or `Cannot bind to port`
**Solution**: Your `server.js` already uses `0.0.0.0` which is correct for Railway.

#### 3. Environment Variables Missing
**Error**: `Cannot read property of undefined` or crashes on startup
**Solution**: Set these in Railway dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `SMTP_USER`
- `SMTP_PASS`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`

#### 4. Health Check Failing
**Error**: Health check endpoint not found
**Solution**: Ensure `/api/health` route exists in your routes.

#### 5. Railway CLI Issues
**Error**: `railway: command not found`
**Solution**: 
```bash
npm install -g @railway/cli
railway login
```

### 🎯 Vercel Frontend Issues

#### 1. Build Failures
**Error**: `Build failed` or TypeScript errors
**Solution**:
```bash
cd frontend_maijjd
npm install
npm run build
```

#### 2. API Integration Failing
**Error**: CORS errors or API calls failing
**Solution**: Update `vercel.json` with correct Railway backend URL.

#### 3. Vercel CLI Issues
**Error**: `vercel: command not found`
**Solution**:
```bash
npm install -g vercel
vercel login
```

#### 4. Environment Variables
**Error**: Frontend can't access backend
**Solution**: Set `REACT_APP_API_URL` in Vercel dashboard.

## 🔧 Emergency Fixes

### If Backend Won't Deploy
```bash
cd backend_maijjd
rm -rf node_modules package-lock.json
npm install
npm run build
railway up
```

### If Frontend Won't Deploy
```bash
cd frontend_maijjd
rm -rf node_modules package-lock.json build
npm install
npm run build
vercel --prod
```

### If Both Fail
```bash
# Use the master script
./deploy-both-platforms.sh
```

## 📞 Get Help

1. **Check logs** in Railway and Vercel dashboards
2. **Verify environment variables** are set correctly
3. **Ensure code is committed** and pushed to Git
4. **Try redeploying** with the updated scripts

## 🚀 Quick Deployment Commands

### Deploy Backend Only
```bash
cd backend_maijjd
../cloud-deployment/deploy-railway.sh
```

### Deploy Frontend Only
```bash
cd frontend_maijjd
../cloud-deployment/deploy-vercel.sh
```

### Deploy Both
```bash
./deploy-both-platforms.sh
```
