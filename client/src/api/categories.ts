// Categories CRUD via Supabase.
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Category } from '../types';

function ensureConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Create a .env file with VITE_SUPABASE_URL ' +
      'and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
    );
  }
}

export const categoriesApi = {
  async getAll() {
    ensureConfig();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, description, sort_order, created_at')
      .order('sort_order', { ascending: true });
    if (error) throw error;

    // Fetch dish counts separately (the count() trick with join doesn't always work in all Supabase versions).
    const cats: Category[] = data ?? [];
    await Promise.all(cats.map(async (c, i) => {
      const { count } = await supabase
        .from('dishes')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', c.id);
      cats[i] = { ...cats[i], dish_count: count ?? 0 };
    }));

    return { categories: cats };
  },

  async create(category: Partial<Category>) {
    ensureConfig();
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: category.name ?? '',
        description: category.description ?? '',
        sort_order: category.sort_order ?? 0,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Category;
  },

  async update(id: number, category: Partial<Category>) {
    ensureConfig();
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: category.name ?? '',
        description: category.description ?? '',
        sort_order: category.sort_order ?? 0,
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Category;
  },

  async delete(id: number, force = false) {
    ensureConfig();
    if (force) {
      await supabase.from('dishes').update({ category_id: null }).eq('category_id', id);
    }
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },
};
