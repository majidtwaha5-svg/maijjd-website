const express = require('express');
const router = express.Router();
const { trackPageView, trackEvent, trackConversion } = require('../services/analytics');

// Track page view
router.post('/pageview', async (req, res) => {
  try {
    const { sessionId, url, title } = req.body;
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip;
    
    await trackPageView(sessionId, url, title, userAgent, ipAddress);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Page view tracking error:', error);
    res.status(500).json({ success: false, error: 'Tracking failed' });
  }
});

// Track event
router.post('/event', async (req, res) => {
  try {
    const { sessionId, event, name, data } = req.body;
    
    await trackEvent(sessionId, event, name, data);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).json({ success: false, error: 'Tracking failed' });
  }
});

// Track conversion
router.post('/conversion', async (req, res) => {
  try {
    const { sessionId, type, value, currency } = req.body;
    
    await trackConversion(sessionId, type, value, currency);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Conversion tracking error:', error);
    res.status(500).json({ success: false, error: 'Tracking failed' });
  }
});

module.exports = router;
