import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import csv from "csv-parser";

const supabaseUrl = "https://hwaqhomwwsltvgyjyqfq.supabase.co";
const supabaseKey = "YOUR_SERVICE_ROLE_KEY_HERE"; // 🔐 Use Service Role Key
const supabase = createClient(supabaseUrl, supabaseKey);

const results = [];
fs.createReadStream("modules_fixed.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", async () => {
    for (const row of results) {
      const { module, submodule } = row;
      const { error } = await supabase
        .from("modules")
        .upsert([{ module, submodule }], { onConflict: ["module", "submodule"] });

      if (error) {
        console.error(`❌ Failed to upsert ${module} → ${submodule}:`, error.message);
      } else {
        console.log(`✅ Upserted: ${module} → ${submodule}`);
      }
    }
  });
