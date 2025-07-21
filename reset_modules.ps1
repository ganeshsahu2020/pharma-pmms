$moduleFolderPath = "src\components"
$moduleFilePath = "$moduleFolderPath\ModuleList.jsx"

# Delete and recreate the folder
if (Test-Path $moduleFolderPath) {
  Remove-Item -Recurse -Force $moduleFolderPath
}
New-Item -ItemType Directory -Path $moduleFolderPath | Out-Null
Write-Host "✅ Created folder: $moduleFolderPath"

# Write JSX code to the file
$jsxContent = @"
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function ModuleList() {
  const [modules, setModules] = useState({});

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    const { data, error } = await supabase.from("modules").select("*");
    if (error) {
      console.error("Supabase fetch failed:", error.message);
    } else {
      const grouped = data.reduce((acc, row) => {
        if (!acc[row.module]) acc[row.module] = [];
        acc[row.module].push(row.submodule);
        return acc;
      }, {});
      setModules(grouped);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Modules & Submodules</h2>
      {Object.entries(modules).map(([module, submodules]) => (
        <div key={module} className="mb-4">
          <h3 className="text-lg font-semibold">📦 {module}</h3>
          <ul className="ml-4 list-disc">
            {submodules.map((sub, idx) => (
              <li key={idx}>{sub}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
"@

Set-Content -Path $moduleFilePath -Value $jsxContent -Encoding UTF8
Write-Host "✅ Created: $moduleFilePath"
