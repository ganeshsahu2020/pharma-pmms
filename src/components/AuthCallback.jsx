import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRecovery = async () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const type = hashParams.get('type');
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');

      if (type === 'recovery' && access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error('❌ Session restore failed:', error.message);
          alert('❌ Failed to restore session. Please log in again.');
          navigate('/login');
        } else {
          navigate('/password-management');
        }
      } else {
        alert('❌ Invalid or expired recovery link.');
        navigate('/login');
      }
    };

    handleRecovery();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-700 text-lg">
      🔁 Verifying your session...
    </div>
  );
};

export default AuthCallback;
