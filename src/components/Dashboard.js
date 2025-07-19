import { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';

const modules = [
  {
    name: 'Masters',
    route: 'masters',
    submodules: ['Plant', 'Department', 'Equipment', 'Product Master', 'Material Master', 'SubPlant', 'Area', 'Location', 'Standard Weight Box', 'Standard Weights', 'Weighing Balance', 'Module Rights', 'UOM', 'Masterial']
  },
  {
    name: 'User Management',
    route: 'user-management',
    submodules: ['User Authorization', 'Password Management', 'Role Management']
  },
  {
    name: 'Document Management',
    route: 'document-management',
    submodules: ['Log Books', 'Check Lists', 'Label Master']
  },
  {
    name: 'Material Inward',
    route: 'material-inward',
    submodules: ['Gate Entry', 'Vehicle Inspection', 'Material Inspection', 'Weight Capture', 'GRN Posting', 'Label Printing', 'Palletization']
  },
  {
    name: 'Sampling',
    route: 'sampling',
    submodules: ['Area Assignment', 'Sampling', 'Stage Out', 'Relocate to WH']
  },
  {
    name: 'Dispensing',
    route: 'dispensing',
    submodules: ['Equipment Cleaning', 'Line Clearance', 'PreStage', 'Dispensing', 'Issue to Production', 'Stage Out', 'Put Away', 'Return to Vendor', 'Destruction']
  },
  {
    name: 'Recipe Management',
    route: 'recipe-management',
    submodules: ['Transaction Approval', 'Recipe Master', 'Recipe Master Approval', 'Activity Master', 'Activity Master Approval', 'Recipe Link to Process Order']
  },
  {
    name: 'MES',
    route: 'mes',
    submodules: ['Cubicle and Equipment Assignment', 'Cubicle and Equipment Cleaning', 'Line Clearance', 'Operation', 'Dispensed Material Weight Verification', 'Material Consumption', 'In-Process Label Printing', 'Put Away', 'Pick and Issue to Stage process', 'Issue to Packing', 'Packing', 'Palletization', 'Material Posting, Yield and OEE Calculation', 'Material Return']
  },
  {
    name: 'FG Management',
    route: 'fg-management',
    submodules: ['Put Away', 'Picking', 'Loading']
  },
  {
    name: 'Weighing Balance',
    route: 'weighing-balance',
    submodules: ['Weighing Balance master', 'Weighing Box Master', 'Standard Weight Master']
  },
  {
    name: 'Weighing Balance Calibration',
    route: 'weighing-balance-calibration',
    submodules: ['Daily/Weekly/Monthly']
  }
];

const componentMap = {
  'User Authorization': lazy(() => import('./UserManagement')),
  'Password Management': lazy(() => import('./PasswordManagement')),
  'Role Management': lazy(() => import('./RoleManagement')),
  'Plant': lazy(() => import('./masters/Plant')),
  'Department': lazy(() => import('./masters/Department')),
  'Equipment': lazy(() => import('./masters/Equipment')),
  'Product Master': lazy(() => import('./masters/ProductMaster')),
  'Material Master': lazy(() => import('./masters/MaterialMaster'))
  // Add more mappings as needed
};

function LandingPage() {
  const [activeModule, setActiveModule] = useState(modules[0]);
  const [activeSubmodule, setActiveSubmodule] = useState(null);

  const renderComponent = (submodule) => {
    const Component = componentMap[submodule];
    if (Component) {
      return (
        <Suspense fallback={<div className="mt-4 text-gray-500">Loading component...</div>}>
          <Component />
        </Suspense>
      );
    }
    return (
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">{submodule}</h3>
        <p className="text-sm text-gray-600">No component mapped for "{submodule}".</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-700">DigitizerX</h1>
        <div>
          <Link to="/logout" className="text-sm text-red-600 hover:underline">Logout</Link>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-md p-4 hidden sm:block overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Modules</h2>
          <ul className="space-y-2">
            {modules.map((module) => (
              <li key={module.route}>
                <button
                  onClick={() => { setActiveModule(module); setActiveSubmodule(null); }}
                  className={`text-left w-full text-blue-600 hover:underline ${activeModule.name === module.name ? 'font-bold' : ''}`}
                >
                  {module.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-semibold mb-6 text-center">{activeModule.name}</h2>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <ul className="list-disc list-inside text-sm text-gray-700">
              {activeModule.submodules.map((sub, index) => (
                <li
                  key={index}
                  className={`cursor-pointer hover:text-blue-600 ${activeSubmodule === sub ? 'font-bold text-blue-700' : ''}`}
                  onClick={() => setActiveSubmodule(sub)}
                >
                  {sub}
                </li>
              ))}
            </ul>
            {activeSubmodule && renderComponent(activeSubmodule)}
          </div>
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
