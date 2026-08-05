import React, { useState } from 'react';
import { CURRICULUM_GRADES } from '../data/public-content';
import { PublicPage } from '../types/public';
import { BookOpen, Download, FileText, CheckCircle2, Search, ArrowRight } from 'lucide-react';

interface CourseContentPageProps {
  onNavigate: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  selectedGrade?: string;
  onGradeSelect?: (gradeId: string) => void;
}

export const CourseContentPage: React.FC<CourseContentPageProps> = ({
  onNavigate,
  onOpenAuth,
  selectedGrade = 'class_5',
  onGradeSelect,
}) => {
  const [activeGradeId, setActiveGradeId] = useState(selectedGrade);
  const [searchQuery, setSearchQuery] = useState('');

  const activeGrade = CURRICULUM_GRADES.find((g) => g.id === activeGradeId) || CURRICULUM_GRADES[4];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Complete Class 1 to Class 8 Directory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Curriculum & Chapter Contents
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Browse comprehensive chapter topics, video modules, practice problem sets, and downloadable formula blueprints across all 8 grades.
        </p>
      </div>

      {/* Grade Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {CURRICULUM_GRADES.map((grade) => {
          const isActive = activeGradeId === grade.id;
          return (
            <button
              key={grade.id}
              onClick={() => {
                setActiveGradeId(grade.id);
                if (onGradeSelect) onGradeSelect(grade.id);
              }}
              className={`p-3 rounded-2xl text-center transition-all cursor-pointer border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/25 scale-105 font-bold'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="block text-xs font-extrabold">Class {grade.gradeNumber}</span>
              <span className="text-[10px] opacity-75">{grade.topicsCount} Topics</span>
            </button>
          );
        })}
      </div>

      {/* Grade Detailed Overview */}
      <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeGrade.badgeBg} ${activeGrade.badgeText}`}>
              Class {activeGrade.gradeNumber} Mathematics
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
              {activeGrade.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeGrade.subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Class {activeGrade.gradeNumber} Sample Worksheets</span>
            </button>
          </div>
        </div>

        {/* Chapters list */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Detailed Syllabus Chapters ({activeGrade.keyTopics.length} Core Units)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGrade.keyTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 hover:border-indigo-500/40 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{topic}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      15+ Practice Worksheets • Video Theory • Answer Key PDF
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  Preview Unit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
