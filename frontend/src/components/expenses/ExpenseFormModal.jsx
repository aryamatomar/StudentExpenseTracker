import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, FileText, Loader2, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { formatDateForInput } from '../../utils/formatters';
import { useExpenses } from '../../hooks/useExpenses';
import { CategoryBadge } from '../ui/Badge';

export const ExpenseFormModal = () => {
  const {
    isFormModalOpen,
    setIsFormModalOpen,
    editingExpense,
    setEditingExpense,
    addExpense,
    updateExpense
  } = useExpenses();

  const isEditing = Boolean(editingExpense);

  // Form Field States
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: formatDateForInput(),
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editingExpense changes
  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount !== undefined ? editingExpense.amount.toString() : '',
        category: editingExpense.category || 'Food',
        date: formatDateForInput(editingExpense.date),
        description: editingExpense.description || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: formatDateForInput(),
        description: ''
      });
    }
    setErrors({});
  }, [editingExpense, isFormModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFormModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFormModalOpen]);

  if (!isFormModalOpen) return null;

  const handleClose = () => {
    setIsFormModalOpen(false);
    setEditingExpense(null);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else {
      const num = Number(formData.amount);
      if (isNaN(num) || num <= 0) {
        newErrors.amount = 'Please enter a valid amount greater than 0';
      }
    }

    if (!formData.category || !CATEGORIES.includes(formData.category)) {
      newErrors.category = 'Please select a valid category';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const payload = {
      title: formData.title.trim(),
      amount: parseFloat(Number(formData.amount).toFixed(2)),
      category: formData.category,
      date: formData.date,
      description: formData.description.trim()
    };

    let result;
    if (isEditing) {
      const id = editingExpense._id || editingExpense.id;
      result = await updateExpense(id, payload);
    } else {
      result = await addExpense(payload);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEditing
                ? 'Update the details for this transaction'
                : 'Enter your student expenditure details'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Expense Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Physics Textbook, Subway Pass, Groceries"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-500/20'
                  : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Amount & Date Fields (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Amount ($ USD) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    errors.amount
                      ? 'border-rose-400 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
                  }`}
                />
              </div>
              {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                    errors.date
                      ? 'border-rose-400 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
                  }`}
                />
              </div>
              {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = formData.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, category: cat }));
                      if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
            {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Description / Notes <span className="text-slate-400 text-[10px] lowercase">(optional)</span>
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Bought with student discount at campus store..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-brand-500/25 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Add Expense'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseFormModal;
