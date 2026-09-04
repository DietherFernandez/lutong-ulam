import { useState, useRef } from 'react';
import { Trash2, Upload, Copy, Check } from 'lucide-react';
import { imagesApi } from '../../api';
import { useFetch, broadcastRefresh } from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/errors';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import { Toast, useToast } from '../../components/admin/Toast';
import { LoadingSpinner } from '../../components/common/States';
import type { Image } from '../../types';

export default function AdminImages() {
  const { data, loading, refetch } = useFetch<{ images: Image[] }>(() => imagesApi.getAll(), [], { autoRefresh: false });
  const { toast, show, hide } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const images = data?.images || [];

  const handleUpload = async (files: FileList | File[]) => {
    setUploading(true);
    try {
      const list = Array.from(files);
      for (const f of list) {
        try { await imagesApi.upload(f); } catch (e) { /* skip individual */ }
      }
      show(`${list.length} image(s) uploaded!`);
      refetch();
      broadcastRefresh();
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try { await imagesApi.delete(deleteId); show('Image deleted!'); setDeleteId(null); refetch(); broadcastRefresh(); }
    catch (err) { show(getErrorMessage(err, 'Failed to delete'), 'error'); }
    finally { setDeleting(false); }
  };

  const copy = async (img: Image) => {
    await navigator.clipboard.writeText(img.public_url || img.file_path);
    setCopiedId(img.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <PageHeader title="Media Library" description={`${images.length} images stored`} />

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`bg-white border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-6 ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleUpload(e.target.files)} />
        <Upload size={36} className="mx-auto mb-2 text-gray-400" />
        <p className="font-semibold text-gray-700">{uploading ? 'Uploading...' : 'Drop images here, or click to select'}</p>
        <p className="text-sm text-gray-500 mt-1">JPG, PNG, WebP up to 5MB</p>
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">No images yet. Upload your first one above.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img src={img.public_url || img.file_path} alt={img.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-700 truncate font-medium">{img.filename}</p>
                <p className="text-xs text-gray-400">{Math.round((img.file_size || 0) / 1024)} KB</p>
                <div className="flex items-center gap-1 mt-2">
                  <button onClick={() => copy(img)} className="flex-1 p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-primary-600 text-xs flex items-center justify-center gap-1">
                    {copiedId === img.id ? <><Check size={12} className="text-green-600" /> Copied</> : <><Copy size={12} /> Copy URL</>}
                  </button>
                  <button onClick={() => setDeleteId(img.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-500 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Image" maxWidth="sm">
        <p className="text-gray-600 mb-4">Are you sure? The image file will be removed permanently.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60">{deleting ? 'Deleting...' : 'Delete'}</button>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}
