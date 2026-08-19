import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  User,
  Settings,
  Plus,
  X,
  Target,
  GraduationCap,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency, getInitials } from '../../utils/formatters';

export const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    openAddModal,
    openProfileModal,
    openSettingsModal,
    stats,
    monthlyBudget,
    profile,
    currency
  } = useExpenses();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/expenses', label: 'All Expenses', icon: Receipt },
    { to: '/analytics', label: 'Analytics & Budget', icon: PieChart },
  ];

  const thisMonthSpending = stats?.thisMonthSpending || 0;
  const budgetPercent = monthlyBudget > 0 ? Math.min(100, Math.round((thisMonthSpending / monthlyBudget) * 100)) : 0;
  const isOverBudget = thisMonthSpending > monthlyBudget && monthlyBudget > 0;

  const initials = profile ? getInitials(profile.name) : 'AS';
  const studentName = profile?.name || 'Student Account';
  const studentId = profile?.studentId || 'Set Profile';

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
        className={`fixed top-0 left-0 bottom-0 z-40 w-72 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 leading-tight tracking-tight">StudentTrack</h1>
                <p className="text-[10px] text-brand-600 font-bold tracking-wider uppercase">Expense Manager</p>
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
          <div className="px-5 pt-5 pb-2 shrink-0">
            <button
              onClick={() => {
                openAddModal();
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              <span>Add Expense</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-3 space-y-1.5 overflow-y-auto">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Main Menu</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
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

            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 pt-4 mb-2">Account</p>

            {/* Profile Navigation Button */}
            <button
              onClick={() => {
                openProfileModal();
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                <span>Student Profile</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-brand-700 border border-indigo-100">
                ID Card
              </span>
            </button>

            {/* Settings Navigation Button */}
            <button
              onClick={() => {
                openSettingsModal();
                if (onClose) onClose();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                <span>Settings</span>
              </div>
            </button>
          </nav>

          {/* Student Monthly Budget Mini Widget */}
          <div
            onClick={() => {
              navigate('/analytics');
              if (onClose) onClose();
            }}
            className="p-4 mx-4 mb-3 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg shadow-indigo-950/20 cursor-pointer hover:ring-2 hover:ring-brand-400/50 transition-all group shrink-0"
            title="Click to view analytics and budget settings"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-200">
                <Target className="w-3.5 h-3.5 text-brand-400" />
                <span>Month Budget</span>
              </div>
              <span className={`text-xs font-extrabold ${isOverBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
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
              <span className="text-slate-400">{formatCurrency(thisMonthSpending, currency)}</span>
              <span className="text-slate-300 font-semibold">{formatCurrency(monthlyBudget, currency)}</span>
            </div>
          </div>
        </div>

        {/* User Info / Profile Footer Card (Clickable -> Opens Profile Modal) */}
        <div
          onClick={() => {
            openProfileModal();
            if (onClose) onClose();
          }}
          className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer transition-colors shrink-0 group"
          title="Click to manage Student Profile"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-xs shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate group-hover:text-brand-600 transition-colors">
                {studentName}
              </p>
              <p className="text-xs text-slate-400 font-mono truncate">{studentId}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
