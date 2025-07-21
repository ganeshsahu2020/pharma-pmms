// scripts/setPassword.js
import { createClient } from '@supabase/supabase-js';

// ✅ Replace with your actual Supabase project URL
const supabaseUrl = 'https://hwaqhomwwsltvgyjyqfq.supabase.co';

// ✅ Replace with your actual Service Role Key
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YXFob213d3NsdHZneWp5cWZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk1MzA2OSwiZXhwIjoyMDY4NTI5MDY5fQ.0GbsLZsDD29WryA49fnl5kRA9DL18AR2n49H_l4Uvug';

// 🚨 This key is sensitive. NEVER expose it on the frontend!
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 🔐 List of users and passwords to update
const usersToUpdate = [
  {
    email: 'ganeshchsahu2020@gmail.com',
    password: 'Password@123'
  },
  {
    email: 'rxgibsmt@gmail.com',
    password: 'Password@123'
  }
];

(async () => {
  for (const user of usersToUpdate) {
    try {
      const { data, error } = await supabase.auth.admin.updateUserByEmail(user.email, {
        password: user.password
      });

      if (error) {
        console.error(`❌ Failed to update password for ${user.email}:`, error.message);
      } else {
        console.log(`✅ Password successfully updated for ${user.email}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${user.email}:`, err.message);
    }
  }
})();
