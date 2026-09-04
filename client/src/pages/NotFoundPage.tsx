import { Link } from 'react-router-dom';
import { ChefHat, Home, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4 max-w-lg">
        <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ChefHat size={48} className="text-primary-600" />
        </div>
        <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for seems to have wandered off the menu. Let's get you back to something delicious.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home size={18} /> Back to Home <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}