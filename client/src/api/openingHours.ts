// Opening hours via Supabase.
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { OpeningHours } from '../types';

function ensureConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Create a .env file with VITE_SUPABASE_URL ' +
      'and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
    );
  }
}

export const openingHoursApi = {
  async getAll() {
    ensureConfig();
    const { data, error } = await supabase
      .from('opening_hours')
      .select('*')
      .order('id', { ascending: true });
    if (error) throw error;
    const hours: OpeningHours[] = (data ?? []).map((h: any) => ({
      ...h,
      is_closed: Boolean(h.is_closed),
    }));
    return { hours };
  },

  async update(hours: OpeningHours[]) {
    ensureConfig();
    const rows = hours.map((h) => ({
      day: h.day,
      opening_time: h.opening_time || null,
      closing_time: h.closing_time || null,
      is_closed: Boolean(h.is_closed),
    }));
    const { error } = await supabase
      .from('opening_hours')
      .upsert(rows, { onConflict: 'day' });
    if (error) throw error;
    return { success: true };
  },
};
