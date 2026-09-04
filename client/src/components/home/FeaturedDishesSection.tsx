import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import { dishesApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import DishCard from '../common/DishCard';
import { LoadingSpinner } from '../common/States';
import type { Dish } from '../../types';

export default function FeaturedDishesSection() {
  const { data, loading } = useFetch<{ dishes: Dish[] }>(
    () => dishesApi.getFeatured(), []
  );

  const dishes = data?.dishes || [];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-sm font-bold text-primary-600 uppercase tracking-widest mb-3">
            Chef's Selection
          </span>
          <h2 className="section-title">Featured Dishes</h2>
          <p className="section-subtitle">
            Handcrafted dishes made with the finest, locally-sourced ingredients
          </p>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : dishes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Featured dishes coming soon!</h3>
            <p className="text-gray-500 mb-6">Check back soon or browse our full menu.</p>
            <Link to="/menu" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Browse Full Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}