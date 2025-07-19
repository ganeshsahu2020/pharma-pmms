import { useEffect, useState } from 'react';
import {
  db,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const UserManagement = () => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({
    employeeId: '',
    email: '',
    Designation: '',
    Rights: '',
    Status: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    } catch (err) {
      setError('Failed to fetch users: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError('Delete failed: ' + err.message);
    }
  };

  const handleEdit = async (user) => {
    const newDesignation = prompt('New Designation:', user.Designation || '');
    if (!newDesignation) return;
    try {
      await updateDoc(doc(db, 'users', user.id), { Designation: newDesignation });
      fetchUsers();
    } catch (err) {
      setError('Edit failed: ' + err.message);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'users'), newUser);
      setNewUser({ employeeId: '', email: '', Designation: '', Rights: '', Status: '' });
      fetchUsers();
    } catch (err) {
      setError('Add user failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">User Management</h2>
      <p className="text-sm mb-4">Logged in as: {currentUser?.email}</p>
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleAddUser} className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 text-sm">
        {['employeeId', 'email', 'Designation', 'Rights', 'Status'].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field}
            value={newUser[field]}
            onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })}
            className="p-2 border rounded"
            required
          />
        ))}
        <button className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 col-span-full md:col-auto">
          ➕ Add User
        </button>
      </form>

      <table className="w-full text-left border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Employee ID</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Designation</th>
            <th className="p-2 border">Rights</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2 border">{user.employeeId || '—'}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.Designation || '—'}</td>
              <td className="p-2 border">{user.Rights || '—'}</td>
              <td className="p-2 border">{user.Status || '—'}</td>
              <td className="p-2 border text-sm">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-600 hover:underline mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
