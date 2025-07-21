import { useState } from 'react';
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

  const designationOptions = ['Dower', 'Checker', 'Approver'];
  const rightsOptions = ['view', 'edit', 'update', 'delete'];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleMultiChange = (val, name) =>
    setForm({ ...form, [name]: val.map((v) => v.value) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('role_management').insert([form]);
    if (!error) {
      alert('✅ Role saved successfully.');
      setForm({
        employee_id: '',
        role: '',
        designation: [],
        module_rights: [],
        rights: []
      });
    } else {
      alert('❌ Error saving role: ' + error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Role Management</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          placeholder="Employee ID"
          className="p-2 border rounded"
        />
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          placeholder="Role"
          className="p-2 border rounded"
        />
        <Select
          isMulti
          options={designationOptions.map((d) => ({ value: d, label: d }))}
          onChange={(val) => handleMultiChange(val, 'designation')}
          className="col-span-2"
        />
        <Select
          isMulti
          options={[
            { value: 'Masters > Plant', label: 'Masters > Plant' },
            { value: 'Sampling > Stage Out', label: 'Sampling > Stage Out' }
          ]}
          onChange={(val) => handleMultiChange(val, 'module_rights')}
          className="col-span-2"
        />
        <Select
          isMulti
          options={rightsOptions.map((r) => ({ value: r, label: r }))}
          onChange={(val) => handleMultiChange(val, 'rights')}
          className="col-span-2"
        />
        <button
          className="col-span-2 bg-green-600 text-white p-2 rounded"
          type="submit"
        >
          Save Role
        </button>
      </form>
    </div>
  );
};

export default RoleManagement;
