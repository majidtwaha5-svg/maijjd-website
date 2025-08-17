# 🌐 Maijjd Full Project - Custom Domain Setup Guide

## Overview

This guide will help you configure a custom domain for your Maijjd Full Project, making it accessible via your own domain name instead of the default cloud platform URLs.

## 🎯 **Domain Strategy**

### **Recommended Domain Structure**
```
Frontend:     maijjd.com (or www.maijjd.com)
Backend API:  api.maijjd.com
```

### **Alternative Domain Structures**
```
Frontend:     app.maijjd.com
Backend:      maijjd.com/api (subpath routing)

Frontend:     maijjd.com
Backend:      backend.maijjd.com
```

## 🛒 **Step 1: Purchase a Domain**

### **Recommended Domain Registrars**
1. **Namecheap** - Best prices, good support
2. **Google Domains** - Simple, reliable
3. **GoDaddy** - Popular, many features
4. **Cloudflare** - Free privacy protection

### **Domain Name Suggestions**
- `maijjd.com` (main domain)
- `maijjd.tech` (technology focus)
- `maijjd.app` (application focus)
- `maijjd.software` (software focus)

### **Cost Estimation**
- **.com domain**: $10-15/year
- **.tech domain**: $20-30/year
- **.app domain**: $15-25/year
- **.software domain**: $30-50/year

## ⚙️ **Step 2: Configure DNS Records**

### **For Vercel Frontend (maijjd.com)**

#### **Option A: Vercel DNS (Recommended)**
1. **In Vercel dashboard**
   - Go to your project → "Settings" → "Domains"
   - Add your domain: `maijjd.com`
   - Vercel will provide DNS records

2. **Add these records to your domain registrar:**
   ```
   Type: A
   Name: @
   Value: 76.76.19.36
   
   Type: A
   Name: @
   Value: 76.76.19.36
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

#### **Option B: Custom DNS Provider**
If using Cloudflare or another DNS provider:
```
Type: A
Name: @
Value: 76.76.19.36

Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: *
Value: cname.vercel-dns.com
```

### **For Railway Backend (api.maijjd.com)**

1. **In Railway dashboard**
   - Go to your service → "Settings" → "Custom Domains"
   - Add domain: `api.maijjd.com`

2. **Add DNS record:**
   ```
   Type: CNAME
   Name: api
   Value: your-railway-service.railway.app
   ```

## 🔒 **Step 3: SSL/HTTPS Configuration**

### **Automatic SSL (Recommended)**
Both Vercel and Railway provide automatic SSL certificates:
- **Vercel**: Automatic HTTPS for all domains
- **Railway**: Automatic HTTPS for custom domains
- **No manual SSL configuration needed**

### **Manual SSL (Advanced)**
If you need custom SSL certificates:
1. **Generate certificates** using Let's Encrypt
2. **Upload to cloud platform** if supported
3. **Configure in your application**

## 📱 **Step 4: Update Application Configuration**

### **Frontend Environment Variables**
```bash
# .env.production
REACT_APP_API_URL=https://api.maijjd.com/api
REACT_APP_ENV=production
REACT_APP_DOMAIN=maijjd.com
```

### **Backend Environment Variables**
```bash
# .env.production
NODE_ENV=production
CORS_ORIGIN=https://maijjd.com
ALLOWED_ORIGINS=https://maijjd.com,https://www.maijjd.com
```

### **Update CORS Configuration**
```javascript
// backend_maijjd/server.js
const corsOptions = {
  origin: [
    'https://maijjd.com',
    'https://www.maijjd.com',
    'http://localhost:3000' // for development
  ],
  credentials: true
};
```

## 🌍 **Step 5: Subdomain Configuration**

### **API Subdomain (api.maijjd.com)**
```
Type: CNAME
Name: api
Value: your-backend.railway.app
TTL: 300 (5 minutes)
```

### **Admin Subdomain (admin.maijjd.com)**
```
Type: CNAME
Name: admin
Value: your-admin-app.vercel.app
TTL: 300
```

### **Docs Subdomain (docs.maijjd.com)**
```
Type: CNAME
Name: docs
Value: your-docs.vercel.app
TTL: 300
```

## 🔄 **Step 6: DNS Propagation**

### **Propagation Time**
- **A Records**: 5-30 minutes
- **CNAME Records**: 5-30 minutes
- **Full propagation**: Up to 48 hours

### **Check Propagation**
```bash
# Check DNS propagation
nslookup maijjd.com
nslookup api.maijjd.com

