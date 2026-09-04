import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons = { success: CheckCircle, error: XCircle, info: AlertCircle };
const colors = {
  success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'text-green-500' },
  error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-500' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-500' },
};

export function Toast({ message, type = 'success', onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const Icon = icons[type];
  const c = colors[type];

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 ${c.bg} border ${c.border} rounded-xl px-4 py-3 shadow-lg max-w-sm animate-slide-up`}>
      <Icon size={20} className={c.icon} />
      <p className={`text-sm font-medium ${c.text}`}>{message}</p>
      <button onClick={onClose} className="ml-1 p-0.5 hover:bg-black/5 rounded transition-colors">
        <X size={16} className={c.text} />
      </button>
    </div>
  );
}

// Simple toast manager hook
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const show = (message: string, type: ToastType = 'success') => setToast({ message, type });
  const hide = () => setToast(null);
  return { toast, show, hide };
}