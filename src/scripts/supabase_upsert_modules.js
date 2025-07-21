// 🔐 Secure Upsert Script for Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import csv from 'csv-parser';

// ✅ Actual Supabase URL and Service Role Key
const supabaseUrl = 'https://hwaqhomwwsltvgyjyqfq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YXFob213d3NsdHZneWp5cWZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk1MzA2OSwiZXhwIjoyMDY4NTI5MDY5fQ.0GbsLZsDD29WryA49fnl5kRA9DL18AR2n49H_l4Uvug';
const supabase = createClient(supabaseUrl, supabaseKey);

// 📄 Path to your CSV file
const csvFilePath = './modules_fixed.csv';

// 🧠 Load CSV and upsert each row
const upsertModules = async () => {
  const records = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
      records.push({
        module: row.module.trim(),
        submodule: row.submodule.trim(),
      });
    })
    .on('end', async () => {
      console.log(`Read ${records.length} rows. Starting upsert...`);

      for (const item of records) {
        const { data, error } = await supabase
          .from('modules')
          .upsert(item, { onConflict: ['module', 'submodule'] });

        if (error) console.error('❌ Failed upsert:', item, error.message);
        else console.log('✅ Upserted:', item);
      }

      console.log('🚀 All records processed.');
    });
};

upsertModules();
