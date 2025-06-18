import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  throw new Error('Supabase configuration is incomplete. Please check your environment variables.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  console.error('Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format. Please check your VITE_SUPABASE_URL environment variable.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Test the connection with better error handling
supabase.from('faq').select('count', { count: 'exact', head: true }).then(({ error }) => {
  if (error) {
    console.error('Supabase connection test failed:', error);
    console.error('Please verify your Supabase project is active and your credentials are correct');
  } else {
    console.log('Supabase connection successful');
  }
}).catch((networkError) => {
  console.error('Network error during Supabase connection test:', networkError);
  console.error('This might indicate a network connectivity issue or incorrect Supabase URL');
});