import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function PasswordRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleRecovery = async () => {
      try {
        // Supabase already stores session via fragment token
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          console.error('❌ Session recovery failed:', error?.message);
          alert('Invalid or expired reset link. Please request again.');
          navigate('/login');
        } else {
          console.log('🔑 Recovery session active');
          navigate('/password-management');
        }
      } catch (err) {
        console.error('🚨 Unexpected error:', err.message);
        navigate('/login');
      }
    };

    handleRecovery();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-gray-600">
      🔄 Validating reset link...
    </div>
  );
}
