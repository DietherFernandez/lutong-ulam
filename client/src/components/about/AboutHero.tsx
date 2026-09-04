import { settingsApi, homepageApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings, HomepageSection } from '../../types';

export default function AboutHero() {
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(() => settingsApi.getAll(), []);
  const { data: homepageData } = useFetch<{ sections: Record<string, HomepageSection> }>(() => homepageApi.getSections(), []);
  const settings = settingsData?.settings;
  const aboutSection = homepageData?.sections?.about;

  return (
    <div className="relative pt-24 md:pt-28 pb-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1600&h=600&fit=crop&q=80')] bg-cover bg-center opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-sm font-bold text-primary-400 uppercase tracking-widest mb-4">Our Story</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
          {aboutSection?.title || `About ${settings?.restaurant_name || 'Savory Kitchen'}`}
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          {aboutSection?.subtitle || settings?.description || 'A journey of passion, flavor, and community.'}
        </p>
      </div>
    </div>
  );
}