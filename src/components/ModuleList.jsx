import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // ✅ Always import from a central config

const ModuleList = () => {
  const [modules, setModules] = useState({});

  useEffect(() => {
    const fetchModules = async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('module, submodule');

      if (error) {
        console.error('❌ Error fetching modules:', error.message);
        return;
      }

      const grouped = data.reduce((acc, { module, submodule }) => {
        if (!acc[module]) acc[module] = [];
        acc[module].push(submodule);
        return acc;
      }, {});

      setModules(grouped);
    };

    fetchModules();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📦 Module List</h2>
      {Object.entries(modules).map(([module, subs]) => (
        <div key={module} className="mb-6">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">📁 {module}</h3>
          <ul className="list-disc list-inside text-gray-700">
            {subs.map((sub, idx) => (
              <li key={idx}>{sub}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ModuleList;
