import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Plus, Wallet, Settings, User, GraduationCap, Sparkles } from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency, getInitials } from '../../utils/formatters';

export const Navbar = ({ onOpenMobileMenu }) => {
  const navigate = useNavigate();
  const {
    openAddModal,
    openProfileModal,
    openSettingsModal,
    stats,
    profile,
    currency
  } = useExpenses();

  const initials = profile ? getInitials(profile.name) : 'AS';
  const displayName = profile ? profile.name.split(' ')[0] : 'Profile';

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
            Smart budgeting & college expenditure management
          </p>
        </div>
      </div>

      {/* Right: Quick Stats Pill, Settings, Profile & CTA */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Total Spending Pill (Clickable -> Analytics) */}
        <button
          onClick={() => navigate('/analytics')}
          className="hidden md:flex items-center gap-2.5 px-3.5 py-2 bg-brand-50/80 hover:bg-brand-100/80 border border-brand-100 rounded-xl transition-all text-left group"
          title="Click to view analytics"
        >
          <div className="w-7 h-7 rounded-lg bg-brand-600/10 flex items-center justify-center text-brand-600 group-hover:scale-105 transition-transform">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">Total Spending</p>
            <p className="text-sm font-extrabold text-slate-900 leading-none">
              {formatCurrency(stats?.totalExpenses || 0, currency)}
            </p>
          </div>
        </button>

        {/* Settings Button */}
        <button
          onClick={openSettingsModal}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-200/80 transition-all"
          title="Settings & Currency"
          aria-label="Open Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Profile Button / Avatar */}
        <button
          onClick={openProfileModal}
          className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all group"
          title="View Student Profile"
          aria-label="Open Student Profile"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-xs shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
            {initials}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-400 leading-none font-mono">
              {profile?.studentId || 'Create ID'}
            </p>
          </div>
        </button>

        {/* Add Expense Action Button */}
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all"
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
