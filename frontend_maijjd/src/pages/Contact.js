import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Clock, Send, Bot, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import AIChatWidget from '../components/AIChatWidget';

const Contact = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    service: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null
  const [chatOpen, setChatOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [chatSoftware, setChatSoftware] = useState({ name: 'Maijjd AI Hub' });

  // Handle pre-filling form data from navigation state
  useEffect(() => {
    if (location.state) {
      const { selectedService, selectedSoftware, serviceCategory, softwareCategory, serviceDescription, softwareDescription, servicePrice, softwarePrice, softwareVersion } = location.state;
      
      let message = '';
      let service = '';
      
      if (selectedService) {
        service = 'custom-development'; // Default to custom development for services
        message = `I'm interested in your ${selectedService} service.\n\nService Details:\n- Category: ${serviceCategory || 'Development'}\n- Description: ${serviceDescription || 'Professional service'}\n- Pricing: ${servicePrice || 'Contact for quote'}\n\nPlease provide more information about this service and how it can benefit my business.`;
      } else if (selectedSoftware) {
        service = 'custom-development'; // Default to custom development for software
        message = `I'm interested in trying your ${selectedSoftware} software.\n\nSoftware Details:\n- Category: ${softwareCategory || 'Business'}\n- Version: ${softwareVersion || 'Latest'}\n- Description: ${softwareDescription || 'Professional software solution'}\n- Pricing: ${softwarePrice || 'Contact for pricing'}\n\nPlease provide more information about this software and how I can get started with a trial.`;
      }
      
      if (message) {
        setFormData(prev => ({
          ...prev,
          service,
          message: message.trim()
        }));
      }
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      await apiService.submitContact(formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        message: '',
        service: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Contact form submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      details: 'info@maijjd.com',
      description: 'Send us an email anytime'
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'MJND Assistant',
      details: '24/7 Available',
      description: 'Get instant help from our AI system'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Office',
              details: 'DFW, TX',
      description: 'Visit us anytime'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Support',
      details: '24/7 Available',
      description: 'Round the clock support'
    }
  ];

  const supportOptions = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'MJND-Powered Support',
      description: 'Get instant help from our intelligent MJND assistant',
      features: ['24/7 Availability', 'Instant Responses', 'Smart Solutions', 'Learning Capabilities'],
      action: 'Start MJND Chat',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'MJND Development Assistant',
      description: 'MJND-powered coding and development support',
      features: ['Code Generation', 'Bug Detection', 'Performance Optimization', 'Best Practices'],
      action: 'Start MJND Dev',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'MJND Knowledge Base',
      description: 'Intelligent documentation and learning resources',
      features: ['Smart Search', 'MJND Explanations', 'Interactive Tutorials', 'Adaptive Learning'],
      action: 'Browse MJND Docs',
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const handleSupportAction = (action) => {
    if (action === 'Start MJND Chat') {
      setChatSoftware({ name: 'Maijjd MJND Hub' });
      setChatOpen(true);
      return;
    }
    if (action === 'Start MJND Dev') {
      // Route to Software page and auto-open the Dev Environment
      navigate('/software', { state: { openDev: true } });
      return;
    }
    if (action === 'Browse MJND Docs') {
      // Open lightweight docs modal
      setDocsOpen(true);
      return;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in <span className="text-primary-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your project? Have questions about our MJND‑powered services?
              Our intelligent MJND system is here to help 24/7. Let's discuss how MJND can help you achieve your goals.
            </p>
          </div>
        </div>
      </section>

      {/* AI Support Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to Get Support
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the MJND support option that works best for you — from instant MJND assistance to MJND‑powered development support and intelligent knowledge resources.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
                <div className={`flex items-center justify-center w-16 h-16 rounded-lg mb-6 ${option.color}`}>
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {option.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => handleSupportAction(option.action)}
                  className="btn-primary w-full"
                >
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-800">Thank you for your message! We will get back to you soon.</p>
                  </div>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <p className="text-red-800">Failed to send message. Please try again.</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Your Company"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      onChange={handleChange}
                      className="input-field"
                      placeholder="+1 (415) 555-0123"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interest
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select a service</option>
                    <option value="custom-development">Custom Software Development</option>
                    <option value="web-development">Web Application Development</option>
                    <option value="mobile-development">Mobile App Development</option>
                    <option value="database-management">Database Management</option>
                    <option value="system-integration">System Integration</option>
                    <option value="user-management">User Management Systems</option>
                    <option value="analytics-reporting">Analytics & Reporting</option>
                    <option value="security-solutions">Security Solutions</option>
                    <option value="cloud-infrastructure">Cloud Infrastructure</option>
                    <option value="ai-integration">AI Integration & Support</option>
                    <option value="devops-services">DevOps & CI/CD Services</option>
                    <option value="consulting">IT Consulting & Strategy</option>
                    <option value="maintenance">Software Maintenance & Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="input-field"
                    placeholder="Tell us about your project requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mr-4">
                      <div className="text-primary-600">
                        {info.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      <p className="text-primary-600 font-medium mb-1">
                        {info.details}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {info.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* MJND Support Hours */}
              <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  🤖 MJND Support Availability
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-blue-700">MJND Assistant</span>
                    <span className="font-medium text-blue-800">24/7 Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Human Support</span>
                    <span className="font-medium text-blue-800">Mon-Fri 8AM-6PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Emergency MJND</span>
                    <span className="font-medium text-blue-800">Always Online</span>
                  </div>
                </div>
                <p className="text-sm text-blue-600 mt-3">
                  💡 Our MJND system provides instant responses and intelligent solutions around the clock
                </p>
              </div>

              {/* MJND Emergency Support */}
              <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🤖 MJND Emergency Support
                </h3>
                <p className="text-green-700 text-sm mb-2">
                  Our MJND system is always available for critical issues
                </p>
                <p className="text-red-800 font-medium">
                  +1 (415) 555-0124
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Us
            </h2>
            <p className="text-xl text-gray-600">
              Visit our office or get in touch with us online.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjgiVw!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Maijjd Office Location"
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Widget */}
      <AIChatWidget
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        onToggle={() => setChatOpen((v) => !v)}
        software={chatSoftware}
      />

      {/* Docs Modal */}
      {docsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl p-6 relative">
            <button
              type="button"
              onClick={() => setDocsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Knowledge Base</h3>
            <p className="text-gray-600 mb-4">
              Explore quick-start guides, API usage, deployment, and troubleshooting.
            </p>
            <div className="space-y-3 text-sm text-gray-800">
              <div>
                <span className="font-medium">Getting Started:</span> Open the Software page and click "Start Coding" to use the full AI development environment (editor, terminal, preview, ZIP download).
              </div>
              <div>
                    <span className="font-medium">API & Backend:</span> Local API runs on http://localhost:5001. Health: /api/health. Public chat: /demo/chat.
              </div>
              <div>
                <span className="font-medium">Deployments:</span> Use the generated ZIP → frontend/backend folders and provider configs (Vercel, Netlify, Render, Railway, Azure, Cloudflare, Docker).
              </div>
            </div>
            <div className="mt-5 flex gap-2 justify-end">
              <button type="button" onClick={() => setDocsOpen(false)} className="px-4 py-2 border rounded-lg">Close</button>
              <button type="button" onClick={() => navigate('/software')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Open Software</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
