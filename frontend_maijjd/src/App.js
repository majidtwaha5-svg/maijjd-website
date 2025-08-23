import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Software from './pages/Software';
import Dashboard from './pages/Dashboard';
import Contact from './pages/Contact';
import AIDevelopment from './pages/AIDevelopment';
import AIChatDemo from './pages/AIChatDemo';
import Billing from './pages/Billing';
import ResetPassword from './pages/ResetPassword';
import analytics from './services/analytics';
import RequireAdmin from './components/RequireAdmin';
import AdminSessions from './pages/AdminSessions';
import AdminFeedback from './pages/AdminFeedback';
import AdminInvoices from './pages/AdminInvoices';
import AdminTracking from './pages/AdminTracking';
import AdminUsers from './pages/AdminUsers';

// Component to track route changes
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Track page view when route changes
    analytics.trackPageView();
    
    // Track specific page events
    switch (location.pathname) {
      case '/':
        analytics.trackHomePage();
        break;
      case '/about':
        analytics.trackAboutPage();
        break;
      case '/services':
        analytics.trackServiceView('services');
        break;
      case '/software':
        analytics.trackServiceView('software');
        break;
      case '/ai-chat':
        analytics.trackAIChat();
        break;
      default:
        analytics.trackNavigation(location.pathname);
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <RouteTracker />
        <Navbar />
        <AuthGate />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/software" element={<Software />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Admin-only routes */}
          <Route path="/admin/sessions" element={<RequireAdmin><AdminSessions /></RequireAdmin>} />
          <Route path="/admin/feedback" element={<RequireAdmin><AdminFeedback /></RequireAdmin>} />
          <Route path="/admin/invoices" element={<RequireAdmin><AdminInvoices /></RequireAdmin>} />
          <Route path="/admin/tracking" element={<RequireAdmin><AdminTracking /></RequireAdmin>} />
          <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-development" element={<AIDevelopment />} />
          <Route path="/ai-chat" element={<AIChatDemo />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
