// Dishes CRUD via Supabase.
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Dish } from '../types';

function ensureConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Create a .env file with VITE_SUPABASE_URL ' +
      'and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
    );
  }
}

function normalize(d: any): Dish {
  return {
    ...d,
    category_name: d.category?.name ?? null,
    is_available: Boolean(d.is_available),
    is_featured:  Boolean(d.is_featured),
  };
}

export const dishesApi = {
  async getAll() {
    ensureConfig();
    const { data, error } = await supabase
      .from('dishes')
      .select('*, category:categories(name)')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { dishes: (data ?? []).map(normalize) };
  },

  async getFeatured() {
    ensureConfig();
    const { data, error } = await supabase
      .from('dishes')
      .select('*, category:categories(name)')
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { dishes: (data ?? []).map(normalize) };
  },

  async getOne(id: number) {
    ensureConfig();
    const { data, error } = await supabase
      .from('dishes')
      .select('*, category:categories(name)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return normalize(data);
  },

  async create(dish: Partial<Dish>) {
    ensureConfig();
    const payload = {
      name: dish.name,
      description: dish.description ?? '',
      price: Number(dish.price),
      category_id: dish.category_id || null,
      image: dish.image || null,
      is_available: Boolean(dish.is_available ?? true),
      is_featured:  Boolean(dish.is_featured ?? false),
    };
    const { data, error } = await supabase
      .from('dishes')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: number, dish: Partial<Dish>) {
    ensureConfig();
    const payload: any = { ...dish };
    if ('price' in payload)        payload.price        = Number(payload.price);
    if ('is_available' in payload) payload.is_available = Boolean(payload.is_available);
    if ('is_featured' in payload)  payload.is_featured  = Boolean(payload.is_featured);
    if ('category_id' in payload)  payload.category_id  = payload.category_id || null;
    if ('image' in payload)        payload.image        = payload.image || null;
    delete payload.id;
    delete payload.created_at;
    delete payload.updated_at;
    delete payload.category;
    const { data, error } = await supabase
      .from('dishes')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id: number) {
    ensureConfig();
    const { error } = await supabase.from('dishes').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  // Back-compat alias used by some admin pages.
  async delete(id: number) {
    return this.remove(id);
  },

  async getStats() {
    ensureConfig();
    const [{ count: total }, { count: available }, { count: featured }] = await Promise.all([
      supabase.from('dishes').select('*', { count: 'exact', head: true }),
      supabase.from('dishes').select('*', { count: 'exact', head: true }).eq('is_available', true),
      supabase.from('dishes').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    ]);
    return { total: total ?? 0, available: available ?? 0, featured: featured ?? 0 };
  },
};
