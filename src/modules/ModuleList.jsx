import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ModuleList = () => {
  const [modules, setModules] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    const { data, error } = await supabase.from('modules').select('*');
    if (error) {
      setError('Failed to fetch modules: ' + error.message);
    } else {
      console.log('Modules fetched:', data); // Debug
      setModules(data);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Modules and Submodules</h2>
      {error && <p className="text-red-600">{error}</p>}
      {modules.length === 0 && <p>No modules found.</p>}
      <ul className="space-y-2">
        {modules.map((mod) => (
          <li key={mod.id} className="p-2 border rounded shadow">
            <strong>{mod.module}</strong> → {mod.submodule}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleList;
