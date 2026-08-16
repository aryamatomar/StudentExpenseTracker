import React from 'react';

export const StatCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-slate-200 rounded-md w-28"></div>
        <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="h-8 bg-slate-200 rounded-md w-36 mb-2"></div>
      <div className="h-3 bg-slate-100 rounded-md w-20"></div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <tr className="border-b border-slate-100 animate-pulse">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0"></div>
          <div>
            <div className="h-4 bg-slate-200 rounded w-32 mb-1.5"></div>
            <div className="h-3 bg-slate-100 rounded w-48"></div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="h-6 bg-slate-200 rounded-full w-20"></div>
      </td>
      <td className="py-4 px-6">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="h-5 bg-slate-200 rounded w-16 ml-auto"></div>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
          <div className="w-8 h-8 rounded-lg bg-slate-100"></div>
        </div>
      </td>
    </tr>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-soft animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-36 mb-6"></div>
      <div className="h-64 bg-slate-100 rounded-xl flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-4 border-slate-200 border-t-brand-400 animate-spin"></div>
      </div>
    </div>
  );
};

export default {
  StatCardSkeleton,
  TableRowSkeleton,
  ChartSkeleton
};
