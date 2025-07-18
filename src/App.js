$appJsx = @"
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import PasswordReset from './components/PasswordReset';
import UserManagement from './components/UserManagement';
import SeedUsers from './components/SeedUsers';
import AddDummyUsers from './components/AddDummyUsers';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppRoutes = () => {
  const { currentUser, userProfile } = useAuth();
  const isAdmin = userProfile?.DESIGNATION === 'Admin' || userProfile?.DESIGNATION === 'Superadmin';

  return (
    <Router>
      {/* 🔹 Top Navigation */}
      <header className='bg-gray-100 border-b shadow-sm'>
        <nav className='p-4 flex flex-wrap justify-center gap-6 text-sm font-medium'>
          {currentUser ? (
            <>
              <Link to='/dashboard' className='text-purple-600 hover:underline'>Dashboard</Link>
              <Link to='/user-management' className='text-teal-600 hover:underline'>User Management</Link>
              <Link to='/reset-password' className='text-red-600 hover:underline'>Reset Password</Link>
              {isAdmin && (
                <>
                  <Link to='/seed-users' className='text-orange-600 hover:underline'>Seed Users</Link>
                  <Link to='/add-users' className='text-orange-600 hover:underline'>Add Dummy Users</Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link to='/login' className='text-blue-600 hover:underline'>Login</Link>
              <Link to='/signup' className='text-green-600 hover:underline'>Signup</Link>
            </>
          )}
        </nav>
      </header>

      {/* 🔹 Routes */}
      <main className='p-4'>
        <Routes>
          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/reset-password' element={<PasswordReset />} />
          <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path='/user-management' element={<PrivateRoute><UserManagement /></PrivateRoute>} />
          <Route path='/seed-users' element={<PrivateRoute requireAdmin={true}><SeedUsers /></PrivateRoute>} />
          <Route path='/add-users' element={<PrivateRoute requireAdmin={true}><AddDummyUsers /></PrivateRoute>} />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </main>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
"@
Set-Content -Path C:\Users\rxgibsmt\PharmaPMMS\pharmapmms-ui\src\App.jsx -Value $appJsx -Force