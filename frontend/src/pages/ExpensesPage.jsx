import React, { useState } from 'react';
import { Plus, Download, LayoutGrid, List, Receipt, FileJson, FileSpreadsheet } from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import ExpenseFilters from '../components/expenses/ExpenseFilters';
import ExpenseTable from '../components/expenses/ExpenseTable';
import ExpenseCard from '../components/expenses/ExpenseCard';
import EmptyState from '../components/ui/EmptyState';
import { TableRowSkeleton } from '../components/ui/LoadingSkeleton';

export const ExpensesPage = () => {
  const {
    expenses,
    loading,
    openAddModal,
    filters,
    resetFilters,
    addToast,
    profile,
    currency
  } = useExpenses();

  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Helper to export expenses to CSV
  const exportToCSV = () => {
    if (expenses.length === 0) {
      addToast('No expenses to export', 'info');
      return;
    }

    const headers = ['Title', 'Amount', 'Currency', 'Category', 'Date', 'Description', 'Student ID'];
    const rows = expenses.map((exp) => [
      `"${(exp.title || '').replace(/"/g, '""')}"`,
      exp.amount,
      currency,
      exp.category,
      exp.date,
      `"${(exp.description || '').replace(/"/g, '""')}"`,
      `"${exp.studentId || profile?.studentId || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Expenses exported as CSV! 📄', 'success');
  };

  const isFiltered =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.datePreset !== 'all' ||
    filters.startDate !== '' ||
    filters.endDate !== '';

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Expenses Management</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Search, filter, categorize, and organize your college transactions
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Toggle (Grid / Table) */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
              aria-label="Switch to table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
              aria-label="Switch to grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export CSV</span>
          </button>

          {/* Add Expense CTA */}
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <ExpenseFilters />

      {/* Expense List Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6">
          <table className="w-full">
            <tbody>
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      ) : expenses.length === 0 ? (
        <EmptyState
          isSearch={isFiltered}
          onReset={resetFilters}
          onAction={openAddModal}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className={viewMode === 'table' ? 'hidden md:block' : 'hidden'}>
            <ExpenseTable expenses={expenses} />
          </div>

          {/* Mobile or Grid Card Layout */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${
              viewMode === 'table' ? 'md:hidden' : ''
            }`}
          >
            {expenses.map((expense) => (
              <ExpenseCard key={expense._id || expense.id} expense={expense} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpensesPage;
