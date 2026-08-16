import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CategoryBadge } from '../ui/Badge';

export const DeleteConfirmModal = () => {
  const {
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deletingExpense,
    setDeletingExpense,
    deleteExpense
  } = useExpenses();

  const [isDeleting, setIsDeleting] = useState(false);

  if (!isDeleteModalOpen || !deletingExpense) return null;

  const handleClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingExpense(null);
  };

  const handleConfirm = async () => {
    setIsDeleting(true);
    const id = deletingExpense._id || deletingExpense.id;
    await deleteExpense(id);
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">Delete Expense</h3>
            <p className="text-xs text-slate-500">This action cannot be undone.</p>
          </div>
        </div>

        {/* Target Item Details Card */}
        <div className="p-4 my-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-bold text-slate-800">{deletingExpense.title}</h4>
            <span className="text-sm font-extrabold text-slate-900 shrink-0">
              {formatCurrency(deletingExpense.amount)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CategoryBadge category={deletingExpense.category} size="sm" />
            <span className="text-xs text-slate-400">{formatDate(deletingExpense.date)}</span>
          </div>
          {deletingExpense.description && (
            <p className="text-xs text-slate-500 italic truncate pt-1 border-t border-slate-200/60">
              "{deletingExpense.description}"
            </p>
          )}
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Are you sure you want to permanently remove this transaction from your expense tracker?
        </p>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 shadow-md shadow-rose-600/25 transition-all"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Delete Expense</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
