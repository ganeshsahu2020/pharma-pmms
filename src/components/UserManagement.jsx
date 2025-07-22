import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Select from 'react-select';

const UserManagement = ({ currentUserRole }) => {
  const [users, setUsers] = useState([]);
  const [plants, setPlants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [sortBy, setSortBy] = useState('employee_id');
  const [sortOrder, setSortOrder] = useState('asc');

  const roleOptions = [
    'Super Admin', 'Admin', 'Manager', 'Supervisor', 'Operator', 'QA', 'Engineering'
  ].map(role => ({ value: role, label: role }));

  const defaultForm = {
    plantid: '',
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone_no: '',
    role: [],
    confirm_password: '',
    force_reset_password: true,
    password_updated_at: '',
    status: 'Active'
  };

  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    fetchPlants();
    fetchUsers();
  }, []);

  const fetchPlants = async () => {
    const { data, error } = await supabase.from('plant_master').select('plant_id');
    if (!error) setPlants(data || []);
    else console.error('⚠️ Failed to fetch plants:', error.message);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('user_management').select('*');
    if (!error) setUsers(data || []);
    else console.error('⚠️ Failed to fetch users:', error.message);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selected) => {
    const roles = selected ? selected.map((r) => r.value) : [];
    setForm((prev) => ({ ...prev, role: roles }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const formData = {
      ...form,
      password_updated_at: now
    };
    delete formData.confirm_password;

    if (editingId) {
      const { error } = await supabase.from('user_management').update(formData).eq('id', editingId);
      if (!error) {
        fetchUsers();
        resetForm();
        alert('✅ User updated successfully');
      } else {
        alert('❌ Failed to update user');
      }
    } else {
      if (!form.confirm_password.trim()) {
        return alert('❗ Temporary password is required');
      }

      const { data: existing } = await supabase.from('user_management').select('email').eq('email', form.email);
      if (existing?.length) {
        return alert('⚠️ Email already exists');
      }

      const { error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.confirm_password
      });

      if (authError) {
        return alert(`❌ Auth Error: ${authError.message}`);
      }

      const { error: insertError } = await supabase.from('user_management').insert([formData]);
      if (!insertError) {
        fetchUsers();
        resetForm();
        alert('✅ User created successfully');
      } else {
        alert('❌ Failed to insert user');
      }
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('🗑️ Are you sure you want to delete this user?')) {
      const { error } = await supabase.from('user_management').delete().eq('id', id);
      if (!error) fetchUsers();
      else alert('❌ Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    const parsedRoles = Array.isArray(user.role) ? user.role : [];
    setForm({
      ...user,
      role: parsedRoles,
      confirm_password: ''
    });
    setEditingId(user.id);
  };

  const sortedUsers = [...users].sort((a, b) => {
    const valA = a[sortBy]?.toString().toLowerCase();
    const valB = b[sortBy]?.toString().toLowerCase();
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortBy(key);
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">👤 User Management</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <select name="plantid" value={form.plantid} onChange={handleChange} className="p-2 border rounded" required>
          <option value="">Select Plant</option>
          {plants.map((p) => (
            <option key={p.plant_id} value={p.plant_id}>{p.plant_id}</option>
          ))}
        </select>
        <input name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="Employee ID" className="p-2 border rounded" required />
        <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" className="p-2 border rounded" required />
        <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" className="p-2 border rounded" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" required />
        <input name="phone_no" value={form.phone_no} onChange={handleChange} placeholder="Phone No" className="p-2 border rounded" required />
        <input
          name="confirm_password"
          type="password"
          value={form.confirm_password}
          onChange={handleChange}
          placeholder="Temporary Password"
          className="p-2 border rounded"
          required={!editingId}
        />
        <Select
          isMulti
          options={roleOptions}
          value={form.role.map(r => ({ value: r, label: r }))}
          onChange={handleRoleChange}
          className="col-span-2"
          placeholder="Select Roles"
        />
        <select name="status" value={form.status} onChange={handleChange} className="p-2 border rounded">
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button className="col-span-2 bg-blue-600 text-white p-2 rounded" type="submit">
          {editingId ? 'Update User' : 'Save User'}
        </button>
      </form>

      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="cursor-pointer" onClick={() => handleSort('employee_id')}>Emp ID</th>
            <th className="cursor-pointer" onClick={() => handleSort('first_name')}>Name</th>
            <th className="cursor-pointer" onClick={() => handleSort('email')}>Email</th>
            <th className="cursor-pointer" onClick={() => handleSort('phone_no')}>Phone</th>
            <th className="cursor-pointer" onClick={() => handleSort('role')}>Role</th>
            <th className="cursor-pointer" onClick={() => handleSort('status')}>Status</th>
            {(currentUserRole === 'Super Admin' || currentUserRole === 'Admin') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((u) => (
            <tr key={u.id}>
              <td>{u.employee_id}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>{u.phone_no}</td>
              <td>{Array.isArray(u.role) ? u.role.join(', ') : u.role}</td>
              <td>{u.status}</td>
              {(currentUserRole === 'Super Admin' || currentUserRole === 'Admin') && (
                <td>
                  <button className="text-blue-600 mr-2" onClick={() => handleEdit(u)}>Edit</button>
                  <button className="text-red-600" onClick={() => handleDelete(u.id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
