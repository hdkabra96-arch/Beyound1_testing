import React, { useState } from 'react';
import { useStudent } from '../../services/student-context';
import { useAdminStore } from '../../services/admin-store';
import { StudentDashboardSection } from '../../types/student';
import { useTheme } from '../../design-system/theme-context';

import { DashboardOverviewView } from './views/DashboardOverviewView';
import { SubjectsView } from './views/SubjectsView';
import { SubjectDetailView } from './views/SubjectDetailView';
import { ChapterDetailView } from './views/ChapterDetailView';
import { PracticePapersView } from './views/PracticePapersView';
import { WorksheetRequestsView } from './views/WorksheetRequestsView';
import { ProgressView } from './views/ProgressView';
import { MyPackageView } from './views/MyPackageView';
import { PaymentHistoryView } from './views/PaymentHistoryView';
import { MyAccountView } from './views/MyAccountView';
import { NotificationsView } from './views/NotificationsView';
import { RenewalCheckoutModal } from './components/RenewalCheckoutModal';

import {
  LayoutDashboard,
  BookOpen,
  FileText,
  TrendingUp,
  Zap,
  CreditCard,
  User,
  Bell,
  LogOut,
  ChevronRight,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Menu,
  X,
  Sun,
  Moon,
  Users,
  CheckCircle2,
  ArrowLeft,
  Calculator,
  Compass,
} from 'lucide-react';

interface StudentDashboardRootProps {
  onViewPublicSite: () => void;
  onOpenAdminPortal?: () => void;
}

