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
