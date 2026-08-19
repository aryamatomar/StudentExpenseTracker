import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { useExpenses } from '../../hooks/useExpenses';
import { BarChart3 } from 'lucide-react';

const CustomBarTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-md">
        <p className="font-bold text-slate-200 mb-1">{label}</p>
        <p className="text-brand-300 font-extrabold text-sm">{formatCurrency(payload[0].value, currency)}</p>
        {payload[0].payload.count !== undefined && (
          <p className="text-slate-400 text-[11px] mt-0.5">{payload[0].payload.count} transactions</p>
        )}
      </div>
    );
  }
  return null;
};

export const MonthlyBarChart = ({ data = [] }) => {
  const { currency } = useExpenses();

  if (!data || data.length === 0 || data.every(d => d.amount === 0)) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col items-center justify-center min-h-[340px] text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-700 text-sm">No Monthly Trends Yet</h4>
        <p className="text-xs text-slate-400 max-w-xs mt-1">
          Monthly spending history will automatically populate as you record expenses over time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Monthly Spending Trend</h3>
          <p className="text-xs text-slate-500">Expenditure flow over past 6 months</p>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
          Last 6 Months
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => formatCurrency(val, currency).split('.')[0]}
            />
            <Tooltip content={<CustomBarTooltip currency={currency} />} />
            <Bar
              dataKey="amount"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === data.length - 1 ? '#4f46e5' : '#818cf8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>💡 Keep an eye on peak semester start and exam months!</span>
      </div>
    </div>
  );
};

export default MonthlyBarChart;
