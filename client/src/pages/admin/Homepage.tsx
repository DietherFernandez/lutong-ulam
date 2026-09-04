import { useState } from 'react';
import { Save } from 'lucide-react';
import { homepageApi } from '../../api';
import { useFetch, broadcastRefresh } from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/errors';
import PageHeader from '../../components/admin/PageHeader';
import { Toast, useToast } from '../../components/admin/Toast';
import { LoadingSpinner } from '../../components/common/States';

const SECTIONS = [
  { key: 'hero', label: 'Hero Section', fields: ['title', 'subtitle', 'image', 'is_enabled'] },
  { key: 'about', label: 'About Section', fields: ['title', 'subtitle', 'image', 'is_enabled'] },
  { key: 'featured', label: 'Featured Dishes', fields: ['title', 'subtitle', 'is_enabled'] },
];

const FIELD_LABELS: Record<string, string> = {
  title: 'Title', subtitle: 'Subtitle', image: 'Image URL', is_enabled: 'Enabled',
};

export default function AdminHomepage() {
  const { data, loading, refetch } = useFetch<any>(() => homepageApi.getSections(), [], { autoRefresh: false });
  const { toast, show, hide } = useToast();
  const [editing, setEditing] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const sections = data?.sections || {};

  const getVal = (section: string, key: string) => {
    if (editing[section] && editing[section][key] !== undefined) return editing[section][key];
    return sections[section]?.[key] ?? '';
  };

  const setVal = (section: string, key: string, val: any) => {
    setEditing((prev) => ({ ...prev, [section]: { ...prev[section], [key]: val } }));
  };

  const hasChanges = (section: string) => !!editing[section];

  const handleSave = async (section: string) => {
    const changes = editing[section];
    if (!changes) return;
    setSaving(section);
    try {
      await homepageApi.updateSection(section, changes);
      show(`${SECTIONS.find(s => s.key === section)?.label || section} updated!`);
      setEditing((prev) => ({ ...prev, [section]: undefined }));
      refetch();
      broadcastRefresh();
    } catch (err) { show(getErrorMessage(err, 'Failed to save'), 'error'); }
    finally { setSaving(null); }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <PageHeader title="Homepage Sections" description="Edit content displayed on the public homepage" />
      <div className="space-y-6">
        {SECTIONS.map(({ key, label, fields }) => {
          const changed = hasChanges(key);
          return (
            <div key={key} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">{label}</h2>
                <button onClick={() => handleSave(key)} disabled={!changed || saving === key}
                  className={`btn-primary flex items-center gap-2 text-sm ${!changed ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <Save size={15} />{saving === key ? 'Saving...' : 'Save'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fields.map((f) => (
                  <div key={f} className={f === 'subtitle' ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{FIELD_LABELS[f] || f}</label>
                    {f === 'is_enabled' ? (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!getVal(key, f)} onChange={(e) => setVal(key, f, e.target.checked ? 1 : 0)}
                          className="w-4 h-4 text-primary-600 rounded" />
                        <span className="text-sm text-gray-700">Enabled</span>
                      </label>
                    ) : f === 'image' ? (
                      <div className="space-y-2">
                        <input className="input-field" value={getVal(key, f) || ''} onChange={(e) => setVal(key, f, e.target.value)} placeholder="https://..." />
                        {getVal(key, f) && <img src={getVal(key, f)} alt="" className="w-full max-h-32 object-cover rounded-lg bg-gray-100" />}
                      </div>
                    ) : (
                      <input className="input-field" value={getVal(key, f) || ''} onChange={(e) => setVal(key, f, e.target.value)} placeholder={FIELD_LABELS[f]} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}