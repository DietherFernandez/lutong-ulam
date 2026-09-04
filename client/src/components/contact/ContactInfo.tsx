import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import { formatTime } from '../../utils/format';
import { settingsApi, openingHoursApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings, OpeningHours } from '../../types';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function ContactInfo() {
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(() => settingsApi.getAll(), []);
  const { data: hoursData } = useFetch<{ hours: OpeningHours[] }>(() => openingHoursApi.getAll(), []);
  const settings = settingsData?.settings;
  const hours = hoursData?.hours || [];
  const hoursMap: Record<string, OpeningHours> = {};
  hours.forEach(h => { hoursMap[h.day] = h; });

  return (
    <div className="space-y-6">
      {/* Contact details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Details</h3>
        <div className="space-y-4">
          {settings?.address && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Address</p>
                <p className="text-sm font-medium text-gray-900">{settings.address}</p>
              </div>
            </div>
          )}
          {settings?.phone && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Phone size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Phone</p>
                <a href={`tel:${settings.phone}`} className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors">{settings.phone}</a>
              </div>
            </div>
          )}
          {settings?.email && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <Mail size={18} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-0.5">Email</p>
                <a href={`mailto:${settings.email}`} className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors">{settings.email}</a>
              </div>
            </div>
          )}
          {/* Social */}
          {(settings?.facebook_url || settings?.instagram_url) && (
            <div className="flex items-center gap-3 pt-2">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors">
                  <Facebook size={16} className="text-gray-600 hover:text-primary-600" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors">
                  <Instagram size={16} className="text-gray-600 hover:text-primary-600" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Opening hours */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-primary-600" />
          <h3 className="text-lg font-bold text-gray-900">Opening Hours</h3>
        </div>
        <div className="space-y-2">
          {DAYS.map((day) => {
            const h = hoursMap[day];
            const today = day === new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            return (
              <div key={day} className={`flex items-center justify-between py-2 ${today ? 'border-b border-gray-100' : 'border-b border-gray-50'}`}>
                <span className={`text-sm font-medium capitalize ${today ? 'text-primary-600' : 'text-gray-700'}`}>
                  {today ? `${day} (Today)` : day}
                </span>
                <span className={`text-sm ${h?.is_closed ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                  {h ? h.is_closed ? 'Closed' : `${formatTime(h.opening_time)} – ${formatTime(h.closing_time)}` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
