import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, doc, getDoc, updateDoc } from '../firebase';

function PasswordManagement() {
  const { currentUser } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setError('No user is currently logged in.');
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setError('User record not found.');
        return;
      }

      const userData = userSnap.data();
      if (userData.password !== oldPassword) {
        setError('Old password is incorrect.');
        return;
      }

      await updateDoc(userRef, { password: newPassword });
      setMessage('Password updated successfully.');
      setError('');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError('Failed to update password.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Password Management</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {message && <p className="text-green-600 mb-4">{message}</p>}
      <form onSubmit={handlePasswordReset}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Old Password</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default PasswordManagement;
