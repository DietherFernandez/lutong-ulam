import { useState } from 'react';
import { imagesApi } from '../../api';
import type { Category, Image } from '../../types';

interface DishFormData {
  name: string;
  description: string;
  price: string;
  category_id: number | '';
  image: string;
  is_available: boolean;
  is_featured: boolean;
}

interface Props {
  initial: DishFormData;
  categories: Category[];
  images: Image[];
  errors: Record<string, string>;
  onChange: (data: DishFormData) => void;
}

export default function DishForm({ initial, categories, images, errors, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = await imagesApi.upload(file);
      const url = (result as any).public_url || (result as any).file_path || '';
      onChange({ ...initial, image: url });
    } catch {
      // silent fail
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dish Name *</label>
        <input type="text" value={initial.name} onChange={(e) => onChange({ ...initial, name: e.target.value })} className={`input-field ${errors.name ? 'border-red-500' : ''}`} placeholder="e.g. Grilled Salmon" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea rows={3} value={initial.description} onChange={(e) => onChange({ ...initial, description: e.target.value })} className="input-field resize-none" placeholder="A brief description..." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
          <input type="number" step="0.01" min="0" value={initial.price} onChange={(e) => onChange({ ...initial, price: e.target.value })} className={`input-field ${errors.price ? 'border-red-500' : ''}`} placeholder="0.00" />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select value={initial.category_id} onChange={(e) => onChange({ ...initial, category_id: e.target.value ? Number(e.target.value) : '' })} className="input-field">
            <option value="">No category</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input type="text" value={initial.image} onChange={(e) => onChange({ ...initial, image: e.target.value })} className="input-field" placeholder="https://..." />
        {images.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Pick from uploaded:</p>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {images.slice(0, 20).map((img) => (
                <button key={img.id} type="button" onClick={() => onChange({ ...initial, image: img.file_path })} className={`w-10 h-10 rounded overflow-hidden border-2 transition-all ${initial.image === img.file_path ? 'border-primary-500' : 'border-transparent hover:border-gray-300'}`}>
                  <img src={img.file_path} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
        <label className="mt-2 flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
          {uploading ? 'Uploading...' : '📁 Upload new image'}
        </label>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={initial.is_available} onChange={(e) => onChange({ ...initial, is_available: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
          <span className="text-sm font-medium text-gray-700">Available</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={initial.is_featured} onChange={(e) => onChange({ ...initial, is_featured: e.target.checked })} className="w-4 h-4 text-primary-600 rounded" />
          <span className="text-sm font-medium text-gray-700">Featured</span>
        </label>
      </div>
    </div>
  );
}