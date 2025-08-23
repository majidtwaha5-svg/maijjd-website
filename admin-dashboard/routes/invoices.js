const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { validateInvoice } = require('../middleware/validation');

// Create invoice
router.post('/', validateInvoice, async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    
    res.status(201).json({
      success: true,
      data: {
        invoiceId: invoice.invoiceId,
        message: 'Invoice created successfully'
      }
    });
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create invoice'
    });
  }
});

// Get invoice list
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, customerEmail } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (status) query['status.current'] = status;
    if (customerEmail) query['customer.email'] = customerEmail;
    
    const invoices = await Invoice.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Invoice.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        invoices,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get invoices'
    });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceId: req.params.id });
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      });
    }
    
    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get invoice'
    });
  }
});

module.exports = router;
