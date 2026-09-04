import { Link } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { settingsApi, openingHoursApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings, OpeningHours } from '../../types';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

function formatDay(day: string) {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(
    () => settingsApi.getAll(), []
  );

  const { data: hoursData } = useFetch<{ hours: OpeningHours[] }>(
    () => openingHoursApi.getAll(), []
  );

  const settings = settingsData?.settings;
  const hours = hoursData?.hours || [];
  const hoursMap: Record<string, OpeningHours> = {};
  hours.forEach(h => { hoursMap[h.day] = h; });

  const displayHours = (day: string) => {
    const h = hoursMap[day];
    if (!h || h.is_closed) return 'Closed';
    return `${h.opening_time} - ${h.closing_time}`;
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-serif font-bold text-white mb-4">
              {settings?.restaurant_name || 'Savory Kitchen'}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {settings?.description || 'Experience the finest dining with fresh ingredients and exceptional service.'}
            </p>
            {(settings?.facebook_url || settings?.instagram_url) && (
              <div className="flex items-center gap-3">
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                    <Facebook size={16} />
                  </a>
                )}
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                    <Instagram size={16} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Menu', path: '/menu' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              {settings?.address && (
                <li className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-primary-400" />
                  <span className="text-gray-400">{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="shrink-0 text-primary-400" />
                  <a href={`tel:${settings.phone}`} className="text-gray-400 hover:text-white transition-colors">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="shrink-0 text-primary-400" />
                  <a href={`mailto:${settings.email}`} className="text-gray-400 hover:text-white transition-colors">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Opening Hours</h4>
            <ul className="space-y-2">
              {DAYS.map((day) => (
                <li key={day} className="flex items-center gap-2 text-sm">
                  <Clock size={14} className="shrink-0 text-primary-400" />
                  <span className="w-20 text-gray-500">{formatDay(day)}</span>
                  <span className="text-gray-400">{displayHours(day)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500">
            © {currentYear} {settings?.restaurant_name || 'Savory Kitchen'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}