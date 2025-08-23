const { body, query, param, validationResult } = require('express-validator');

const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

const validateFeedback = [
  body('customerInfo.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('customerInfo.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('feedback.type')
    .isIn(['suggestion', 'complaint', 'question', 'feature_request', 'bug_report', 'compliment', 'general'])
    .withMessage('Invalid feedback type'),
  body('feedback.category')
    .isIn(['website', 'product', 'service', 'support', 'pricing', 'features', 'ui_ux', 'performance', 'other'])
    .withMessage('Invalid feedback category'),
  body('feedback.subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('feedback.message')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

const validateInvoice = [
  body('customer.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),
  body('customer.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Item name must be between 1 and 200 characters'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

const validateAdminLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

const validateTrackingEvent = [
  body('sessionId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Session ID is required'),
  body('event')
    .isIn(['page_view', 'click', 'scroll', 'form_submit', 'download', 'purchase', 'signup', 'login', 'search', 'custom'])
    .withMessage('Invalid event type'),
  body('data')
    .optional()
    .isObject()
    .withMessage('Data must be an object'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateDateRange,
  validateFeedback,
  validateInvoice,
  validateAdminLogin,
  validateTrackingEvent
};
