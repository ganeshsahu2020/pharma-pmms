import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hwaqhomwwsltvgyjyqfq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YXFob213d3NsdHZneWp5cWZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk1MzA2OSwiZXhwIjoyMDY4NTI5MDY5fQ.0GbsLZsDD29WryA49fnl5kRA9DL18AR2n49H_l4Uvug";
const supabase = createClient(supabaseUrl, supabaseKey);

const ModuleList = () => {
  const [modules, setModules] = useState({});

  useEffect(() => {
    const fetchModules = async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("module, submodule");

      if (error) {
        console.error("Error fetching modules:", error);
        return;
      }

      const grouped = data.reduce((acc, row) => {
        if (!acc[row.module]) acc[row.module] = [];
        acc[row.module].push(row.submodule);
        return acc;
      }, {});
      setModules(grouped);
    };

    fetchModules();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">📦 Module List</h2>
      {Object.entries(modules).map(([module, subs]) => (
        <div key={module} className="mb-4">
          <h3 className="font-bold text-blue-600">📁 {module}</h3>
          <ul className="list-disc pl-6">
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
