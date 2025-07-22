import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetReady, setResetReady] = useState(false);
  const navigate = useNavigate();

  // ✅ Detect recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setResetReady(true);
      }
    };
    checkSession();
  }, []);

  // ✅ Send reset email
  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:5175/reset',
    });

    if (error) {
      setError(`❌ ${error.message}`);
    } else {
      setMessage('📩 Reset link sent! Please check your email.');
    }
  };

  // ✅ Update new password after redirect
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const newPassword = e.target.password.value;

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(`❌ ${error.message}`);
    } else {
      setMessage('✅ Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        supabase.auth.signOut();
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {resetReady ? '🔐 Set New Password' : '📧 Request Password Reset'}
        </h2>

        {resetReady ? (
          <form onSubmit={handleUpdatePassword}>
            <input
              name="password"
              type="password"
              placeholder="Enter new password"
              className="w-full p-2 border mb-4 rounded"
              required
            />
            <button
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              type="submit"
            >
              Update Password
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendResetLink}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border mb-4 rounded"
              required
            />
            <button
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              type="submit"
            >
              Send Reset Link
            </button>
          </form>
        )}

        {message && <p className="text-green-600 mt-4 text-sm">{message}</p>}
        {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default PasswordReset;
