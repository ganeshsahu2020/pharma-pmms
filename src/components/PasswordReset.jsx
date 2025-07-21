import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetReady, setResetReady] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setResetReady(true);
      }
    };
    checkSession();
  }, []);

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/password-reset',
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Check your email for the reset link.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    const newPassword = e.target.password.value;

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('✅ Password updated successfully. You can now log in.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

      {resetReady ? (
        <form onSubmit={handleUpdatePassword}>
          <input
            name="password"
            type="password"
            placeholder="Enter new password"
            className="border p-2 w-full mb-4"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
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
            className="border p-2 w-full mb-4"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
            Send Reset Link
          </button>
        </form>
      )}

      {message && <p className="text-green-600 mt-2">{message}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default PasswordReset;
