// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// ⚙️ Load Supabase credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🚨 Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error(
    '🚫 Missing Supabase credentials. Make sure .env.local is present and restart the dev server.'
  );
}

// ✅ Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
