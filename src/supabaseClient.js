// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// ✅ Load from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🧪 Debug logs — only in development
if (import.meta.env.DEV) {
  console.log('🔍 VITE_SUPABASE_URL:', supabaseUrl);
  console.log('🔍 VITE_SUPABASE_ANON_KEY:', supabaseAnonKey);
}

// 🚨 Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Missing Supabase credentials. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local'
  );
}

// ✅ Export Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
