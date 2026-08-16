import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-4">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm mt-2 mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-md transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
