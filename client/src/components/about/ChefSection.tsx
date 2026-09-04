import { Star, Clock } from 'lucide-react';
import { settingsApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import type { RestaurantSettings } from '../../types';

const CHEF_IMG = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=700&fit=crop&q=80';

export default function ChefSection() {
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(() => settingsApi.getAll(), []);
  const title = settingsData?.settings?.about_chef_title || 'Our Head Chef';

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Phone: image stacked above text. md+: small floated image right with text wrapping beside (Word Square wrap). */}
        <div>
          {/* Image — stacked on phone, floats right at ~160px on md+ */}
          <div className="mb-4 w-full md:float-right md:ml-6 md:mb-3 md:w-40 md:shrink-0 rounded-2xl overflow-hidden shadow-xl">
            <img src={CHEF_IMG} alt="Chef Marcus" className="w-full h-48 md:h-auto object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          {/* Text — wraps beside floated image on md+, full width below */}
          <div>
            <span className="inline-block text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Meet the Team</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">{title}</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed mb-6">
              <p>Chef Marcus Rivera brings over 20 years of culinary expertise to our kitchen. Trained at the Culinary Institute of America and having worked in Michelin-starred kitchens across Europe, he returned home with a vision: to create food that nourishes both body and soul.</p>
              <p>"I believe food is a language that speaks directly to the heart," says Marcus. "Every plate we serve is an opportunity to create a moment of joy for our guests. That's what drives me every single day."</p>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-900">4.9</span>
                <span className="text-gray-500 text-sm">Avg. Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary-600" />
                <span className="font-bold text-gray-900">20+</span>
                <span className="text-gray-500 text-sm">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}