import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Calendar,
  Edit2,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building,
  Loader2
} from 'lucide-react';
import { useExpenses } from '../../hooks/useExpenses';
import { formatCurrency, getInitials } from '../../utils/formatters';
import { CURRENCIES } from '../../utils/constants';

export const ProfileModal = () => {
  const {
    profile,
    profileLoading,
    isProfileModalOpen,
    setIsProfileModalOpen,
    createProfile,
    updateProfile,
    currency
  } = useExpenses();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    semester: '6th Semester',
    monthlyBudget: '15000',
    currency: 'INR'
  });

  const [errors, setErrors] = useState({});

  // Sync form when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        college: profile.college || '',
        course: profile.course || '',
        semester: profile.semester || '6th Semester',
        monthlyBudget: profile.monthlyBudget !== undefined ? profile.monthlyBudget.toString() : '15000',
        currency: profile.currency || 'INR'
      });
      setIsEditing(false);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        college: '',
        course: '',
        semester: '1st Semester',
        monthlyBudget: '15000',
        currency: 'INR'
      });
      setIsEditing(true);
    }
    setErrors({});
  }, [profile, isProfileModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isProfileModalOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProfileModalOpen]);

  if (!isProfileModalOpen) return null;

  const handleClose = () => {
    setIsProfileModalOpen(false);
    setIsEditing(false);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.college.trim()) {
      newErrors.college = 'College or University name is required';
    }

    if (!formData.course.trim()) {
      newErrors.course = 'Course or Major is required';
    }

    if (!formData.monthlyBudget) {
      newErrors.monthlyBudget = 'Monthly budget is required';
    } else {
      const num = Number(formData.monthlyBudget);
      if (isNaN(num) || num < 0) {
        newErrors.monthlyBudget = 'Please enter a valid monthly budget in INR';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      college: formData.college.trim(),
      course: formData.course.trim(),
      semester: formData.semester.trim(),
      monthlyBudget: parseFloat(Number(formData.monthlyBudget).toFixed(2)),
      currency: formData.currency || 'INR'
    };

    if (profile && profile.studentId) {
      const res = await updateProfile(profile.studentId, payload);
      if (res.success) {
        setIsEditing(false);
      }
    } else {
      const res = await createProfile(payload);
      if (res.success) {
        setIsEditing(false);
      }
    }
    setIsSubmitting(false);
  };

  const initials = profile ? getInitials(profile.name) : (formData.name ? getInitials(formData.name) : 'ST');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Student Identity Card</h3>
              <p className="text-[11px] text-indigo-200">Official Student Profile & Budget Account</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            aria-label="Close profile modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {profile && !isEditing ? (
            /* VIEW MODE: Holographic Student ID Card */
            <div className="space-y-6">
              {/* Virtual Student ID Badge */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-brand-600 to-purple-800 p-6 text-white shadow-xl shadow-brand-900/20 border border-white/20">
                {/* Background decorative watermark */}
                <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
                  <GraduationCap className="w-48 h-48" />
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Top Bar: University & Verified Chip */}
                  <div className="flex items-start justify-between gap-2 border-b border-white/15 pb-3">
                    <div>
                      <p className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-200">
                        {profile.college}
                      </p>
                      <h4 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 mt-0.5">
                        <span>{profile.name}</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-300 inline" />
                      </h4>
                    </div>
                    <span className="px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-mono font-bold tracking-wider text-amber-300 border border-amber-300/30">
                      {profile.studentId}
                    </span>
                  </div>

                  {/* Middle Info: Course, Semester & Avatar */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-indigo-100">
                        <BookOpen className="w-3.5 h-3.5 text-brand-300 shrink-0" />
                        <span className="font-semibold">{profile.course}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-indigo-200">
                        <Calendar className="w-3.5 h-3.5 text-brand-300 shrink-0" />
                        <span>{profile.semester}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-indigo-200">
                        <Mail className="w-3.5 h-3.5 text-brand-300 shrink-0" />
                        <span className="truncate max-w-[200px]">{profile.email}</span>
                      </div>
                      {profile.phone && (
                        <div className="flex items-center gap-1.5 text-indigo-200">
                          <Phone className="w-3.5 h-3.5 text-brand-300 shrink-0" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Avatar Initials Badge */}
                    <div className="w-16 h-16 rounded-2xl bg-white text-brand-700 flex flex-col items-center justify-center font-extrabold text-xl shadow-lg border-2 border-white/80 shrink-0">
                      <span>{initials}</span>
                      <span className="text-[9px] font-bold text-slate-400 -mt-1 tracking-tighter">VERIFIED</span>
                    </div>
                  </div>

                  {/* Bottom Stats inside Card */}
                  <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] text-indigo-200 uppercase font-semibold">Monthly Budget</p>
                      <p className="text-base font-extrabold text-white">
                        {formatCurrency(profile.monthlyBudget || 15000, 'INR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-indigo-200 uppercase font-semibold">Member Since</p>
                      <p className="font-semibold text-indigo-100">
                        {new Date(profile.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details List */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">Student ID</span>
                  <span className="font-bold text-slate-800 font-mono">{profile.studentId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">Email Address</span>
                  <span className="font-bold text-slate-800">{profile.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">College / University</span>
                  <span className="font-bold text-slate-800">{profile.college}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="font-semibold text-slate-500">Course & Major</span>
                  <span className="font-bold text-slate-800">{profile.course}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-semibold text-slate-500">Monthly Spending Target</span>
                  <span className="font-extrabold text-emerald-600">
                    {formatCurrency(profile.monthlyBudget || 15000, 'INR')} / month
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/20 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          ) : (
            /* CREATE / EDIT FORM MODE */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-brand-50/70 border border-brand-100 rounded-2xl flex items-center gap-2.5 text-xs text-brand-800">
                <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                <span>
                  {profile
                    ? 'Update your student information and monthly expense limit.'
                    : 'Create your permanent student profile to unlock personalized budgeting and a unique Student ID.'}
                </span>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Aryama Singh"
                    className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-rose-400 focus:ring-rose-500/20'
                        : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Student Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="student@university.edu.in"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-rose-400 focus:ring-rose-500/20'
                          : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number <span className="text-slate-400 text-[10px] lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* College & Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    College / University <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="e.g. National Institute of Technology"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                        errors.college
                          ? 'border-rose-400 focus:ring-rose-500/20'
                          : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  {errors.college && <p className="text-xs text-rose-500 mt-1">{errors.college}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Course / Major <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="course"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="e.g. B.Tech Computer Science"
                      className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                        errors.course
                          ? 'border-rose-400 focus:ring-rose-500/20'
                          : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  {errors.course && <p className="text-xs text-rose-500 mt-1">{errors.course}</p>}
                </div>
              </div>

              {/* Semester & Budget (INR) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Year / Semester
                  </label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    placeholder="e.g. 6th Semester"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Monthly Budget (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="text-sm font-extrabold text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 select-none">
                      ₹
                    </span>
                    <input
                      type="number"
                      step="100"
                      min="0"
                      name="monthlyBudget"
                      value={formData.monthlyBudget}
                      onChange={handleChange}
                      placeholder="15000"
                      className={`w-full pl-8 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                        errors.monthlyBudget
                          ? 'border-rose-400 focus:ring-rose-500/20'
                          : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
                      }`}
                    />
                  </div>
                  {errors.monthlyBudget && <p className="text-xs text-rose-500 mt-1">{errors.monthlyBudget}</p>}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                {profile && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-md shadow-brand-500/25 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{profile ? 'Save Profile Changes' : 'Generate Student ID & Save'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
