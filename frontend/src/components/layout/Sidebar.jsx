import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Sparkles, 
  Plus, 
  X,
  Target,
  GraduationCap
} from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency } from '../../utils/formatters';

export const Sidebar = ({ isOpen, onClose }) => {
  const { openAddModal, stats, monthlyBudget } = useExpenses();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/expenses', label: 'All Expenses', icon: Receipt },
    { to: '/analytics', label: 'Analytics & Budget', icon: PieChart },
  ];

  const thisMonthSpending = stats?.thisMonthSpending || 0;
  const budgetPercent = monthlyBudget > 0 ? Math.min(100, Math.round((thisMonthSpending / monthlyBudget) * 100)) : 0;
  const isOverBudget = thisMonthSpending > monthlyBudget && monthlyBudget > 0;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">StudentTrack</h1>
              <p className="text-xs text-brand-600 font-semibold tracking-wide uppercase">Expense Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action CTA */}
        <div className="px-5 pt-6 pb-2">
          <button
            onClick={() => {
              openAddModal();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-98 text-white font-semibold text-sm shadow-md shadow-brand-500/25 transition-all group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-bold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Student Monthly Budget Mini Widget */}
        <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg shadow-indigo-950/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200">
              <Target className="w-3.5 h-3.5 text-brand-400" />
              <span>Month Budget</span>
            </div>
            <span className={`text-xs font-bold ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
              {budgetPercent}%
            </span>
          </div>

          <div className="w-full bg-slate-700/60 rounded-full h-2 overflow-hidden mb-2.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : budgetPercent > 80
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-brand-400 to-emerald-400'
              }`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{formatCurrency(thisMonthSpending)}</span>
            <span className="text-slate-300 font-semibold">{formatCurrency(monthlyBudget)}</span>
          </div>
        </div>

        {/* User Info / College footer */}
        <div className="p-4 border-t border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">Student Account</p>
            <p className="text-xs text-slate-400 truncate">Academic Year 2026</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
