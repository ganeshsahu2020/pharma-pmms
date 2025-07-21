// utils/UserService.js
import { supabase } from './supabaseClient';

/**
 * Creates a user in Supabase Auth and inserts additional profile data in user_management.
 * @param {Object} userDetails
 * @param {string} userDetails.email
 * @param {string} userDetails.password
 * @param {string} userDetails.employee_id
 * @param {string} userDetails.first_name
 * @param {string} userDetails.last_name
 * @param {string} userDetails.phone_no
 * @param {Array} userDetails.role - Array of roles
 * @param {string} userDetails.plantid - UUID
 */
export const createUserAndInsertToUserManagement = async (userDetails) => {
  const { email, password, employee_id, first_name, last_name, phone_no, role, plantid } = userDetails;

  // Step 1: Create user in Supabase Auth
  const { data: authUser, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error('🔴 Supabase Auth signup error:', authError.message);
    throw new Error(authError.message);
  }

  const userId = authUser?.user?.id;

  // Step 2: Insert user profile into user_management
  const { error: dbError } = await supabase.from('user_management').insert([
    {
      uuid: userId,
      plantid,
      employee_id,
      first_name,
      last_name,
      email,
      phone_no,
      role,
      reset_password: true, // Force change on first login
      status: 'Active',
    },
  ]);

  if (dbError) {
    console.error('🔴 Insert to user_management failed:', dbError.message);
    throw new Error(dbError.message);
  }

  console.log('✅ User created in auth and user_management.');
  return { userId, email };
};
