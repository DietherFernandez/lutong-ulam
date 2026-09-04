import { Pencil, Trash2, Star } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import type { Dish } from '../../types';

interface Props {
  dishes: Dish[];
  search: string;
  onEdit: (dish: Dish) => void;
  onDelete: (id: number) => void;
}

export default function DishTable({ dishes, search, onEdit, onDelete }: Props) {
  const filtered = dishes.filter((d) =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {search ? 'No dishes match your search.' : 'No dishes yet. Add your first dish!'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {['Image', 'Name', 'Category', 'Price', 'Featured', 'Available', 'Actions'].map((h) => (
              <th key={h} className={`text-left px-4 py-3 font-semibold text-gray-700 ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((dish) => (
            <tr key={dish.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                  {dish.image ? <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">—</div>}
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{dish.name}</td>
              <td className="px-4 py-3 text-gray-600">{dish.category_name || '—'}</td>
              <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(dish.price)}</td>
              <td className="px-4 py-3">
                {dish.is_featured ? <Star size={16} className="text-yellow-500 fill-yellow-500" /> : <span className="text-gray-300">—</span>}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${dish.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {dish.is_available ? 'Available' : 'Off'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={() => onEdit(dish)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600 transition-colors"><Pencil size={15} /></button>
                  <button onClick={() => onDelete(dish.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}