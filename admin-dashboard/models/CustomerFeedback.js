const mongoose = require('mongoose');
const moment = require('moment');

const customerFeedbackSchema = new mongoose.Schema({
  feedbackId: {
    type: String,
    required: true,
    unique: true,
    default: () => `FB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  contact: {
    preferredMethod: {
      type: String,
      enum: ['email', 'phone', 'whatsapp', 'skype', 'other'],
      default: 'email'
    },
    timezone: String,
    bestTime: String
  },
  feedback: {
    type: {
      type: String,
      enum: ['suggestion', 'complaint', 'question', 'feature_request', 'bug_report', 'compliment', 'general'],
      required: true
    },
    category: {
      type: String,
      enum: ['website', 'product', 'service', 'support', 'pricing', 'features', 'ui_ux', 'performance', 'other'],
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    attachments: [{
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      url: String
    }]
  },
  context: {
    pageUrl: String,
    userAgent: String,
    ipAddress: String,
    sessionId: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  },
  status: {
    current: {
      type: String,
      enum: ['new', 'reviewing', 'in_progress', 'resolved', 'closed', 'spam'],
      default: 'new'
    },
    history: [{
      status: String,
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      notes: String
    }]
  },
  responses: [{
    from: {
      type: String,
      enum: ['customer', 'admin'],
      required: true
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  tags: [{
    name: String,
    color: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  metrics: {
    responseTime: Number, // in hours
    resolutionTime: Number, // in hours
    customerSatisfaction: {
      type: Number,
      min: 1,
      max: 5
    },
    followUpRequired: {
      type: Boolean,
      default: false
    },
    followUpDate: Date
  },
  automation: {
    autoAssigned: {
      type: Boolean,
      default: false
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    autoResponseSent: {
      type: Boolean,
      default: false
    },
    reminderSent: {
      type: Boolean,
      default: false
    }
  },
  notes: [{
    content: String,
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isPrivate: {
      type: Boolean,
      default: false
    }
  }],
  relatedTickets: [{
    ticketId: String,
    relationship: String // 'duplicate', 'related', 'parent', 'child'
  }]
}, {
  timestamps: true
});

// Indexes
customerFeedbackSchema.index({ 'feedback.type': 1, createdAt: -1 });
customerFeedbackSchema.index({ 'feedback.category': 1 });
customerFeedbackSchema.index({ 'status.current': 1 });
customerFeedbackSchema.index({ 'feedback.priority': 1 });
customerFeedbackSchema.index({ 'customerInfo.email': 1 });
customerFeedbackSchema.index({ createdAt: -1 });
customerFeedbackSchema.index({ 'automation.assignedTo': 1 });

// Virtual for response time
customerFeedbackSchema.virtual('responseTimeHours').get(function() {
  if (this.responses.length > 0) {
    const firstResponse = this.responses[0];
    return moment(firstResponse.timestamp).diff(moment(this.createdAt), 'hours');
  }
  return null;
});

// Methods
customerFeedbackSchema.methods.addResponse = function(from, message, adminId = null, isInternal = false) {
  this.responses.push({
    from,
    adminId,
    message,
    isInternal
  });
  
  // Update status if it's an admin response
  if (from === 'admin') {
    this.updateStatus('reviewing', adminId, 'Response sent to customer');
  }
  
  return this.save();
};

customerFeedbackSchema.methods.updateStatus = function(newStatus, adminId, notes = '') {
  this.status.history.push({
    status: this.status.current,
    changedBy: adminId,
    notes
  });
  this.status.current = newStatus;
  return this.save();
};

customerFeedbackSchema.methods.addTag = function(name, color, adminId) {
  this.tags.push({
    name,
    color,
    addedBy: adminId
  });
  return this.save();
};

customerFeedbackSchema.methods.addNote = function(content, adminId, isPrivate = false) {
  this.notes.push({
    content,
    adminId,
    isPrivate
  });
  return this.save();
};

customerFeedbackSchema.methods.assignTo = function(adminId) {
  this.automation.assignedTo = adminId;
  this.automation.autoAssigned = true;
  return this.save();
};

// Static methods
customerFeedbackSchema.statics.getFeedbackByStatus = function(status) {
  return this.find({ 'status.current': status }).sort({ createdAt: -1 });
};

customerFeedbackSchema.statics.getFeedbackByPriority = function(priority) {
  return this.find({ 'feedback.priority': priority }).sort({ createdAt: -1 });
};

customerFeedbackSchema.statics.getFeedbackByCategory = function(category) {
  return this.find({ 'feedback.category': category }).sort({ createdAt: -1 });
};

customerFeedbackSchema.statics.getFeedbackByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ createdAt: -1 });
};

customerFeedbackSchema.statics.getFeedbackStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$feedback.type',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

customerFeedbackSchema.statics.getPriorityStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$feedback.priority',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

customerFeedbackSchema.statics.getResponseTimeStats = function() {
  return this.aggregate([
    {
      $match: {
        'responses.0': { $exists: true }
      }
    },
    {
      $addFields: {
        responseTime: {
          $divide: [
            { $subtract: ['$responses.0.timestamp', '$createdAt'] },
            1000 * 60 * 60 // Convert to hours
          ]
        }
      }
    },
    {
      $group: {
        _id: null,
        avgResponseTime: { $avg: '$responseTime' },
        minResponseTime: { $min: '$responseTime' },
        maxResponseTime: { $max: '$responseTime' }
      }
    }
  ]);
};

// Pre-save middleware
customerFeedbackSchema.pre('save', function(next) {
  // Auto-generate feedback ID if not provided
  if (!this.feedbackId) {
    this.feedbackId = `FB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Update response time metric
  if (this.responses.length > 0 && !this.metrics.responseTime) {
    const firstResponse = this.responses[0];
    this.metrics.responseTime = moment(firstResponse.timestamp).diff(moment(this.createdAt), 'hours');
  }
  
  next();
});

module.exports = mongoose.model('CustomerFeedback', customerFeedbackSchema);
