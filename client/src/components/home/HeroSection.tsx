import { Link } from 'react-router-dom';
import { ArrowRight, Utensils } from 'lucide-react';
import { homepageApi, settingsApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings, HomepageSection } from '../../types';

export default function HeroSection() {
  const { data: homepageData } = useFetch<{ sections: Record<string, HomepageSection> }>(
    () => homepageApi.getSections(), []
  );
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(
    () => settingsApi.getAll(), []
  );

  const settings = settingsData?.settings;
  const heroSection = homepageData?.sections?.hero;
  const restaurantName = settings?.restaurant_name || '';

  // Don't fall back to a hardcoded Unsplash image. Use only the admin-configured
  // image from the homepage `hero` section. If it's missing or disabled, the
  // section is rendered as a clean dark gradient — no "wrong image" flash.
  const isHeroEnabled = heroSection?.is_enabled !== false; // default to enabled
  const heroImage = isHeroEnabled && heroSection?.image ? heroSection.image : '';

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20 bg-gradient-to-b from-gray-900 to-gray-800"
      style={
        heroImage
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
          <Utensils size={16} className="text-primary-300" />
          <span className="text-sm text-white/90 font-medium">
            {settings?.tagline || 'Where Flavor Meets Passion'}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
          {heroSection?.title || (restaurantName ? `Welcome to ${restaurantName}` : 'Welcome')}
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {heroSection?.subtitle || settings?.description}
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-base font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          View Our Menu
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}