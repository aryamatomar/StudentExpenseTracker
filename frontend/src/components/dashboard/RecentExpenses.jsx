import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Edit2, Trash2, Clock } from 'lucide-react';
import { CategoryBadge } from '../ui/Badge';
import { formatCurrency, formatRelativeDate } from '../../utils/formatters';
import { useExpenses } from '../../hooks/useExpenses';

export const RecentExpenses = ({ expenses = [] }) => {
  const { openEditModal, openDeleteModal, currency } = useExpenses();
  const recentList = expenses.slice(0, 6);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Recent Transactions</h3>
          <p className="text-xs text-slate-500">Your latest recorded college expenditures</p>
        </div>
        <Link
          to="/expenses"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {recentList.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-xs">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          No recent expenses found.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recentList.map((expense) => (
            <div
              key={expense._id || expense.id}
              className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-brand-600 transition-colors">
                    {expense.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <CategoryBadge category={expense.category} size="sm" />
                    <span className="text-[11px] text-slate-400">
                      {formatRelativeDate(expense.date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold text-slate-900">
                  {formatCurrency(expense.amount, currency)}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(expense)}
                    className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    title="Edit Expense"
                    aria-label={`Edit ${expense.title}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(expense)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Expense"
                    aria-label={`Delete ${expense.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentExpenses;
