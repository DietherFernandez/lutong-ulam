import { Award, Users, Leaf, Heart } from 'lucide-react';

const values = [
  { icon: Leaf, title: 'Fresh & Local', desc: 'We partner with local farms to bring you the freshest seasonal ingredients every single day.' },
  { icon: Heart, title: 'Made with Love', desc: 'Every dish is crafted with care, passion, and an unwavering commitment to quality.' },
  { icon: Users, title: 'Community First', desc: 'We are proud to be a gathering place for friends, families, and neighbors in our community.' },
  { icon: Award, title: 'Excellence Always', desc: 'From kitchen to table, we uphold the highest standards in everything we do.' },
];

export default function ValuesSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">What We Stand For</span>
          <h2 className="section-title">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon size={24} className="text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}