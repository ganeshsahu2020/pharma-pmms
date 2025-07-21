import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

// 🧩 Submodule Components
import PlantMaster from './PlantMaster';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import PasswordManagement from './PasswordManagement';

const LandingPage = () => {
  const [modules, setModules] = useState([]);
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const [user, setUser] = useState(null);

  // 🔁 Load modules + user on mount
  useEffect(() => {
    fetchModules();
    fetchUserSession();
  }, []);

  const fetchModules = async () => {
    const { data, error } = await supabase.from('modules').select('*');
    if (error) {
      console.error('❌ Error fetching modules:', error.message);
    } else {
      setModules(data);
    }
  };

  const fetchUserSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('⚠️ Error fetching user session:', error.message);
    } else {
      setUser(session?.user || null);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('rememberEmail');
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  // 📦 Group submodules by module name
  const groupedModules = modules.reduce((acc, item) => {
    const moduleName = item.module;
    if (!acc[moduleName]) acc[moduleName] = [];
    acc[moduleName].push(item.submodule);
    return acc;
  }, {});

  // 🧩 Submodule component mapper
  const submoduleComponents = {
    'plant': <PlantMaster />,
    'userauthorization': <UserManagement currentUserRole="Super Admin" />,
    'rolemanagement': <RoleManagement />,
    'passwordmanagement': <PasswordManagement />
  };

  const renderSubmodule = () => {
    const key = selectedSubmodule?.toLowerCase().replace(/\s+/g, '');
    return submoduleComponents[key] || (
      <p className="text-gray-600">📁 Select a submodule to begin.</p>
    );
  };

  return (
    <div className="flex h-screen">
      {/* 📋 Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 overflow-y-auto border-r">
        <h2 className="text-lg font-semibold mb-4">📦 Modules</h2>
        {Object.entries(groupedModules).map(([module, submodules]) => (
          <div key={module} className="mb-3">
            <h3
              className={`font-bold text-blue-600 cursor-pointer ${expandedModule === module ? 'underline' : ''}`}
              onClick={() => setExpandedModule(prev => (prev === module ? null : module))}
            >
              {module}
            </h3>
            {expandedModule === module && (
              <div className="mt-1 space-y-1">
                {submodules.map((sub, idx) => (
                  <div
                    key={idx}
                    className={`ml-4 text-sm cursor-pointer hover:text-blue-700 ${selectedSubmodule === sub ? 'font-medium text-blue-800' : 'text-gray-700'}`}
                    onClick={() => setSelectedSubmodule(sub)}
                  >
                    • {sub}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </aside>

      {/* 🧱 Main Panel */}
      <div className="flex-1 flex flex-col">
        {/* 🔐 Top Bar */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-3 border-b">
          <img src="/logo192.png" alt="Logo" className="h-8" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* 🖥️ Submodule Area */}
        <main className="p-6 overflow-y-auto">
          {renderSubmodule()}
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
