import React from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import { StudentDashboardSection } from '../../../types/student';
import {
  BookOpen,
  FileText,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface DashboardOverviewViewProps {
  onNavigate: (section: StudentDashboardSection, params?: { subjectId?: string; chapterId?: string }) => void;
  onOpenRenewal: () => void;
}

export const DashboardOverviewView: React.FC<DashboardOverviewViewProps> = ({
  onNavigate,
  onOpenRenewal,
}) => {
  const {
    currentStudent,
    activeEntitlement,
    daysRemaining,
    daysTotal,
    expiryStatus,
    isExpired,
    worksheetRequests,
    practiceAttempts,
    progressSummary,
  } = useStudent();

  const { subjects, chapters, contents, announcements } = useAdminStore();

  if (!currentStudent || !activeEntitlement) {
    return null;
  }

  // Filter subjects for the student's assigned class
  const studentSubjects = subjects.filter((s) => s.classId === currentStudent.classId && s.isEnabled);
  const studentClassChapters = chapters.filter((c) => c.classId === currentStudent.classId && c.isEnabled);
  const studentContents = contents.filter((cnt) => cnt.class_id === currentStudent.classId && cnt.is_published);
  const practicePapersCount = studentContents.filter((cnt) => cnt.content_type === 'practice_paper').length;
  const readyWorksheetsCount = worksheetRequests.filter((w) => w.studentId === currentStudent.id && w.status === 'ready').length;

  // Calculate percentage of validity remaining
  const validityPercent = Math.min(100, Math.max(0, Math.round((daysRemaining / (daysTotal || 365)) * 100)));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="space-y-2 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-black uppercase">
              {activeEntitlement.className}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
              Board: {currentStudent.board || 'CBSE'}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Enrolled
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {currentStudent.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Empower your mathematical thinking through rigorous NCERT & Olympiad practice, verified step proofs, and interactive worksheets.
          </p>
        </div>

        {/* Quick Action Pill on Welcome Banner */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('practice-papers')}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Start Daily Practice</span>
          </button>
          <button
            onClick={() => onNavigate('worksheet-requests')}
            className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Request Worksheet</span>
          </button>
        </div>
      </div>

      {/* Top 7 Metrics Summary Cards (Requirement 3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* 1. My Class */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">My Class</span>
          <p className="text-sm font-black text-white mt-1 truncate">{activeEntitlement.className}</p>
          <span className="text-[10px] text-indigo-400 font-bold mt-2">Active Curriculum</span>
        </div>

        {/* 2. My Package */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">My Package</span>
          <p className="text-sm font-black text-amber-400 mt-1 truncate">{activeEntitlement.packageName}</p>
          <span className="text-[10px] text-emerald-400 font-bold mt-2 uppercase">{activeEntitlement.status}</span>
        </div>

        {/* 3. Amount Paid */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Amount Paid</span>
          <p className="text-sm font-black text-white mt-1">₹{activeEntitlement.amountPaid.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 font-bold mt-2">Verified Direct</span>
        </div>

        {/* 4. Valid Until */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Valid Until</span>
          <p className="text-sm font-black text-white mt-1">{activeEntitlement.expiryDate}</p>
          <span className="text-[10px] text-slate-400 font-bold mt-2">Academic Pass</span>
        </div>

        {/* 5. Days Remaining */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Days Remaining</span>
          <p
            className={`text-sm font-black mt-1 ${
              daysRemaining <= 7 ? 'text-rose-400 animate-pulse' : daysRemaining <= 30 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {daysRemaining} Days
          </p>
          <span className="text-[10px] text-slate-400 font-bold mt-2">{validityPercent}% of cycle</span>
        </div>

        {/* 6. Practice Papers */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Practice Papers</span>
          <p className="text-sm font-black text-indigo-400 mt-1">{practicePapersCount} Available</p>
          <span className="text-[10px] text-slate-400 font-bold mt-2">Class 5 Level</span>
        </div>

        {/* 7. Worksheets */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Worksheets</span>
          <p className="text-sm font-black text-teal-400 mt-1">{readyWorksheetsCount} Ready</p>
          <span className="text-[10px] text-slate-400 font-bold mt-2">{worksheetRequests.length} Total</span>
        </div>
      </div>

      {/* Prominent Expiry Card (Requirement 4 & 5) */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          expiryStatus === 'expired'
            ? 'bg-rose-950/40 border-rose-800/80 shadow-rose-950/20'
            : expiryStatus === 'tomorrow' || expiryStatus === 'critical'
            ? 'bg-gradient-to-r from-rose-950/50 via-slate-900 to-slate-900 border-rose-800/80 shadow-lg'
            : expiryStatus === 'warning'
            ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-800/70 shadow-lg'
            : 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              {expiryStatus === 'expired' ? (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ) : expiryStatus === 'critical' || expiryStatus === 'tomorrow' ? (
                <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
              ) : expiryStatus === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}

              <h3 className="text-base font-black text-white">
                {expiryStatus === 'expired'
                  ? 'Your Package has Expired'
                  : expiryStatus === 'tomorrow'
                  ? 'Your package expires tomorrow!'
                  : expiryStatus === 'critical'
                  ? `Critical: Your package expires in ${daysRemaining} days!`
                  : expiryStatus === 'warning'
                  ? `Notice: Your package expires in ${daysRemaining} days`
                  : 'Your package is active and in good standing'}
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              {expiryStatus === 'expired'
                ? 'Your access to downloads and custom paper generators has been suspended. Renew now to restore full access.'
                : expiryStatus === 'critical' || expiryStatus === 'tomorrow'
                ? 'Renew your Beyond Classroom pass now to avoid disruption in your daily math homework & practice papers.'
                : expiryStatus === 'warning'
                ? 'Take advantage of our renewal discount to extend your academic access for another 365 days.'
                : `You have full access to all Class ${currentStudent.classId.replace('class_', '')} curriculum materials until ${activeEntitlement.expiryDate}.`}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenRenewal}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
                expiryStatus === 'expired' || expiryStatus === 'critical' || expiryStatus === 'tomorrow'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : expiryStatus === 'warning'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{isExpired ? 'Renew Package Now' : 'Renew / Extend Access'}</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar for Expiry */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold">
            <span className="text-slate-400">Validity Timeline</span>
            <span className={daysRemaining <= 30 ? 'text-amber-400' : 'text-emerald-400'}>
              {daysRemaining} Days Left of {daysTotal} Days Total
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all ${
                daysRemaining <= 7
                  ? 'bg-rose-500'
                  : daysRemaining <= 30
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
              }`}
              style={{ width: `${validityPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* MY SUBJECTS Section (Requirement 6) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-black text-white">My Subjects (Class {currentStudent.classId.replace('class_', '')})</h2>
          </div>
          <button
            onClick={() => onNavigate('subjects')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Subjects</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {studentSubjects.map((subj) => {
            const subjChapters = chapters.filter((c) => c.subjectId === subj.id && c.isEnabled);
            const subjContents = contents.filter((cnt) => cnt.subject_id === subj.id && cnt.is_published);
            const papersCount = subjContents.filter((cnt) => cnt.content_type === 'practice_paper').length;

            return (
              <div
                key={subj.id}
                onClick={() => onNavigate('subject-detail', { subjectId: subj.id })}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {subj.code}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{subj.board}</span>
                  </div>

                  <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                    {subj.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{subj.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold">
                    <span>{subjChapters.length} Chapters</span>
                    <span>•</span>
                    <span>{papersCount} Papers</span>
                  </div>
                  <span className="font-bold text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Explore <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of Learning Progress & Quick Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Learning Progress Widget */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-white">My Academic Progress</h3>
            </div>
            <button
              onClick={() => onNavigate('progress')}
              className="text-xs text-indigo-400 hover:underline font-bold cursor-pointer"
            >
              Details
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-400">Chapters Explored</span>
                <span className="text-white">
                  {progressSummary.chaptersCompletedCount} / {progressSummary.totalChaptersCount}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{
                    width: `${Math.round(
                      (progressSummary.chaptersCompletedCount / (progressSummary.totalChaptersCount || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-slate-400">Practice Paper Accuracy</span>
                <span className="text-emerald-400">{progressSummary.accuracyPercentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${progressSummary.accuracyPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Quizzes Taken</span>
              <span className="font-black text-white">{practiceAttempts.length} Completed</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Questions Solved</span>
              <span className="font-black text-indigo-400">{progressSummary.questionsAttemptedCount} Questions</span>
            </div>
          </div>
        </div>

        {/* Custom Worksheet Requests Status Widget */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-black text-white">Worksheet Requests</h3>
            </div>
            <button
              onClick={() => onNavigate('worksheet-requests')}
              className="text-xs text-indigo-400 hover:underline font-bold cursor-pointer"
            >
              Manage
            </button>
          </div>

          <div className="space-y-2.5">
            {worksheetRequests.slice(0, 2).map((req) => (
              <div key={req.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate max-w-[170px]">{req.topic}</span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                      req.status === 'ready'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : req.status === 'in_progress'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{req.chapterTitle}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('worksheet-requests')}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>+ Request New Custom Worksheet</span>
          </button>
        </div>

        {/* Academic Council Announcements */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-black text-white">Academic Notices</h3>
          </div>

          <div className="space-y-2.5">
            {announcements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] font-black text-indigo-400 uppercase">{ann.publishDate}</span>
                <h4 className="font-bold text-white text-xs">{ann.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
