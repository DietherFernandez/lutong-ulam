// Auth API using Supabase Auth (email/password).
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { User } from '../types';

function ensureConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Create a .env file with VITE_SUPABASE_URL ' +
      'and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
    );
  }
}

export const authApi = {
  async login(email: string, password: string) {
    ensureConfig();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('No user returned from Supabase');
    return {
      user: {
        id: data.user.id,
        email: data.user.email ?? '',
        username: (data.user.email ?? '').split('@')[0],
        role: 'admin',
      } as User,
      session: data.session,
    };
  },

  async logout() {
    ensureConfig();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async me(): Promise<User | null> {
    ensureConfig();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;
    return {
      id: data.user.id,
      email: data.user.email ?? '',
      username: (data.user.email ?? '').split('@')[0],
      role: 'admin',
    } as User;
  },
};
