import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log("🔐 Initial session check:", data?.session);
        setSession(data?.session || null);
      } catch (err) {
        console.error("❌ Session fetch failed:", err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log("📡 Auth state changed:", _event, newSession);
      setSession(newSession);
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">🔄 Checking session...</div>;
  }

  return session ? children : <Navigate to="/login" replace />;
};

export default AuthGuard;
