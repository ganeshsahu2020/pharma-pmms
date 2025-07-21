import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// ✅ Public Pages
import Login from './components/Login';
import Signup from './components/Signup';
import PasswordReset from './components/PasswordReset';
import PasswordRedirect from './components/PasswordRedirect'; // Supabase email callback

// ✅ Protected Pages
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';
import PrivateRoute from './components/PrivateRoute';

// ✅ Styles
import './App.css'; // Tailwind CSS & global styles

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/reset" element={<PasswordRedirect />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/landingpage"
            element={
              <PrivateRoute>
                <LandingPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            }
          />

          {/* 🧭 Fallback Routes */}
          <Route path="/" element={<Navigate to="/landingpage" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
