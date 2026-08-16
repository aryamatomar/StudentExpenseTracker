import React from 'react';
import { Edit3, Trash2, Calendar, FileText, ArrowUpDown } from 'lucide-react';
import { CategoryBadge } from '../ui/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useExpenses } from '../../hooks/useExpenses';

export const ExpenseTable = ({ expenses = [] }) => {
  const { openEditModal, openDeleteModal } = useExpenses();

  const totalFilteredAmount = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6">Expense Title & Description</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-right">Amount</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {expenses.map((expense) => (
              <tr
                key={expense._id || expense.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Title & Description */}
                <td className="py-4 px-6">
                  <div className="min-w-0 max-w-xs sm:max-w-md">
                    <p className="font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                      {expense.title}
                    </p>
                    {expense.description ? (
                      <p className="text-xs text-slate-400 truncate mt-0.5" title={expense.description}>
                        {expense.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-300 italic mt-0.5">No description added</p>
                    )}
                  </div>
                </td>

                {/* Category Badge */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <CategoryBadge category={expense.category} size="md" />
                </td>

                {/* Date */}
                <td className="py-4 px-6 whitespace-nowrap text-slate-600 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(expense.date)}</span>
                  </div>
                </td>

                {/* Amount */}
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <span className="font-extrabold text-slate-900 text-base">
                    {formatCurrency(expense.amount)}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEditModal(expense)}
                      className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
                      title="Edit Expense"
                      aria-label={`Edit ${expense.title}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(expense)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Delete Expense"
                      aria-label={`Delete ${expense.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Summary Footer */}
      <div className="bg-slate-50/60 px-6 py-3.5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>Showing {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'}</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Filtered Total:</span>
          <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(totalFilteredAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
