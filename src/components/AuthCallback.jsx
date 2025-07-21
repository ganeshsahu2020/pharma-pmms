// AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRecovery = async () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1)); // after '#'
      const type = hashParams.get('type');
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');

      if (type === 'recovery' && access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (!error) {
          navigate('/password-management');
        } else {
          alert('❌ Failed to restore session');
          navigate('/login');
        }
      }
    };

    handleRecovery();
  }, [navigate]);

  return <div className="p-6 text-gray-700">🔁 Verifying your session...</div>;
}
