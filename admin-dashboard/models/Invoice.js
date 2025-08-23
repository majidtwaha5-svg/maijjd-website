const mongoose = require('mongoose');
const moment = require('moment');

const invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true,
    default: () => `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
  customer: {
    customerId: {
      type: String,
      required: true
    },
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
    phone: String,
    company: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    taxId: String
  },
  billing: {
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true
    },
    exchangeRate: {
      type: Number,
      default: 1
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  items: [{
    itemId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    type: {
      type: String,
      enum: ['service', 'product', 'upgrade', 'subscription', 'one_time'],
      required: true
    },
    category: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  subscription: {
    planId: String,
    planName: String,
    billingCycle: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly', 'one_time'],
      default: 'monthly'
    },
    startDate: Date,
    endDate: Date,
    nextBillingDate: Date,
    autoRenew: {
      type: Boolean,
      default: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe', 'cash', 'check', 'other'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled', 'disputed'],
      default: 'pending'
    },
    transactionId: String,
    gateway: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    paidAt: Date,
    dueDate: {
      type: Date,
      required: true
    },
    lateFees: {
      type: Number,
      default: 0
    },
    notes: String
  },
  status: {
    current: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled', 'refunded'],
      default: 'draft'
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
  notifications: {
    sent: {
      invoice: {
        type: Boolean,
        default: false
      },
      reminder: {
        type: Boolean,
        default: false
      },
      overdue: {
        type: Boolean,
        default: false
      }
    },
    lastSent: {
      invoice: Date,
      reminder: Date,
      overdue: Date
    }
  },
  documents: {
    pdfUrl: String,
    pdfGeneratedAt: Date,
    attachments: [{
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
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
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  metadata: {
    source: String, // 'website', 'admin_panel', 'api', 'import'
    campaign: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    customFields: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
invoiceSchema.index({ invoiceId: 1 });
invoiceSchema.index({ 'customer.email': 1 });
invoiceSchema.index({ 'payment.status': 1 });
invoiceSchema.index({ 'status.current': 1 });
invoiceSchema.index({ 'payment.dueDate': 1 });
invoiceSchema.index({ createdAt: -1 });
invoiceSchema.index({ 'subscription.planId': 1 });

// Virtual for days overdue
invoiceSchema.virtual('daysOverdue').get(function() {
  if (this.payment.status === 'completed') return 0;
  if (this.payment.dueDate < new Date()) {
    return moment().diff(moment(this.payment.dueDate), 'days');
  }
  return 0;
});

// Virtual for payment status
invoiceSchema.virtual('isOverdue').get(function() {
  return this.payment.status !== 'completed' && this.payment.dueDate < new Date();
});

// Methods
invoiceSchema.methods.calculateTotals = function() {
  this.billing.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.billing.taxAmount = (this.billing.subtotal * this.billing.taxRate) / 100;
  this.billing.totalAmount = this.billing.subtotal + this.billing.taxAmount - this.billing.discountAmount;
  return this.save();
};

invoiceSchema.methods.addItem = function(item) {
  item.totalPrice = item.quantity * item.unitPrice;
  this.items.push(item);
  return this.calculateTotals();
};

invoiceSchema.methods.updatePaymentStatus = function(status, transactionId = null, notes = '') {
  this.payment.status = status;
  if (transactionId) this.payment.transactionId = transactionId;
  if (status === 'completed') {
    this.payment.paidAt = new Date();
    this.status.current = 'paid';
  }
  
  this.status.history.push({
    status: this.status.current,
    changedBy: null, // Will be set by admin
    notes
  });
  
  return this.save();
};

invoiceSchema.methods.sendInvoice = function() {
  this.status.current = 'sent';
  this.notifications.sent.invoice = true;
  this.notifications.lastSent.invoice = new Date();
  
  this.status.history.push({
    status: 'draft',
    changedBy: null,
    notes: 'Invoice sent to customer'
  });
  
  return this.save();
};

invoiceSchema.methods.addNote = function(content, adminId, isInternal = false) {
  this.notes.push({
    content,
    adminId,
    isInternal
  });
  return this.save();
};

// Static methods
invoiceSchema.statics.getInvoicesByStatus = function(status) {
  return this.find({ 'status.current': status }).sort({ createdAt: -1 });
};

invoiceSchema.statics.getOverdueInvoices = function() {
  return this.find({
    'payment.status': { $ne: 'completed' },
    'payment.dueDate': { $lt: new Date() }
  }).sort({ 'payment.dueDate': 1 });
};

invoiceSchema.statics.getInvoicesByDateRange = function(startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ createdAt: -1 });
};

invoiceSchema.statics.getRevenueStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        'payment.status': 'completed',
        'payment.paidAt': {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$payment.paidAt' },
          month: { $month: '$payment.paidAt' }
        },
        totalRevenue: { $sum: '$billing.totalAmount' },
        invoiceCount: { $sum: 1 },
        avgInvoiceValue: { $avg: '$billing.totalAmount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
};

invoiceSchema.statics.getPaymentMethodStats = function() {
  return this.aggregate([
    {
      $match: {
        'payment.status': 'completed'
      }
    },
    {
      $group: {
        _id: '$payment.method',
        count: { $sum: 1 },
        totalAmount: { $sum: '$billing.totalAmount' }
      }
    },
    { $sort: { totalAmount: -1 } }
  ]);
};

invoiceSchema.statics.getCustomerInvoiceHistory = function(customerEmail) {
  return this.find({
    'customer.email': customerEmail
  }).sort({ createdAt: -1 });
};

// Pre-save middleware
invoiceSchema.pre('save', function(next) {
  // Auto-generate invoice ID if not provided
  if (!this.invoiceId) {
    this.invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Set due date if not provided (30 days from creation)
  if (!this.payment.dueDate) {
    this.payment.dueDate = moment().add(30, 'days').toDate();
  }
  
  // Calculate totals if items exist
  if (this.items.length > 0) {
    this.calculateTotals();
  }
  
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
