import React from 'react';
import { Receipt, SearchX, Plus } from 'lucide-react';

export const EmptyState = ({
  isSearch = false,
  title,
  description,
  actionText,
  onAction,
  onReset
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4 ring-8 ring-brand-50/50">
        {isSearch ? <SearchX className="w-8 h-8" /> : <Receipt className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">
        {title || (isSearch ? 'No matching expenses found' : 'No expenses recorded yet')}
      </h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description ||
          (isSearch
            ? 'Try adjusting your search terms, changing the category filter, or clearing date ranges.'
            : 'Start tracking your college spending by adding your first expense.')}
      </p>
      <div className="flex items-center gap-3">
        {isSearch && onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            Clear Filters
          </button>
        )}
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            {actionText || 'Add New Expense'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
