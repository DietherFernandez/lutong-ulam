import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import { Star, Tag } from 'lucide-react';
import type { Dish } from '../../types';

interface DishCardProps {
  dish: Dish;
  showCategory?: boolean;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop';

export default function DishCard({ dish, showCategory = true }: DishCardProps) {
  const image = dish.image || FALLBACK_IMAGE;

  return (
    <Link
      to="/menu"
      className="card group flex flex-col h-full"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={dish.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        {dish.is_featured ? (
          <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
            <Star size={12} fill="currentColor" />
            Featured
          </div>
        ) : null}
        {!dish.is_available ? (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
              Unavailable
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
            {dish.name}
          </h3>
          <span className="text-primary-600 font-bold whitespace-nowrap">
            {formatPrice(dish.price)}
          </span>
        </div>

        {showCategory && dish.category_name && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Tag size={12} />
            <span>{dish.category_name}</span>
          </div>
        )}

        {dish.description && (
          <p className="text-sm text-gray-600 line-clamp-2 flex-1">
            {dish.description}
          </p>
        )}
      </div>
    </Link>
  );
}