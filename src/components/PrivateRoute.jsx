// src/components/PrivateRoute.jsx
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  // 💤 Auto logout after 10 minutes of inactivity
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.warn('🔒 Session expired due to inactivity.');
        localStorage.removeItem('rememberEmail');
        window.location.href = '/logout'; // Full reload to trigger Supabase signOut
      }, 10 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, []);

  // 🛑 Still loading session state from Supabase
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        🔄 Authenticating...
      </div>
    );
  }

  // ❌ No user authenticated
  if (!currentUser) {
    console.warn('🚫 Unauthorized. Redirecting to /login.');
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated, allow access
  return children;
};

export default PrivateRoute;
