const express = require('express');
const router = express.Router();
const CustomerFeedback = require('../models/CustomerFeedback');
const { validateFeedback } = require('../middleware/validation');

// Submit feedback
router.post('/', validateFeedback, async (req, res) => {
  try {
    const feedback = new CustomerFeedback({
      ...req.body,
      context: {
        pageUrl: req.body.pageUrl || req.get('Referer'),
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      }
    });
    
    await feedback.save();
    
    res.status(201).json({
      success: true,
      data: {
        feedbackId: feedback.feedbackId,
        message: 'Feedback submitted successfully'
      }
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit feedback'
    });
  }
});

// Get feedback list (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority, type } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) query['status.current'] = status;
    if (priority) query['feedback.priority'] = priority;
    if (type) query['feedback.type'] = type;
    
    const feedback = await CustomerFeedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await CustomerFeedback.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        feedback,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get feedback'
    });
  }
});

module.exports = router;
