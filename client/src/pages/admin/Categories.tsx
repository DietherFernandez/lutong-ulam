import { useState } from 'react';
import { Plus } from 'lucide-react';
import { categoriesApi, dishesApi } from '../../api';
import { useFetch } from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/errors';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import CategoryForm from '../../components/admin/CategoryForm';
import CategoryList from '../../components/admin/CategoryList';
import { Toast, useToast } from '../../components/admin/Toast';
import { LoadingSpinner } from '../../components/common/States';
import type { Category } from '../../types';

const EMPTY = { name: '', description: '', sort_order: 0 };

export default function AdminCategories() {
  const { data, loading, refetch } = useFetch<{ categories: Category[] }>(() => categoriesApi.getAll(), []);
  const { data: dishesData } = useFetch<{ dishes: any[] }>(() => dishesApi.getAll(), []);
  const { toast, show, hide } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = data?.categories || [];
  const dishCountByCat: Record<number, number> = {};
  (dishesData?.dishes || []).forEach((d: any) => { if (d.category_id) dishCountByCat[d.category_id] = (dishCountByCat[d.category_id] || 0) + 1; });

  const openCreate = () => { setEditId(null); setForm(EMPTY); setErrors({}); setModalOpen(true); };
  const openEdit = (c: Category) => { setEditId(c.id); setForm({ name: c.name, description: c.description || '', sort_order: c.sort_order || 0 }); setErrors({}); setModalOpen(true); };
  const validate = () => { const e: Record<string, string> = {}; if (!form.name.trim()) e.name = 'Name is required'; setErrors(e); return Object.keys(e).length === 0; };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editId) { await categoriesApi.update(editId, form); show('Category updated!'); }
      else { await categoriesApi.create(form); show('Category created!'); }
      setModalOpen(false); refetch();
    } catch (err) { show(getErrorMessage(err, 'Failed to save'), 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await categoriesApi.delete(deleteId, forceDelete); show('Category deleted!'); setDeleteId(null); setForceDelete(false); refetch(); }
    catch (err) { show(getErrorMessage(err, 'Failed to delete'), 'error'); }
    finally { setDeleting(false); }
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <PageHeader title="Categories" description={`${categories.length} categories`} action={<button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={18} /> Add Category</button>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CategoryList categories={categories} dishCountByCat={dishCountByCat} onEdit={openEdit} onDelete={(id) => { setDeleteId(id); setForceDelete(false); }} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Category' : 'Add Category'} maxWidth="md">
        <CategoryForm form={form} errors={errors} onChange={setForm} onSubmit={handleSave} onCancel={() => setModalOpen(false)} saving={saving} isEdit={!!editId} />
      </Modal>

      <Modal open={!!deleteId} onClose={() => { setDeleteId(null); setForceDelete(false); }} title="Delete Category" maxWidth="sm">
        <p className="text-gray-600 mb-3">Are you sure you want to delete this category?</p>
        <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
          <input type="checkbox" checked={forceDelete} onChange={(e) => setForceDelete(e.target.checked)} className="w-4 h-4 text-red-600 rounded" />
          <span>Force delete (also clear category from all dishes)</span>
        </label>
        <div className="flex justify-end gap-3">
          <button onClick={() => { setDeleteId(null); setForceDelete(false); }} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60">{deleting ? 'Deleting...' : 'Delete'}</button>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}
