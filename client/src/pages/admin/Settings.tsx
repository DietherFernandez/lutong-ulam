import { useState } from 'react';
import { Image, Upload } from 'lucide-react';
import { settingsApi, imagesApi } from '../../api';
import { useFetch, broadcastRefresh } from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/errors';
import PageHeader from '../../components/admin/PageHeader';
import SettingsField from '../../components/admin/SettingsField';
import Modal from '../../components/admin/Modal';
import { Toast, useToast } from '../../components/admin/Toast';
import { LoadingSpinner } from '../../components/common/States';
import type { RestaurantSettings, Image as ImageType } from '../../types';

export default function AdminSettings() {
  const { data, loading, refetch } = useFetch<{ settings: RestaurantSettings }>(() => settingsApi.getAll(), [], { autoRefresh: false });
  const { data: imagesData } = useFetch<{ images: ImageType[] }>(() => imagesApi.getAll(), [], { autoRefresh: false });
  const { toast, show, hide } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const s = data?.settings as any || {};
  const merge = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));
  const val = (key: string) => form[key] ?? (s[key] ?? '');
  const logoUrl = val('logo_url') || s.logo_url || '';

  const handleSave = async () => {
    if (Object.keys(form).length === 0) { show('No changes to save', 'info'); return; }
    setSaving(true);
    try { await settingsApi.update(form); show('Settings saved!'); setForm({}); refetch(); broadcastRefresh(); }
    catch (err) { show(getErrorMessage(err, 'Failed to save'), 'error'); }
    finally { setSaving(false); }
  };

  const pickImage = (url: string) => {
    merge('logo_url', url);
    setImagePickerOpen(false);
  };

  if (loading) return <LoadingSpinner size="lg" />;


  return (
    <div>
      <PageHeader title="Settings" description="Manage your restaurant information" />
      <div className="space-y-6 max-w-3xl">

        {/* Logo */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Restaurant Logo</h2>
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo preview" className="w-24 h-24 object-contain rounded-xl border border-gray-200 bg-white" />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <Image size={32} className="text-white opacity-60" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <SettingsField
                label="Logo Image URL"
                value={logoUrl}
                onChange={(v) => merge('logo_url', v)}
                placeholder="https://... or paste a Supabase Storage URL"
              />
              <button
                onClick={() => setImagePickerOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                <Upload size={15} />
                Choose from Media Library
              </button>
              {logoUrl && (
                <button
                  onClick={() => merge('logo_url', '')}
                  className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Remove logo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Restaurant Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingsField label="Restaurant Name" value={val('restaurant_name')} onChange={(v) => merge('restaurant_name', v)} placeholder="La Maison Doree" />
            <SettingsField label="Tagline" value={val('tagline')} onChange={(v) => merge('tagline', v)} placeholder="A taste of France..." />
            <div className="sm:col-span-2"><SettingsField label="Description" value={val('description')} onChange={(v) => merge('description', v)} placeholder="Your restaurant's story..." multiline /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingsField label="Address" value={val('address')} onChange={(v) => merge('address', v)} placeholder="123 Main St" />
            <SettingsField label="Phone" value={val('phone')} onChange={(v) => merge('phone', v)} placeholder="+1 (555) 123-4567" />
            <SettingsField label="Email" value={val('email')} onChange={(v) => merge('email', v)} type="email" placeholder="hello@example.com" />
            <SettingsField label="Latitude" value={val('latitude')} onChange={(v) => merge('latitude', v)} placeholder="40.7128" />
            <SettingsField label="Longitude" value={val('longitude')} onChange={(v) => merge('longitude', v)} placeholder="-74.0060" />
            <div className="sm:col-span-2"><SettingsField label="Google Maps Embed URL" value={val('google_maps_url')} onChange={(v) => merge('google_maps_url', v)} placeholder="https://www.google.com/maps/embed?pb=..." /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Social Media</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SettingsField label="Facebook" value={val('facebook_url')} onChange={(v) => merge('facebook_url', v)} type="url" placeholder="https://facebook.com/..." />
            <SettingsField label="Instagram" value={val('instagram_url')} onChange={(v) => merge('instagram_url', v)} type="url" placeholder="https://instagram.com/..." />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-2">Website Text</h2>
          <p className="text-sm text-gray-500 mb-4">Customize the text shown across your website. Leave blank to use the default text.</p>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Featured Dishes Section (Homepage)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SettingsField label="Section Title" value={val('featured_section_title')} onChange={(v) => merge('featured_section_title', v)} placeholder="Featured Dishes" />
                <SettingsField label="Section Subtitle" value={val('featured_section_subtitle')} onChange={(v) => merge('featured_section_subtitle', v)} placeholder="Handcrafted dishes made with the finest, locally-sourced ingredients" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Menu Page</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SettingsField label="Page Title" value={val('menu_page_title')} onChange={(v) => merge('menu_page_title', v)} placeholder="Discover Our Dishes" />
                <SettingsField label="Page Subtitle" value={val('menu_page_subtitle')} onChange={(v) => merge('menu_page_subtitle', v)} placeholder="From appetizers to desserts..." />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Contact Page</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SettingsField label="Page Title" value={val('contact_page_title')} onChange={(v) => merge('contact_page_title', v)} placeholder="Contact Us" />
                <SettingsField label="Page Subtitle" value={val('contact_page_subtitle')} onChange={(v) => merge('contact_page_subtitle', v)} placeholder="We'd love to hear from you..." />
                <div className="sm:col-span-2"><SettingsField label="Form Heading" value={val('contact_form_title')} onChange={(v) => merge('contact_form_title', v)} placeholder="Send us a Message" /></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">About Page</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SettingsField label="Story Section Title" value={val('about_story_title')} onChange={(v) => merge('about_story_title', v)} placeholder="A Passion for Great Food" />
                <SettingsField label="Chef Section Title" value={val('about_chef_title')} onChange={(v) => merge('about_chef_title', v)} placeholder="Our Head Chef" />
                <SettingsField label="Values Section Title" value={val('about_values_title')} onChange={(v) => merge('about_values_title', v)} placeholder="Our Core Values" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-2">Contact Messages</h2>
          <p className="text-sm text-gray-500 mb-4">Auto-cleanup prevents the device/database from filling up with old messages.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Retention Period</label>
            <select
              value={val('message_retention_days') || '90'}
              onChange={(e) => merge('message_retention_days', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="0">Never (manual cleanup only)</option>
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days (recommended)</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">Old messages are automatically deleted when new ones arrive. You can always delete messages manually from the Messages page.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving...' : 'Save All Settings'}</button>
        </div>
      </div>

      <Modal open={imagePickerOpen} onClose={() => setImagePickerOpen(false)} title="Choose Logo Image" maxWidth="lg">
        <p className="text-sm text-gray-500 mb-4">Select an image from your Media Library to use as the logo.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto mb-4">
          {(imagesData?.images || []).map((img) => (
            <button
              key={img.id}
              onClick={() => pickImage(img.public_url || img.file_path)}
              className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-500 transition-all bg-gray-50"
            >
              <img src={img.public_url || img.file_path} alt={img.filename} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        {(!imagesData?.images || imagesData.images.length === 0) && (
          <p className="text-center text-gray-400 py-8 text-sm">No images in Media Library. Upload images first.</p>
        )}
        <div className="flex justify-end pt-3 border-t">
          <button onClick={() => setImagePickerOpen(false)} className="btn-secondary">Cancel</button>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}
