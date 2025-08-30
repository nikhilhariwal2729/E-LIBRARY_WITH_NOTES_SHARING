import { create } from 'zustand';
import api from '../services/api';
import Cookies from 'js-cookie';

const useAuth = create((set, get) => ({
  user: null,
  token: Cookies.get('token') || null,
  loading: false,
  
  // Initialize auth state
  init: async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const { data } = await api.get('/auth/me');
        set({ user: data, token });
      } catch (error) {
        // Token is invalid, remove it
        Cookies.remove('token');
        set({ user: null, token: null });
      }
    }
  },

  async login(email, password) {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      // Store token in cookie
      Cookies.set('token', data.token, { expires: 7 }); // 7 days
      
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
    set({ user: null, token: null });
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const { user, token } = get();
    return !!(user && token);
  },

  // Check if user has specific role
  hasRole: (role) => {
    const { user } = get();
    return user?.role === role;
  }
}));

export default useAuth;
