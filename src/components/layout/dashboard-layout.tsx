import React, { useState } from 'react';
import { Navbar } from '../navigation/navbar';
import { Sidebar } from '../navigation/sidebar';
import { Footer } from '../navigation/footer';
import { ChevronRight, Home, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import { CLASS_GRADES } from '../../design-system/tokens';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  currentRole?: 'student' | 'admin' | 'affiliate';
  onRoleChange?: (role: 'student' | 'admin' | 'affiliate') => void;
  selectedGrade?: string;
  onGradeSelect?: (gradeId: string) => void;
  activeSection?: string;
  onSectionSelect?: (section: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentRole = 'student',
  onRoleChange,
  selectedGrade = 'class_5',
  onGradeSelect,
  activeSection = 'overview',
  onSectionSelect,
}) => {
  const activeGradeObj = CLASS_GRADES.find((g) => g.id === selectedGrade) || CLASS_GRADES[4];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--bg-primary)] flex flex-col transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={onRoleChange}
        selectedGrade={selectedGrade}
        onGradeSelect={onGradeSelect}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Collapsible Sidebar */}
        <Sidebar
          role={currentRole}
          activeSection={activeSection}
          onSectionSelect={onSectionSelect}
          selectedGrade={selectedGrade}
          onGradeSelect={onGradeSelect}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden">
          {/* Breadcrumbs & Active Class Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 hover:text-indigo-600 transition-colors">
                <Home className="w-3.5 h-3.5" /> Portal
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize text-slate-700 dark:text-slate-200">{currentRole}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-indigo-600 dark:text-indigo-400 capitalize">
                {activeSection.replace('-', ' ')}
              </span>
            </div>

            {currentRole === 'student' && (
              <div className="flex items-center gap-2">
                <Badge variant={selectedGrade.replace('_', '-') as any} size="md">
                  Active: {activeGradeObj.name}
                </Badge>
                <span className="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {activeGradeObj.description}
                </span>
              </div>
            )}
          </div>

          {/* Children View Canvas */}
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <Footer onGradeSelect={onGradeSelect} />
    </div>
  );
};
