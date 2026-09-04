// Homepage sections via Supabase.
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { HomepageSection } from '../types';

function ensureConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Create a .env file with VITE_SUPABASE_URL ' +
      'and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
    );
  }
}

export const homepageApi = {
  async getSections() {
    ensureConfig();
    const { data, error } = await supabase.from('homepage_sections').select('*');
    if (error) throw error;
    const sections: Record<string, HomepageSection> = {};
    (data ?? []).forEach((s: any) => {
      sections[s.section_key] = {
        ...s,
        is_enabled: Boolean(s.is_enabled),
      } as HomepageSection;
    });
    return { sections };
  },

  async updateSection(section: string, updates: Partial<HomepageSection>) {
    ensureConfig();
    const payload: any = { ...updates };
    if ('is_enabled' in payload) payload.is_enabled = Boolean(payload.is_enabled);
    delete payload.id;
    const { data, error } = await supabase
      .from('homepage_sections')
      .upsert({ section_key: section, ...payload }, { onConflict: 'section_key' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
