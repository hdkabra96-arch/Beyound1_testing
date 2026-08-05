import React, { useState } from 'react';
import {
  GraduationCap,
  Sun,
  Moon,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  User,
  ShieldAlert,
  Share2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../design-system/theme-context';
import { CLASS_GRADES } from '../../design-system/tokens';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export interface NavbarProps {
  currentRole?: 'student' | 'admin' | 'affiliate';
  onRoleChange?: (role: 'student' | 'admin' | 'affiliate') => void;
  selectedGrade?: string;
  onGradeSelect?: (gradeId: string) => void;
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole = 'student',
  onRoleChange,
  selectedGrade = 'class_5',
  onGradeSelect,
  onSearchClick,
}) => {
  const { effectiveTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gradeDropdownOpen, setGradeDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const activeGradeObj = CLASS_GRADES.find((g) => g.id === selectedGrade) || CLASS_GRADES[4];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Class Selector */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                Beyond <span className="gradient-text-indigo">Classroom</span>
              </span>
              <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Class 1–8 Mathematics
              </span>
            </div>
          </div>

          {/* Grade Quick Selector Dropdown (Desktop) */}
          <div className="hidden lg:relative lg:block">
            <button
              onClick={() => setGradeDropdownOpen(!gradeDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm hover:border-indigo-500/50 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>{activeGradeObj.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {gradeDropdownOpen && (
              <div
                onClick={() => setGradeDropdownOpen(false)}
                className="absolute top-full left-0 mt-2 w-64 glass-card p-2 rounded-2xl shadow-2xl z-50 grid grid-cols-2 gap-1 border border-indigo-500/20"
              >
                {CLASS_GRADES.map((grade) => (
                  <button
                    key={grade.id}
                    onClick={() => {
                      onGradeSelect?.(grade.id);
                      setGradeDropdownOpen(false);
                    }}
                    className={`
                      p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors
                      ${
                        selectedGrade === grade.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                      }
                    `}
                  >
                    <span>{grade.name}</span>
                    <span className="text-[10px] opacity-75">{grade.shortName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Bar & Portal Links (Desktop) */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
          <button
            onClick={onSearchClick}
            className="w-full flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-400 dark:text-slate-500 hover:border-indigo-500/50 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-500" />
              <span>Search math topics, worksheets, Class 1-8...</span>
            </span>
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Switcher Pill */}
          {onRoleChange && (
            <div className="hidden sm:flex items-center p-1 rounded-2xl bg-slate-200/60 dark:bg-slate-900/80 border border-slate-300/50 dark:border-slate-800 text-xs font-semibold">
              <button
                onClick={() => onRoleChange('student')}
                className={`px-3 py-1 rounded-xl transition-all ${
                  currentRole === 'student'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => onRoleChange('admin')}
                className={`px-3 py-1 rounded-xl transition-all ${
                  currentRole === 'admin'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Admin
              </button>
              <button
                onClick={() => onRoleChange('affiliate')}
                className={`px-3 py-1 rounded-xl transition-all ${
                  currentRole === 'affiliate'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Affiliate
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all cursor-pointer"
          >
            {effectiveTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Notification Bell */}
          <button
            aria-label="Notifications"
            className="relative p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {/* User Profile Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                BC
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userMenuOpen && (
              <div
                onClick={() => setUserMenuOpen(false)}
                className="absolute right-0 top-full mt-2 w-56 glass-card p-2 rounded-2xl shadow-2xl z-50 border border-indigo-500/20 space-y-1 text-xs"
              >
                <div className="p-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <p className="font-bold text-slate-900 dark:text-slate-100">Aarav Sharma</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Class 5 Mathematics</p>
                  <Badge variant="success" size="sm" className="mt-1.5">
                    Pro Plan Active
                  </Badge>
                </div>
                <button className="w-full p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <User className="w-4 h-4 text-indigo-500" /> Profile & Grade
                </button>
                <button className="w-full p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Subscription Plan
                </button>
                <button className="w-full p-2 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-rose-500">
                  <ShieldAlert className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Select Class Grade</p>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {CLASS_GRADES.map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => {
                    onGradeSelect?.(grade.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-xl text-center text-xs font-bold ${
                    selectedGrade === grade.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {grade.shortName}
                </button>
              ))}
            </div>
          </div>

          {onRoleChange && (
            <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Portal Access</p>
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant={currentRole === 'student' ? 'primary-gradient' : 'secondary'}
                  onClick={() => {
                    onRoleChange('student');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1"
                >
                  Student
                </Button>
                <Button
                  size="sm"
                  variant={currentRole === 'admin' ? 'primary-gradient' : 'secondary'}
                  onClick={() => {
                    onRoleChange('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1"
                >
                  Admin
                </Button>
                <Button
                  size="sm"
                  variant={currentRole === 'affiliate' ? 'primary-gradient' : 'secondary'}
                  onClick={() => {
                    onRoleChange('affiliate');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1"
                >
                  Affiliate
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
