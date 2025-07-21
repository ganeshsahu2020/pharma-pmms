import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    let timeoutId;

    const resetInactivityTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        localStorage.removeItem('rememberEmail');
        window.location.href = '/logout'; // 👋 Auto logout after 10 min
      }, 10 * 60 * 1000); // 10 minutes
    };

    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);

    resetInactivityTimer(); // 🔁 Start on mount

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetInactivityTimer);
      window.removeEventListener('keydown', resetInactivityTimer);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        🔄 Authenticating...
      </div>
    );
  }

  return currentUser ? children : <Navigate to="/login" replace />;
}