export const StudentDashboardRoot: React.FC<StudentDashboardRootProps> = ({
  onViewPublicSite,
  onOpenAdminPortal,
}) => {
  const {
    currentStudent,
    activeEntitlement,
    daysRemaining,
    daysTotal,
    expiryStatus,
    isExpired,
    unreadNotificationsCount,
    logoutStudent,
    switchStudent,
  } = useStudent();

  const { students } = useAdminStore();
  const { theme, toggleTheme } = useTheme();

  const [activeSection, setActiveSection] = useState<StudentDashboardSection>('overview');
  const [activeSubjectId, setActiveSubjectId] = useState<string>('math_5_core');
  const [activeChapterId, setActiveChapterId] = useState<string>('ch_5_1');
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [studentSwitcherOpen, setStudentSwitcherOpen] = useState(false);

  const handleNavigate = (
    section: StudentDashboardSection,
    params?: { subjectId?: string; chapterId?: string }
  ) => {
    if (params?.subjectId) setActiveSubjectId(params.subjectId);
    if (params?.chapterId) setActiveChapterId(params.chapterId);
    setActiveSection(section);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navMenuItems: { id: StudentDashboardSection; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'subjects', label: 'My Subjects', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'practice-papers', label: 'Practice Papers', icon: <FileText className="w-4 h-4" /> },
    { id: 'worksheet-requests', label: 'Worksheet Requests', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'progress', label: 'Learning Progress', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'my-package', label: 'My Package & Validity', icon: <Zap className="w-4 h-4" />, badge: `${daysRemaining}d` },
    { id: 'payment-history', label: 'Payment History', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'my-account', label: 'My Profile & Account', icon: <User className="w-4 h-4" /> },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
  ];

  if (!currentStudent || !activeEntitlement) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
          <GraduationCap className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black">Student Session Not Found</h2>
        <p className="text-xs text-slate-400 max-w-md">
          Please select a student profile or login to access the Beyond Classroom Student Dashboard.
        </p>
        <button
          onClick={onViewPublicSite}
          className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
        >
          Return to Public Site
        </button>
      </div>
    );
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <DashboardOverviewView
            onNavigate={handleNavigate}
            onOpenRenewal={() => setIsRenewalModalOpen(true)}
          />
        );
      case 'subjects':
        return <SubjectsView onNavigate={handleNavigate} />;
      case 'subject-detail':
        return (
          <SubjectDetailView
            subjectId={activeSubjectId}
            onNavigate={handleNavigate}
          />
        );
      case 'chapter-detail':
        return (
          <ChapterDetailView
            subjectId={activeSubjectId}
            chapterId={activeChapterId}
            onNavigate={handleNavigate}
            onOpenRenewal={() => setIsRenewalModalOpen(true)}
          />
        );
      case 'practice-papers':
        return (
          <PracticePapersView
            onOpenRenewal={() => setIsRenewalModalOpen(true)}
          />
        );
      case 'worksheet-requests':
        return <WorksheetRequestsView />;
      case 'progress':
        return <ProgressView />;
      case 'my-package':
        return <MyPackageView onOpenRenewal={() => setIsRenewalModalOpen(true)} />;
      case 'payment-history':
        return <PaymentHistoryView />;
      case 'my-account':
        return <MyAccountView />;
      case 'notifications':
        return <NotificationsView />;
      default:
        return (
          <DashboardOverviewView
            onNavigate={handleNavigate}
            onOpenRenewal={() => setIsRenewalModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Universal Dashboard App Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Brand + Mobile Trigger */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Toggle Dashboard Menu"
              >
                {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <button
                onClick={onViewPublicSite}
                className="flex items-center gap-2.5 group cursor-pointer text-left"
                title="Return to Public Website"
              >
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                  <Calculator className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-white tracking-tight">BEYOND</span>
                    <span className="font-bold text-[9px] uppercase px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      Student Desk
                    </span>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400">Class 1 to 8 Mathematics</p>
                </div>
              </button>
            </div>

            {/* Middle Quick Navigation Pills (Desktop only) */}
            <div className="hidden md:flex items-center gap-2">
              <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                <span>{activeEntitlement.className}</span>
              </div>

              <div
                className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${
                  daysRemaining <= 7
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : daysRemaining <= 30
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{daysRemaining} Days Left</span>
              </div>
            </div>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Student Account Switcher Simulation Menu */}
              <div className="relative">
                <button
                  onClick={() => setStudentSwitcherOpen(!studentSwitcherOpen)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
                  title="Switch Mock Student"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">{currentStudent.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({activeEntitlement.packageName.split(' ')[0]})</span>
                </button>

                {studentSwitcherOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-fade-in text-xs">
                    <p className="text-[10px] uppercase font-black text-slate-500 px-3 py-1.5">
                      Switch Student Profile
                    </p>
                    <div className="space-y-1">
                      {students.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            switchStudent(s.id);
                            setStudentSwitcherOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                            s.id === currentStudent.id
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div>
                            <p className="font-bold">{s.name}</p>
                            <p className="text-[10px] opacity-75">
                              Class {s.classId.replace('class_', '')} • {s.packageName}
                            </p>
                          </div>
                          {s.id === currentStudent.id && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Bell Icon */}
              <button
                onClick={() => handleNavigate('notifications')}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white relative cursor-pointer"
                title="View Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Toggle UI Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              </button>

              {/* Back to Public Site */}
              <button
                onClick={onViewPublicSite}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
                title="Return to Public Website"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Public Site</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body with Fixed Sidebar & Fluid Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Left Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-4">
          {/* User Profile Mini Badge */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 text-white font-black text-sm flex items-center justify-center shadow-md">
                {currentStudent.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-white truncate">{currentStudent.name}</h4>
                <p className="text-[10px] text-slate-400 truncate">{currentStudent.email}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold">
              <span className="text-indigo-400">{activeEntitlement.className}</span>
              <span className="text-emerald-400 uppercase">{activeEntitlement.packageName.split(' ')[0]}</span>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="p-2 rounded-3xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
            {navMenuItems.map((item) => {
              const isActive =
                activeSection === item.id ||
                ((item.id === 'subjects' || item.id === 'overview') &&
                  (activeSection === 'subject-detail' || activeSection === 'chapter-detail'));
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-800 text-white'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Upgrade / Extend Promo Pill */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-800/50 space-y-2 shadow-lg">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Full Academic Pass</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Instant access to all solved proofs, interactive quizzes, and custom worksheets.
            </p>
            <button
              onClick={() => setIsRenewalModalOpen(true)}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow-md shadow-indigo-600/20"
            >
              Extend / Upgrade
            </button>
          </div>

          {/* Exit / Logout */}
          <button
            onClick={() => {
              logoutStudent();
              onViewPublicSite();
            }}
            className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-rose-950/30 hover:border-rose-800/50 text-slate-400 hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
            <div className="w-72 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between overflow-y-auto animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-indigo-400" />
                    <span className="font-black text-sm text-white">Student Desk</span>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Student Profile Badge */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <p className="text-xs font-black text-white">{currentStudent.name}</p>
                  <p className="text-[10px] text-slate-400">{activeEntitlement.className}</p>
                </div>

                {/* Mobile Nav Links */}
                <nav className="space-y-1">
                  {navMenuItems.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white font-black'
                            : 'text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={onViewPublicSite}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Public Website</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Dynamic Workspace Container */}
        <main className="flex-1 min-w-0">{renderActiveSection()}</main>
      </div>

      {/* Renewal / Upgrade Checkout Modal */}
      {isRenewalModalOpen && (
        <RenewalCheckoutModal
          onClose={() => setIsRenewalModalOpen(false)}
          onSuccess={() => setIsRenewalModalOpen(false)}
        />
      )}
    </div>
  );
};
