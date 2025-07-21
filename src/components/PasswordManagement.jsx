import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export default function PasswordManagement({ currentUser }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      await supabase
        .from('user_management')
        .update({
          force_reset_password: false,
          password_updated_at: new Date().toISOString(),
        })
        .eq('email', currentUser?.email);

      setMessage('Password updated successfully. Redirecting to dashboard...');
      setTimeout(() => navigate('/landingpage'), 1500);

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // ⏳ Idle timeout logout after 10 mins
  useEffect(() => {
    let timeout;
    const handleIdle = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        alert('🔒 Session expired due to inactivity. Please login again.');
        await supabase.auth.signOut();
        navigate('/login');
      }, 10 * 60 * 1000);
    };

    window.addEventListener('mousemove', handleIdle);
    window.addEventListener('keydown', handleIdle);
    handleIdle();

    return () => {
      window.removeEventListener('mousemove', handleIdle);
      window.removeEventListener('keydown', handleIdle);
      clearTimeout(timeout);
    };
  }, [navigate]);

  // 🔁 Check password age and alert
  useEffect(() => {
    const checkPasswordAge = async () => {
      if (!currentUser?.email) return;

      const { data, error } = await supabase
        .from('user_management')
        .select('password_updated_at')
        .eq('email', currentUser.email)
        .single();

      if (data?.password_updated_at) {
        const updatedDate = new Date(data.password_updated_at);
        const now = new Date();
        const diffDays = Math.floor((now - updatedDate) / (1000 * 60 * 60 * 24));
        const remaining = 90 - diffDays;
        if (remaining <= 0) {
          alert('🔒 Your password has expired. You will be logged out.');
          await supabase.auth.signOut();
          navigate('/login');
        } else if (remaining <= 15) {
          alert(`⚠️ Your password will expire in ${remaining} day(s). Please update it soon.`);
        }
      }
    };

    checkPasswordAge();
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleChangePassword} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}
        {message && <p className="text-green-500 mb-2">{message}</p>}

        <input
          type="password"
          placeholder="Old Password"
          className="w-full border px-3 py-2 rounded mb-2"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded mb-2"
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
