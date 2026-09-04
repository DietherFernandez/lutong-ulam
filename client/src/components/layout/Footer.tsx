import { Facebook, Instagram } from 'lucide-react';
import { settingsApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings } from '../../types';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(
    () => settingsApi.getAll(), []
  );

  const settings = settingsData?.settings;

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {/* Description */}
          {settings?.description && (
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {settings.description}
            </p>
          )}

          {/* Social Links */}
          {(settings?.facebook_url || settings?.instagram_url) && (
            <div className="flex items-center gap-3 mb-6">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"
                  aria-label="Facebook">
                  <Facebook size={16} />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"
                  aria-label="Instagram">
                  <Instagram size={16} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-500">
            &copy; {currentYear}{settings?.restaurant_name ? ` ${settings.restaurant_name}` : ''}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}