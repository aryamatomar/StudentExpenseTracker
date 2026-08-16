import React from 'react';
import { 
  DollarSign, 
  Receipt, 
  Calendar, 
  TrendingUp, 
  Award, 
  Plus, 
  Sparkles,
  ArrowUpRight,
  Calculator
} from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../utils/formatters';
import StatCard from '../components/dashboard/StatCard';
import CategoryChart from '../components/dashboard/CategoryChart';
import MonthlyBarChart from '../components/dashboard/MonthlyBarChart';
import RecentExpenses from '../components/dashboard/RecentExpenses';
import { StatCardSkeleton, ChartSkeleton } from '../components/ui/LoadingSkeleton';

export const Dashboard = () => {
  const { expenses, stats, statsLoading, loading, openAddModal } = useExpenses();

  const highestTitle = stats?.highestExpense?.title
    ? `Highest: ${stats.highestExpense.title}`
    : 'No expenses yet';

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-600 to-indigo-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-100 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Student Financial Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back to your Expense Tracker 🎓
            </h1>
            <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
              Track your campus expenditures, manage textbooks, groceries, and student budget in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-brand-700 hover:bg-indigo-50 active:scale-95 font-bold text-sm rounded-2xl shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            {/* Total Expenses */}
            <StatCard
              title="Total Expenses"
              value={formatCurrency(stats?.totalExpenses || 0)}
              subtitle="All-time recorded spending"
              icon={DollarSign}
              iconBg="bg-indigo-50 text-indigo-600 border border-indigo-100"
              badgeText="Overall"
            />

            {/* Total Number of Expenses */}
            <StatCard
              title="Transactions"
              value={stats?.totalCount || 0}
              subtitle="Total logged entries"
              icon={Receipt}
              iconBg="bg-sky-50 text-sky-600 border border-sky-100"
              badgeText="Count"
            />

            {/* This Month's Spending */}
            <StatCard
              title="This Month"
              value={formatCurrency(stats?.thisMonthSpending || 0)}
              subtitle="Current calendar month"
              icon={Calendar}
              iconBg="bg-emerald-50 text-emerald-600 border border-emerald-100"
              badgeText="Current"
            />

            {/* Highest Expense */}
            <StatCard
              title="Highest Expense"
              value={formatCurrency(stats?.highestExpense?.amount || 0)}
              subtitle={highestTitle}
              icon={Award}
              iconBg="bg-amber-50 text-amber-600 border border-amber-100"
              badgeText="Peak"
            />
          </>
        )}
      </div>

      {/* Charts Grid: Category Donut & Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {statsLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <CategoryChart
              breakdown={stats?.categoryBreakdown || []}
              totalExpenses={stats?.totalExpenses || 0}
            />
            <MonthlyBarChart data={stats?.monthlyTrends || []} />
          </>
        )}
      </div>

      {/* Bottom Row: Recent Transactions */}
      <div>
        <RecentExpenses expenses={expenses} />
      </div>
    </div>
  );
};

export default Dashboard;
