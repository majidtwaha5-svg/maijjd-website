const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const Admin = require('./models/Admin');
const UserSession = require('./models/UserSession');
const CustomerFeedback = require('./models/CustomerFeedback');
const Invoice = require('./models/Invoice');

async function initializeDatabase() {
  try {
    console.log('🔧 Initializing Maijjd Admin Dashboard Database...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/maijjd-admin';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Create admin user
    await createAdminUser();
    
    // Create sample data
    await createSampleData();
    
    console.log('✅ Database initialization completed successfully!');
    console.log('🎯 Admin Dashboard is ready to use!');
    console.log('📊 Access your dashboard at: http://localhost:5002/admin');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@maijjd.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      return;
    }
    
    // Create admin user (password will be hashed by pre-save middleware)
    const admin = new Admin({
      name: 'Maijjd Admin',
      email: 'admin@maijjd.com',
      password: 'admin123',
      role: 'super_admin',
      permissions: ['all'],
      isActive: true
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@maijjd.com');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    throw error;
  }
}

async function createSampleData() {
  try {
    console.log('📊 Creating sample data...');
    
    // Create sample user sessions
    await createSampleSessions();
    
    // Create sample customer feedback
    await createSampleFeedback();
    
    // Create sample invoices
    await createSampleInvoices();
    
    console.log('✅ Sample data created successfully');
    
  } catch (error) {
    console.error('❌ Failed to create sample data:', error);
    throw error;
  }
}

async function createSampleSessions() {
  try {
    const sessionCount = await UserSession.countDocuments();
    
    if (sessionCount > 0) {
      console.log('ℹ️  Sample sessions already exist');
      return;
    }
    
    const sampleSessions = [
      {
        sessionId: 'sample-session-1',
        userId: 'user-1',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        deviceInfo: {
          browser: 'Chrome',
          browserVersion: '91.0.4472.124',
          os: 'Windows',
          osVersion: '10',
          device: 'Desktop',
          isMobile: false,
          isTablet: false,
          isDesktop: true
        },
        location: {
          country: 'United States',
          region: 'California',
          city: 'San Francisco',
          timezone: 'America/Los_Angeles'
        },
        entryPage: '/',
        currentPage: '/services',
        pages: [
          { url: '/', title: 'Home - Maijjd', timestamp: new Date(Date.now() - 300000) },
          { url: '/about', title: 'About - Maijjd', timestamp: new Date(Date.now() - 200000) },
          { url: '/services', title: 'Services - Maijjd', timestamp: new Date(Date.now() - 100000) }
        ],
        events: [
          { type: 'page_view', name: 'home_page', timestamp: new Date(Date.now() - 300000) },
          { type: 'click', name: 'about_link', timestamp: new Date(Date.now() - 250000) },
          { type: 'page_view', name: 'about_page', timestamp: new Date(Date.now() - 200000) },
          { type: 'click', name: 'services_link', timestamp: new Date(Date.now() - 150000) },
          { type: 'page_view', name: 'services_page', timestamp: new Date(Date.now() - 100000) }
        ],
        sessionDuration: 300,
        isActive: true,
        startTime: new Date(Date.now() - 300000),
        lastActivity: new Date()
      },
      {
        sessionId: 'sample-session-2',
        userId: 'user-2',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
        deviceInfo: {
          browser: 'Safari',
          browserVersion: '14.1.1',
          os: 'iOS',
          osVersion: '14.6',
          device: 'iPhone',
          isMobile: true,
          isTablet: false,
          isDesktop: false
        },
        location: {
          country: 'Canada',
          region: 'Ontario',
          city: 'Toronto',
          timezone: 'America/Toronto'
        },
        entryPage: '/',
        currentPage: '/contact',
        pages: [
          { url: '/', title: 'Home - Maijjd', timestamp: new Date(Date.now() - 600000) },
          { url: '/contact', title: 'Contact - Maijjd', timestamp: new Date(Date.now() - 500000) }
        ],
        events: [
          { type: 'page_view', name: 'home_page', timestamp: new Date(Date.now() - 600000) },
          { type: 'click', name: 'contact_link', timestamp: new Date(Date.now() - 550000) },
          { type: 'page_view', name: 'contact_page', timestamp: new Date(Date.now() - 500000) },
          { type: 'form_submit', name: 'contact_form', timestamp: new Date(Date.now() - 400000) }
        ],
        sessionDuration: 600,
        isActive: false,
        startTime: new Date(Date.now() - 600000),
        endTime: new Date(Date.now() - 400000),
        conversion: {
          type: 'contact_form',
          value: 0,
          currency: 'USD',
          timestamp: new Date(Date.now() - 400000)
        }
      }
    ];
    
    await UserSession.insertMany(sampleSessions);
    console.log('✅ Sample user sessions created');
    
  } catch (error) {
    console.error('❌ Failed to create sample sessions:', error);
    throw error;
  }
}

async function createSampleFeedback() {
  try {
    const feedbackCount = await CustomerFeedback.countDocuments();
    
    if (feedbackCount > 0) {
      console.log('ℹ️  Sample feedback already exists');
      return;
    }
    
    const sampleFeedback = [
      {
        customerInfo: {
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1-555-0123',
          company: 'Tech Solutions Inc.'
        },
        contact: {
          preferredMethod: 'email',
          timezone: 'America/New_York'
        },
        feedback: {
          type: 'suggestion',
          category: 'features',
          priority: 'medium',
          subject: 'Great website, but could use more features',
          message: 'I really like your website design and the services you offer. However, I think it would be great if you could add more interactive features and maybe a blog section. The current design is clean and professional.'
        },
        context: {
          pageUrl: '/services',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          ipAddress: '192.168.1.100'
        },
        status: {
          current: 'new'
        }
      },
      {
        customerInfo: {
          name: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          phone: '+1-555-0456',
          company: 'Digital Marketing Pro'
        },
        contact: {
          preferredMethod: 'phone',
          timezone: 'America/Chicago'
        },
        feedback: {
          type: 'question',
          category: 'support',
          priority: 'high',
          subject: 'Need help with pricing information',
          message: 'I\'m interested in your services but I need more detailed pricing information. Could you please provide a breakdown of your different packages and what\'s included in each? Also, do you offer any discounts for long-term contracts?'
        },
        context: {
          pageUrl: '/pricing',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          ipAddress: '192.168.1.101'
        },
        status: {
          current: 'reviewing'
        }
      },
      {
        customerInfo: {
          name: 'Mike Wilson',
          email: 'mike.wilson@example.com',
          phone: '+1-555-0789'
        },
        contact: {
          preferredMethod: 'email',
          timezone: 'America/Los_Angeles'
        },
        feedback: {
          type: 'compliment',
          category: 'ui_ux',
          priority: 'low',
          subject: 'Excellent user experience!',
          message: 'Just wanted to say that your website is absolutely fantastic! The user interface is intuitive, the design is modern, and everything loads quickly. Great job on creating such a professional and user-friendly experience.'
        },
        context: {
          pageUrl: '/',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)',
          ipAddress: '192.168.1.102'
        },
        status: {
          current: 'resolved'
        }
      }
    ];
    
    await CustomerFeedback.insertMany(sampleFeedback);
    console.log('✅ Sample customer feedback created');
    
  } catch (error) {
    console.error('❌ Failed to create sample feedback:', error);
    throw error;
  }
}

async function createSampleInvoices() {
  try {
    const invoiceCount = await Invoice.countDocuments();
    
    if (invoiceCount > 0) {
      console.log('ℹ️  Sample invoices already exist');
      return;
    }
    
    const sampleInvoices = [
      {
        customer: {
          customerId: 'CUST-001',
          name: 'Tech Solutions Inc.',
          email: 'billing@techsolutions.com',
          phone: '+1-555-0123',
          company: 'Tech Solutions Inc.',
          address: {
            street: '123 Business Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          }
        },
        billing: {
          billingAddress: {
            street: '123 Business Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          },
          currency: 'USD',
          subtotal: 1500,
          taxAmount: 150,
          totalAmount: 1650,
          taxRate: 10
        },
        items: [
          {
            itemId: 'ITEM-001',
            name: 'Website Development',
            description: 'Custom website development with responsive design',
            quantity: 1,
            unitPrice: 1500,
            totalPrice: 1500,
            type: 'service',
            category: 'web_development'
          }
        ],
        subscription: {
          planId: 'PLAN-PRO',
          planName: 'Professional Plan',
          billingCycle: 'monthly',
          startDate: new Date(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          autoRenew: true
        },
        payment: {
          method: 'credit_card',
          status: 'completed',
          transactionId: 'TXN-123456',
          gateway: 'stripe',
          paidAt: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        status: {
          current: 'paid'
        }
      },
      {
        customer: {
          customerId: 'CUST-002',
          name: 'Digital Marketing Pro',
          email: 'accounts@digitalmarketingpro.com',
          phone: '+1-555-0456',
          company: 'Digital Marketing Pro',
          address: {
            street: '456 Marketing St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'United States'
          }
        },
        billing: {
          billingAddress: {
            street: '456 Marketing St',
            city: 'Chicago',
            state: 'IL',
            zipCode: '60601',
            country: 'United States'
          },
          currency: 'USD',
          subtotal: 2500,
          taxAmount: 250,
          totalAmount: 2750,
          taxRate: 10
        },
        items: [
          {
            itemId: 'ITEM-002',
            name: 'SEO Optimization',
            description: 'Search engine optimization services',
            quantity: 1,
            unitPrice: 1500,
            totalPrice: 1500,
            type: 'service',
            category: 'seo'
          },
          {
            itemId: 'ITEM-003',
            name: 'Content Marketing',
            description: 'Content creation and marketing strategy',
            quantity: 1,
            unitPrice: 1000,
            totalPrice: 1000,
            type: 'service',
            category: 'content_marketing'
          }
        ],
        subscription: {
          planId: 'PLAN-PREMIUM',
          planName: 'Premium Plan',
          billingCycle: 'monthly',
          startDate: new Date(),
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          autoRenew: true
        },
        payment: {
          method: 'bank_transfer',
          status: 'pending',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        status: {
          current: 'sent'
        }
      }
    ];
    
    await Invoice.insertMany(sampleInvoices);
    console.log('✅ Sample invoices created');
    
  } catch (error) {
    console.error('❌ Failed to create sample invoices:', error);
    throw error;
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
