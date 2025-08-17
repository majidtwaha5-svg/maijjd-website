import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <AuthGate />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/software" element={<Software />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
