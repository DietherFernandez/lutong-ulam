import { dishesApi, settingsApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import DishCard from '../../components/common/DishCard';
import { LoadingSpinner, EmptyState } from '../../components/common/States';
import type { Dish, RestaurantSettings } from '../../types';

export default function MenuPage() {
  const { data, loading, error, refetch } = useFetch<{ dishes: Dish[] }>(
    () => dishesApi.getAll(),
    []
  );
  const { data: settingsData } = useFetch<{ settings: RestaurantSettings }>(
    () => settingsApi.getAll(), []
  );

  const dishes = data?.dishes || [];
  const title = settingsData?.settings?.menu_page_title || 'Discover Our Dishes';
  const subtitle = settingsData?.settings?.menu_page_subtitle || 'From appetizers to desserts, every dish is crafted with passion using the freshest ingredients.';

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-900 text-white pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 text-center">
          <span className="inline-block text-sm font-bold text-primary-300 uppercase tracking-widest mb-3">
            Our Menu
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {title}
          </h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {!loading && (
          <p className="text-sm text-gray-500 mb-6 text-center">
            Showing {dishes.length} {dishes.length === 1 ? 'dish' : 'dishes'}
          </p>
        )}

        {loading ? (
          <LoadingSpinner size="lg" />
        ) : error ? (
          <EmptyState
            title="Failed to load menu"
            description={error}
            action={{ label: 'Try Again', onClick: refetch }}
          />
        ) : dishes.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No dishes yet
            </h3>
            <p className="text-gray-500">
              Check back soon — our menu is coming soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} showCategory />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}