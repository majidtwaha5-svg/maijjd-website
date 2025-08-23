const mongoose = require('mongoose');
const moment = require('moment');

const userSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  deviceInfo: {
    browser: String,
    browserVersion: String,
    os: String,
    osVersion: String,
    device: String,
    isMobile: Boolean,
    isTablet: Boolean,
    isDesktop: Boolean
  },
  location: {
    country: String,
    region: String,
    city: String,
    timezone: String,
    latitude: Number,
    longitude: Number
  },
  referrer: {
    type: String,
    default: null
  },
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,
  utmTerm: String,
  utmContent: String,
  entryPage: {
    type: String,
    required: true
  },
  currentPage: {
    type: String,
    required: true
  },
  pages: [{
    url: String,
    title: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    timeSpent: Number // in seconds
  }],
  events: [{
    type: {
      type: String,
      enum: ['page_view', 'click', 'scroll', 'form_submit', 'download', 'purchase', 'signup', 'login', 'search', 'custom', 'navigation']
    },
    name: String,
    data: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  sessionDuration: {
    type: Number,
    default: 0 // in seconds
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  conversion: {
    type: {
      type: String,
      enum: ['contact_form', 'purchase', 'signup', 'download', 'newsletter', 'custom']
    },
    value: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    timestamp: Date
  },
  tags: [String],
  notes: String
}, {
  timestamps: true
});

// Indexes for better query performance
userSessionSchema.index({ startTime: -1 });
userSessionSchema.index({ lastActivity: -1 });
userSessionSchema.index({ ipAddress: 1, startTime: -1 });
userSessionSchema.index({ 'location.country': 1 });
userSessionSchema.index({ 'deviceInfo.isMobile': 1 });
userSessionSchema.index({ conversion: 1 });

// Virtual for session duration
userSessionSchema.virtual('duration').get(function() {
  if (this.endTime) {
    return moment(this.endTime).diff(moment(this.startTime), 'seconds');
  }
  return moment().diff(moment(this.startTime), 'seconds');
});

// Methods
userSessionSchema.methods.addPageView = function(url, title) {
  this.pages.push({
    url,
    title,
    timestamp: new Date()
  });
  this.currentPage = url;
  this.lastActivity = new Date();
  return this.save();
};

userSessionSchema.methods.addEvent = function(type, name, data = {}) {
  this.events.push({
    type,
    name,
    data,
    timestamp: new Date()
  });
  this.lastActivity = new Date();
  return this.save();
};

userSessionSchema.methods.endSession = function() {
  this.isActive = false;
  this.endTime = new Date();
  this.sessionDuration = moment(this.endTime).diff(moment(this.startTime), 'seconds');
  return this.save();
};

userSessionSchema.methods.setConversion = function(type, value = 0, currency = 'USD') {
  this.conversion = {
    type,
    value,
    currency,
    timestamp: new Date()
  };
  return this.save();
};

// Static methods for analytics
userSessionSchema.statics.getActiveSessions = function() {
  return this.find({ isActive: true }).countDocuments();
};

userSessionSchema.statics.getSessionsByDateRange = function(startDate, endDate) {
  return this.find({
    startTime: {
      $gte: startDate,
      $lte: endDate
    }
  });
};

userSessionSchema.statics.getTopPages = function(limit = 10) {
  return this.aggregate([
    { $unwind: '$pages' },
    {
      $group: {
        _id: '$pages.url',
        title: { $first: '$pages.title' },
        views: { $sum: 1 },
        uniqueSessions: { $addToSet: '$sessionId' }
      }
    },
    {
      $project: {
        url: '$_id',
        title: 1,
        views: 1,
        uniqueSessions: { $size: '$uniqueSessions' }
      }
    },
    { $sort: { views: -1 } },
    { $limit: limit }
  ]);
};

userSessionSchema.statics.getConversionRate = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        startTime: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        conversions: {
          $sum: {
            $cond: [{ $ne: ['$conversion.type', null] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        conversionRate: {
          $multiply: [
            { $divide: ['$conversions', '$totalSessions'] },
            100
          ]
        }
      }
    }
  ]);
};

userSessionSchema.statics.getDeviceStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$deviceInfo.device',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

userSessionSchema.statics.getGeographicStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$location.country',
        count: { $sum: 1 },
        cities: { $addToSet: '$location.city' }
      }
    },
    {
      $project: {
        country: '$_id',
        sessions: '$count',
        uniqueCities: { $size: '$cities' }
      }
    },
    { $sort: { sessions: -1 } }
  ]);
};

// Pre-save middleware to update session duration
userSessionSchema.pre('save', function(next) {
  if (this.isModified('endTime') && this.endTime) {
    this.sessionDuration = moment(this.endTime).diff(moment(this.startTime), 'seconds');
  }
  next();
});

module.exports = mongoose.model('UserSession', userSessionSchema);
