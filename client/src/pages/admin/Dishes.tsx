import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { dishesApi, categoriesApi, imagesApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/errors';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import DishTable from '../../components/admin/DishTable';
import DishForm from '../../components/admin/DishForm';
import { Toast, useToast } from '../../components/admin/Toast';
import { LoadingSpinner } from '../../components/common/States';
import type { Dish, Category, Image } from '../../types';

const EMPTY = { name: '', description: '', price: '', category_id: '' as number | '', image: '', is_available: true, is_featured: false };

export default function AdminDishes() {
  const { data, loading, refetch } = useFetch<{ dishes: Dish[] }>(() => dishesApi.getAll(), []);
  const { data: cd } = useFetch<{ categories: Category[] }>(() => categoriesApi.getAll(), []);
  const { data: id } = useFetch<{ images: Image[] }>(() => imagesApi.getAll(), []);
  const { toast, show, hide } = useToast();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dishes = data?.dishes || [];
  const categories = cd?.categories || [];
  const images = id?.images || [];

  const openCreate = () => { setEditId(null); setForm(EMPTY); setErrors({}); setModalOpen(true); };
  const openEdit = (dish: Dish) => {
    setEditId(dish.id);
    setForm({ name: dish.name, description: dish.description || '', price: String(dish.price), category_id: dish.category_id || '', image: dish.image || '', is_available: Boolean(dish.is_available), is_featured: Boolean(dish.is_featured) });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) e.price = 'Valid price is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), description: form.description.trim(), price: parseFloat(form.price), category_id: form.category_id || null, image: form.image || null, is_available: form.is_available, is_featured: form.is_featured };
      if (editId) { await dishesApi.update(editId, payload as any); show('Dish updated!'); }
      else { await dishesApi.create(payload as any); show('Dish created!'); }
      setModalOpen(false);
      refetch();
    } catch (err) { show(getErrorMessage(err, 'Failed to save'), 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await dishesApi.delete(deleteId); show('Dish deleted!'); setDeleteId(null); refetch(); }
    catch (err) { show(getErrorMessage(err, 'Failed to delete'), 'error'); }
    finally { setDeleting(false); }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <PageHeader title="Dishes" description={`${dishes.length} dishes total`} action={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Dish</button>} />
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search dishes..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <DishTable dishes={dishes} search={search} onEdit={openEdit} onDelete={setDeleteId} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Dish' : 'Add New Dish'} maxWidth="xl">
        <DishForm initial={form} categories={categories} images={images} errors={errors} onChange={setForm} />
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t">
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving...' : editId ? 'Save Changes' : 'Create Dish'}</button>
        </div>
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Dish" maxWidth="sm">
        <p className="text-gray-600 mb-4">Are you sure? This cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60">{deleting ? 'Deleting...' : 'Delete'}</button>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}
