const stats = [
  { num: '10+', label: 'Years of Service' },
  { num: '50+', label: 'Menu Items' },
  { num: '15K+', label: 'Happy Customers' },
  { num: '4.9', label: 'Average Rating' },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map(({ num, label }) => (
            <div key={label}>
              <div className="text-4xl md:text-5xl font-bold mb-2">{num}</div>
              <div className="text-white/70 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}