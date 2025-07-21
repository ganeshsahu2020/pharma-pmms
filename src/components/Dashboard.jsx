import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Error fetching session:', error.message);
          setUser(null);
        } else {
          setUser(data?.session?.user || null);
        }
      } catch (err) {
        console.error('⚠️ Unexpected session fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

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
          <p className="text-red-600">⚠️ No user session found.</p>
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
