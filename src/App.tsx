import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './design-system/theme-context';
import { ToastProvider } from './components/ui/toast';
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
import { CLASS_GRADES } from './design-system/tokens';
import { Sparkles, LayoutGrid } from 'lucide-react';

function BeyondClassroomPublicWebsite() {
  const [currentPage, setCurrentPage] = useState<PublicPage>('home');
  const [selectedGrade, setSelectedGrade] = useState<string>('class_5');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Dynamic SEO Meta Title & Description updates
  useEffect(() => {
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
  }, [currentPage]);

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

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
        return <TeamPage />;
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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--bg-primary)] flex flex-col transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header Navigation */}
      <PublicHeader
        activePage={currentPage}
        onNavigate={setCurrentPage}
        onOpenAuth={handleOpenAuth}
        selectedGrade={selectedGrade}
        onGradeSelect={setSelectedGrade}
      />

      {/* Main Page View Content */}
      <main className="flex-1 animate-fade-in">{renderCurrentPage()}</main>

      {/* Footer */}
      <PublicFooter onNavigate={setCurrentPage} onGradeSelect={setSelectedGrade} />

      {/* Login / Signup Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BeyondClassroomPublicWebsite />
      </ToastProvider>
    </ThemeProvider>
  );
}
