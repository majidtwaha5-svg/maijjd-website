import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';

// Blocks the app until the user is authenticated. Shows Register by default.
const AuthGate = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // Reset to Register when user logs out
    if (!isAuthenticated) setShowLogin(false);
  }, [isAuthenticated]);

  if (loading || isAuthenticated) return null;

  const noop = () => {};

  return (
      <div className="fixed inset-0 z-[9999] pointer-events-auto">
      <button
        onClick={() => window.location.reload()}
        className="absolute top-3 right-3 z-[10000] px-3 py-1 text-xs font-medium text-gray-600 bg-white/80 backdrop-blur rounded border border-gray-200 hover:bg-white"
        title="Reload"
      >
        Reload
      </button>
      {showLogin ? (
        <Login onClose={noop} onSwitchToRegister={() => setShowLogin(false)} />
      ) : (
        <Register onClose={noop} onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
};

export default AuthGate;


