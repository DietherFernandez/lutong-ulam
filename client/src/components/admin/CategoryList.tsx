import { Pencil, Trash2 } from 'lucide-react';
import type { Category } from '../../types';

interface Props {
  categories: Category[];
  dishCountByCat: Record<number, number>;
  onEdit: (c: Category) => void;
  onDelete: (id: number) => void;
}

export default function CategoryList({ categories, dishCountByCat, onEdit, onDelete }: Props) {
  if (categories.length === 0) {
    return <div className="col-span-full bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">No categories yet.</div>;
  }

  return (
    <>
      {categories.map((cat) => {
        const cnt = dishCountByCat[cat.id] || cat.dish_count || 0;
        return (
          <div key={cat.id} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 truncate">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">Order: {cat.sort_order}</p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <button onClick={() => onEdit(cat)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600"><Pencil size={15} /></button>
                <button onClick={() => onDelete(cat.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600"><Trash2 size={15} /></button>
              </div>
            </div>
            {cat.description && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{cat.description}</p>}
            <div className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full w-fit">{cnt} dish{cnt === 1 ? '' : 'es'}</div>
          </div>
        );
      })}
    </>
  );
}