import { Star, Clock } from 'lucide-react';

const CHEF_IMG = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=700&fit=crop&q=80';

export default function ChefSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="inline-block text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">Meet the Team</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Our Head Chef</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed mb-6">
              <p>Chef Marcus Rivera brings over 20 years of culinary expertise to our kitchen. Trained at the Culinary Institute of America and having worked in Michelin-starred kitchens across Europe, he returned home with a vision: to create food that nourishes both body and soul.</p>
              <p>"I believe food is a language that speaks directly to the heart," says Marcus. "Every plate we serve is an opportunity to create a moment of joy for our guests. That's what drives me every single day."</p>
            </div>
            <div className="flex items-center gap-6">
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
          <div className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-xl">
            <img src={CHEF_IMG} alt="Chef Marcus" className="w-full h-96 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}