import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEmailFromEmployeeId } from '../utils/userLookup';

function Login() {
  const [employeeId,setEmployeeId] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const email = await getEmailFromEmployeeId(employeeId);
      await login(email,password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
      
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700">Employee ID</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-sm text-center">
        <button
          onClick={() => navigate('/password-reset')}
          className="text-blue-500 underline mr-4"
        >
          Forgot password?
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="text-blue-600 underline"
        >
          Create account
        </button>
      </div>
    </div>
  );
}

export default Login;
