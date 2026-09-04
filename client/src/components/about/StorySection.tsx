import { settingsApi, homepageApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import { ImageSkeleton } from '../common/States';
import type { RestaurantSettings, HomepageSection } from '../../types';

/** Fallback image shown only after confirmed empty DB value (not on startup). */
const STORY_FALLBACK = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=500&fit=crop&q=80';

export default function StorySection() {
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(() => settingsApi.getAll(), []);
  const { data: homepageData, loading } = useFetch<{ sections: Record<string, HomepageSection> }>(() => homepageApi.getSections(), []);

  const name = settingsData?.settings?.restaurant_name || '';
  // Only show the DB image after confirmed load — no Unsplash flash on startup.
  const storyImage = homepageData?.sections?.about?.image || '';

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Phone: float layout (Word-style wrap). md+: 5/7 grid. */}
        <div className="md:grid md:grid-cols-12 md:gap-12 md:items-center">
          {/* Image — floats left on phone, 5/12 column on md+ */}
          <div className="float-left mr-4 mb-3 w-36 shrink-0 rounded-2xl overflow-hidden shadow-xl md:float-none md:mr-0 md:mb-0 md:w-auto md:col-span-5">
            {loading ? (
              <ImageSkeleton className="w-full h-44 md:h-72" />
            ) : storyImage ? (
              <img src={storyImage} alt="Our kitchen" className="w-full h-44 md:h-72 object-cover hover:scale-105 transition-transform duration-500" />
            ) : (
              // Show fallback only after confirmed empty value — not on initial load
              <img src={STORY_FALLBACK} alt="Our kitchen" className="w-full h-44 md:h-72 object-cover hover:scale-105 transition-transform duration-500" />
            )}
          </div>
          {/* Text — wraps beside image on phone, full 7/12 column on md+ */}
          <div className="md:col-span-7">
            <span className="inline-block text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">{settingsData?.settings?.about_story_title || 'A Passion for Great Food'}</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>Founded with a love for culinary excellence{name && `, ${name}`}, we have been a beloved gathering place for food lovers in our community for over a decade. What started as a simple dream to share incredible flavors has grown into a destination where every meal becomes a cherished memory.</p>
              <p>Our chefs bring together time-honored techniques and modern creativity, crafting dishes that honor tradition while embracing innovation. We source the finest local ingredients — from farm-fresh vegetables to premium cuts — because we believe great food starts with great ingredients.</p>
              <p>Whether you're celebrating a special occasion or enjoying a casual dinner, we invite you to pull up a chair and experience the warmth and flavor that keep our guests coming back time and time again.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}