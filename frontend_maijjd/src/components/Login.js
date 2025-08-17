import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

const Login = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error: authError } = useAuth();
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotBusy, setForgotBusy] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotBusy(true);
    setForgotMsg('');
    try {
      await apiService.requestPasswordReset(forgotEmail.trim());
      setForgotMsg('If this email exists, a reset link was sent.');
    } catch (_) {
      setForgotMsg('If this email exists, a reset link was sent.');
    } finally {
      setForgotBusy(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }
      await login({ email: formData.email.trim(), password: formData.password });
      onClose(); // Close modal after successful login
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <p className="text-red-800 text-sm">{authError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={()=>setForgotOpen(true)} className="text-sm text-blue-600 hover:text-blue-700 mb-3">Forgot password?</button>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]" onClick={()=>setForgotOpen(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Reset your password</h3>
            <p className="text-sm text-gray-600 mb-4">Enter your account email. We'll send a reset link if it exists.</p>
            <form onSubmit={submitForgot} className="space-y-3">
              <input type="email" value={forgotEmail} onChange={(e)=>setForgotEmail(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" placeholder="you@example.com" />
              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={()=>setForgotOpen(false)} className="px-3 py-2 border rounded-lg">Close</button>
                <button type="submit" disabled={forgotBusy} className="px-3 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">{forgotBusy?'Sending…':'Send link'}</button>
              </div>
            </form>
            {forgotMsg && <div className="mt-3 text-sm text-green-700">{forgotMsg}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
