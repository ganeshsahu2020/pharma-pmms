import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function PasswordManagement({ currentUser = null }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // 🧠 Extract email (either from prop or Supabase)
  useEffect(() => {
    const fetchUser = async () => {
      if (currentUser?.email) {
        setEmail(currentUser.email);
      } else {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user?.email) setEmail(data.user.email);
      }
    };

    fetchUser();
  }, [currentUser]);

  // 🔐 Handle password update
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      return setError('❌ Passwords do not match.');
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError(`❌ ${updateError.message}`);
      return;
    }

    if (email) {
      await supabase
        .from('user_management')
        .update({
          force_reset_password: false,
          password_updated_at: new Date().toISOString()
        })
        .eq('email', email);
    }

    setMessage('✅ Password updated successfully. Redirecting to login...');
    setTimeout(async () => {
      await supabase.auth.signOut();
      navigate('/login');
    }, 2000);
  };

  // ⏳ Inactivity logout only for authenticated users
  useEffect(() => {
    if (!currentUser) return;

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        alert('🔒 Session expired. Please log in again.');
        await supabase.auth.signOut();
        navigate('/login');
      }, 10 * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [currentUser, navigate]);

  // ⏱️ Password expiry warning logic (only for known email)
  useEffect(() => {
    if (!email) return;

    const checkExpiration = async () => {
      const { data } = await supabase
        .from('user_management')
        .select('password_updated_at')
        .eq('email', email)
        .single();

      if (data?.password_updated_at) {
        const updated = new Date(data.password_updated_at);
        const now = new Date();
        const daysElapsed = Math.floor((now - updated) / (1000 * 60 * 60 * 24));
        const daysLeft = 90 - daysElapsed;

        if (daysLeft <= 0) {
          alert('🔒 Password expired. Logging out.');
          await supabase.auth.signOut();
          navigate('/login');
        } else if (daysLeft <= 15) {
          alert(`⚠️ Your password expires in ${daysLeft} day(s).`);
        }
      }
    };

    checkExpiration();
  }, [email, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleChangePassword}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4 text-center">🔐 Change Password</h2>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded mb-3"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border px-3 py-2 rounded mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Password
        </button>

        <p className="mt-4 text-sm text-center">
          <a href="/login" className="text-blue-600 underline">Back to Login</a>
        </p>
      </form>
    </div>
  );
}
