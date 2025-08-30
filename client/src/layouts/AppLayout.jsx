import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../context/authStore';

export default function AppLayout() {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      {/* Header */}
      <header className="bg-stone-800 text-white shadow-lg">
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
                <>
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
                <NavLink
                  to="/auth"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                >
                  Sign In
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-gray-600 flex items-center justify-between">
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
