import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import useAuth from './context/authStore';
import AppLayout from './layouts/AppLayout';
import Browse from './pages/Browse';
import Upload from './pages/Upload';
import Bookmarks from './pages/Bookmarks';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import ResourceDetail from './pages/ResourceDetail';

export default function App() {
  const { init } = useAuth();

  // Initialize authentication state on app load
  useEffect(() => {
    init();
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Browse />} />
          <Route path="upload" element={<Upload />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin" element={<Admin />} />
          <Route path="resource/:id" element={<ResourceDetail />} />
          <Route path="auth" element={<Auth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


