import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const roleOptions = [
  'Super Admin',
  'Admin',
  'Manager',
  'Supervisor',
  'Operator',
  'QA',
  'Engineering'
];

export default function UserManagement({ currentUserRole }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('user_management')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('❌ Error loading users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isPrivileged = (role) => {
    return ['Super Admin', 'Admin'].includes(role);
  };

  if (loading) return <div className="p-4 text-gray-600">Loading users...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="overflow-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1 text-left">Employee ID</th>
              <th className="border px-2 py-1 text-left">Name</th>
              <th className="border px-2 py-1 text-left">Email</th>
              <th className="border px-2 py-1 text-left">Phone</th>
              <th className="border px-2 py-1 text-left">Role</th>
              <th className="border px-2 py-1 text-left">Status</th>
              {isPrivileged(currentUserRole) && (
                <th className="border px-2 py-1 text-left">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user.employee_id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{user.employee_id || '—'}</td>
                <td className="border px-2 py-1">
                  {user.first_name || ''} {user.last_name || ''}
                </td>
                <td className="border px-2 py-1">{user.email || '—'}</td>
                <td className="border px-2 py-1">{user.phone_no || '—'}</td>
                <td className="border px-2 py-1">
                  {(user.role || []).join(', ') || '—'}
                </td>
                <td className="border px-2 py-1">{user.status || 'Inactive'}</td>
                {isPrivileged(currentUserRole) && (
                  <td className="border px-2 py-1 space-x-2">
                    <button className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button className="text-red-600 hover:underline text-xs">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
