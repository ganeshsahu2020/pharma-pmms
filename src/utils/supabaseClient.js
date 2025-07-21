// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hwaqhomwwsltvgyjyqfq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YXFob213d3NsdHZneWp5cWZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk1MzA2OSwiZXhwIjoyMDY4NTI5MDY5fQ.0GbsLZsDD29WryA49fnl5kRA9DL18AR2n49H_l4Uvug';

export const supabase = createClient(supabaseUrl, supabaseKey);
