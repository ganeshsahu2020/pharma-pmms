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

function Department() {
  const [departments, setDepartments] = useState([]);
  const [subplants, setSubplants] = useState([]);
  const [form, setForm] = useState({
    departmentId: '', departmentName: '', subplantName: '', subplantId: '', status: 'Active'
  });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptSnap = await getDocs(collection(db, 'departments'));
        const deptData = deptSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setDepartments(deptData);

        const subplantSnap = await getDocs(collection(db, 'subplants'));
        const subplantData = subplantSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setSubplants(subplantData);
      } catch (err) {
        setError('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'subplantId') {
      const selected = subplants.find((s) => s.subplantId === value);
      setForm((prev) => ({
        ...prev,
        subplantName: selected ? selected.subplantName : ''
      }));
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.departmentId || !form.subplantId) return setError('Department ID and Subplant are required.');

    try {
      if (editingId) {
        await updateDoc(doc(db, 'departments', editingId), form);
        setDepartments((prev) => prev.map((d) => d.id === editingId ? { id: editingId, ...form } : d));
        setEditingId(null);
      } else {
        const docRef = await addDoc(collection(db, 'departments'), form);
        setDepartments((prev) => [...prev, { id: docRef.id, ...form }]);
      }
      setForm({ departmentId: '', departmentName: '', subplantName: '', subplantId: '', status: 'Active' });
      setError('');
    } catch (err) {
      console.error('Department Save Error:', err);
      setError('Failed to save department.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'departments', id));
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError('Failed to delete department.');
    }
  };

  const handleEdit = (dept) => {
    setForm({
      departmentId: dept.departmentId,
      departmentName: dept.departmentName,
      subplantName: dept.subplantName,
      subplantId: dept.subplantId,
      status: dept.status
    });
    setEditingId(dept.id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Department Master</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 mb-6">
        <input name="departmentId" placeholder="Department ID" value={form.departmentId} onChange={handleChange} className="border p-2 rounded" required />
        <input name="departmentName" placeholder="Department Name" value={form.departmentName} onChange={handleChange} className="border p-2 rounded" required />
        <select name="subplantId" value={form.subplantId} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Subplant</option>
          {subplants.map((sp) => (
            <option key={sp.id} value={sp.subplantId}>{sp.subplantId}</option>
          ))}
        </select>
        <input name="subplantName" placeholder="Subplant Name" value={form.subplantName} readOnly className="border p-2 rounded bg-gray-100" />
        <input name="status" placeholder="Status" value={form.status} onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {editingId ? 'Update Department' : 'Add Department'}
        </button>
      </form>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Department ID</th>
            <th className="border p-2">Department Name</th>
            <th className="border p-2">Subplant Name</th>
            <th className="border p-2">Subplant ID</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              <td className="border p-2">{dept.departmentId}</td>
              <td className="border p-2">{dept.departmentName}</td>
              <td className="border p-2">{dept.subplantName}</td>
              <td className="border p-2">{dept.subplantId}</td>
              <td className="border p-2">{dept.status}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(dept)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(dept.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Department;
