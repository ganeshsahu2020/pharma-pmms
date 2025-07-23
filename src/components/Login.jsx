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
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        const session = data?.session;

        if (session?.user) {
          const { data: userData, error: userError } = await supabase
            .from('user_management')
            .select('status')
            .eq('email', session.user.email)
            .single();

          if (userError || !userData || userData.status !== 'Active') {
            await supabase.auth.signOut();
            setSessionChecked(true);
          } else {
            navigate('/landingpage');
          }
        } else {
          setSessionChecked(true);
        }
      } catch (err) {
        console.error('🔁 Session check failed:', err);
        setSessionChecked(true);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (rememberMe) localStorage.setItem('rememberEmail', trimmedEmail);
    else localStorage.removeItem('rememberEmail');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword
      });

      if (authError) {
        return setError('❌ Invalid credentials. Try again.');
      }

      const { data: userData, error: userError } = await supabase
        .from('user_management')
        .select('status, force_reset_password, password_updated_at')
        .eq('email', trimmedEmail)
        .single();

      if (userError || !userData) {
        console.warn('⚠️ No user record in user_management for:', trimmedEmail);
        await supabase.auth.signOut();
        return setError('❌ Failed to fetch user profile.');
      }

      if (userData.status !== 'Active') {
        await supabase.auth.signOut();
        return setError('⛔ Your account is inactive.');
      }

      if (userData.force_reset_password) {
        return navigate('/password-management');
      }

      const lastUpdated = userData.password_updated_at ? new Date(userData.password_updated_at) : null;
      const now = new Date();

      if (!lastUpdated) {
        return navigate('/password-management');
      }

      const daysSinceUpdate = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

      if (daysSinceUpdate >= 90) {
        alert('🔐 Your password has expired. Reset it.');
        return navigate('/password-management');
      } else if (daysSinceUpdate >= 75) {
        alert(`⚠️ Password expires in ${90 - daysSinceUpdate} day(s).`);
      }

      setMessage('✅ Login successful. Redirecting...');
      setTimeout(() => navigate('/landingpage'), 1000);
    } catch (err) {
      console.error('💥 Unexpected login error:', err);
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!sessionChecked) {
    return <div className="flex justify-center items-center h-screen text-gray-500">🔄 Validating session...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-center text-2xl font-bold mb-6 text-blue-600">DigitizerX</h1>
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        {message && <p className="text-green-600 mb-2">{message}</p>}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mb-2 border rounded" placeholder="Email" required />
        <div className="relative w-full mb-2">
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 pr-10 border rounded" placeholder="Password" required />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 cursor-pointer text-gray-600 text-sm">{showPassword ? '🙈' : '👁️'}</span>
        </div>
        <div className="text-right mb-4">
          <a href="/password-reset" className="text-blue-600 hover:underline text-sm">Forgot Password?</a>
        </div>
        <div className="flex items-center mb-4">
          <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="mr-2" />
          <label>Remember me</label>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
