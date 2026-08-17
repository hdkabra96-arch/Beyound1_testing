import React, { useState, useEffect } from 'react';
import { PublicPage } from '../../types/public';
import { useTheme } from '../../design-system/theme-context';
import { useStudent } from '../../services/student-context';
import {
  Calculator,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  UserCheck,
  LogIn,
  UserPlus,
  BookOpen,
  GraduationCap,
  Award,
  LayoutDashboard,
} from 'lucide-react';
import { CLASS_GRADES } from '../../design-system/tokens';

interface PublicHeaderProps {
  activePage: PublicPage;
  onNavigate: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenDashboard?: () => void;
  selectedGrade?: string;
  onGradeSelect?: (gradeId: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  activePage,
  onNavigate,
  onOpenAuth,
  onOpenDashboard,
  selectedGrade = 'class_5',
  onGradeSelect,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { currentStudent } = useStudent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; page: PublicPage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Our Package', page: 'packages' },
    { label: 'Course & Content', page: 'course-content' },
    { label: 'Our Partners', page: 'partners' },
    { label: 'Our Team Members', page: 'team' },
    { label: 'Career', page: 'career' },
    { label: 'Contact Us', page: 'contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md shadow-slate-900/5'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo Brand */}
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900">
                  BEYOND
                </span>
                <span className="font-bold text-[11px] tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Classroom
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-600 tracking-wide">
                Class 1 to Class 8 Mathematics
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'text-slate-800 hover:text-indigo-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Grade Switcher Dropdown */}
            {onGradeSelect && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-900 flex items-center gap-2 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>
                    {CLASS_GRADES.find((g) => g.id === selectedGrade)?.name || 'Class 5'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-fade-in">
                    <p className="text-[10px] uppercase font-extrabold text-slate-500 px-3 py-1">
                      Quick Grade Switcher
                    </p>
                    <div className="space-y-1">
                      {CLASS_GRADES.map((grade) => (
                        <button
                          key={grade.id}
                          onClick={() => {
                            onGradeSelect(grade.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                            selectedGrade === grade.id
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          <span>{grade.name}</span>
                          <span className="text-[10px] opacity-80">{grade.shortName}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 hover:text-indigo-600 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            {/* Student Dashboard Direct Access Button */}
            {onOpenDashboard && (
              <button
                onClick={onOpenDashboard}
                className="px-3.5 py-2 rounded-xl text-xs font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Open Student Dashboard"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Student Dashboard</span>
                {currentStudent && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </button>
            )}

            {/* Auth Buttons */}
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 hover:text-indigo-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-600" />
              <span>Login</span>
            </button>

            <button
              onClick={() => onOpenAuth('signup')}
              className="px-4.5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 hover:opacity-95 shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-white" />
              <span>Signup</span>
            </button>
          </div>

          {/* Mobile Menu Trigger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-fade-in shadow-2xl">
          <nav className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold text-left cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {onOpenDashboard && (
            <button
              onClick={() => {
                onOpenDashboard();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Enter Student Dashboard</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenAuth('login');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-center text-slate-900 hover:bg-slate-100"
            >
              Login
            </button>
            <button
              onClick={() => {
                onOpenAuth('signup');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-500 text-white text-xs font-bold text-center shadow-md"
            >
              Signup
            </button>
          </div>
        </div>
      )}
      {/* Subtle Brand Accent Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 via-cyan-500 via-blue-600 via-purple-600 via-fuchsia-500 to-amber-500 opacity-75" />
    </header>
  );
};
