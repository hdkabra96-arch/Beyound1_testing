import React, { useState } from 'react';
import {
  BookOpen,
  Award,
  Layers,
  FileText,
  BarChart3,
  Users,
  CreditCard,
  Link2,
  Settings,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CLASS_GRADES } from '../../design-system/tokens';
import { Badge } from '../ui/badge';

export interface SidebarProps {
  role?: 'student' | 'admin' | 'affiliate';
  activeSection?: string;
  onSectionSelect?: (section: string) => void;
  selectedGrade?: string;
  onGradeSelect?: (gradeId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role = 'student',
  activeSection = 'overview',
  onSectionSelect,
  selectedGrade = 'class_5',
  onGradeSelect,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const studentNavItems: NavItem[] = [
    { id: 'overview', label: 'Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'curriculum', label: 'Math Curriculum', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'worksheets', label: 'Worksheets & PDFs', icon: <FileText className="w-4 h-4" />, badge: 'New' },
    { id: 'quizzes', label: 'Practice & Quizzes', icon: <Zap className="w-4 h-4" /> },
    { id: 'progress', label: 'My Progress', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin-overview', label: 'Admin Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'curriculum-manager', label: 'Curriculum Manager', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'students', label: 'Student Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'file-library', label: 'Storage & Materials', icon: <FileText className="w-4 h-4" /> },
    { id: 'subscriptions', label: 'Subscriptions & Sales', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Platform Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const affiliateNavItems: NavItem[] = [
    { id: 'affiliate-overview', label: 'Affiliate Portal', icon: <Layers className="w-4 h-4" /> },
    { id: 'referral-links', label: 'My Referral Links', icon: <Link2 className="w-4 h-4" /> },
    { id: 'conversions', label: 'Conversions & Logs', icon: <FileText className="w-4 h-4" /> },
    { id: 'payouts', label: 'Payouts & Earnings', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const navItems =
    role === 'admin' ? adminNavItems : role === 'affiliate' ? affiliateNavItems : studentNavItems;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col h-[calc(100vh-4.5rem)] sticky top-18 z-30
          glass-panel border-r border-slate-200/80 dark:border-slate-800/80
          transition-all duration-300 ease-in-out shrink-0
          ${collapsed ? 'w-20 p-3' : 'w-64 p-4'}
        `}
      >
        {/* Toggle Collapse Button */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-slate-800/80">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Badge variant={role === 'admin' ? 'danger' : role === 'affiliate' ? 'warning' : 'primary'}>
                {role.toUpperCase()} PORTAL
              </Badge>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Sidebar"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionSelect?.(item.id)}
                className={`
                  w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer group
                  ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {!collapsed && item.badge && (
                  <Badge variant="warning" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        {/* Grade Quick Switcher (When in Student mode) */}
        {role === 'student' && !collapsed && (
          <div className="mt-4 p-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Math Grade
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="grid grid-cols-4 gap-1">
              {CLASS_GRADES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => onGradeSelect?.(g.id)}
                  className={`p-1.5 rounded-lg text-[11px] font-extrabold text-center transition-all ${
                    selectedGrade === g.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-white'
                  }`}
                >
                  {g.shortName}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-slate-200 dark:border-slate-800 p-2 flex items-center justify-around shadow-2xl">
        {navItems.slice(0, 4).map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionSelect?.(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold transition-colors ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
