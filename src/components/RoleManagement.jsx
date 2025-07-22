// RoleManagement.jsx
import React from 'react';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { supabase } from '../utils/supabaseClient';

const RoleManagement = () => {
  const [form, setForm] = useState({
    employee_id: '',
    role: '',
    designation: [],
    module_rights: [],
    rights: []
  });
  const [roles, setRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const designationOptions = ['Dower', 'Checker', 'Approver'];
  const rightsOptions = ['view', 'edit', 'update', 'delete'];
  const moduleOptions = [
    { value: 'Masters > Plant', label: 'Masters > Plant' },
    { value: 'Sampling > Stage Out', label: 'Sampling > Stage Out' }
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const { data, error } = await supabase.from('role_management').select('*');
    if (!error) setRoles(data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleMultiChange = (val, name) =>
    setForm({ ...form, [name]: val.map((v) => v.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let error;

    if (editingId) {
      ({ error } = await supabase
        .from('role_management')
        .update(form)
        .eq('id', editingId));
    } else {
      ({ error } = await supabase.from('role_management').insert([form]));
    }

    if (!error) {
      alert(editingId ? '✅ Role updated.' : '✅ Role created.');
      setForm({ employee_id: '', role: '', designation: [], module_rights: [], rights: [] });
      setEditingId(null);
      fetchRoles();
    } else {
      alert('❌ Error: ' + error.message);
    }
  };

  const handleEdit = (role) => {
    setForm(role);
    setEditingId(role.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      await supabase.from('role_management').delete().eq('id', id);
      fetchRoles();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Role Management</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          placeholder="Employee ID"
          className="p-2 border rounded"
          required
        />
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Role"
          className="p-2 border rounded"
          required
        />
        <Select
          isMulti
          value={form.designation.map(d => ({ value: d, label: d }))}
          options={designationOptions.map(d => ({ value: d, label: d }))}
          onChange={(val) => handleMultiChange(val, 'designation')}
          className="col-span-2"
        />
        <Select
          isMulti
          value={form.module_rights.map(m => ({ value: m, label: m }))}
          options={moduleOptions}
          onChange={(val) => handleMultiChange(val, 'module_rights')}
          className="col-span-2"
        />
        <Select
          isMulti
          value={form.rights.map(r => ({ value: r, label: r }))}
          options={rightsOptions.map(r => ({ value: r, label: r }))}
          onChange={(val) => handleMultiChange(val, 'rights')}
          className="col-span-2"
        />
        <button type="submit" className="col-span-2 bg-green-600 text-white p-2 rounded">
          {editingId ? 'Update Role' : 'Save Role'}
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-3">Existing Roles</h3>
      <table className="w-full text-sm table-auto border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Employee ID</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Designation</th>
            <th className="border p-2">Modules</th>
            <th className="border p-2">Rights</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.employee_id}</td>
              <td className="border p-2">{r.role}</td>
              <td className="border p-2">{r.designation?.join(', ')}</td>
              <td className="border p-2">{r.module_rights?.join(', ')}</td>
              <td className="border p-2">{r.rights?.join(', ')}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(r)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(r.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
