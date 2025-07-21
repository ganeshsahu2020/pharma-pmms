// Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const signOut = async () => {
      // Clear localStorage/sessionStorage if used
      localStorage.removeItem('rememberEmail');
      await supabase.auth.signOut();
      navigate('/login');
    };

    signOut();
  }, [navigate]);

  return null; // No UI required for logout
};

export default Logout;
