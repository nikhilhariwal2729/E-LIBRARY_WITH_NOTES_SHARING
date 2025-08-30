import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/authStore';

export default function Auth(){
  const { login, signup, user, isAuthenticated } = useAuth();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-800 mb-2">E-Library</h1>
          <p className="text-stone-600">{isLogin ? 'Welcome back!' : 'Join our community'}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-stone-200">
          <h2 className="text-2xl font-bold text-center mb-6 text-stone-800">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          
          <form onSubmit={submit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                <input 
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-stone-700 mb-1">Role</label>
                <select 
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
            <p className="text-sm text-stone-600">
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
          <div className="mt-6 p-4 bg-stone-50 rounded-lg">
            <h3 className="text-sm font-medium text-stone-800 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-stone-600 space-y-1">
              <div><strong>Admin:</strong> admin@elibrary.com / admin123</div>
              <div><strong>Teacher:</strong> teacher@elibrary.com / teacher123</div>
              <div><strong>Student:</strong> student@elibrary.com / student123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
