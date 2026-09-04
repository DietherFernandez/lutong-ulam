// Contact messages API
import { supabase, isSupabaseConfigured } from '../lib/supabase';

function ensureConfig() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Create a .env file with VITE_SUPABASE_URL ' +
      'and VITE_SUPABASE_ANON_KEY, then restart the dev server.'
    );
  }
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const messagesApi = {
  // Submit a new message (public)
  async submit(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
    ensureConfig();
    const { data: result, error } = await supabase
      .from('contact_messages')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
      }])
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Get all messages (admin)
  async getAll() {
    ensureConfig();
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { messages: data as ContactMessage[] };
  },

  // Get unread count
  async getUnreadCount() {
    ensureConfig();
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
    if (error) throw error;
    return { count: count ?? 0 };
  },

  // Mark message as read
  async markAsRead(id: number) {
    ensureConfig();
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);
    if (error) throw error;
  },

  // Mark as unread
  async markAsUnread(id: number) {
    ensureConfig();
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: false })
      .eq('id', id);
    if (error) throw error;
  },

  // Delete single message
  async delete(id: number) {
    ensureConfig();
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Bulk delete messages
  async bulkDelete(ids: number[]) {
    ensureConfig();
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .in('id', ids);
    if (error) throw error;
  },

  // Mark all as read
  async markAllAsRead() {
    ensureConfig();
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('is_read', false);
    if (error) throw error;
  },
};