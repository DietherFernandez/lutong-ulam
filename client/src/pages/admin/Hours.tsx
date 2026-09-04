import { useState } from 'react';
import { openingHoursApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/errors';
import PageHeader from '../../components/admin/PageHeader';
import { Toast, useToast } from '../../components/admin/Toast';
import { LoadingSpinner } from '../../components/common/States';
import type { OpeningHours } from '../../types';

const DAYS = [
  { key: 'monday', label: 'Monday' }, { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' }, { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' }, { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const DEFAULT_DAY: OpeningHours = { id: 0, day: '', opening_time: '09:00', closing_time: '22:00', is_closed: false };

export default function AdminHours() {
  const { data, loading, refetch } = useFetch<{ hours: OpeningHours[] }>(() => openingHoursApi.getAll(), []);
  const { toast, show, hide } = useToast();
  const [hours, setHours] = useState<OpeningHours[]>([]);
  const [saving, setSaving] = useState(false);

  const existing = data?.hours || [];

  const getDay = (key: string): OpeningHours => {
    return hours.find((h) => h.day === key) || existing.find((h) => h.day === key) || { ...DEFAULT_DAY, day: key };
  };

  const update = (key: string, field: keyof OpeningHours, value: any) => {
    const cur = getDay(key);
    const updated = { ...cur, [field]: value };
    setHours((arr) => {
      const without = arr.filter((h) => h.day !== key);
      return [...without, updated];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = DAYS.map((d) => getDay(d.key));
      await openingHoursApi.update(payload);
      show('Opening hours saved!');
      setHours([]);
      refetch();
    } catch (err) { show(getErrorMessage(err, 'Failed to save'), 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <PageHeader title="Opening Hours" description="Set the weekly schedule" action={<button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving...' : 'Save Hours'}</button>} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {DAYS.map((d) => {
            const day = getDay(d.key);
            return (
              <div key={d.key} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="sm:w-32 shrink-0">
                  <p className="font-semibold text-gray-900">{d.label}</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={!day.is_closed} onChange={(e) => update(d.key, 'is_closed', !e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
                  <span className="text-sm text-gray-700">Open</span>
                </label>
                {day.is_closed ? (
                  <span className="text-sm text-red-600 font-medium">Closed all day</span>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <input type="time" value={day.opening_time || '09:00'} onChange={(e) => update(d.key, 'opening_time', e.target.value)} className="input-field max-w-[140px]" />
                    <span className="text-gray-500">–</span>
                    <input type="time" value={day.closing_time || '22:00'} onChange={(e) => update(d.key, 'closing_time', e.target.value)} className="input-field max-w-[140px]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}