import { MapPin, Phone, Clock } from 'lucide-react';
import { formatTime } from '../../utils/format';
import { settingsApi, openingHoursApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings, OpeningHours } from '../../types';

export default function InfoBar() {
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(
    () => settingsApi.getAll(), []
  );
  const { data: hoursData } = useFetch<{ hours: OpeningHours[] }>(
    () => openingHoursApi.getAll(), []
  );

  const settings = settingsData?.settings;
  const todayHours = hoursData?.hours?.find(
    (h) => h.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  );

  return (
    <section className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {settings?.address && (
            <div className="flex items-center gap-3 py-5 px-4 sm:px-6">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-primary-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Location</p>
                <p className="text-sm font-medium text-gray-900 truncate">{settings.address}</p>
              </div>
            </div>
          )}
          {settings?.phone && (
            <div className="flex items-center gap-3 py-5 px-4 sm:px-6">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                <Phone size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Call Us</p>
                <p className="text-sm font-medium text-gray-900">{settings.phone}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 py-5 px-4 sm:px-6">
            <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
              <Clock size={18} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Today's Hours</p>
              <p className="text-sm font-medium text-gray-900">
                {todayHours
                  ? todayHours.is_closed
                    ? 'Closed Today'
                    : `${formatTime(todayHours.opening_time)} – ${formatTime(todayHours.closing_time)}`
                  : 'Check schedule'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
