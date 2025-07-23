// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// ✅ Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🚨 Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.error(
    '🚫 Supabase credentials missing. Check your .env.local file and restart the dev server.'
  );
}

// 🔧 Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// 🧪 Optional: Automatically create test user only once
const createTestUser = async () => {
  const email = 'admin@digitizerx.space';
  const password = 'admin123';

  try {
    const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
    const exists = users?.some((u) => u.email === email);
    if (exists) return console.log('✅ Test user already exists.');

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error('❌ Failed to create test user:', error.message);
    } else {
      console.log('🧪 Test user created:', data.user.email);
    }
  } catch (err) {
    console.error('🔥 Exception during test user creation:', err.message);
  }
};

// ⏱️ Create user only in development (not production)
if (import.meta.env.DEV) {
  createTestUser();
}
