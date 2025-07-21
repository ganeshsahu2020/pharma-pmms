import { createClient } from '@supabase/supabase-js';

// ✅ Load environment variables from Vite config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ⚠️ Validate environment config
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('🚫 Missing Supabase URL or Anon Key. Please check your .env file and restart the dev server.');
} else {
  console.log('✅ Supabase URL:', supabaseUrl);
  console.log('🔑 Supabase Key (partial):', supabaseAnonKey.slice(0, 10) + '...');
}

// ✅ Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
