import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import Select from 'react-select';

const UserManagement = ({ currentUserRole }) => {
  const [users, setUsers] = useState([]);
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState({
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
  });

  const roles = ['Super Admin', 'Admin', 'Manager', 'Supervisor', 'Operator', 'QA', 'Engineering'];

  useEffect(() => {
    fetchPlants();
    fetchUsers();
  }, []);

  const fetchPlants = async () => {
    const { data, error } = await supabase.from('plant_master').select('plant_id');
    if (!error) setPlants(data);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('user_management').select('*');
    if (!error) setUsers(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMultiChange = (selected, name) => {
    setForm({ ...form, [name]: selected.map((item) => item.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.confirm_password === '') {
      alert('Temporary password is required');
      return;
    }

    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.confirm_password
    });

    if (authError) {
      alert(authError.message);
      return;
    }

    const now = new Date().toISOString();
    const formData = { ...form, password_updated_at: now };
    delete formData.confirm_password;

    const { error: insertError } = await supabase.from('user_management').insert([formData]);
    if (!insertError) fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      const { error } = await supabase.from('user_management').delete().eq('id', id);
      if (!error) fetchUsers();
    }
  };

  const handleUpdate = async (user) => {
    const { error } = await supabase.from('user_management').update(user).eq('id', user.id);
    if (!error) fetchUsers();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">User Management</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <select name="plantid" value={form.plantid} onChange={handleChange} className="p-2 border rounded">
          <option value="">Select Plant</option>
          {plants.map((p) => <option key={p.plant_id} value={p.plant_id}>{p.plant_id}</option>)}
        </select>
        <input name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="Employee ID" className="p-2 border rounded" />
        <input name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" className="p-2 border rounded" />
        <input name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" className="p-2 border rounded" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
        <input name="phone_no" value={form.phone_no} onChange={handleChange} placeholder="Phone No" className="p-2 border rounded" />
        <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} placeholder="Temporary Password" className="p-2 border rounded" />
        <Select isMulti options={roles.map(r => ({ value: r, label: r }))} onChange={(val) => handleMultiChange(val, 'role')} className="col-span-2" />
        <select name="status" value={form.status} onChange={handleChange} className="p-2 border rounded">
          <option>Active</option>
          <option>Inactive</option>
        </select>
        <button className="col-span-2 bg-blue-600 text-white p-2 rounded" type="submit">Save User</button>
      </form>

      <table className="w-full table-auto border">
        <thead>
          <tr>
            <th>Emp ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th>
            {(currentUserRole === 'Super Admin' || currentUserRole === 'Admin') && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.employee_id}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>{u.phone_no}</td>
              <td>{u.role?.join(', ')}</td>
              <td>{u.status}</td>
              {(currentUserRole === 'Super Admin' || currentUserRole === 'Admin') && (
                <td>
                  <button className="text-blue-600" onClick={() => handleUpdate(u)}>Edit</button>
                  <button className="text-red-600 ml-2" onClick={() => handleDelete(u.id)}>Delete</button>
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
