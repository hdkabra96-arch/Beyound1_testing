import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './design-system/theme-context';
import { ToastProvider } from './components/ui/toast';
import { AdminAuthProvider, useAdminAuth } from './services/admin-auth-context';
import { AdminStoreProvider, useAdminStore } from './services/admin-store';
import { StudentProvider, useStudent } from './services/student-context';
import { AffiliateProvider, useAffiliate } from './services/affiliate-context';
import { AdminRoot } from './components/admin/AdminRoot';
import { StudentDashboardRoot } from './components/dashboard/StudentDashboardRoot';

import { PublicHeader } from './components/public/Header';
import { PublicFooter } from './components/public/PublicFooter';
import { AuthModal } from './components/public/AuthModal';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PackagesPage } from './pages/PackagesPage';
import { CourseContentPage } from './pages/CourseContentPage';
import { PartnersPage } from './pages/PartnersPage';
import { TeamPage } from './pages/TeamPage';
import { CareerPage } from './pages/CareerPage';
import { BlogPage } from './pages/BlogPage';
import { FaqPage } from './pages/FaqPage';
import { ContactPage } from './pages/ContactPage';
import { AffiliatePage } from './pages/AffiliatePage';
import { LegalPages } from './pages/LegalPages';

import { PublicPage } from './types/public';
import { Shield, Sparkles, LayoutGrid, AlertTriangle, LayoutDashboard, GraduationCap, Gift } from 'lucide-react';

function BeyondClassroomApp() {
  const [viewMode, setViewMode] = useState<'public' | 'admin' | 'dashboard'>('public');
  const [currentPage, setCurrentPage] = useState<PublicPage>('home');
  const [selectedGrade, setSelectedGrade] = useState<string>('class_5');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const { currentAdmin } = useAdminAuth();
  const { globalSettings } = useAdminStore();
  const { currentStudent } = useStudent();

  // Dynamic SEO Meta Title & Description updates
  useEffect(() => {
    if (viewMode === 'admin') {
      document.title = 'Beyond Classroom | Administration Control Center';
      return;
    }
    if (viewMode === 'dashboard') {
      document.title = 'Student Dashboard | Beyond Classroom Math Desk';
      return;
    }

    const pageTitles: Record<PublicPage, string> = {
      home: 'Beyond Classroom | Class 1 to 8 Mathematics Excellence',
      about: 'About Us | Beyond Classroom - Redefining K-8 Mathematics',
      packages: 'Our Packages & Pricing | Class 1-8 Math Pass',
      'course-content': 'Course & Content Directory | Class 1-8 Curriculum',
      partners: 'Our School Partners & Accreditation | Beyond Classroom',
      team: 'Our Team Members | Mathematicians & Educators',
      career: 'Careers at Beyond Classroom | EdTech Opportunities',
      blog: 'Educational Blog & Insights | Math Learning Strategies',
      faq: 'Frequently Asked Questions | Beyond Classroom Support',
      contact: 'Contact Us | Academic & Institutional Support',
      affiliate: 'Affiliate Program | Earn 20% Commission',
      privacy: 'Privacy Policy | Beyond Classroom Security',
      refund: 'Refund & Cancellation Policy | Beyond Classroom',
      terms: 'Terms & Conditions | Beyond Classroom Platform',
    };

    document.title = pageTitles[currentPage] || 'Beyond Classroom';
  }, [currentPage, viewMode]);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  // If in Student Dashboard mode, render Student Dashboard Root
  if (viewMode === 'dashboard') {
    return (
      <StudentDashboardRoot
        onViewPublicSite={() => setViewMode('public')}
        onOpenAdminPortal={() => setViewMode('admin')}
      />
    );
  }

  // If in Admin mode, render full Admin Portal
  if (viewMode === 'admin') {
    return <AdminRoot onViewPublicSite={() => setViewMode('public')} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={setCurrentPage}
            onOpenAuth={handleOpenAuth}
            onGradeSelect={setSelectedGrade}
          />
        );
      case 'about':
        return <AboutPage onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} />;
      case 'packages':
        return <PackagesPage onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} />;
      case 'course-content':
        return (
          <CourseContentPage
            onNavigate={setCurrentPage}
            onOpenAuth={handleOpenAuth}
            selectedGrade={selectedGrade}
            onGradeSelect={setSelectedGrade}
          />
        );
      case 'partners':
        return <PartnersPage onNavigate={setCurrentPage} />;
      case 'team':
        return <TeamPage onNavigate={setCurrentPage} onOpenAuth={handleOpenAuth} />;
      case 'career':
        return <CareerPage />;
      case 'blog':
        return <BlogPage />;
      case 'faq':
        return <FaqPage />;
      case 'contact':
        return <ContactPage />;
      case 'affiliate':
        return <AffiliatePage />;
      case 'privacy':
        return <LegalPages type="privacy" />;
      case 'refund':
        return <LegalPages type="refund" />;
      case 'terms':
        return <LegalPages type="terms" />;
      default:
        return (
          <HomePage
            onNavigate={setCurrentPage}
            onOpenAuth={handleOpenAuth}
            onGradeSelect={setSelectedGrade}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--bg-primary)] flex flex-col transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Maintenance Mode Banner Notice if active */}
      {globalSettings?.maintenanceMode?.isEnabled && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-md">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            {globalSettings.maintenanceMode.title}: {globalSettings.maintenanceMode.message}
          </span>
          {globalSettings.maintenanceMode.expectedAvailability && (
            <span className="opacity-80">({globalSettings.maintenanceMode.expectedAvailability})</span>
          )}
        </div>
      )}

      {/* Top Header Navigation */}
      <PublicHeader
        activePage={currentPage}
        onNavigate={setCurrentPage}
        onOpenAuth={handleOpenAuth}
        onOpenDashboard={() => setViewMode('dashboard')}
        selectedGrade={selectedGrade}
        onGradeSelect={setSelectedGrade}
      />

      {/* Main Page View Content */}
      <main className="flex-1 animate-fade-in">{renderCurrentPage()}</main>

      {/* Footer */}
      <PublicFooter onNavigate={setCurrentPage} onGradeSelect={setSelectedGrade} />

      {/* Floating Mode Switcher (Student Dashboard, Admin Portal & Affiliate Portal) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => {
            setCurrentPage('affiliate');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-500/90 hover:bg-amber-500 border border-amber-400/50 text-slate-950 text-xs font-black shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer group"
          title="Open Affiliate & Partner Portal"
        >
          <Gift className="w-3.5 h-3.5 text-slate-950" />
          <span>Affiliate Hub</span>
        </button>

        <button
          onClick={() => setViewMode('dashboard')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-indigo-600/95 hover:bg-indigo-600 border border-indigo-400/50 text-white text-xs font-bold shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer group"
          title="Open Student Learning Dashboard"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping group-hover:bg-white" />
          <LayoutDashboard className="w-3.5 h-3.5 text-white" />
          <span>Student Dashboard</span>
        </button>

        <button
          onClick={() => setViewMode('admin')}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 border border-slate-700/80 hover:border-indigo-500/80 text-white text-xs font-bold shadow-2xl backdrop-blur-md transition-all hover:scale-105 cursor-pointer group"
          title="Open Beyond Classroom Admin Panel"
        >
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          <span>Admin Portal</span>
        </button>
      </div>

      {/* Login / Signup Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => setViewMode('dashboard')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <AdminStoreProvider>
          <StudentProvider>
            <AffiliateProvider>
              <ToastProvider>
                <BeyondClassroomApp />
              </ToastProvider>
            </AffiliateProvider>
          </StudentProvider>
        </AdminStoreProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
