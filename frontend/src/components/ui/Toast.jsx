import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';

export const ToastContainer = () => {
  const { toasts, removeToast } = useExpenses();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 text-white border-emerald-700/50'
              : toast.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-700/50'
              : 'bg-slate-900/90 text-white border-slate-700/50'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
          </div>
          <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
