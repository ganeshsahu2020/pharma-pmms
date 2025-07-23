import React, { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const CreateUser = () => {
  useEffect(() => {
    const createTestUser = async () => {
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@digitizerx.space',
        password: 'admin123'
      });

      if (error) {
        console.error('❌ Error creating user:', error.message);
      } else {
        console.log('✅ Test user created:', data);
      }
    };

    createTestUser();
  }, []);

  return (
    <div className="p-8 text-green-700">
      🚀 Creating test user... Check browser console for result.
    </div>
  );
};

export default CreateUser;
