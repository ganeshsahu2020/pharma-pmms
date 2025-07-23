import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

// 🧩 Submodule Components
import PlantMaster from './PlantMaster';
import UserManagement from './UserManagement';
import RoleManagement from './RoleManagement';
import PasswordManagement from './PasswordManagement';

export default function LandingPage() {
  const [modules, setModules] = useState([]);
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchModules();
    fetchUser();
  }, []);

  const fetchModules = async () => {
    const { data, error } = await supabase.from('modules').select('*');
    if (error) console.error('❌ Failed to load modules:', error.message);
    else setModules(data || []);
  };

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) console.error('⚠️ Failed to get user session:', error.message);
    else setUser(data?.session?.user || null);
  };

  const handleLogout = async () => {
    localStorage.removeItem('rememberEmail');
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const groupedModules = modules.reduce((acc, { module, submodule }) => {
    if (!acc[module]) acc[module] = [];
    acc[module].push(submodule);
    return acc;
  }, {});

  const submoduleComponents = {
    plantmaster: <PlantMaster />,
    usermanagement: <UserManagement currentUserRole="Super Admin" />,
    rolemanagement: <RoleManagement />,
    passwordmanagement: <PasswordManagement />
  };

  useEffect(() => {
    if (expandedModule && groupedModules[expandedModule]) {
      const first = groupedModules[expandedModule][0];
      setSelectedSubmodule(first);
    }
  }, [expandedModule, groupedModules]);

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
              className={`font-bold text-blue-600 cursor-pointer ${
                expandedModule === module ? 'underline' : ''
              }`}
              onClick={() => setExpandedModule(expandedModule === module ? null : module)}
            >
              {module}
            </h3>
            {expandedModule === module && (
              <div className="mt-1 space-y-1">
                {submodules.map((sub, idx) => (
                  <div
                    key={idx}
                    className={`ml-4 text-sm cursor-pointer hover:text-blue-700 ${
                      selectedSubmodule === sub ? 'font-medium text-blue-800' : 'text-gray-700'
                    }`}
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

      {/* 🧱 Main Content */}
      <div className="flex-1 flex flex-col">
        {/* 🔐 Top Bar with Centered Logo */}
        <header className="flex items-center justify-between bg-white shadow px-6 py-3 border-b">
          <div className="w-40" />
          <div className="text-2xl font-extrabold text-blue-600 animate-logo-fade">
            DigitizerX
          </div>
          <div className="flex items-center gap-4 w-40 justify-end">
            <span className="text-sm text-gray-700 truncate">
              {user?.email || '🔒 Unknown User'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* 🧩 Render Submodule */}
        <main className="p-6 overflow-y-auto">{renderSubmodule()}</main>
      </div>
    </div>
  );
}
