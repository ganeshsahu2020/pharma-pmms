import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import PasswordReset from './components/PasswordManagement';
import PrivateRoute from './components/PrivateRoute';
import Logout from './components/Logout';
import UserManagement from './components/UserManagement';
import AutoLoginEmulator from './components/AutoLoginEmulator';
import EmulatorBanner from './components/EmulatorBanner'; // ✅ Emulator visual indicator

function App() {
  const isLocalhost = window.location.hostname === 'localhost';

  return (
    <Router>
      <AuthProvider>
        {isLocalhost && <AutoLoginEmulator />}        {/* 🔐 Auto-login for Emulator */}
        {isLocalhost && <EmulatorBanner />}           {/* ⚠️ Visual Emulator warning */}

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<PasswordReset />} />

          {/* Private Routes */}
          <Route path="/" element={<PrivateRoute><LandingPage /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/user-management" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
          <Route path="/logout" element={<PrivateRoute><Logout /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
