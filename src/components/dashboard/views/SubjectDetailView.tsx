import React from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import { StudentDashboardSection } from '../../../types/student';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Award,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SubjectDetailViewProps {
  subjectId: string;
  onNavigate: (section: StudentDashboardSection, params?: { subjectId?: string; chapterId?: string }) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({ subjectId, onNavigate }) => {
  const { currentStudent, practiceAttempts } = useStudent();
  const { subjects, chapters, contents, classes } = useAdminStore();

  const currentSubj = subjects.find((s) => s.id === subjectId) || subjects[0];
  const classObj = classes.find((c) => c.id === currentStudent?.classId);
  const subjectChapters = chapters
    .filter((c) => c.subjectId === currentSubj?.id && c.isEnabled)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
        <button
          onClick={() => onNavigate('subjects')}
          className="hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>All Subjects</span>
        </button>
        <span>/</span>
        <span className="text-white">{currentSubj?.name}</span>
      </div>

      {/* Subject Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-black uppercase">
              {currentSubj?.code}
            </span>
            <span className="text-xs font-bold text-slate-400">
              {classObj?.name || 'Class 5'} • {currentSubj?.board}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white">{currentSubj?.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{currentSubj?.description}</p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 shrink-0 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Chapters</span>
            <span className="text-xl font-black text-white">{subjectChapters.length}</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Assessments</span>
            <span className="text-xl font-black text-emerald-400">
              {contents.filter((cnt) => cnt.subject_id === currentSubj?.id && cnt.is_published).length}
            </span>
          </div>
        </div>
      </div>

      {/* Chapters Listing (Requirement 7) */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-white">Curriculum Chapters & Content Sets</h2>

        <div className="space-y-3.5">
          {subjectChapters.map((ch, idx) => {
            const chContents = contents.filter((cnt) => cnt.chapter_id === ch.id && cnt.is_published);
            const notesCount = chContents.filter((cnt) => cnt.content_type === 'chapter_notes').length;
            const papersCount = chContents.filter((cnt) => cnt.content_type === 'practice_paper').length;
            const mcqCount = chContents.filter((cnt) => cnt.content_type === 'mcq_quiz').length;
            const solvedCount = chContents.filter((cnt) => cnt.content_type === 'solved_example').length;

            const isAttempted = practiceAttempts.some((a) => a.chapterId === ch.id);

            return (
              <div
                key={ch.id}
                onClick={() => onNavigate('chapter-detail', { subjectId: currentSubj.id, chapterId: ch.id })}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg hover:shadow-indigo-950/20"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-black text-sm shrink-0 group-hover:scale-105 transition-transform">
                    {ch.chapterNumber.toString().padStart(2, '0')}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                        {ch.title}
                      </h3>
                      {isAttempted && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Attempted
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">{ch.description}</p>

                    {/* Content pill badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {notesCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-indigo-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> {notesCount} Notes
                        </span>
                      )}
                      {papersCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> {papersCount} Practice Papers
                        </span>
                      )}
                      {mcqCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> {mcqCount} Quizzes
                        </span>
                      )}
                      {solvedCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-purple-400 flex items-center gap-1">
                          <Award className="w-3 h-3" /> {solvedCount} Solved Proofs
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button className="px-4 py-2 rounded-xl bg-slate-800 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all">
                    <span>Open Chapter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
