import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { CATEGORY_CONFIG } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { useExpenses } from '../../hooks/useExpenses';
import { PieChart as PieIcon } from 'lucide-react';

const CustomTooltip = ({ active, payload, currency }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const config = CATEGORY_CONFIG[data.name] || CATEGORY_CONFIG['Other'];
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
          <span className="font-bold">{data.name}</span>
        </div>
        <p className="text-slate-300 font-semibold">{formatCurrency(data.value, currency)} ({data.percentage}%)</p>
      </div>
    );
  }
  return null;
};

export const CategoryChart = ({ breakdown = [], totalExpenses = 0 }) => {
  const { currency } = useExpenses();

  // Filter categories with amounts > 0
  const chartData = breakdown
    .filter((item) => item.amount > 0)
    .map((item) => ({
      name: item.category,
      value: item.amount,
      percentage: item.percentage,
      color: CATEGORY_CONFIG[item.category]?.color || '#64748b',
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col items-center justify-center min-h-[340px] text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <PieIcon className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-700 text-sm">No Category Data Yet</h4>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Add expenses with different categories to see your student spending breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Category Breakdown</h3>
          <p className="text-xs text-slate-500">Distribution across student expenses</p>
        </div>
        <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
          {chartData.length} Active {chartData.length === 1 ? 'Category' : 'Categories'}
        </span>
      </div>

      <div className="h-56 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
          <span className="text-sm font-extrabold text-slate-800">{formatCurrency(totalExpenses, currency)}</span>
        </div>
      </div>

      {/* Category Pills List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t border-slate-100">
        {chartData.slice(0, 6).map((item) => (
          <div key={item.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-700 truncate">{item.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">{item.percentage}% ({formatCurrency(item.value, currency)})</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
