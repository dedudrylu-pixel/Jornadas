import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type ProfileRow = {
  id: string;
  email: string;
  role: 'member' | 'admin';
  created_at: string;
};

export type AdminStatsRow = {
  total_users: number;
  total_admins: number;
};
