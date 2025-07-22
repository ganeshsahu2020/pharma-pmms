import { createClient } from '@supabase/supabase-js';

// ✅ Load from .env via Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🚫 Dev warning if env vars are missing
if (!supabaseUrl || !supabaseKey) {
  console.error('🚫 Supabase URL or Anon Key missing. Check your .env.local and restart the dev server.');
}

// ✅ Singleton client
export const supabase = createClient(supabaseUrl, supabaseKey);
