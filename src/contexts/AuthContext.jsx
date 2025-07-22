import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('⚠️ Error fetching session:', sessionError.message);
        }

        if (session?.user) {
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError) {
            console.warn('⚠️ Error fetching user:', userError.message);
          } else {
            setCurrentUser(user);
          }
        }
      } catch (err) {
        console.error('🚨 Unexpected session init error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.warn('⚠️ Auth state change: failed to fetch user:', error.message);
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
