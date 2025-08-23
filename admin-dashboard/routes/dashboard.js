const express = require('express');
const router = express.Router();
const UserSession = require('../models/UserSession');
const CustomerFeedback = require('../models/CustomerFeedback');
const Invoice = require('../models/Invoice');
const moment = require('moment');

// Get dashboard overview
router.get('/overview', async (req, res) => {
  try {
    const now = new Date();
    const last30Days = moment().subtract(30, 'days').toDate();
    const last7Days = moment().subtract(7, 'days').toDate();
    const today = moment().startOf('day').toDate();

    // Get active sessions
    const activeSessions = await UserSession.getActiveSessions();

    // Get sessions in last 30 days
    const sessions30Days = await UserSession.getSessionsByDateRange(last30Days, now);
    const sessions7Days = await UserSession.getSessionsByDateRange(last7Days, now);
    const sessionsToday = await UserSession.getSessionsByDateRange(today, now);

    // Get conversion rates
    const conversionRate30Days = await UserSession.getConversionRate(last30Days, now);
    const conversionRate = conversionRate30Days[0]?.conversionRate || 0;

    // Get top pages
    const topPages = await UserSession.getTopPages(5);

    // Get device statistics
    const deviceStats = await UserSession.getDeviceStats();

    // Get geographic statistics
    const geoStats = await UserSession.getGeographicStats(5);

    // Get feedback statistics
    const feedbackStats = await CustomerFeedback.getFeedbackStats();
    const priorityStats = await CustomerFeedback.getPriorityStats();

    // Get revenue statistics (if invoices exist)
    const revenueStats = await Invoice.getRevenueStats(last30Days, now);

    res.json({
      success: true,
      data: {
        sessions: {
          active: activeSessions,
          last30Days: sessions30Days.length,
          last7Days: sessions7Days.length,
          today: sessionsToday.length
        },
        conversion: {
          rate: conversionRate.toFixed(2)
        },
        topPages,
        devices: deviceStats,
        geography: geoStats,
        feedback: {
          byType: feedbackStats,
          byPriority: priorityStats
        },
        revenue: revenueStats
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard overview'
    });
  }
});

module.exports = router;
