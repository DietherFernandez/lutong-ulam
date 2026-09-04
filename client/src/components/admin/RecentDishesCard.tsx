import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import { ArrowRight, TrendingUp } from 'lucide-react';
import type { Dish } from '../../types';

export default function RecentDishesCard({ dishes }: { dishes: Dish[] }) {
  const recent = [...dishes].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary-600" /> Recent Dishes
        </h3>
        <Link to="/admin/dishes" className="text-sm text-primary-600 hover:text-primary-700">View all →</Link>
      </div>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-500 py-4 text-center">
          No dishes yet.{' '}
          <Link to="/admin/dishes" className="text-primary-600 hover:underline">Add one</Link>
        </p>
      ) : (
        <div className="space-y-1">
          {recent.map((dish) => (
            <div key={dish.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0">
                {dish.image && <img src={dish.image} alt="" className="w-full h-full object-cover rounded-lg" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{dish.name}</p>
                <p className="text-xs text-gray-500">{dish.category_name || 'Uncategorized'} · {formatPrice(dish.price)}</p>
              </div>
              {dish.is_featured ? (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">Featured</span>
              ) : !dish.is_available ? (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">Off</span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}