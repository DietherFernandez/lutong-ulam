import { Link } from 'react-router-dom';
import { ArrowRight, ChefHat, Star, HeartHandshake, Utensils } from 'lucide-react';
import { homepageApi, settingsApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings, HomepageSection } from '../../types';

export default function AboutTeaser() {
  const { data: homepageData } = useFetch<{ sections: Record<string, HomepageSection> }>(
    () => homepageApi.getSections(), []
  );
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(
    () => settingsApi.getAll(), []
  );

  const settings = settingsData?.settings;
  const aboutSection = homepageData?.sections?.about;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="inline-block text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">
              Our Story
            </span>
            <h2 className="section-title mb-4">
              {aboutSection?.title || (settings?.restaurant_name ? `About ${settings.restaurant_name}` : 'About Us')}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {aboutSection?.subtitle || settings?.description}
            </p>
            <Link to="/about" className="btn-primary inline-flex items-center gap-2">
              Learn More About Us <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 text-center h-full flex flex-col justify-center min-h-[160px]">
              <ChefHat size={32} className="text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-lg mb-1">Expert Chefs</h3>
              <p className="text-sm text-gray-600">Award-winning culinary team</p>
            </div>
            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-6 text-center h-full flex flex-col justify-center min-h-[160px]">
              <Star size={32} className="text-accent-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-lg mb-1">5-Star Reviews</h3>
              <p className="text-sm text-gray-600">Loved by our community</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center h-full flex flex-col justify-center min-h-[160px]">
              <HeartHandshake size={32} className="text-gray-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-lg mb-1">Fresh Daily</h3>
              <p className="text-sm text-gray-600">Locally sourced ingredients</p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 text-center h-full flex flex-col justify-center min-h-[160px]">
              <Utensils size={32} className="text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 text-lg mb-1">10+ Years</h3>
              <p className="text-sm text-gray-600">Serving delicious meals</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}