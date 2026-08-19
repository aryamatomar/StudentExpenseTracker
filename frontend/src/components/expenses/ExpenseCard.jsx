import React from 'react';
import { Edit3, Trash2, Calendar, FileText } from 'lucide-react';
import { CategoryBadge } from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useExpenses } from '../../hooks/useExpenses';

export const ExpenseCard = ({ expense }) => {
  const { openEditModal, openDeleteModal, currency } = useExpenses();

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft card-hover flex flex-col justify-between gap-3">
      {/* Card Header: Category & Amount */}
      <div className="flex items-start justify-between gap-2">
        <CategoryBadge category={expense.category} size="sm" />
        <span className="text-lg font-extrabold text-slate-900 leading-none">
          {formatCurrency(expense.amount, currency)}
        </span>
      </div>

      {/* Card Body: Title & Description */}
      <div>
        <h4 className="font-bold text-slate-900 text-base leading-snug">{expense.title}</h4>
        {expense.description ? (
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{expense.description}</p>
        ) : (
          <p className="text-xs text-slate-300 italic mt-1">No additional notes</p>
        )}
      </div>

      {/* Card Footer: Date & Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formatDate(expense.date)}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditModal(expense)}
            className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
            title="Edit Expense"
            aria-label={`Edit ${expense.title}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => openDeleteModal(expense)}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Delete Expense"
            aria-label={`Delete ${expense.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCard;
