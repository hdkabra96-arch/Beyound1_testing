import React, { useState } from 'react';
import { CURRICULUM_GRADES } from '../../data/public-content';
import { BookOpen, CheckCircle2, ArrowRight, FileText, HelpCircle, Layers, Sparkles } from 'lucide-react';
import { PublicPage } from '../../types/public';

interface ClassCurriculumSectionProps {
  onNavigate?: (page: PublicPage) => void;
  onGradeSelect?: (gradeId: string) => void;
}

export const ClassCurriculumSection: React.FC<ClassCurriculumSectionProps> = ({
  onNavigate,
  onGradeSelect,
}) => {
  const [selectedGradeId, setSelectedGradeId] = useState('class_1');
  const activeGrade = CURRICULUM_GRADES.find((g) => g.id === selectedGradeId) || CURRICULUM_GRADES[0];

  return (
    <section className="py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Complete Class 1 to 8 Syllabus</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Mathematics by Grade Level
        </h2>
        <p className="text-sm text-slate-700 font-medium">
          Structured learning pathways crafted to build logical thinking, conceptual clarity, and speed calculations from primary to middle school.
        </p>
      </div>

      {/* Grade Selector Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 px-2">
        {CURRICULUM_GRADES.map((grade) => {
          const isSelected = selectedGradeId === grade.id;
          return (
            <button
              key={grade.id}
              onClick={() => setSelectedGradeId(grade.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 scale-105'
                  : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-100 hover:text-indigo-600'
              }`}
            >
              <span>Class {grade.gradeNumber}</span>
            </button>
          );
        })}
      </div>

      {/* Active Grade Content Card */}
      <div className="max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200">
                Class {activeGrade.gradeNumber} Mathematics
              </span>
              <span className="text-xs text-slate-600 font-bold">{activeGrade.subtitle}</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              {activeGrade.title} Curriculum Details
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-center min-w-[90px]">
              <span className="block text-xl font-black text-indigo-700">{activeGrade.topicsCount}</span>
              <span className="text-slate-800 font-bold">Chapters</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-center min-w-[90px]">
              <span className="block text-xl font-black text-emerald-700">{activeGrade.worksheetsCount}+</span>
              <span className="text-slate-800 font-bold">Worksheets</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-center min-w-[90px]">
              <span className="block text-xl font-black text-amber-700">{activeGrade.quizzesCount}+</span>
              <span className="text-slate-800 font-bold">Quizzes</span>
            </div>
          </div>
        </div>

        {/* Key Syllabus Chapters List */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
            Core Chapter Modules in Class {activeGrade.gradeNumber}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeGrade.keyTopics.map((topic, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 hover:bg-white hover:shadow-md transition-all"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-extrabold text-slate-900">{topic}</p>
                  <p className="text-[11px] font-medium text-slate-600 mt-0.5">
                    Includes video theory, 15+ practice sheets & answer key
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-600">
            Aligned with CBSE, ICSE, Cambridge & State Board Mathematics Benchmarks.
          </p>
          {onNavigate && (
            <button
              onClick={() => {
                if (onGradeSelect) onGradeSelect(activeGrade.id);
                onNavigate('packages');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <span>Enroll in Class {activeGrade.gradeNumber}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
