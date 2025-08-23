import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Code, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Software', href: '/software' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Contact', href: '/contact' },
    { name: 'MJND Chat Assistant', href: '/ai-chat' },
  ];
  const adminNav = [
    { name: 'Sessions', href: '/admin/sessions' },
    { name: 'Feedback', href: '/admin/feedback' },
    { name: 'Invoices', href: '/admin/invoices' },
    { name: 'Tracking', href: '/admin/tracking' },
    { name: 'Users', href: '/admin/users' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Code className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Maijjd</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Admin menu (hidden from non-admins) */}
            {isAuthenticated && user?.role === 'admin' && (
              <div className="ml-4 flex items-center space-x-2">
                {adminNav.map(item => (
                  <Link key={item.name} to={item.href} className={`px-2 py-1 rounded text-xs border ${isActive(item.href)?'bg-blue-600 text-white border-blue-600':'bg-white text-gray-700 border-gray-300'}`}>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated && user?.role === 'admin' && (
              <div className="mt-2 border-t border-gray-200 pt-2">
                {adminNav.map(item => (
                  <Link key={item.name} to={item.href} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(item.href)?'text-blue-600 bg-blue-50':'text-gray-700 hover:text-blue-600 hover:bg-blue-50'}`} onClick={()=>setIsOpen(false)}>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
            
            {/* Mobile Authentication */}
            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="px-3 py-2">
                  <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full mt-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Login Modal */}
      {showLogin && (
        <Login
          onClose={closeModals}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <Register
          onClose={closeModals}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </nav>
  );
};

export default Navbar;
