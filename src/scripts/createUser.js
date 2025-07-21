// scripts/createUser.js
import { createClient } from '@supabase/supabase-js';

// ❗ Use service role key here (from Supabase project settings → API → "Service key")
const supabase = createClient(
  'https://hwaqhomwwsltvgyjyqfq.supabase.co',
  'your-service-role-key-here'
);

(async () => {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin1@digitizerx.com',
    password: 'password123',
    email_confirm: true
  });

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('✅ User created:', data.user);
  }
})();

