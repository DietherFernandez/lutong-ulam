import { settingsApi, homepageApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings, HomepageSection } from '../../types';

export default function AboutHero() {
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(() => settingsApi.getAll(), []);
  const { data: homepageData } = useFetch<{ sections: Record<string, HomepageSection> }>(() => homepageApi.getSections(), []);
  const settings = settingsData?.settings;
  const aboutSection = homepageData?.sections?.about;

  // Use the admin-configured about section image only — no hardcoded Unsplash fallback.
  // This prevents the "wrong image flash" on startup.
  const aboutBgImage = aboutSection?.image || '';

  return (
    <div
      className="relative pt-24 md:pt-28 pb-20 text-white overflow-hidden"
      style={
        aboutBgImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${aboutBgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { background: 'linear-gradient(to bottom right, #111827, #1f2937)' }
      }
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-sm font-bold text-primary-400 uppercase tracking-widest mb-4">Our Story</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
          {aboutSection?.title || (settings?.restaurant_name ? `About ${settings.restaurant_name}` : 'About Us')}
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          {aboutSection?.subtitle || settings?.description}
        </p>
      </div>
    </div>
  );
}