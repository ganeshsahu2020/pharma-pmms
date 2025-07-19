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

function SubPlant() {
  const [subplants, setSubplants] = useState([]);
  const [plants, setPlants] = useState([]);
  const [selectedPlantId, setSelectedPlantId] = useState('');
  const [form, setForm] = useState({
    subplantName: '', subplantId: '', description: '', plantId: '', status: 'Active'
  });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subplantSnapshot = await getDocs(collection(db, 'subplants'));
        const subplantData = subplantSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSubplants(subplantData);

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

  const handlePlantSelection = (e) => {
    setSelectedPlantId(e.target.value);
    setForm((prev) => ({ ...prev, plantId: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.subplantId || !form.plantId) return setError('Subplant ID and Plant ID are required.');

    try {
      if (editingId) {
        await updateDoc(doc(db, 'subplants', editingId), form);
        setSubplants((prev) => prev.map((sp) => sp.id === editingId ? { id: editingId, ...form } : sp));
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, 'subplants'), form);
        setSubplants((prev) => [...prev, { id: docRef.id, ...form }]);
      }
      setForm({ subplantName: '', subplantId: '', description: '', plantId: selectedPlantId, status: 'Active' });
      setError('');
    } catch (err) {
      console.error('Subplant Save Error:', err);
      setError('Failed to save subplant.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'subplants', id));
      setSubplants((prev) => prev.filter((sp) => sp.id !== id));
    } catch (err) {
      setError('Failed to delete subplant.');
    }
  };

  const handleEdit = (sp) => {
    setForm({
      subplantName: sp.subplantName,
      subplantId: sp.subplantId,
      description: sp.description,
      plantId: sp.plantId,
      status: sp.status
    });
    setSelectedPlantId(sp.plantId);
    setEditingId(sp.id);
  };

  const filteredSubplants = selectedPlantId
    ? subplants.filter((sp) => sp.plantId === selectedPlantId)
    : subplants;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Subplant Master</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Filter by Plant:</label>
        <select value={selectedPlantId} onChange={handlePlantSelection} className="border p-2 rounded">
          <option value="">All Plants</option>
          {plants.map((plant) => (
            <option key={plant.id} value={plant.plantId}>{plant.plantId}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 mb-6">
        <input name="subplantName" placeholder="Subplant Name" value={form.subplantName} onChange={handleChange} className="border p-2 rounded" required />
        <input name="subplantId" placeholder="Subplant ID" value={form.subplantId} onChange={handleChange} className="border p-2 rounded" required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded" />
        <select name="plantId" value={form.plantId} onChange={handlePlantSelection} className="border p-2 rounded" required>
          <option value="">Select Plant</option>
          {plants.map((plant) => (
            <option key={plant.id} value={plant.plantId}>{plant.plantId}</option>
          ))}
        </select>
        <input name="status" placeholder="Status" value={form.status} onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" className="col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700">
          {editingId ? 'Update Subplant' : 'Add Subplant'}
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Subplant Name</th>
            <th className="border p-2">Subplant ID</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Plant ID</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubplants.map((sp) => (
            <tr key={sp.id}>
              <td className="border p-2">{sp.subplantName}</td>
              <td className="border p-2">{sp.subplantId}</td>
              <td className="border p-2">{sp.description}</td>
              <td className="border p-2">{sp.plantId}</td>
              <td className="border p-2">{sp.status}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(sp)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(sp.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubPlant;
