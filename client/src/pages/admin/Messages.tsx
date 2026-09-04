import { useState } from 'react';
import { Mail, Trash2, CheckCheck, Search, Eye, Reply, X } from 'lucide-react';
import { messagesApi } from '../../api';
import { useFetch, broadcastRefresh } from '../../hooks/useFetch';
import { getErrorMessage } from '../../utils/errors';
import PageHeader from '../../components/admin/PageHeader';
import Modal from '../../components/admin/Modal';
import { Toast, useToast } from '../../components/admin/Toast';
import { LoadingSpinner } from '../../components/common/States';
import type { ContactMessage } from '../../types';

type FilterType = 'all' | 'unread' | 'read';

export default function AdminMessages() {
  const { data, loading, refetch } = useFetch<{ messages: ContactMessage[] }>(
    () => messagesApi.getAll(), [], { autoRefresh: false }
  );
  const { toast, show, hide } = useToast();
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [viewing, setViewing] = useState<ContactMessage | null>(null);
  const [busy, setBusy] = useState(false);

  const messages = data?.messages || [];
  const filtered = messages.filter(m => {
    if (filter === 'unread' && m.is_read) return false;
    if (filter === 'read' && !m.is_read) return false;
    if (search) {
      const s = search.toLowerCase();
      return m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s) ||
        (m.subject?.toLowerCase().includes(s) ?? false) || m.message.toLowerCase().includes(s);
    }
    return true;
  });
  const unreadCount = messages.filter(m => !m.is_read).length;

  const toggleOne = (id: number) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(m => m.id)));
  };

  const markAll = async () => {
    try { await messagesApi.markAllAsRead(); refetch(); broadcastRefresh(); show('All marked as read'); }
    catch (e) { show(getErrorMessage(e), 'error'); }
  };
  const del = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    setBusy(true);
    try {
      await messagesApi.delete(id);
      const s = new Set(selected); s.delete(id); setSelected(s);
      if (viewing?.id === id) setViewing(null);
      refetch(); show('Deleted');
    } catch (e) { show(getErrorMessage(e), 'error'); }
    finally { setBusy(false); }
  };
  const delMany = async () => {
    const n = selected.size;
    if (!confirm('Delete ' + n + ' message(s)?')) return;
    setBusy(true);
    try { await messagesApi.bulkDelete(Array.from(selected)); setSelected(new Set()); refetch(); show('Deleted ' + n); }
    catch (e) { show(getErrorMessage(e), 'error'); }
    finally { setBusy(false); }
  };
  const view = async (m: ContactMessage) => {
    setViewing(m);
    if (!m.is_read) { try { await messagesApi.markAsRead(m.id); refetch(); } catch {} }
  };

  const timeAgo = (d: string) => {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000), h = Math.floor(ms / 3600000), days = Math.floor(ms / 86400000);
    if (m < 1) return 'Just now';
    if (m < 60) return m + 'm ago';
    if (h < 24) return h + 'h ago';
    if (days < 7) return days + 'd ago';
    return new Date(d).toLocaleDateString();
  };

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <div>
      <PageHeader title="Messages" description={unreadCount + ' unread of ' + messages.length + ' total'} />
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {(['all', 'unread', 'read'] as FilterType[]).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={'px-3 py-1.5 rounded-lg text-sm font-medium ' + (filter === f ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                {f[0].toUpperCase() + f.slice(1)}
                {f === 'unread' && unreadCount > 0 && <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && <button onClick={markAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm"><CheckCheck size={14} />Mark all read</button>}
            {selected.size > 0 && <button onClick={delMany} disabled={busy} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm disabled:opacity-50"><Trash2 size={14} />Delete ({selected.size})</button>}
          </div>
        </div>
        <div className="mt-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Mail size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">{filter !== 'all' || search ? 'No matches' : 'No messages yet'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="w-12 px-4 py-3"><input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">From</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Preview</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(m => (
                  <tr key={m.id} className={'hover:bg-gray-50 ' + (!m.is_read ? 'bg-blue-50/50' : '')}>
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleOne(m.id)} /></td>
                    <td className="px-4 py-3">{!m.is_read ? <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">New</span> : <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">Read</span>}</td>
                    <td className="px-4 py-3"><p className={'text-sm font-medium ' + (!m.is_read ? 'text-gray-900' : 'text-gray-700')}>{m.name}</p><p className="text-xs text-gray-500">{m.email}</p></td>
                    <td className="px-4 py-3 text-sm text-gray-900 max-w-[150px] truncate">{m.subject || '(No subject)'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{m.message}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{timeAgo(m.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => view(m)} className="p-1.5 text-gray-400 hover:text-primary-600" title="View"><Eye size={16} /></button>
                        <a href={'mailto:' + m.email + '?subject=Re: ' + (m.subject || '')} className="p-1.5 text-gray-400 hover:text-primary-600" title="Reply"><Reply size={16} /></a>
                        <button onClick={() => del(m.id)} disabled={busy} className="p-1.5 text-gray-400 hover:text-red-600 disabled:opacity-50" title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Message Details" maxWidth="lg">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div><h3 className="font-bold text-gray-900">{viewing.name}</h3><p className="text-sm text-gray-500">{viewing.email}</p>{viewing.phone && <p className="text-sm text-gray-500">{viewing.phone}</p>}</div>
              <button onClick={() => setViewing(null)} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            {viewing.subject && <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs font-medium text-gray-500 uppercase mb-1">Subject</p><p className="text-sm text-gray-900">{viewing.subject}</p></div>}
            <div><p className="text-xs font-medium text-gray-500 uppercase mb-1">Message</p><div className="bg-gray-50 rounded-lg p-4"><p className="text-sm text-gray-700 whitespace-pre-wrap">{viewing.message}</p></div></div>
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-xs text-gray-400">Received {new Date(viewing.created_at).toLocaleString()}</p>
              <div className="flex gap-2">
                <a href={'mailto:' + viewing.email + '?subject=Re: ' + (viewing.subject || '')} className="btn-primary flex items-center gap-1.5 text-sm"><Reply size={14} />Reply</a>
                <button onClick={() => del(viewing.id)} className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium"><Trash2 size={14} />Delete</button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hide} />}
    </div>
  );
}
