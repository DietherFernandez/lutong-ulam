import { Search } from 'lucide-react';
import type { Category } from '../../types';

interface MenuFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  activeCategory: number | null;
  onCategoryChange: (id: number | null) => void;
  showOnlyAvailable: boolean;
  onAvailabilityChange: (v: boolean) => void;
  categories: Category[];
  categoriesLoading: boolean;
  totalCount: number;
  filteredCount: number;
}

export default function MenuFilters({
  search,
  onSearchChange,
  activeCategory,
  onCategoryChange,
  showOnlyAvailable,
  onAvailabilityChange,
  categories,
  categoriesLoading,
  totalCount,
  filteredCount,
}: MenuFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search & Toggle */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              transition-all text-gray-900 placeholder-gray-400"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showOnlyAvailable}
            onChange={(e) => onAvailabilityChange(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-checked:bg-primary-500 rounded-full transition-colors" />
          <div className="absolute w-5 h-5 bg-white rounded-full shadow left-0.5 top-[2px]
            peer-checked:translate-x-5 transition-transform" />
          <span className="text-sm font-medium text-gray-700">Available only</span>
        </label>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => onCategoryChange(null)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === null
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categoriesLoading ? (
          <span className="text-sm text-gray-400">Loading...</span>
        ) : (
          categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(activeCategory === cat.id ? null : cat.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))
        )}
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        Showing {filteredCount} of {totalCount} dishes
        {activeCategory && categories.find((c) => c.id === activeCategory)
          ? ` in "${categories.find((c) => c.id === activeCategory)?.name}"`
          : ''}
      </p>
    </div>
  );
}