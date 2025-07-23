// src/components/CreateUser.jsx
import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const CreateUser = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const createUser = async () => {
    setMessage('');
    setError('');

    const { error: signUpError } = await supabase.auth.signUp({
      email: 'admin@digitizerx.space',
      password: 'admin123',
    });

    if (signUpError) {
      console.error('❌ Error creating user:', signUpError.message);
      setError('❌ ' + signUpError.message);
    } else {
      console.log('✅ User created in Supabase Auth.');
      setMessage('✅ User created successfully in Supabase Auth.');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">🧪 Create Supabase Auth User</h2>
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}
      <button
        onClick={createUser}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Create Test User
      </button>
    </div>
  );
};

export default CreateUser;
