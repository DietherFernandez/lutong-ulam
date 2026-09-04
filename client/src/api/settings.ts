// Restaurant settings (key/value) via Supabase.
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { RestaurantSettings } from '../types';

function ensureConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Create a .env file with VITE_SUPABASE_URL ' +
      'and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
    );
  }
}

export const settingsApi = {
  async getAll() {
    ensureConfig();
    const { data, error } = await supabase.from('restaurant_settings').select('*');
    if (error) throw error;
    const settings: RestaurantSettings = {};
    (data ?? []).forEach((row: any) => { (settings as Record<string, string>)[row.setting_key] = row.setting_value; });
    return { settings };
  },

  async update(settings: Partial<RestaurantSettings>) {
    ensureConfig();
    const rows = Object.entries(settings as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => ({
        setting_key: k,
        setting_value: v == null ? '' : String(v),
      }));
    if (rows.length === 0) return { settings };
    const { error } = await supabase
      .from('restaurant_settings')
      .upsert(rows, { onConflict: 'setting_key' });
    if (error) throw error;
    return { settings };
  },
};
