import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      try {
        // 🧹 Clean up storage/session
        localStorage.removeItem('rememberEmail');

        // 🔒 Sign out from Supabase
        const { error } = await supabase.auth.signOut();
        if (error) console.error('❌ Error signing out:', error.message);
      } catch (err) {
        console.error('⚠️ Unexpected error during logout:', err);
      } finally {
        navigate('/login');
      }
    };

    signOut();
  }, [navigate]);

  return null; // 🚪 No UI for logout page
};

export default Logout;
