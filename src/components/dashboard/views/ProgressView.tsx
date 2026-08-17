import React from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  BookOpen,
  Calendar,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { currentStudent, practiceAttempts, progressSummary } = useStudent();
  const { chapters, contents } = useAdminStore();

  if (!currentStudent) return null;

  const studentClassChapters = chapters.filter((c) => c.classId === currentStudent.classId && c.isEnabled);
  const studentAttempts = practiceAttempts.filter((a) => a.studentId === currentStudent.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Learning Progress & Accuracy</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track your chapter coverage, practice paper scores, speed metrics, and historical question accuracy.
          </p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-500 block">Chapters Explored</span>
          <p className="text-2xl font-black text-white">
            {progressSummary.chaptersCompletedCount} / {progressSummary.totalChaptersCount}
          </p>
          <span className="text-[10px] text-indigo-400 font-bold">Class {currentStudent.classId.replace('class_', '')} Track</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-500 block">Overall Accuracy</span>
          <p className="text-2xl font-black text-emerald-400">{progressSummary.accuracyPercentage}%</p>
          <span className="text-[10px] text-emerald-300 font-bold">Top 10% Percentile</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-500 block">Assessments Taken</span>
          <p className="text-2xl font-black text-indigo-400">{progressSummary.practicePapersAttemptedCount}</p>
          <span className="text-[10px] text-slate-400 font-bold">Quizzes & Tests</span>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-500 block">Questions Solved</span>
          <p className="text-2xl font-black text-amber-400">{progressSummary.questionsAttemptedCount}</p>
          <span className="text-[10px] text-slate-400 font-bold">Step Proofs & MCQs</span>
        </div>
      </div>

      {/* Chapters Mastery Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
        <h2 className="text-base font-black text-white">Chapter-by-Chapter Learning Coverage</h2>

        <div className="space-y-4">
          {studentClassChapters.map((ch) => {
            const chAttempts = studentAttempts.filter((a) => a.chapterId === ch.id);
            const isCompleted = chAttempts.length > 0;
            const avgAccuracy =
              chAttempts.length > 0
                ? Math.round(chAttempts.reduce((acc, a) => acc + a.accuracyPercentage, 0) / chAttempts.length)
                : 0;

            return (
              <div key={ch.id} className="space-y-2 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">
                      Chapter {ch.chapterNumber}: {ch.title}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                        Attempted
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-slate-400">{isCompleted ? `${avgAccuracy}% Accuracy` : 'Not Started'}</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                    style={{ width: isCompleted ? `${avgAccuracy}%` : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Quiz Attempts Table */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-white">Assessment Attempt Log</h2>

        {studentAttempts.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No quiz attempts recorded yet. Start a practice paper to view results here!
          </div>
        ) : (
          <div className="space-y-3">
            {studentAttempts.map((att) => (
              <div
                key={att.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{att.id}</span>
                    <span className="text-xs text-slate-400">• {att.completedAt}</span>
                  </div>
                  <h3 className="text-sm font-black text-white">{att.contentTitle}</h3>
                  <p className="text-xs text-slate-400">
                    Time Spent: <strong className="text-slate-200">{Math.round(att.timeSpentSeconds / 60)} mins</strong> • Questions: <strong className="text-slate-200">{att.totalQuestions}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Score Earned</span>
                    <span className="text-base font-black text-emerald-400">{att.score} / {att.maxScore}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Accuracy</span>
                    <span className="text-base font-black text-indigo-400">{att.accuracyPercentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
