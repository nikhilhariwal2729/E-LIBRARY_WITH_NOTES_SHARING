import { create } from 'zustand';
import api from '../services/api';
import Cookies from 'js-cookie';

const useAuth = create((set, get) => ({
  user: null,
  token: Cookies.get('token') || null,
  loading: false,
  initialized: false,
  
  // Initialize auth state
  init: async () => {
    // Try to get token from cookie
    let token = Cookies.get('token');
    console.log('Initializing auth with token:', token ? 'exists' : 'none');
    
    // If no token in cookie, try to get from localStorage as fallback
    if (!token) {
      token = localStorage.getItem('token');
      if (token) {
        console.log('Found token in localStorage, setting cookie');
        Cookies.set('token', token, { expires: 7 });
      }
    }
    
    if (token) {
      set({ loading: true });
      try {
        const { data } = await api.get('/auth/me');
        console.log('Auth init successful, user:', data);
        // Store in both cookie and localStorage for redundancy
        Cookies.set('token', token, { expires: 7 });
        localStorage.setItem('token', token);
        set({ user: data, token, loading: false, initialized: true });
      } catch (error) {
        console.log('Auth init failed:', error.response?.status, error.message);
        // Token is invalid, remove it from both places
        Cookies.remove('token');
        localStorage.removeItem('token');
        set({ user: null, token: null, loading: false, initialized: true });
      }
    } else {
      console.log('No token found, setting initialized to true');
      set({ initialized: true });
    }
  },

  async login(email, password) {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      console.log('Login successful, data:', data);
      
      // Store token in both cookie and localStorage for redundancy
      Cookies.set('token', data.token, { expires: 7 }); // 7 days
      localStorage.setItem('token', data.token);
      console.log('Token stored in cookie:', Cookies.get('token'));
      console.log('Token stored in localStorage:', localStorage.getItem('token'));
      
      // Set user data
      set({ 
        user: data.user, 
        token: data.token, 
        loading: false 
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      set({ loading: false });
      return false;
    }
  },

  async signup(payload) {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/signup', payload);
      
      // After signup, automatically login
      if (data.token) {
        Cookies.set('token', data.token, { expires: 7 });
        localStorage.setItem('token', data.token);
        set({ 
          user: data.user, 
          token: data.token, 
          loading: false 
        });
        return true;
      }
      
      set({ loading: false });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      set({ loading: false });
      return false;
    }
  },

  async fetchMe() {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data });
      return data;
    } catch (error) {
      console.error('Fetch me error:', error);
      // If fetch fails, clear invalid token
      Cookies.remove('token');
      localStorage.removeItem('token');
      set({ user: null, token: null });
      return null;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear everything
    Cookies.remove('token');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const { user, token, initialized } = get();
    return initialized && !!(user && token);
  },

  // Check if user has specific role
  hasRole: (role) => {
    const { user } = get();
    return user?.role === role;
  }
}));

export default useAuth;
