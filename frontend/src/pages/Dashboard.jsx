import React from 'react';
import {
  Receipt,
  Calendar,
  TrendingUp,
  Award,
  Plus,
  Sparkles,
  Target,
  Clock,
  User,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../utils/formatters';
import StatCard from '../components/dashboard/StatCard';
import CategoryChart from '../components/dashboard/CategoryChart';
import MonthlyBarChart from '../components/dashboard/MonthlyBarChart';
import RecentExpenses from '../components/dashboard/RecentExpenses';
import { StatCardSkeleton, ChartSkeleton } from '../components/ui/LoadingSkeleton';

// Vector Indian Rupee Icon
const RupeeIcon = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="m6 13 8.5 8" />
    <path d="M6 13h3a4 4 0 0 0 0-8" />
  </svg>
);

export const Dashboard = () => {
  const {
    expenses,
    stats,
    statsLoading,
    loading,
    openAddModal,
    openProfileModal,
    profile,
    monthlyBudget,
    currency
  } = useExpenses();

  const thisMonthSpending = stats?.thisMonthSpending || 0;
  const remainingBudget = monthlyBudget - thisMonthSpending;
  const isOverBudget = thisMonthSpending > monthlyBudget && monthlyBudget > 0;
  const todaySpending = stats?.todaySpending || 0;

  const highestTitle = stats?.highestExpense?.title
    ? `Peak: ${stats.highestExpense.title}`
    : 'No expenses recorded';

  const studentGreeting = profile?.name
    ? `Welcome back, ${profile.name.split(' ')[0]} 🎓`
    : 'Welcome to your Student Expense Tracker 🎓';

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-600 to-indigo-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-100 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {profile ? `${profile.college} • ${profile.studentId}` : 'Student Financial Overview (INR ₹)'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {studentGreeting}
            </h1>
            <p className="mt-2 text-indigo-100 text-sm leading-relaxed">
              Track college tuition, textbooks, groceries, mess dues, transit, and keep your monthly student budget under control.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={openProfileModal}
              className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm rounded-2xl backdrop-blur-md border border-white/20 transition-all"
            >
              <User className="w-4 h-4" />
              <span>{profile ? 'Student ID' : 'Create Profile'}</span>
            </button>

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

      {/* 5 Key Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            {/* Total Expenses */}
            <StatCard
              title="Total Spending"
              value={formatCurrency(stats?.totalExpenses || 0, 'INR')}
              subtitle="All-time recorded spend"
              icon={RupeeIcon}
              iconBg="bg-indigo-50 text-indigo-600 border border-indigo-100"
              badgeText="Overall"
            />

            {/* This Month's Spending */}
            <StatCard
              title="This Month"
              value={formatCurrency(thisMonthSpending, 'INR')}
              subtitle="Current calendar month"
              icon={Calendar}
              iconBg="bg-emerald-50 text-emerald-600 border border-emerald-100"
              badgeText="Current"
            />

            {/* Today's Spending */}
            <StatCard
              title="Today's Spend"
              value={formatCurrency(todaySpending, 'INR')}
              subtitle="Logged today"
              icon={Clock}
              iconBg="bg-sky-50 text-sky-600 border border-sky-100"
              badgeText="Daily"
            />

            {/* Remaining Monthly Budget */}
            <StatCard
              title="Remaining Budget"
              value={formatCurrency(Math.max(0, remainingBudget), 'INR')}
              subtitle={
                isOverBudget
                  ? `Over limit by ${formatCurrency(thisMonthSpending - monthlyBudget, 'INR')}`
                  : `Target: ${formatCurrency(monthlyBudget, 'INR')}`
              }
              icon={Target}
              iconBg={
                isOverBudget
                  ? 'bg-rose-50 text-rose-600 border border-rose-100'
                  : 'bg-indigo-50 text-brand-600 border border-indigo-100'
              }
              badgeText={isOverBudget ? 'Exceeded' : 'On Track'}
            />

            {/* Highest Expense */}
            <StatCard
              title="Peak Expense"
              value={formatCurrency(stats?.highestExpense?.amount || 0, 'INR')}
              subtitle={highestTitle}
              icon={Award}
              iconBg="bg-amber-50 text-amber-600 border border-amber-100"
              badgeText="Highest"
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