# Check from different locations
dig maijjd.com
dig api.maijjd.com
```

### **Online DNS Checkers**
- [whatsmydns.net](https://whatsmydns.net)
- [dnschecker.org](https://dnschecker.org)
- [mxtoolbox.com](https://mxtoolbox.com)

## 🚀 **Step 7: Test Your Custom Domain**

### **Frontend Testing**
```bash
# Test frontend
curl -I https://maijjd.com
curl -I https://www.maijjd.com

# Check SSL certificate
openssl s_client -connect maijjd.com:443 -servername maijjd.com
```

### **Backend Testing**
```bash
# Test API endpoints
curl https://api.maijjd.com/api/health
curl https://api.maijjd.com/api/status

# Check CORS headers
curl -H "Origin: https://maijjd.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS https://api.maijjd.com/api/health
```

## 🔧 **Step 8: Advanced Configuration**

### **Redirects and Rewrites**
```javascript
// vercel.json (for frontend)
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.maijjd.com/api/:path*"
    }
  ]
}
```

### **Custom Headers**
```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## 📊 **Step 9: Monitoring and Analytics**

### **Domain Health Monitoring**
- **Uptime monitoring**: UptimeRobot, Pingdom
- **SSL monitoring**: SSL Labs, SSL Checker
- **DNS monitoring**: DNSimple, Cloudflare

### **Analytics Setup**
```javascript
// Google Analytics
gtag('config', 'GA_MEASUREMENT_ID', {
  'custom_map': {
    'dimension1': 'user_type',
    'dimension2': 'feature_used'
  }
});

// Custom domain tracking
gtag('config', 'GA_MEASUREMENT_ID', {
  'page_title': 'Maijjd - Software Solutions',
  'page_location': 'https://maijjd.com'
});
```

## 🆘 **Troubleshooting Common Issues**

### **DNS Issues**
1. **Domain not resolving**
   - Check DNS records are correct
   - Wait for propagation (up to 48 hours)
   - Verify TTL settings

2. **CNAME conflicts**
   - Ensure no conflicting A records
   - Check for wildcard records

### **SSL Issues**
1. **Certificate errors**
   - Wait for automatic SSL generation
   - Check DNS propagation
   - Verify domain ownership

2. **Mixed content warnings**
   - Ensure all resources use HTTPS
   - Check for hardcoded HTTP URLs

### **CORS Issues**
1. **Cross-origin errors**
   - Verify CORS_ORIGIN in backend
   - Check frontend domain matches
   - Test with browser developer tools

## 🎯 **Production Checklist**

- [ ] Domain purchased and configured
- [ ] DNS records added and propagated
- [ ] SSL certificates active
- [ ] Environment variables updated
- [ ] CORS configuration updated
- [ ] Frontend deployed with custom domain
- [ ] Backend accessible via custom domain
- [ ] All endpoints tested
- [ ] Monitoring configured
- [ ] Analytics tracking active

## 🌟 **Best Practices**

### **Security**
- Use HTTPS everywhere
- Implement proper CORS policies
- Set security headers
- Regular SSL certificate monitoring

### **Performance**
- Use CDN for static assets
- Implement caching strategies
- Monitor response times
- Optimize images and resources

### **SEO**
- Set proper meta tags
- Configure sitemap
- Implement structured data
- Monitor search console

## 🎉 **Success!**

Once configured, your Maijjd Full Project will be accessible at:
- **Main Website**: https://maijjd.com
- **API**: https://api.maijjd.com
- **Professional appearance** with your own domain
- **Better SEO** and brand recognition
- **Trusted by users** with custom domain

Your Maijjd project now has a professional, branded presence on the internet! 🚀
