const express = require('express');
const router = express.Router();
const UserSession = require('../models/UserSession');
const CustomerFeedback = require('../models/CustomerFeedback');
const Invoice = require('../models/Invoice');
const moment = require('moment');
const { validateDateRange } = require('../middleware/validation');

// Get dashboard overview statistics
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
    console.error('Analytics overview error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics overview'
    });
  }
});

// Get real-time analytics
router.get('/realtime', async (req, res) => {
  try {
    const now = new Date();
    const lastHour = moment().subtract(1, 'hour').toDate();
    const last24Hours = moment().subtract(24, 'hours').toDate();

    // Get active sessions in last hour
    const activeSessions = await UserSession.find({
      lastActivity: { $gte: lastHour },
      isActive: true
    }).countDocuments();

    // Get sessions in last 24 hours
    const sessions24Hours = await UserSession.getSessionsByDateRange(last24Hours, now);

    // Get current page views
    const currentPageViews = await UserSession.aggregate([
      {
        $match: {
          lastActivity: { $gte: lastHour }
        }
      },
      { $unwind: '$pages' },
      {
        $match: {
          'pages.timestamp': { $gte: lastHour }
        }
      },
      {
        $group: {
          _id: '$pages.url',
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Get geographic distribution of active users
    const activeGeoDistribution = await UserSession.aggregate([
      {
        $match: {
          lastActivity: { $gte: lastHour },
          isActive: true
        }
      },
      {
        $group: {
          _id: '$location.country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        activeSessions,
        sessions24Hours: sessions24Hours.length,
        currentPageViews,
        geographicDistribution: activeGeoDistribution,
        timestamp: now
      }
    });
  } catch (error) {
    console.error('Real-time analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch real-time analytics'
    });
  }
});

// Get detailed session analytics
router.get('/sessions', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const sessions = await UserSession.find({
      startTime: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
    .sort({ startTime: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-events -pages');

    const totalSessions = await UserSession.countDocuments({
      startTime: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });

    res.json({
      success: true,
      data: {
        sessions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalSessions,
          pages: Math.ceil(totalSessions / limit)
        }
      }
    });
  } catch (error) {
    console.error('Session analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch session analytics'
    });
  }
});

// Get page analytics
router.get('/pages', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate, limit = 20 } = req.query;

    const pageStats = await UserSession.aggregate([
      {
        $match: {
          startTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      { $unwind: '$pages' },
      {
        $group: {
          _id: '$pages.url',
          title: { $first: '$pages.title' },
          totalViews: { $sum: 1 },
          uniqueSessions: { $addToSet: '$sessionId' },
          avgTimeSpent: { $avg: '$pages.timeSpent' }
        }
      },
      {
        $project: {
          url: '$_id',
          title: 1,
          totalViews: 1,
          uniqueViews: { $size: '$uniqueSessions' },
          avgTimeSpent: { $round: ['$avgTimeSpent', 2] }
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: pageStats
    });
  } catch (error) {
    console.error('Page analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch page analytics'
    });
  }
});

// Get conversion analytics
router.get('/conversions', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const conversionStats = await UserSession.aggregate([
      {
        $match: {
          startTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          'conversion.type': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$conversion.type',
          count: { $sum: 1 },
          totalValue: { $sum: '$conversion.value' },
          avgValue: { $avg: '$conversion.value' }
        }
      },
      {
        $project: {
          conversionType: '$_id',
          count: 1,
          totalValue: { $round: ['$totalValue', 2] },
          avgValue: { $round: ['$avgValue', 2] }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get conversion funnel
    const funnelStats = await UserSession.aggregate([
      {
        $match: {
          startTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          sessionsWithEvents: {
            $sum: {
              $cond: [{ $gt: [{ $size: '$events' }, 0] }, 1, 0]
            }
          },
          conversions: {
            $sum: {
              $cond: [{ $ne: ['$conversion.type', null] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        conversions: conversionStats,
        funnel: funnelStats[0] || {
          totalSessions: 0,
          sessionsWithEvents: 0,
          conversions: 0
        }
      }
    });
  } catch (error) {
    console.error('Conversion analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversion analytics'
    });
  }
});

// Get geographic analytics
router.get('/geography', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    const geoStats = await UserSession.aggregate([
      {
        $match: {
          startTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: '$location.country',
          sessions: { $sum: 1 },
          cities: { $addToSet: '$location.city' },
          conversions: {
            $sum: {
              $cond: [{ $ne: ['$conversion.type', null] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          country: '$_id',
          sessions: 1,
          uniqueCities: { $size: '$cities' },
          conversions: 1,
          conversionRate: {
            $multiply: [
              { $divide: ['$conversions', '$sessions'] },
              100
            ]
          }
        }
      },
      { $sort: { sessions: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: geoStats
    });
  } catch (error) {
    console.error('Geographic analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch geographic analytics'
    });
  }
});

// Get device analytics
router.get('/devices', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const deviceStats = await UserSession.aggregate([
      {
        $match: {
          startTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: {
            device: '$deviceInfo.device',
            browser: '$deviceInfo.browser',
            os: '$deviceInfo.os'
          },
          sessions: { $sum: 1 },
          conversions: {
            $sum: {
              $cond: [{ $ne: ['$conversion.type', null] }, 1, 0]
            }
          },
          avgSessionDuration: { $avg: '$sessionDuration' }
        }
      },
      {
        $project: {
          device: '$_id.device',
          browser: '$_id.browser',
          os: '$_id.os',
          sessions: 1,
          conversions: 1,
          conversionRate: {
            $multiply: [
              { $divide: ['$conversions', '$sessions'] },
              100
            ]
          },
          avgSessionDuration: { $round: ['$avgSessionDuration', 2] }
        }
      },
      { $sort: { sessions: -1 } }
    ]);

    res.json({
      success: true,
      data: deviceStats
    });
  } catch (error) {
    console.error('Device analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch device analytics'
    });
  }
});

// Export analytics data
router.get('/export', validateDateRange, async (req, res) => {
  try {
    const { startDate, endDate, type = 'sessions' } = req.query;

    let data;
    let filename;

    switch (type) {
      case 'sessions':
        data = await UserSession.find({
          startTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }).select('-events -pages');
        filename = `sessions-${startDate}-${endDate}.json`;
        break;

      case 'pages':
        data = await UserSession.aggregate([
          {
            $match: {
              startTime: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              }
            }
          },
          { $unwind: '$pages' },
          {
            $group: {
              _id: '$pages.url',
              title: { $first: '$pages.title' },
              views: { $sum: 1 }
            }
          }
        ]);
        filename = `pages-${startDate}-${endDate}.json`;
        break;

      case 'conversions':
        data = await UserSession.find({
          startTime: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          },
          'conversion.type': { $exists: true, $ne: null }
        });
        filename = `conversions-${startDate}-${endDate}.json`;
        break;

      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid export type'
        });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(data);
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export analytics data'
    });
  }
});

module.exports = router;
