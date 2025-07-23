import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { supabase } from './utils/supabaseClient';

// 🔓 Public Pages
import Login from './components/Login';
import PasswordReset from './components/PasswordReset';
import PasswordRedirect from './components/PasswordRedirect';
import PasswordManagement from './components/PasswordManagement';

// 🔐 Protected Pages
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';
import UserManagement from './components/UserManagement';
import AuthGuard from './components/AuthGuard';

import './App.css';

const App = () => {
  console.log('✅ App.jsx Loaded');

  useEffect(() => {
    const testConnection = async () => {
      console.groupCollapsed('🟡 Supabase Health Check');
      try {
        const { data, error } = await supabase.from('user_management').select('*').limit(1);
        if (error) {
          console.error('❌ Supabase connection failed:', error.message);
        } else {
          console.log(data?.length ? '🟢 Supabase OK – Data found' : '🟢 Supabase OK – No data found');
        }
      } catch (err) {
        console.error('🔥 Supabase Exception:', err);
      }
      console.groupEnd();
    };
    setTimeout(testConnection, 0);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 🔓 Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/reset" element={<PasswordRedirect />} />
          <Route path="/password-management" element={<PasswordManagement />} />

          {/* 🔐 Protected Routes */}
          <Route path="/landingpage" element={<AuthGuard><LandingPage /></AuthGuard>} />
          <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
          <Route path="/logout" element={<AuthGuard><Logout /></AuthGuard>} />
          <Route path="/user-management" element={<AuthGuard><UserManagement currentUserRole="Super Admin" /></AuthGuard>} />

          {/* 🧪 Test Route */}
          <Route path="/test" element={<div className="p-8 text-green-600 text-2xl">✅ Test route works!</div>} />

          {/* 🔁 Default Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
