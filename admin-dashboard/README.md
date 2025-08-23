# 🎯 Maijjd Website Control Panel & Analytics System

A comprehensive **Website Control Panel & Analytics System** that allows you to track website usage, manage customer feedback, and handle invoicing for upgrades and services.

## 🚀 **Features Overview**

### 📊 **Analytics & User Tracking**
- **Real-time visitor tracking** with detailed session analytics
- **Page view analytics** with time spent and conversion tracking
- **Geographic analytics** showing visitor locations
- **Device analytics** (mobile, desktop, tablet, browsers)
- **Conversion funnel analysis** and goal tracking
- **Export capabilities** for data analysis

### 💬 **Customer Feedback Management**
- **Multi-channel feedback collection** (website, email, forms)
- **Automated categorization** and priority assignment
- **Response management** with internal notes
- **Customer satisfaction tracking**
- **Follow-up automation** and reminders

### 💰 **Invoice & Billing System**
- **Professional invoice generation** with PDF export
- **Subscription management** with recurring billing
- **Payment tracking** and status management
- **Revenue analytics** and reporting
- **Multi-currency support**

### 🔐 **Admin Dashboard**
- **Secure authentication** with role-based access
- **Real-time notifications** and alerts
- **Comprehensive reporting** and analytics
- **Data export** and backup capabilities

## 🛠 **Technology Stack**

- **Backend**: Node.js, Express.js, MongoDB
- **Real-time**: Socket.IO for live updates
- **Analytics**: Custom tracking with Chart.js
- **Security**: JWT authentication, rate limiting
- **File Handling**: Multer for uploads, PDF generation
- **Email**: Nodemailer for notifications
- **Payments**: Stripe integration (ready for implementation)

## 📦 **Installation & Setup**

### **Prerequisites**
- Node.js 18+ 
- MongoDB database
- npm or yarn package manager

### **1. Clone and Install**
```bash
# Navigate to admin dashboard directory
cd admin-dashboard

# Install dependencies
npm run install:all
```

### **2. Environment Configuration**
Create `.env` file:
```env
# Server Configuration
PORT=5002
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/maijjd-admin
MONGODB_URI_PROD=your_production_mongodb_uri

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Analytics Configuration
TRACKING_ENABLED=true
ANONYMIZE_IPS=true

# Payment Gateway (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Redis (for caching and sessions)
REDIS_URL=redis://localhost:6379
```

### **3. Database Setup**
```bash
# Initialize database with sample data
npm run setup
```

### **4. Start Development Server**
```bash
# Start the admin dashboard
npm run dev

# Or start production
npm start
```

## 🎯 **API Endpoints**

### **Authentication**
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/profile` - Get admin profile

### **Analytics**
- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/realtime` - Real-time analytics
- `GET /api/analytics/sessions` - Session analytics
- `GET /api/analytics/pages` - Page analytics
- `GET /api/analytics/conversions` - Conversion analytics
- `GET /api/analytics/geography` - Geographic analytics
- `GET /api/analytics/devices` - Device analytics
- `GET /api/analytics/export` - Export data

### **User Tracking**
- `POST /api/tracking/session` - Start new session
- `POST /api/tracking/event` - Track user event
- `POST /api/tracking/pageview` - Track page view
- `POST /api/tracking/conversion` - Track conversion

### **Customer Feedback**
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get feedback list
- `GET /api/feedback/:id` - Get specific feedback
- `PUT /api/feedback/:id` - Update feedback
- `POST /api/feedback/:id/response` - Add response

### **Invoices**
- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - Get invoice list
- `GET /api/invoices/:id` - Get specific invoice
- `PUT /api/invoices/:id` - Update invoice
- `POST /api/invoices/:id/send` - Send invoice
- `GET /api/invoices/export/:id` - Export PDF

## 📊 **Analytics Features**

### **Real-time Tracking**
```javascript
// Track user session
fetch('/api/tracking/session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'unique-session-id',
    pageUrl: window.location.href,
    userAgent: navigator.userAgent
  })
});

// Track page view
fetch('/api/tracking/pageview', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'unique-session-id',
    url: window.location.href,
    title: document.title
  })
});

// Track conversion
fetch('/api/tracking/conversion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: 'unique-session-id',
    type: 'contact_form',
    value: 0
  })
});
```

