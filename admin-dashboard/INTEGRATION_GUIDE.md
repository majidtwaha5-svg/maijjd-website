# 🎯 **Maijjd Admin Dashboard Integration Guide**

## 🚀 **Quick Start**

### **1. Start the Admin Dashboard**
```bash
cd admin-dashboard
./start-admin-dashboard.sh
```

### **2. Access Your Dashboard**
- **URL**: http://localhost:5002
- **Email**: admin@maijjd.com
- **Password**: admin123

## 📊 **Website Integration**

### **Add Tracking to Your Frontend**

Add this JavaScript to your website's `<head>` section:

```html
<!-- Maijjd Analytics Tracking -->
<script>
(function() {
    // Generate unique session ID
    let sessionId = localStorage.getItem('maijjd_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('maijjd_session_id', sessionId);
    }

    // Track page views
    function trackPageView() {
        fetch('http://localhost:5002/api/tracking/pageview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: sessionId,
                url: window.location.href,
                title: document.title
            })
        }).catch(console.error);
    }

    // Track events
    function trackEvent(eventType, eventName, data = {}) {
        fetch('http://localhost:5002/api/tracking/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: sessionId,
                event: eventType,
                name: eventName,
                data: data
            })
        }).catch(console.error);
    }

    // Track conversions
    function trackConversion(type, value = 0) {
        fetch('http://localhost:5002/api/tracking/conversion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: sessionId,
                type: type,
                value: value,
                currency: 'USD'
            })
        }).catch(console.error);
    }

    // Track initial page view
    trackPageView();

    // Track navigation
    window.addEventListener('popstate', trackPageView);

    // Track form submissions
    document.addEventListener('submit', function(e) {
        if (e.target.tagName === 'FORM') {
            trackEvent('form_submit', 'form_submission', {
                formId: e.target.id || e.target.className,
                formAction: e.target.action
            });
        }
    });

    // Track clicks on important elements
    document.addEventListener('click', function(e) {
        const target = e.target;
        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
            trackEvent('click', 'button_click', {
                element: target.tagName,
                text: target.textContent,
                href: target.href || null
            });
        }
    });

    // Make functions globally available
    window.MaijjdAnalytics = {
        trackEvent,
        trackConversion,
        sessionId
    };
})();
</script>
```

### **Add Feedback Form to Your Website**

Add this HTML to your contact page:

```html
<!-- Customer Feedback Form -->
<div class="feedback-form">
    <h3>We'd Love Your Feedback!</h3>
    <form id="feedbackForm">
        <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required>
        </div>
        
        <div class="form-group">
            <label for="feedbackType">Feedback Type *</label>
            <select id="feedbackType" name="feedbackType" required>
                <option value="">Select type...</option>
                <option value="suggestion">Suggestion</option>
                <option value="complaint">Complaint</option>
                <option value="question">Question</option>
                <option value="feature_request">Feature Request</option>
                <option value="bug_report">Bug Report</option>
                <option value="compliment">Compliment</option>
                <option value="general">General</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="subject">Subject *</label>
            <input type="text" id="subject" name="subject" required>
        </div>
        
        <div class="form-group">
            <label for="message">Message *</label>
            <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        
        <button type="submit">Submit Feedback</button>
    </form>
</div>

<script>
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const feedbackData = {
        customerInfo: {
            name: formData.get('name'),
            email: formData.get('email')
        },
        feedback: {
            type: formData.get('feedbackType'),
            category: 'website',
            priority: 'medium',
            subject: formData.get('subject'),
            message: formData.get('message')
        }
    };
    
    // Submit feedback
    fetch('http://localhost:5002/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Thank you for your feedback!');
            e.target.reset();
            
            // Track conversion
            if (window.MaijjdAnalytics) {
                window.MaijjdAnalytics.trackConversion('feedback_submission');
            }
        } else {
            alert('Error submitting feedback. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting feedback. Please try again.');
    });
});
</script>
```

## 📈 **Analytics Dashboard Features**

### **Real-time Analytics**
- **Live visitor tracking**
- **Page view analytics**
- **Conversion tracking**
- **Geographic data**
- **Device analytics**

### **Customer Feedback Management**
- **Feedback categorization**
- **Priority assignment**
- **Response management**
- **Customer satisfaction tracking**

### **Invoice & Billing System**
- **Professional invoice generation**
- **Payment tracking**
- **Revenue analytics**
- **Subscription management**

## 🔧 **Configuration Options**

### **Environment Variables**
```env
# Analytics
TRACKING_ENABLED=true
ANONYMIZE_IPS=true
SESSION_TIMEOUT=30

# Email Notifications
FEEDBACK_NOTIFICATIONS=true
INVOICE_REMINDERS=true
DAILY_REPORTS=true

# Database
MONGODB_URI=mongodb://localhost:27017/maijjd-admin

# Security
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### **Custom Tracking Events**
```javascript
// Track custom events
window.MaijjdAnalytics.trackEvent('custom', 'product_view', {
    productId: '123',
    productName: 'Premium Package',
    price: 99.99
});

// Track conversions
window.MaijjdAnalytics.trackConversion('purchase', 99.99);
```

## 🚀 **Deployment Options**

### **Local Development**
```bash
cd admin-dashboard
npm start
```

### **Production Deployment**
1. **Set up MongoDB** (local or cloud)
2. **Configure environment variables**
3. **Deploy to your server**
4. **Set up SSL certificates**
5. **Configure domain**

### **Cloud Deployment**
- **Railway**: Easy deployment with MongoDB
- **Heroku**: With MongoDB add-on
- **DigitalOcean**: With managed MongoDB
- **AWS**: With DocumentDB

## 📊 **API Endpoints**

### **Analytics**
- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/realtime` - Real-time data
- `GET /api/analytics/sessions` - Session analytics
- `GET /api/analytics/pages` - Page analytics

### **Tracking**
- `POST /api/tracking/pageview` - Track page view
- `POST /api/tracking/event` - Track event
- `POST /api/tracking/conversion` - Track conversion

### **Feedback**
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get feedback list

### **Invoices**
- `POST /api/invoices` - Create invoice
- `GET /api/invoices` - Get invoice list

## 🔐 **Security Features**

- **JWT authentication**
- **Rate limiting**
- **Input validation**
- **CORS protection**
- **Data encryption**

## 📈 **Future Enhancements**

### **Planned Features**
- **AI-powered insights**
- **Advanced segmentation**
- **Marketing automation**
- **Mobile app**
- **API rate limiting**

### **Integrations**
- **Google Analytics**
- **Facebook Pixel**
- **Mailchimp**
- **Slack notifications**
- **Zapier automation**

## 🆘 **Support**

### **Troubleshooting**
1. **Check MongoDB connection**
2. **Verify environment variables**
3. **Check server logs**
4. **Test API endpoints**

### **Common Issues**
- **CORS errors**: Update FRONTEND_URL in .env
- **Database connection**: Check MONGODB_URI
- **Authentication**: Verify JWT_SECRET

## 📞 **Contact**

For support or questions:
- **Email**: support@maijjd.com
- **Documentation**: https://docs.maijjd.com
- **GitHub**: https://github.com/maijjd/admin-dashboard

---

**🎉 Your comprehensive website control panel is ready to track, analyze, and grow your business!**
