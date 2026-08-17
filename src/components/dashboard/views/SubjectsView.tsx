import React from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import { StudentDashboardSection } from '../../../types/student';
import {
  BookOpen,
  ChevronRight,
  Layers,
  FileText,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface SubjectsViewProps {
  onNavigate: (section: StudentDashboardSection, params?: { subjectId?: string; chapterId?: string }) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({ onNavigate }) => {
  const { currentStudent } = useStudent();
  const { subjects, chapters, contents } = useAdminStore();

  if (!currentStudent) return null;

  const studentSubjects = subjects.filter((s) => s.classId === currentStudent.classId && s.isEnabled);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Class {currentStudent.classId.replace('class_', '')} Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose a subject track to explore chapters, conceptual notes, worked examples, and practice assessments.
          </p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentSubjects.map((subj) => {
          const subjChapters = chapters.filter((c) => c.subjectId === subj.id && c.isEnabled);
          const subjContents = contents.filter((cnt) => cnt.subject_id === subj.id && cnt.is_published);
          const notesCount = subjContents.filter((cnt) => cnt.content_type === 'chapter_notes').length;
          const papersCount = subjContents.filter((cnt) => cnt.content_type === 'practice_paper').length;
          const mcqCount = subjContents.filter((cnt) => cnt.content_type === 'mcq_quiz').length;

          return (
            <div
              key={subj.id}
              onClick={() => onNavigate('subject-detail', { subjectId: subj.id })}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer group flex flex-col justify-between space-y-6 shadow-xl hover:shadow-indigo-950/20"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    {subj.code}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{subj.board} Curriculum</span>
                </div>

                <div>
                  <h2 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                    {subj.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{subj.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-bold block">Chapters</span>
                    <span className="font-black text-white">{subjChapters.length}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-bold block">Notes</span>
                    <span className="font-black text-indigo-400">{notesCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 font-bold block">Papers</span>
                    <span className="font-black text-emerald-400">{papersCount}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400">Class {currentStudent.classId.replace('class_', '')} Track</span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Enter Track</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
