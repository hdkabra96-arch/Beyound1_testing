import React, { useState } from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import { EducationalContent, ContentType } from '../../../types/admin';
import { StudentDashboardSection } from '../../../types/student';
import { ProtectedPdfViewer } from '../components/ProtectedPdfViewer';
import { InteractiveQuizRunner } from '../components/InteractiveQuizRunner';
import {
  ChevronLeft,
  BookOpen,
  FileText,
  Sparkles,
  Award,
  Lock,
  Download,
  Eye,
  Play,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface ChapterDetailViewProps {
  subjectId: string;
  chapterId: string;
  onNavigate: (section: StudentDashboardSection, params?: { subjectId?: string; chapterId?: string }) => void;
  onOpenRenewal: () => void;
}

export const ChapterDetailView: React.FC<ChapterDetailViewProps> = ({
  subjectId,
  chapterId,
  onNavigate,
  onOpenRenewal,
}) => {
  const { currentStudent, practiceAttempts } = useStudent();
  const { subjects, chapters, contents, canUserAccessContent, canStudentDownloadPDF } = useAdminStore();

  const [activeTab, setActiveTab] = useState<ContentType | 'all'>('all');
  const [readingContent, setReadingContent] = useState<EducationalContent | null>(null);
  const [runningQuizContent, setRunningQuizContent] = useState<EducationalContent | null>(null);

  const currentSubj = subjects.find((s) => s.id === subjectId) || subjects[0];
  const currentChapter = chapters.find((c) => c.id === chapterId) || chapters[0];

  // Contents for this chapter
  const chapterContents = contents.filter((cnt) => cnt.chapter_id === currentChapter?.id && cnt.is_published);

  // Filtered by tab
  const displayedContents =
    activeTab === 'all' ? chapterContents : chapterContents.filter((cnt) => cnt.content_type === activeTab);

  const tabs: { id: ContentType | 'all'; label: string; count: number }[] = [
    { id: 'all', label: 'All Content', count: chapterContents.length },
    {
      id: 'notes',
      label: '📖 Chapter Notes',
      count: chapterContents.filter((c) => c.content_type === 'notes').length,
    },
    {
      id: 'practice_paper',
      label: '📝 Practice Papers',
      count: chapterContents.filter((c) => c.content_type === 'practice_paper').length,
    },
    {
      id: 'solution',
      label: '💡 Solved Examples',
      count: chapterContents.filter((c) => c.content_type === 'solution').length,
    },
    {
      id: 'mcq',
      label: '🎯 MCQs & Quizzes',
      count: chapterContents.filter((c) => c.content_type === 'mcq').length,
    },
    {
      id: 'question_bank',
      label: '🧠 Question Bank',
      count: chapterContents.filter((c) => c.content_type === 'question_bank').length,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <button
          onClick={() => onNavigate('subjects')}
          className="hover:text-indigo-400 cursor-pointer"
        >
          Subjects
        </button>
        <span>/</span>
        <button
          onClick={() => onNavigate('subject-detail', { subjectId: currentSubj.id })}
          className="hover:text-indigo-400 cursor-pointer"
        >
          {currentSubj?.name}
        </button>
        <span>/</span>
        <span className="text-white truncate">Chapter {currentChapter?.chapterNumber}: {currentChapter?.title}</span>
      </div>

      {/* Chapter Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-black uppercase">
              Chapter {currentChapter?.chapterNumber}
            </span>
            <span className="text-xs font-bold text-slate-400">{currentSubj?.name}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">{currentChapter?.title}</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{currentChapter?.description}</p>
        </div>

        <button
          onClick={() => onNavigate('subject-detail', { subjectId: currentSubj.id })}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Subject</span>
        </button>
      </div>

      {/* Categorized Tabs (Requirement 8) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === tab.id ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content Items Grid (Requirement 8 & 9 with Access Rules Enforcement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedContents.map((cnt) => {
          // Check access permission strictly via AdminStore entitlement logic
          const accessCheck = currentStudent
            ? canUserAccessContent(currentStudent.id, cnt.id)
            : { allowed: false, reason: 'Please log in' };

          const downloadCheck = currentStudent
            ? canStudentDownloadPDF(currentStudent.id, cnt.id)
            : { allowed: false };

          const isAttempted = practiceAttempts.some((a) => a.contentId === cnt.id);
          const lastAttempt = practiceAttempts.find((a) => a.contentId === cnt.id);

          return (
            <div
              key={cnt.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                accessCheck.allowed
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-85'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {cnt.content_type.replace('_', ' ')}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {cnt.requires_pro_package && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> PRO Required
                      </span>
                    )}

                    {accessCheck.allowed ? (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-black text-white">{cnt.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cnt.description}</p>
                </div>

                {/* Badges for marks / questions */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-400">
                  {cnt.total_marks && <span>{cnt.total_marks} Marks</span>}
                  {cnt.time_limit_minutes && (
                    <>
                      <span>•</span>
                      <span>{cnt.time_limit_minutes} Mins</span>
                    </>
                  )}
                  {cnt.difficulty && (
                    <>
                      <span>•</span>
                      <span className="uppercase text-amber-400">{cnt.difficulty}</span>
                    </>
                  )}
                </div>

                {/* Previous Attempt Summary */}
                {isAttempted && lastAttempt && (
                  <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-bold">Last Score: {lastAttempt.score} / {lastAttempt.maxScore}</span>
                    <span className="text-emerald-400 font-black">{lastAttempt.accuracyPercentage}% Accuracy</span>
                  </div>
                )}
              </div>

              {/* Action Buttons with strict access enforcement */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                {accessCheck.allowed ? (
                  <>
                    <div className="flex items-center gap-2">
                      {/* Reading / Notes Viewer */}
                      {cnt.content_type === 'chapter_notes' || cnt.content_type === 'solved_example' || cnt.content_type === 'question_bank' ? (
                        <button
                          onClick={() => setReadingContent(cnt)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Read Notes</span>
                        </button>
                      ) : null}

                      {/* Interactive Quiz / Practice Runner */}
                      {cnt.content_type === 'practice_paper' || cnt.content_type === 'mcq_quiz' ? (
                        <button
                          onClick={() => setRunningQuizContent(cnt)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>{isAttempted ? 'Retake Practice' : 'Start Practice'}</span>
                        </button>
                      ) : null}
                    </div>

                    {/* Download button strictly guarded */}
                    {!cnt.disable_download && downloadCheck.allowed ? (
                      <a
                        href={cnt.pdf_url || '#'}
                        download={`${cnt.title}.pdf`}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>
                    ) : cnt.content_type === 'chapter_notes' ? (
                      <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-400" /> Protected Material
                      </span>
                    ) : null}
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between gap-3">
                    <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{accessCheck.reason || 'Locked by Package Tier'}</span>
                    </p>
                    <button
                      onClick={onOpenRenewal}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shrink-0"
                    >
                      Upgrade / Unlock
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Protected Document Reader Modal */}
      {readingContent && (
        <ProtectedPdfViewer content={readingContent} onClose={() => setReadingContent(null)} />
      )}

      {/* Interactive Quiz Runner Modal */}
      {runningQuizContent && (
        <InteractiveQuizRunner content={runningQuizContent} onClose={() => setRunningQuizContent(null)} />
      )}
    </div>
  );
};
