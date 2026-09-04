import { Link } from 'react-router-dom';
import { ArrowRight, Utensils } from 'lucide-react';
import { homepageApi, settingsApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings, HomepageSection } from '../../types';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=900&fit=crop&q=80';

export default function HeroSection() {
  const { data: homepageData } = useFetch<{ sections: Record<string, HomepageSection> }>(
    () => homepageApi.getSections(), []
  );
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(
    () => settingsApi.getAll(), []
  );

  const settings = settingsData?.settings;
  const heroSection = homepageData?.sections?.hero;
  const restaurantName = settings?.restaurant_name || 'Savory Kitchen';

  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-16 md:pt-20"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${heroSection?.image || HERO_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
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
          {heroSection?.title || `Welcome to ${restaurantName}`}
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          {heroSection?.subtitle || settings?.description ||
            'Experience the finest dining with fresh ingredients and exceptional service.'}
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