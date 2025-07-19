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

function Area() {
  const [areas, setAreas] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    areaId: '', areaName: '', areaDesc: '', areaType: '', departmentId: ''
  });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const areaSnap = await getDocs(collection(db, 'areas'));
        const areaData = areaSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAreas(areaData);

        const deptSnap = await getDocs(collection(db, 'departments'));
        const deptData = deptSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDepartments(deptData);
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
    if (!form.areaId || !form.departmentId) return setError('Area ID and Department ID are required.');

    try {
      if (editingId) {
        await updateDoc(doc(db, 'areas', editingId), form);
        setAreas((prev) => prev.map((a) => a.id === editingId ? { id: editingId, ...form } : a));
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, 'areas'), form);
        setAreas((prev) => [...prev, { id: docRef.id, ...form }]);
      }
      setForm({ areaId: '', areaName: '', areaDesc: '', areaType: '', departmentId: '' });
      setError('');
    } catch (err) {
      console.error('Area Save Error:', err);
      setError('Failed to save area.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'areas', id));
      setAreas((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError('Failed to delete area.');
    }
  };

  const handleEdit = (area) => {
    setForm({
      areaId: area.areaId,
      areaName: area.areaName,
      areaDesc: area.areaDesc,
      areaType: area.areaType,
      departmentId: area.departmentId
    });
    setEditingId(area.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Area Master</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 mb-6">
        <input name="areaId" placeholder="Area ID" value={form.areaId} onChange={handleChange} className="border p-2 rounded" required />
        <input name="areaName" placeholder="Area Name" value={form.areaName} onChange={handleChange} className="border p-2 rounded" required />
        <input name="areaDesc" placeholder="Area Description" value={form.areaDesc} onChange={handleChange} className="border p-2 rounded" />
        <input name="areaType" placeholder="Area Type" value={form.areaType} onChange={handleChange} className="border p-2 rounded" />
        <select name="departmentId" value={form.departmentId} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.departmentId}>{d.departmentId}</option>
          ))}
        </select>
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {editingId ? 'Update Area' : 'Add Area'}
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Area ID</th>
            <th className="border p-2">Area Name</th>
            <th className="border p-2">Area Description</th>
            <th className="border p-2">Area Type</th>
            <th className="border p-2">Department ID</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area) => (
            <tr key={area.id}>
              <td className="border p-2">{area.areaId}</td>
              <td className="border p-2">{area.areaName}</td>
              <td className="border p-2">{area.areaDesc}</td>
              <td className="border p-2">{area.areaType}</td>
              <td className="border p-2">{area.departmentId}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(area)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(area.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Area;