### **Dashboard Metrics**
- **Active Sessions**: Real-time count of current visitors
- **Page Views**: Total and unique page views
- **Conversion Rate**: Percentage of sessions with conversions
- **Geographic Distribution**: Top visitor countries
- **Device Breakdown**: Mobile vs desktop usage
- **Top Pages**: Most visited pages
- **Revenue Analytics**: Monthly/yearly revenue trends

## 💬 **Customer Feedback System**

### **Feedback Types**
- **Suggestions**: Feature requests and improvements
- **Complaints**: Issues and problems
- **Questions**: General inquiries
- **Bug Reports**: Technical issues
- **Compliments**: Positive feedback
- **General**: Other feedback

### **Priority Levels**
- **Low**: Minor suggestions
- **Medium**: Standard requests
- **High**: Important issues
- **Urgent**: Critical problems

### **Automation Features**
- **Auto-categorization** based on content
- **Priority assignment** based on keywords
- **Auto-response** emails
- **Follow-up reminders**
- **Escalation rules**

## 💰 **Invoice System**

### **Invoice Features**
- **Professional PDF generation**
- **Multiple payment methods**
- **Subscription management**
- **Late fee calculation**
- **Payment tracking**
- **Multi-currency support**

### **Subscription Plans**
- **Monthly**: Recurring monthly billing
- **Quarterly**: Every 3 months
- **Yearly**: Annual billing
- **One-time**: Single payment

### **Payment Methods**
- **Credit/Debit Cards**
- **Bank Transfer**
- **PayPal**
- **Stripe**
- **Cash/Check**

## 🔐 **Security Features**

### **Authentication**
- **JWT-based authentication**
- **Role-based access control**
- **Session management**
- **Password hashing**

### **Data Protection**
- **IP anonymization** (GDPR compliant)
- **Data encryption** at rest
- **Secure file uploads**
- **Rate limiting**

### **Privacy Compliance**
- **GDPR compliance** features
- **Cookie consent** tracking
- **Data retention** policies
- **User data export**

## 📈 **Reporting & Export**

### **Available Reports**
- **Analytics Reports**: Session, page, conversion data
- **Feedback Reports**: Customer feedback analysis
- **Revenue Reports**: Invoice and payment data
- **Performance Reports**: System performance metrics

### **Export Formats**
- **JSON**: Raw data export
- **CSV**: Spreadsheet format
- **PDF**: Professional reports
- **Excel**: Advanced analytics

## 🚀 **Deployment**

### **Development**
```bash
npm run dev
```

### **Production**
```bash
npm start
```

### **Docker Deployment**
```bash
# Build image
docker build -t maijjd-admin-dashboard .

# Run container
docker run -p 5002:5002 maijjd-admin-dashboard
```

## 🔧 **Configuration**

### **Analytics Settings**
```javascript
// Enable/disable tracking
TRACKING_ENABLED=true

// Anonymize IP addresses
ANONYMIZE_IPS=true

// Session timeout (minutes)
SESSION_TIMEOUT=30

// Data retention (days)
DATA_RETENTION_DAYS=365
```

### **Email Notifications**
```javascript
// Feedback notifications
FEEDBACK_NOTIFICATIONS=true

// Invoice reminders
INVOICE_REMINDERS=true

// Daily reports
DAILY_REPORTS=true
```

## 📞 **Support & Maintenance**

### **Monitoring**
- **Health checks** at `/health`
- **Performance monitoring**
- **Error logging** and alerts
- **Database monitoring**

### **Backup**
- **Automated database backups**
- **File upload backups**
- **Configuration backups**

### **Updates**
- **Security updates**
- **Feature updates**
- **Bug fixes**

## 🎯 **Future Enhancements**

### **Planned Features**
- **AI-powered analytics** insights
- **Advanced customer segmentation**
- **Marketing automation** integration
- **Advanced reporting** dashboards
- **Mobile app** for admin access
- **API rate limiting** and quotas
- **Multi-tenant** support

### **Integration Possibilities**
- **Google Analytics** integration
- **Facebook Pixel** tracking
- **Mailchimp** email marketing
- **Slack** notifications
- **Zapier** automation
- **Shopify** e-commerce
- **WooCommerce** integration

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 **Contact**

For support or questions:
- **Email**: support@maijjd.com
- **Website**: https://maijjd.com
- **Documentation**: https://docs.maijjd.com

---

**🎉 Your comprehensive website control panel is ready to track, analyze, and grow your business!**
