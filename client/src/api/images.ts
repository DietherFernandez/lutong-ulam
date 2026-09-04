// Image upload + metadata via Supabase Storage + Database.
import { supabase, isSupabaseConfigured, BUCKETS } from '../lib/supabase';
import type { Image } from '../types';

function ensureConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Create a .env file with VITE_SUPABASE_URL ' +
      'and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
    );
  }
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 5 * 1024 * 1024;

function randomName(originalName: string) {
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const stamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `dishes/${stamp}-${rand}.${ext}`;
}

export const imagesApi = {
  async getAll(search?: string) {
    ensureConfig();
    let q = supabase.from('images').select('*').order('created_at', { ascending: false });
    if (search) q = q.ilike('original_name', `%${search}%`);
    const { data, error } = await q;
    if (error) throw error;
    return { images: (data ?? []) as Image[] };
  },

  async upload(file: File) {
    ensureConfig();
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type || 'unknown'}. Allowed: JPG, PNG, WEBP, GIF.`);
    }
    if (file.size > MAX_BYTES) {
      throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 5 MB.`);
    }
    const filePath = randomName(file.name);
    const { error: upErr } = await supabase.storage
      .from(BUCKETS.IMAGES)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage.from(BUCKETS.IMAGES).getPublicUrl(filePath);
    const publicUrl = pub.publicUrl;

    const { data, error } = await supabase
      .from('images')
      .insert({
        filename: filePath.split('/').pop() || filePath,
        original_name: file.name,
        file_path: filePath,
        public_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Image;
  },

  async delete(id: number) {
    ensureConfig();
    const { data: img, error: selErr } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();
    if (selErr && selErr.code !== 'PGRST116') throw selErr;
    if (img?.file_path) {
      await supabase.storage.from(BUCKETS.IMAGES).remove([img.file_path]);
    }
    const { error } = await supabase.from('images').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  },

  async getStats() {
    ensureConfig();
    const { count: total } = await supabase
      .from('images')
      .select('*', { count: 'exact', head: true });
    const { data: rows } = await supabase.from('images').select('file_size');
    const totalSize = (rows ?? []).reduce((s, r) => s + (r.file_size ?? 0), 0);
    return { total: total ?? 0, totalSize };
  },
};
