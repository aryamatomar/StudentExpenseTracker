import React, { useState } from 'react';
import {
  X,
  Settings,
  DollarSign,
  Bell,
  Download,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { CURRENCIES } from '../../utils/constants';

export const SettingsModal = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    currency,
    updateCurrency,
    monthlyBudget,
    updateMonthlyBudget,
    expenses,
    profile,
    addToast
  } = useExpenses();

  const [alertThreshold, setAlertThreshold] = useState(() => {
    return Number(localStorage.getItem('budget_alert_threshold')) || 85;
  });

  if (!isSettingsModalOpen) return null;

  const handleClose = () => {
    setIsSettingsModalOpen(false);
  };

  const handleCurrencyChange = (e) => {
    updateCurrency(e.target.value);
  };

  const handleThresholdChange = (e) => {
    const val = Number(e.target.value);
    setAlertThreshold(val);
    localStorage.setItem('budget_alert_threshold', val.toString());
    addToast(`Budget alert set to ${val}% of monthly limit`, 'info');
  };

  const exportJSONBackup = () => {
    if (expenses.length === 0) {
      addToast('No expenses to export', 'info');
      return;
    }

    const backupData = {
      exportDate: new Date().toISOString(),
      studentProfile: profile || null,
      monthlyBudget,
      currency,
      totalExpenses: expenses.length,
      expenses
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `student_expense_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('Complete financial backup exported as JSON! 📦', 'success');
  };

  const exportFullCSV = () => {
    if (expenses.length === 0) {
      addToast('No expenses to export', 'info');
      return;
    }

    const headers = ['Transaction ID', 'Student ID', 'Title', 'Amount', 'Currency', 'Category', 'Date', 'Description'];
    const rows = expenses.map((exp) => [
      exp._id || exp.id,
      `"${exp.studentId || profile?.studentId || 'N/A'}"`,
      `"${(exp.title || '').replace(/"/g, '""')}"`,
      exp.amount,
      currency,
      exp.category,
      exp.date,
      `"${(exp.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_expenses_full_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    addToast('Full expense report exported as CSV! 📄', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Settings</h3>
              <p className="text-[11px] text-slate-500">Preferences, currency & data management</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Preferred Currency Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Preferred Currency
            </label>
            <p className="text-xs text-slate-500">
              Select your university or country currency symbol for all expense calculations.
            </p>
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              {CURRENCIES.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Warning Alert Threshold */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Budget Alert Threshold
              </label>
              <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                {alertThreshold}%
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Show warning banner when monthly expenditures reach this percentage of your budget.
            </p>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={alertThreshold}
              onChange={handleThresholdChange}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>50% (Conservative)</span>
              <span>85% (Standard)</span>
              <span>100% (Strict)</span>
            </div>
          </div>

          {/* Backup and Data Export */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Data Backup & Export
            </label>
            <p className="text-xs text-slate-500">
              Export your expenses data for spreadsheets, budgeting apps, or personal archival.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={exportFullCSV}
                className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all active:scale-95"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={exportJSONBackup}
                className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-all active:scale-95"
              >
                <FileJson className="w-4 h-4 text-brand-600" />
                <span>Backup JSON</span>
              </button>
            </div>
          </div>

          {/* About Student Expense Tracker */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center justify-between">
            <div>
              <p className="font-bold">Student Expense Tracker v2.0</p>
              <p className="text-[11px] text-indigo-600">React + Express + MongoDB Atlas</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">
              ONLINE
            </span>
          </div>

          {/* Close Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
