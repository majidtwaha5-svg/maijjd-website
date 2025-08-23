const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { validateAdminLogin } = require('../middleware/validation');

// Admin login
router.post('/login', validateAdminLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);
    
    // Find admin by email
    const admin = await Admin.findByEmail(email);
    
    console.log('Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check if account is locked
    if (admin.isLocked) {
      return res.status(423).json({
        success: false,
        error: 'Account is locked. Please try again later.'
      });
    }
    
    // Check if account is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }
    
    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await admin.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Reset login attempts on successful login
    await admin.resetLoginAttempts();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id,
        email: admin.email,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        }
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Get admin profile
router.get('/profile', async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    
    res.json({
      success: true,
      data: admin
    });
    
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
