import {useEffect, useState} from 'react';
import {supabase} from '../utils/supabaseClient';

const PlantMaster = () => {
  const [form, setForm] = useState({
    plant_id: '',
    description: '',
    status: 'Active',
    tax_reg_no: '',
    license: '',
    gs1_prefix: '',
    address1: ''
  });
  const [plants, setPlants] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchPlants();
  }, []);

  const fetchUser = async () => {
    const {data: {user}} = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchPlants = async () => {
    const {data, error} = await supabase
      .from('plant_master')
      .select('*')
      .order('created_at', {ascending: false});
    if (!error) setPlants(data);
  };

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const resetForm = () => {
    setForm({
      plant_id: '',
      description: '',
      status: 'Active',
      tax_reg_no: '',
      license: '',
      gs1_prefix: '',
      address1: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      const {error} = await supabase
        .from('plant_master')
        .update({
          ...form,
          updated_by: currentUser?.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingId);

      if (!error) {
        fetchPlants();
        resetForm();
        alert('✅ Plant updated successfully');
      }
    } else {
      const {error} = await supabase
        .from('plant_master')
        .insert([{...form, created_by: currentUser?.email}]);

      if (!error) {
        fetchPlants();
        resetForm();
        alert('✅ Plant created successfully');
      }
    }
  };

  const handleEdit = (plant) => {
    setForm(plant);
    setEditingId(plant.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('🗑️ Are you sure you want to delete this plant?')) {
      const {error} = await supabase.from('plant_master').delete().eq('id', id);
      if (!error) fetchPlants();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🏭 Plant Master</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input name="plant_id" value={form.plant_id} onChange={handleChange} placeholder="Plant ID" className="p-2 border rounded" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded" required />
        <select name="status" value={form.status} onChange={handleChange} className="p-2 border rounded">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <input name="tax_reg_no" value={form.tax_reg_no} onChange={handleChange} placeholder="Tax Reg. No." className="p-2 border rounded" />
        <input name="license" value={form.license} onChange={handleChange} placeholder="License" className="p-2 border rounded" />
        <input name="gs1_prefix" value={form.gs1_prefix} onChange={handleChange} placeholder="GS1 Prefix" className="p-2 border rounded" />
        <input name="address1" value={form.address1} onChange={handleChange} placeholder="Address" className="p-2 border rounded" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update' : 'Save'} Plant
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">📋 Plant List</h3>
      <table className="w-full table-auto border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Plant ID</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Tax Reg No</th>
            <th className="border p-2">License</th>
            <th className="border p-2">GS1 Prefix</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Created By</th>
            <th className="border p-2">Updated By</th>
            <th className="border p-2">Updated At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.plant_id}</td>
              <td className="border p-2">{p.description}</td>
              <td className="border p-2">{p.status}</td>
              <td className="border p-2">{p.tax_reg_no || '-'}</td>
              <td className="border p-2">{p.license || '-'}</td>
              <td className="border p-2">{p.gs1_prefix || '-'}</td>
              <td className="border p-2">{p.address1 || '-'}</td>
              <td className="border p-2">{p.created_by || '-'}</td>
              <td className="border p-2">{p.updated_by || '-'}</td>
              <td className="border p-2">{p.updated_at ? new Date(p.updated_at).toLocaleString() : '-'}</td>
              <td className="border p-2">
                <button onClick={() => handleEdit(p)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlantMaster;
