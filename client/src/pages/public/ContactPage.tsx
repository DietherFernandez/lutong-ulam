import { MapPin, Phone, Mail } from 'lucide-react';
import { settingsApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import ContactInfo from '../../components/contact/ContactInfo';
import ContactForm from '../../components/contact/ContactForm';
import type { RestaurantSettings } from '../../types';

export default function ContactPage() {
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(() => settingsApi.getAll(), []);
  const settings = settingsData?.settings;

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <span className="inline-block text-sm font-bold text-primary-300 uppercase tracking-widest mb-3">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-primary-200 text-lg max-w-2xl">We'd love to hear from you. Reach out with questions, reservation requests, or just to say hello.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <ContactForm />
          </div>

          {/* Info + Map */}
          <div className="space-y-6">
            <ContactInfo />
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {settings?.address ? (
                <iframe
                  title="Restaurant Location"
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(settings.address)}&zoom=15`}
                />
              ) : (
                <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Add your address in settings to show the map</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick contact cards */}
        {(settings?.phone || settings?.email) && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {settings?.phone && (
              <a href={`tel:${settings.phone}`} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-colors">
                  <Phone size={22} className="text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Call Us</p>
                  <p className="font-bold text-gray-900">{settings.phone}</p>
                </div>
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-colors">
                  <Mail size={22} className="text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Us</p>
                  <p className="font-bold text-gray-900">{settings.email}</p>
                </div>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}