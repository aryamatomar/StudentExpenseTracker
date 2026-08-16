import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  Edit, 
  Save, 
  DollarSign,
  PieChart as PieIcon,
  HelpCircle
} from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency, getCategoryConfig } from '../utils/formatters';
import CategoryChart from '../components/dashboard/CategoryChart';
import MonthlyBarChart from '../components/dashboard/MonthlyBarChart';

export const AnalyticsPage = () => {
  const { stats, monthlyBudget, updateMonthlyBudget } = useExpenses();
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(monthlyBudget.toString());

  const thisMonthSpending = stats?.thisMonthSpending || 0;
  const remainingBudget = monthlyBudget - thisMonthSpending;
  const budgetPercentage = monthlyBudget > 0 ? Math.min(150, Math.round((thisMonthSpending / monthlyBudget) * 100)) : 0;
  const isOverBudget = thisMonthSpending > monthlyBudget && monthlyBudget > 0;

  // Calculate days remaining in current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = Math.max(1, daysInMonth - currentDay);
  const dailyAllowance = remainingBudget > 0 ? remainingBudget / daysRemaining : 0;

  const handleSaveBudget = (e) => {
    e.preventDefault();
    updateMonthlyBudget(budgetInput);
    setIsEditingBudget(false);
  };

  const studentTips = [
    {
      title: 'Buy Used Textbooks or Rent Digital Copies',
      description: 'Check library reserves, Chegg, or campus swap groups before buying new bookstore copies.',
      category: 'Education'
    },
    {
      title: 'Meal Prep & Cook in Bulk',
      description: 'Eating campus takeout twice daily can cost upwards of $400/month. Cooking basics saves 60%.',
      category: 'Food'
    },
    {
      title: 'Use Student ID for Discounts',
      description: 'Spotify, Apple Music, Adobe, public transit, and movie theaters offer 50%+ discounts for students.',
      category: 'Entertainment'
    },
    {
      title: 'Transit Semester Passes',
      description: 'Most university IDs double as unlimited city bus or subway passes at a fraction of the standard rate.',
      category: 'Transport'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Analytics & Budget Planner
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Plan your monthly student budget, track limits, and analyze your financial habits
        </p>
      </div>

      {/* Monthly Budget Tracker Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-600 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Monthly Spending Budget</h2>
              <p className="text-xs text-slate-500">Set a spending target to keep your student expenses on track</p>
            </div>
          </div>

          {/* Budget Setting Input */}
          <div>
            {isEditingBudget ? (
              <form onSubmit={handleSaveBudget} className="flex items-center gap-2">
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="w-32 pl-8 pr-3 py-2 bg-slate-50 border border-brand-500 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBudgetInput(monthlyBudget.toString());
                    setIsEditingBudget(false);
                  }}
                  className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-400">Monthly Target</p>
                  <p className="text-xl font-extrabold text-slate-900">{formatCurrency(monthlyBudget)}</p>
                </div>
                <button
                  onClick={() => setIsEditingBudget(true)}
                  className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 border border-slate-200 rounded-xl transition-all"
                  title="Edit Budget Limit"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Budget Progress Bar */}
        <div className="py-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">
              Spent {formatCurrency(thisMonthSpending)} of {formatCurrency(monthlyBudget)}
            </span>
            <span
              className={`font-extrabold text-sm ${
                isOverBudget ? 'text-rose-600' : budgetPercentage > 80 ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {budgetPercentage}% used
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : budgetPercentage > 80
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-brand-500 to-indigo-600'
              }`}
              style={{ width: `${Math.min(100, budgetPercentage)}%` }}
            />
          </div>

          {/* Status Note */}
          <div className="flex items-center justify-between pt-1 text-xs">
            {isOverBudget ? (
              <div className="flex items-center gap-1.5 text-rose-600 font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>You are {formatCurrency(thisMonthSpending - monthlyBudget)} over your monthly limit!</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{formatCurrency(remainingBudget)} remaining for the next {daysRemaining} days.</span>
              </div>
            )}

            {!isOverBudget && (
              <span className="text-slate-500 font-medium">
                Safe Daily Pace: <strong className="text-slate-800">{formatCurrency(dailyAllowance)}/day</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart
          breakdown={stats?.categoryBreakdown || []}
          totalExpenses={stats?.totalExpenses || 0}
        />
        <MonthlyBarChart data={stats?.monthlyTrends || []} />
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-slate-800">Category Expense Distribution</h3>
        <div className="space-y-3">
          {(stats?.categoryBreakdown || []).map((cat) => {
            const config = getCategoryConfig(cat.category);
            return (
              <div key={cat.category} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                    <span className="font-bold text-slate-800 text-sm">{cat.category}</span>
                    <span className="text-xs text-slate-400">({config.description})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 text-sm">{formatCurrency(cat.amount)}</span>
                    <span className="text-xs text-slate-400 ml-1.5 font-semibold">({cat.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200/70 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%`, backgroundColor: config.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Saving Tips */}
      <div className="bg-gradient-to-br from-indigo-50/70 to-brand-50/40 p-6 sm:p-8 rounded-3xl border border-indigo-100">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-sm">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Student Budgeting Tips</h3>
            <p className="text-xs text-slate-500">Practical advice to stretch your college budget further</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentTips.map((tip, idx) => (
            <div key={idx} className="p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-indigo-100/60 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                {tip.category}
              </span>
              <h4 className="font-bold text-slate-800 text-sm mt-2">{tip.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
