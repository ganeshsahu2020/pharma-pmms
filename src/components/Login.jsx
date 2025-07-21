import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Login = () => {
  const [email, setEmail] = useState(localStorage.getItem('rememberEmail') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberEmail'));
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Auto logout after 10 min of inactivity
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        alert('🔒 Session expired due to inactivity.');
        await supabase.auth.signOut();
        navigate('/login');
      }, 10 * 60 * 1000); // 10 minutes
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

    // 🔁 Remember email
    rememberMe
      ? localStorage.setItem('rememberEmail', email)
      : localStorage.removeItem('rememberEmail');

    try {
      // 🔐 Supabase Auth
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) return setError('❌ Invalid login credentials.');

      // ✅ Get user data
      const { data: userData, error: userError } = await supabase
        .from('user_management')
        .select('status, force_reset_password, password_updated_at')
        .eq('email', email)
        .single();

      if (userError || !userData) {
        setError('❌ User data fetch failed.');
        await supabase.auth.signOut();
        return;
      }

      if (userData.status !== 'Active') {
        setError('⛔ Your account is inactive. Contact admin.');
        await supabase.auth.signOut();
        return;
      }

      if (userData.force_reset_password) {
        navigate('/password-management');
        return;
      }

      // ⏳ Password expiry check
      const lastUpdated = new Date(userData.password_updated_at);
      const now = new Date();
      const diffDays = Math.floor((now - lastUpdated) / (1000 * 60 * 60 * 24));

      if (diffDays >= 90) {
        alert('🔒 Password expired. Please reset it.');
        navigate('/password-management');
        return;
      } else if (diffDays >= 75) {
        alert(`⚠️ Password will expire in ${90 - diffDays} day(s). Consider updating.`);
      }

      setMessage('✅ Login successful. Redirecting...');
      setTimeout(() => navigate('/landingpage'), 1000);

    } catch (err) {
      console.error('Login Exception:', err);
      setError('❌ Unexpected login error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
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
            onClick={() => setShowPassword(!showPassword)}
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
