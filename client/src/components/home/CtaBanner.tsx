import { Link } from 'react-router-dom';

export default function CtaBanner() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
          Ready for an Unforgettable Dining Experience?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Book your table today and let us create a memorable culinary journey for you and your guests.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/contact"
            className="bg-white text-primary-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Make a Reservation
          </Link>
          <Link
            to="/menu"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-colors"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    </section>
  );
}