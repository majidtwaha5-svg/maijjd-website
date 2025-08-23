import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, AlertCircle, CheckCircle, Phone } from 'lucide-react';
import apiService from '../services/api';
import { validatePasswordStrong, splitEmailOrPhone, isPhone } from '../utils/validation';

const Register = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [lookupOpen, setLookupOpen] = useState(false);
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResult, setLookupResult] = useState('');
  
  const { register, error: authError } = useAuth();

  const pwdState = validatePasswordStrong(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pwdState.valid || formData.password !== formData.confirmPassword) return;
    setIsSubmitting(true);
    try {
      const identifier = splitEmailOrPhone(formData.emailOrPhone);
      if (!identifier.email && !identifier.phone) {
        throw new Error('Enter a valid email or phone number');
      }
      const payload = { name: formData.name.trim(), ...identifier, password: formData.password };
      await register(payload);
      // Request verification (non-blocking if backend doesn’t support yet)
      try { await apiService.requestVerification(identifier); } catch (_) {}
      setNeedsVerification(true);
    } catch (_) {
      // handled upstream by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmCode = async (e) => {
    e.preventDefault();
    try {
      const identifier = splitEmailOrPhone(formData.emailOrPhone);
      await apiService.confirmVerification(verificationCode.trim(), identifier);
      setSuccess(true);
      setTimeout(() => { onClose(); }, 1500);
    } catch (_) {
      // stay on screen for retry
    }
  };

  const doLookupEmail = async (e) => {
    e.preventDefault();
    if (!isPhone(lookupPhone)) return;
    try {
      const res = await apiService.lookupEmailByPhone(lookupPhone.replace(/\s+/g,'') );
      const payload = res?.data || res;
      setLookupResult(payload?.email || 'If an account exists, details were sent.');
    } catch (_) {
      setLookupResult('If an account exists, details were sent.');
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete</h2>
          <p className="text-gray-600">You’re all set.</p>
        </div>
      </div>
    );
  }

  if (needsVerification) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your account</h2>
          <p className="text-gray-600 mb-4">Enter the 6-digit code sent to your email or phone.</p>
          <form onSubmit={confirmCode} className="space-y-4">
            <input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e)=>setVerificationCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="123456"
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Verify</button>
          </form>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600">Join Maijjd and start your journey</p>
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your full name" />
            </div>
          </div>

          <div>
            <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-1">Email or Phone</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" id="emailOrPhone" name="emailOrPhone" value={formData.emailOrPhone} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@example.com or +1 555 555 5555" />
            </div>
            <button type="button" onClick={()=>setLookupOpen(true)} className="text-xs text-blue-600 mt-1">Forgot email?</button>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength={8} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter your password" />
            </div>
            <ul className="mt-2 text-xs text-gray-600 space-y-1">
              <li className={pwdState.lengthOk? 'text-green-600':'text-gray-600'}>8+ characters</li>
              <li className={pwdState.hasUpper? 'text-green-600':'text-gray-600'}>1 uppercase letter</li>
              <li className={pwdState.hasLower? 'text-green-600':'text-gray-600'}>1 lowercase letter</li>
              <li className={pwdState.hasNumber? 'text-green-600':'text-gray-600'}>1 number</li>
              <li className={pwdState.hasSymbol? 'text-green-600':'text-gray-600'}>1 symbol</li>
            </ul>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={8} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Confirm your password" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting || !pwdState.valid || formData.password !== formData.confirmPassword} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Already have an account?{' '}<button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-medium">Sign in</button></p>
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
      </div>

      {lookupOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]" onClick={()=>setLookupOpen(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4" onClick={(e)=>e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Find your account email</h3>
            <form onSubmit={doLookupEmail} className="space-y-3">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={lookupPhone} onChange={(e)=>setLookupPhone(e.target.value)} required className="w-full pl-10 pr-3 py-2 border rounded-lg" placeholder="Your phone number" />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={()=>setLookupOpen(false)} className="px-3 py-2 border rounded-lg">Close</button>
                <button type="submit" className="px-3 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">Send</button>
              </div>
            </form>
            {lookupResult && <div className="mt-3 text-sm text-gray-700">{lookupResult}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
