import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import ExpenseFormModal from './components/expenses/ExpenseFormModal';
import DeleteConfirmModal from './components/expenses/DeleteConfirmModal';
import ProfileModal from './components/profile/ProfileModal';
import SettingsModal from './components/settings/SettingsModal';
import ToastContainer from './components/ui/Toast';

// Pages
import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFound from './pages/NotFound';

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800 selection:bg-brand-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Top Navbar */}
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Dynamic Page Routes Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ExpenseFormModal />
      <DeleteConfirmModal />
      <ProfileModal />
      <SettingsModal />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ExpenseProvider>
        <AppContent />
      </ExpenseProvider>
    </Router>
  );
}

export default App;
