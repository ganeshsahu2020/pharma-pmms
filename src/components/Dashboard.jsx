import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log('📦 Session response:', data);

        if (error || !data?.session?.user) {
          console.warn('⚠️ No valid session. Redirecting to /login...');
          navigate('/login');
        } else {
          setUser(data.session.user);
        }
      } catch (err) {
        console.error('🔥 Session fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>

        {loading ? (
          <p className="text-gray-500">🔄 Loading user data...</p>
        ) : user ? (
          <div className="space-y-3 text-gray-700">
            <p><strong>📧 Email:</strong> {user.email}</p>
            <p><strong>🆔 User ID:</strong> {user.id}</p>
          </div>
        ) : (
          <p className="text-red-600">❌ No user found — something went wrong.</p>
        )}

        <div className="mt-6 text-gray-700 leading-relaxed">
          Welcome to the <strong>DigitizerX</strong> Pharmaceutical Automation Dashboard.
          Use the sidebar to navigate modules, manage users, and ensure regulatory compliance across operations.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
