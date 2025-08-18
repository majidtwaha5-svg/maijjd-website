# 🚀 Maijjd Deployment Guide

This guide will help you deploy the Maijjd full-stack application to Railway (backend) and Vercel (frontend).

## 📋 Prerequisites

- Node.js 18+
- npm 9+
- Railway account
- Vercel account
- GitHub repository

## 🏗️ Project Structure

```
Maijjd_Full_Project/
├── backend_maijjd/     # Express API (Railway)
├── frontend_maijjd/    # React App (Vercel)
├── install.sh          # Installation script
├── dev.sh             # Development script
└── package.json       # Monorepo root
```

## 🔧 Local Development Setup

### Quick Start
```bash
# Install all dependencies
./install.sh

# Start development environment
./dev.sh
```

### Manual Setup
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend_maijjd
npm install
cd ..

# Install frontend dependencies
cd frontend_maijjd
npm install
cd ..

# Start backend (Terminal 1)
cd backend_maijjd
npm start

# Start frontend (Terminal 2)
cd frontend_maijjd
npm start
```

## 🌐 Production Deployment

### Step 1: Deploy Backend to Railway

1. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Create new project
   - Connect your GitHub repository
   - Select the `backend_maijjd` directory

2. **Set Environment Variables in Railway**
   ```
   NODE_ENV=production
   PORT=5001
   JWT_SECRET=your-secure-jwt-secret-here
   FRONTEND_BASE_URL=https://your-frontend-domain.vercel.app
   BCRYPT_ROUNDS=12
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   LOG_LEVEL=info
   ```

3. **Optional Environment Variables**
   ```
   # Stripe (for payments)
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # Email (for notifications)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_FROM=noreply@maijjd.com

   # Database (if using MongoDB)
   MONGODB_URI=your_mongodb_connection_string

   # AI Integration
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. **Deploy**
   - Railway will automatically deploy when you push to GitHub
   - Monitor the deployment in the Railway dashboard
   - Note your backend URL (e.g., `https://your-backend.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Project**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set the root directory to `frontend_maijjd`

2. **Set Environment Variables in Vercel**
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

3. **Deploy**
   - Vercel will automatically deploy when you push to GitHub
   - Your frontend will be available at your Vercel domain

## 🔍 Health Check Endpoints

After deployment, test these endpoints:

### Backend (Railway)
- **Health Check**: `https://your-backend.railway.app/`
- **API Health**: `https://your-backend.railway.app/api/health`
- **API Documentation**: `https://your-backend.railway.app/api-docs`
- **API Root**: `https://your-backend.railway.app/api`

### Frontend (Vercel)
- **Main App**: `https://your-frontend.vercel.app`

## 🛠️ Troubleshooting

### Railway Deployment Issues

1. **Health Check Failing**
   - Ensure the root `/` endpoint returns 200 OK
   - Check that the server is binding to `0.0.0.0:PORT`
   - Verify environment variables are set correctly

2. **Build Failing**
   - Check that all dependencies are in `package.json`
   - Ensure Node.js version is 18+
   - Review build logs in Railway dashboard

3. **Runtime Errors**
   - Check application logs in Railway dashboard
   - Verify all required environment variables are set
   - Test locally first

### Vercel Deployment Issues

1. **Build Failing**
   - Ensure React app builds locally: `npm run build`
   - Check that `REACT_APP_API_URL` is set correctly
   - Review build logs in Vercel dashboard

2. **API Connection Issues**
   - Verify `REACT_APP_API_URL` points to your Railway backend
   - Check CORS settings in backend
   - Test API endpoints directly

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files to Git
   - Use strong, unique secrets for production
   - Rotate secrets regularly

2. **CORS Configuration**
   - Configure CORS to allow only your frontend domain
   - Use HTTPS in production

3. **Rate Limiting**
   - Backend includes rate limiting by default
   - Adjust limits based on your needs

## 📊 Monitoring

### Railway
- Monitor application logs
- Check resource usage
- Set up alerts for failures

### Vercel
- Monitor build status
- Check performance metrics
- Review analytics

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:
- Push to `main` branch triggers deployment
- Preview deployments for pull requests
- Rollback to previous versions if needed

## 📞 Support

If you encounter issues:
1. Check the logs in Railway/Vercel dashboards
2. Test locally first
3. Review this deployment guide
4. Check the project documentation

---

**Happy Deploying! 🚀**
