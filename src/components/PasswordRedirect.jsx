import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const PasswordRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (type === 'recovery' && access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token
        });

        if (error) {
          console.error('Session error:', error.message);
          alert('❌ Session error. Please login again.');
          navigate('/login');
        } else {
          navigate('/password-management'); // ✅ Your app's internal password update page
        }
      } else {
        alert('❌ Invalid or expired reset link.');
        navigate('/login');
      }
    };

    handleRedirect();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-700">
      🔄 Validating your reset link...
    </div>
  );
};

export default PasswordRedirect;
