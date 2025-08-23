const UserSession = require('../models/UserSession');
const moment = require('moment');

const initializeAnalytics = async () => {
  try {
    console.log('📊 Initializing analytics service...');
    
    // Set up analytics tracking
    if (process.env.TRACKING_ENABLED === 'true') {
      console.log('✅ Analytics tracking enabled');
    } else {
      console.log('⚠️  Analytics tracking disabled');
    }
    
    // Initialize any analytics configurations
    console.log('✅ Analytics service initialized');
    
  } catch (error) {
    console.error('❌ Failed to initialize analytics:', error);
    throw error;
  }
};

const trackPageView = async (sessionId, url, title, userAgent, ipAddress) => {
  try {
    let session = await UserSession.findOne({ sessionId });
    
    if (!session) {
      // Create new session
      session = new UserSession({
        sessionId,
        ipAddress,
        userAgent,
        entryPage: url,
        currentPage: url,
        startTime: new Date(),
        lastActivity: new Date()
      });
    }
    
    // Add page view
    await session.addPageView(url, title);
    
    return session;
  } catch (error) {
    console.error('Error tracking page view:', error);
    throw error;
  }
};

const trackEvent = async (sessionId, eventType, eventName, eventData = {}) => {
  try {
    const session = await UserSession.findOne({ sessionId });
    
    if (session) {
      await session.addEvent(eventType, eventName, eventData);
    }
    
    return session;
  } catch (error) {
    console.error('Error tracking event:', error);
    throw error;
  }
};

const trackConversion = async (sessionId, conversionType, value = 0, currency = 'USD') => {
  try {
    const session = await UserSession.findOne({ sessionId });
    
    if (session) {
      await session.setConversion(conversionType, value, currency);
    }
    
    return session;
  } catch (error) {
    console.error('Error tracking conversion:', error);
    throw error;
  }
};

const getAnalyticsSummary = async (startDate, endDate) => {
  try {
    const sessions = await UserSession.getSessionsByDateRange(startDate, endDate);
    const topPages = await UserSession.getTopPages(10);
    const conversionRate = await UserSession.getConversionRate(startDate, endDate);
    const deviceStats = await UserSession.getDeviceStats();
    const geoStats = await UserSession.getGeographicStats();
    
    return {
      totalSessions: sessions.length,
      topPages,
      conversionRate: conversionRate[0]?.conversionRate || 0,
      deviceStats,
      geoStats
    };
  } catch (error) {
    console.error('Error getting analytics summary:', error);
    throw error;
  }
};

module.exports = {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackConversion,
  getAnalyticsSummary
};
