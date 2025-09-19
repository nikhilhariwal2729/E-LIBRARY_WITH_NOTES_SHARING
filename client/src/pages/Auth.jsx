import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/authStore';
import useTheme from '../context/themeStore';

export default function Auth(){
  const { login, signup, user, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(form.email, form.password);
        if (!success) {
          setError('Invalid email or password. Please try again.');
        }
      } else {
        success = await signup(form);
        if (success) {
          setError('Account created successfully! You are now logged in.');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          setError('Signup failed. Please try again.');
        }
      }
      
      if (success && isLogin) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setForm({ name:'', email:'', password:'', role:'student' });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearForm();
  };

  const fillDemoCredentials = (email, password) => {
    setForm(prev => ({
      ...prev,
      email,
      password
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
        <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>E-Library</h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-stone-600'}>{isLogin ? 'Welcome back!' : 'Join our community'}</p>
        </div>
        
        <div className={`rounded-2xl shadow-xl p-8 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-stone-200'}`}>
          <h2 className={`text-2xl font-bold text-center mb-6 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          
          <form onSubmit={submit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>Full Name</label>
                <input 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-stone-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Enter your full name"
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})}
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
              <input 
                type="email"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter your email"
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input 
                type="password"
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Enter your password"
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>Role</label>
                <select 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-stone-300 text-gray-900 placeholder-gray-500'}`}
                  value={form.role} 
                  onChange={e => setForm({...form, role: e.target.value})}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            )}
            
            {error && (
              <div className={`px-4 py-3 rounded-lg text-sm ${
                error.includes('successfully') 
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                {error}
              </div>
            )}
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-stone-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                className="ml-1 text-amber-600 hover:text-amber-700 font-medium"
                onClick={toggleMode}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className={`mt-6 p-4 rounded-xl border ${isDarkMode ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-700' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'}`}>
            <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Demo Credentials
            </h3>
            <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>Click any credential to auto-fill:</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials('admin@elibrary.com', 'admin123')}
                className={`p-2 rounded-lg border transition-all duration-200 group ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:border-amber-300 hover:bg-gray-600' : 'bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50'}`}
              >
                <div className="text-center">
                  <div className="text-sm mb-1">👑</div>
                  <div className={`text-xs font-semibold mb-1 group-hover:text-amber-700 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Admin</div>
                  <div className={`text-xs font-mono leading-tight break-all ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>
                    <div className="truncate">admin@elibrary.com</div>
                    <div>admin123</div>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => fillDemoCredentials('teacher@elibrary.com', 'teacher123')}
                className={`p-2 rounded-lg border transition-all duration-200 group ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:border-amber-300 hover:bg-gray-600' : 'bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50'}`}
              >
                <div className="text-center">
                  <div className="text-sm mb-1">👨‍🏫</div>
                  <div className={`text-xs font-semibold mb-1 group-hover:text-amber-700 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Teacher</div>
                  <div className={`text-xs font-mono leading-tight break-all ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>
                    <div className="truncate">teacher@elibrary.com</div>
                    <div>teacher123</div>
                  </div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => fillDemoCredentials('student@elibrary.com', 'student123')}
                className={`p-2 rounded-lg border transition-all duration-200 group ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:border-amber-300 hover:bg-gray-600' : 'bg-white border-amber-200 hover:border-amber-300 hover:bg-amber-50'}`}
              >
                <div className="text-center">
                  <div className="text-sm mb-1">👨‍🎓</div>
                  <div className={`text-xs font-semibold mb-1 group-hover:text-amber-700 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Student</div>
                  <div className={`text-xs font-mono leading-tight break-all ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>
                    <div className="truncate">student@elibrary.com</div>
                    <div>student123</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
