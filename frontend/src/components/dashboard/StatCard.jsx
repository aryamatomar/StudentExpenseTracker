import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'neutral', // 'up', 'down', 'neutral'
  colorClass = 'text-brand-600 bg-brand-50 border-brand-100',
  iconBg = 'bg-brand-500/10 text-brand-600',
  badgeText
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft card-hover relative overflow-hidden group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${iconBg} transition-transform group-hover:scale-110 duration-200`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs text-slate-500">
        <span className="truncate">{subtitle}</span>
        {badgeText && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
