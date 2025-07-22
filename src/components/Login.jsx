import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState(() => localStorage.getItem('rememberEmail') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberEmail'));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    console.log('✅ Login component loaded');
    let mounted = true;
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (!error && user && mounted) {
            navigate('/landingpage');
            return;
          }
        }
      } catch (err) {
        console.warn('⚠️ Session check failed:', err.message);
      }
      if (mounted) setSessionChecked(true);
    };
    checkSession();
    return () => { mounted = false; };
  }, [navigate]);

  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        alert('🔒 Session expired due to inactivity.');
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
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (rememberMe) {
      localStorage.setItem('rememberEmail', trimmedEmail);
    } else {
      localStorage.removeItem('rememberEmail');
    }

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword
      });

      if (authError) return setError('❌ Invalid login credentials.');

      const { data: userData, error: userError } = await supabase
        .from('user_management')
        .select('status, force_reset_password, password_updated_at')
        .eq('email', trimmedEmail)
        .single();

      if (userError || !userData) {
        await supabase.auth.signOut();
        return setError('❌ Failed to fetch user profile.');
      }

      if (userData.status !== 'Active') {
        await supabase.auth.signOut();
        return setError('⛔ Your account is inactive. Contact admin.');
      }

      if (userData.force_reset_password) return navigate('/password-management');

      const lastUpdated = new Date(userData.password_updated_at);
      const now = new Date();
      const daysSinceUpdate = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

      if (daysSinceUpdate >= 90) {
        alert('🔒 Your password has expired. Please reset it.');
        return navigate('/password-management');
      } else if (daysSinceUpdate >= 75) {
        alert(`⚠️ Password expires in ${90 - daysSinceUpdate} day(s). Please update it soon.`);
      }

      setMessage('✅ Login successful. Redirecting...');
      setTimeout(() => navigate('/landingpage'), 1000);

    } catch (err) {
      console.error('Login Exception:', err);
      setError('❌ Unexpected login error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        🔄 Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-center text-2xl font-bold mb-6 text-blue-600 animate-logo-fade">
          DigitizerX
        </h1>

        <h2 className="text-xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {message && <p className="text-green-600 mb-2">{message}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          required
        />

        <div className="relative w-full mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pr-10 border rounded"
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-2 cursor-pointer text-gray-600 text-sm"
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <div className="text-right mb-4">
          <a href="/password-reset" className="text-blue-600 hover:underline text-sm">
            Forgot Password?
          </a>
        </div>

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mr-2"
          />
          <label>Remember me</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
