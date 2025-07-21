$componentPath = "src\components\ModuleList.jsx"

# Ensure components directory exists
$componentsDir = "src\components"
if (-Not (Test-Path $componentsDir)) {
    New-Item -Path $componentsDir -ItemType Directory -Force
    Write-Host "📁 Created folder: $componentsDir"
}

# JSX content
$jsxContent = @"
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hwaqhomwwsltvgyjyqfq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YXFob213d3NsdHZneWp5cWZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk1MzA2OSwiZXhwIjoyMDY4NTI5MDY5fQ.0GbsLZsDD29WryA49fnl5kRA9DL18AR2n49H_l4Uvug'
);

const ModuleList = () => {
  const [moduleTree, setModuleTree] = useState({});

  useEffect(() => {
    const fetchModules = async () => {
      const { data, error } = await supabase.from('modules').select('*');
      if (error) return console.error('Error fetching modules:', error);

      const tree = {};
      data.forEach(({ module, submodule }) => {
        if (!tree[module]) tree[module] = [];
        tree[module].push(submodule);
      });

      setModuleTree(tree);
    };

    fetchModules();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Modules & Submodules</h1>
      <ul className="space-y-3">
        {Object.entries(moduleTree).map(([module, submodules]) => (
          <li key={module}>
            <strong>{module}</strong>
            <ul className="ml-6 list-disc text-sm text-gray-700">
              {submodules.map((sub, idx) => (
                <li key={idx}>{sub}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleList;
"@

# Write JSX to file
Set-Content -Path $componentPath -Value $jsxContent -Encoding UTF8
Write-Host "✅ ModuleList.jsx created at $componentPath"
