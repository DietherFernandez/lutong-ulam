export default function MenuHeader() {
  return (
    <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <span className="inline-block text-sm font-bold text-primary-300 uppercase tracking-widest mb-3">
          Our Menu
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Discover Our Dishes</h1>
        <p className="text-primary-200 text-lg max-w-2xl">
          From appetizers to desserts, every dish is crafted with passion using the freshest ingredients.
        </p>
      </div>
    </div>
  );
}