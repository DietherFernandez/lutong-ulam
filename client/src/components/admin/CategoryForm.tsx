interface Props {
  form: { name: string; description: string; sort_order: number };
  errors: Record<string, string>;
  onChange: (form: { name: string; description: string; sort_order: number }) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
  isEdit: boolean;
}

export default function CategoryForm({ form, errors, onChange, onSubmit, onCancel, saving, isEdit }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input type="text" value={form.name} onChange={(e) => onChange({ ...form, name: e.target.value })} className={`input-field ${errors.name ? 'border-red-500' : ''}`} placeholder="e.g. Appetizers" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea rows={2} value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="Brief description..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
        <input type="number" value={form.sort_order} onChange={(e) => onChange({ ...form, sort_order: Number(e.target.value) })} className="input-field" placeholder="0" />
        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first.</p>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t">
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
        <button onClick={onSubmit} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving...' : isEdit ? 'Save' : 'Create'}</button>
      </div>
    </div>
  );
}