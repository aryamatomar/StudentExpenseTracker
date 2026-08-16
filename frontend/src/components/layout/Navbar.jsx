import React from 'react';
import { Menu, Plus, Wallet, Bell, Sparkles } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency } from '../../utils/formatters';

export const Navbar = ({ onOpenMobileMenu }) => {
  const { openAddModal, stats } = useExpenses();

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between transition-all">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            Student Expense Tracker
          </h2>
          <p className="text-xs text-slate-500 hidden sm:block">
            Smart budgeting & expense management
          </p>
        </div>
      </div>

      {/* Right: Quick Stats, Notifications & CTA */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Total Spending Pill */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-2 bg-brand-50/80 border border-brand-100 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-brand-600/10 flex items-center justify-center text-brand-600">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">Total Spending</p>
            <p className="text-sm font-extrabold text-slate-900 leading-none">
              {formatCurrency(stats?.totalExpenses || 0)}
            </p>
          </div>
        </div>

        {/* Add Expense Action Button */}
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md shadow-brand-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Expense</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
