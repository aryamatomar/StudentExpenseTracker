import React from 'react';
import { Search, Filter, ArrowUpDown, X, Calendar, RotateCcw } from 'lucide-react';
import { CATEGORIES, SORT_OPTIONS, DATE_PRESETS } from '../../utils/constants';
import { useExpenses } from '../../hooks/useExpenses';

export const ExpenseFilters = () => {
  const { filters, setFilters, resetFilters } = useExpenses();

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (cat) => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split('-');
    setFilters((prev) => ({ ...prev, sortBy, order }));
  };

  const handleDatePreset = (preset) => {
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0];

    if (preset === 'this-month') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = firstDay.toISOString().split('T')[0];
    } else if (preset === 'last-30') {
      const past30 = new Date();
      past30.setDate(today.getDate() - 30);
      startDate = past30.toISOString().split('T')[0];
    } else if (preset === 'last-7') {
      const past7 = new Date();
      past7.setDate(today.getDate() - 7);
      startDate = past7.toISOString().split('T')[0];
    } else {
      startDate = '';
      endDate = '';
    }

    setFilters((prev) => ({
      ...prev,
      datePreset: preset,
      startDate,
      endDate
    }));
  };

  const handleCustomDateChange = (type, val) => {
    setFilters((prev) => ({
      ...prev,
      datePreset: 'custom',
      [type]: val
    }));
  };

  const isFiltered =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.datePreset !== 'all' ||
    filters.startDate !== '' ||
    filters.endDate !== '' ||
    filters.sortBy !== 'date' ||
    filters.order !== 'desc';

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft space-y-4">
      {/* Top Row: Search & Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search expenses by title or note..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[190px]">
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={`${filters.sortBy}-${filters.order}`}
              onChange={handleSortChange}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-semibold transition-all shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Category Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Category:
        </span>
        {['All', ...CATEGORIES].map((cat) => {
          const isSelected = filters.category === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Bottom Row: Date Presets & Custom Date Range */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-slate-400 font-bold uppercase tracking-wider mr-1 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Date:
          </span>
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleDatePreset(preset.value)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filters.datePreset === preset.value
                  ? 'bg-indigo-100 text-indigo-700 font-bold'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom Start & End Date Inputs */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
            title="Start Date"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
            title="End Date"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;
