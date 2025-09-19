import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../context/authStore';
import useTheme from '../context/themeStore';

export default function AppLayout() {
  const { user, logout, isAuthenticated, hasRole, loading, initialized } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Show loading spinner while initializing
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-stone-50'}`}>
      {/* Header */}
      <header className={`text-white shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-stone-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <NavLink to="/" className="text-2xl font-bold text-amber-400 hover:text-amber-300 transition-colors">
                📚 E-Library
              </NavLink>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {isAuthenticated() && (
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-amber-600 text-white' 
                        : 'text-stone-300 hover:text-white hover:bg-stone-700'
                    }`
                  }
                >
                  Browse Library
                </NavLink>
              )}
              
              {isAuthenticated() && (
                <>

                  <NavLink 
                    to="/upload" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-amber-600 text-white' 
                          : 'text-stone-300 hover:text-white hover:bg-stone-700'
                      }`
                    }
                  >
                    Upload
                  </NavLink>
                  
                  <NavLink 
                    to="/bookmarks" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-amber-600 text-white' 
                          : 'text-stone-300 hover:text-white hover:bg-stone-700'
                      }`
                    }
                  >
                    My Shelf
                  </NavLink>
                  
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-amber-600 text-white' 
                          : 'text-stone-300 hover:text-white hover:bg-stone-700'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  
                  {hasRole('admin') && (
                    <NavLink 
                      to="/admin" 
                      className={({ isActive }) => 
                        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive 
                            ? 'bg-red-600 text-white' 
                            : 'text-red-300 hover:text-white hover:bg-red-700'
                        }`
                      }
                    >
                      Admin Panel
                    </NavLink>
                  )}
                </>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-stone-700 hover:bg-stone-600 transition-colors"
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {isAuthenticated() ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-stone-300">
                    Welcome, <span className="text-amber-400 font-medium">{user?.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-stone-700 text-white rounded-lg hover:bg-stone-600 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  {location.pathname === '/auth' ? (
                    <NavLink
                      to="/"
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                    >
                      🏠 Home
                    </NavLink>
                  ) : (
                    <NavLink
                      to="/auth"
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                    >
                      Login
                    </NavLink>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isDarkMode ? 'text-white bg-gray-900' : 'text-gray-900 bg-stone-50'}`}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={`border-t ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/50'} backdrop-blur-sm`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} flex items-center justify-between`}>
          <div className="text-left">
            <p>© 2025 Developer Viewpoint. All rights reserved.</p>
            <p className="mt-0.5">Free source code available on GitHub (MIT Licensed).</p>
          </div>
          <p className="text-right">Developed by <span className="font-semibold">Anshul</span>.</p>
        </div>
      </footer>
    </div>
  );
}
