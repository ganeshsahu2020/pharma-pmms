import { useState, useEffect } from 'react';
import {
  db,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from '../../firebase';

function Plant() {
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState({
    plantId: '', plantDesc: '', status: 'Active', taxRegNo: '', license: '', gs1Prefix: '', address1: ''
  });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plantSnapshot = await getDocs(collection(db, 'plants'));
        const plantData = plantSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPlants(plantData);
      } catch (err) {
        setError('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.plantId) return setError('Plant ID is required.');

    try {
      if (editingId) {
        await updateDoc(doc(db, 'plants', editingId), form);
        setPlants((prev) => prev.map((p) => p.id === editingId ? { id: editingId, ...form } : p));
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, 'plants'), form);
        setPlants((prev) => [...prev, { id: docRef.id, ...form }]);
      }
      setForm({ plantId: '', plantDesc: '', status: 'Active', taxRegNo: '', license: '', gs1Prefix: '', address1: '' });
      setError('');
    } catch (err) {
      console.error('Save Error:', err);
      setError('Failed to save plant.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'plants', id));
      setPlants((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete plant.');
    }
  };

  const handleEdit = (plant) => {
    setForm({
      plantId: plant.plantId,
      plantDesc: plant.plantDesc,
      status: plant.status,
      taxRegNo: plant.taxRegNo,
      license: plant.license,
      gs1Prefix: plant.gs1Prefix,
      address1: plant.address1
    });
    setEditingId(plant.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Plant Master</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 mb-6">
        <input name="plantId" placeholder="Plant ID" value={form.plantId} onChange={handleChange} className="border p-2 rounded" required />
        <input name="plantDesc" placeholder="Plant Description" value={form.plantDesc} onChange={handleChange} className="border p-2 rounded" />
        <input name="status" placeholder="Status" value={form.status} onChange={handleChange} className="border p-2 rounded" />
        <input name="taxRegNo" placeholder="Tax Reg No." value={form.taxRegNo} onChange={handleChange} className="border p-2 rounded" />
        <input name="license" placeholder="License" value={form.license} onChange={handleChange} className="border p-2 rounded" />
        <input name="gs1Prefix" placeholder="GS1 Prefix" value={form.gs1Prefix} onChange={handleChange} className="border p-2 rounded" />
        <input name="address1" placeholder="Address1" value={form.address1} onChange={handleChange} className="border p-2 rounded col-span-2" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {editingId ? 'Update Plant' : 'Add Plant'}
        </button>
      </form>

      <table className="w-full text-sm border mb-10">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Plant ID</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Tax Reg</th>
            <th className="border p-2">License</th>
            <th className="border p-2">GS1</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((plant) => (
            <tr key={plant.id}>
              <td className="border p-2">{plant.plantId}</td>
              <td className="border p-2">{plant.plantDesc}</td>
              <td className="border p-2">{plant.status}</td>
              <td className="border p-2">{plant.taxRegNo}</td>
              <td className="border p-2">{plant.license}</td>
              <td className="border p-2">{plant.gs1Prefix}</td>
              <td className="border p-2">{plant.address1}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(plant)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(plant.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Plant;
