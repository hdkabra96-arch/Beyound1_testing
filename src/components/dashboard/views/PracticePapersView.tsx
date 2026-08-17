import React, { useState } from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import { EducationalContent, DifficultyLevel } from '../../../types/admin';
import { InteractiveQuizRunner } from '../components/InteractiveQuizRunner';
import { ProtectedPdfViewer } from '../components/ProtectedPdfViewer';
import {
  FileText,
  Play,
  Download,
  Lock,
  CheckCircle2,
  Filter,
  Search,
  Sparkles,
  Clock,
  Award,
} from 'lucide-react';

interface PracticePapersViewProps {
  onOpenRenewal: () => void;
}

export const PracticePapersView: React.FC<PracticePapersViewProps> = ({ onOpenRenewal }) => {
  const { currentStudent, practiceAttempts } = useStudent();
  const { contents, chapters, subjects, canUserAccessContent, canStudentDownloadPDF } = useAdminStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [runningQuizContent, setRunningQuizContent] = useState<EducationalContent | null>(null);
  const [readingContent, setReadingContent] = useState<EducationalContent | null>(null);

  if (!currentStudent) return null;

  // Filter practice papers for this student's class
  const classPapers = contents.filter(
    (c) =>
      c.class_id === currentStudent.classId &&
      (c.content_type === 'practice_paper' || c.content_type === 'mcq_quiz') &&
      c.is_published
  );

  const studentSubjects = subjects.filter((s) => s.classId === currentStudent.classId);

  const filteredPapers = classPapers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || paper.subject_id === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'all' || paper.difficulty === selectedDifficulty;
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Practice Papers & Assessments (Class {currentStudent.classId.replace('class_', '')})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Solve interactive question sets, test your timed mathematical speed, and review full step solutions.
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, place values, fractions..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Subject Filter */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Subjects</option>
          {studentSubjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Difficulty Levels</option>
          <option value="easy">Easy (Foundational)</option>
          <option value="medium">Medium (Standard)</option>
          <option value="hard">Hard (Advanced HOTS)</option>
          <option value="olympiad">Olympiad Level</option>
        </select>
      </div>

      {/* Papers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPapers.map((paper) => {
          const accessCheck = canUserAccessContent(currentStudent.id, paper.id);
          const downloadCheck = canStudentDownloadPDF(currentStudent.id, paper.id);
          const chapter = chapters.find((c) => c.id === paper.chapter_id);
          const subject = subjects.find((s) => s.id === paper.subject_id);

          const isAttempted = practiceAttempts.some((a) => a.contentId === paper.id);
          const lastAttempt = practiceAttempts.find((a) => a.contentId === paper.id);

          return (
            <div
              key={paper.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                accessCheck.allowed
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {subject?.name || 'Mathematics'}
                    </span>
                    {chapter && (
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Ch {chapter.chapterNumber}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      paper.difficulty === 'olympiad'
                        ? 'bg-purple-500/20 text-purple-300'
                        : paper.difficulty === 'hard'
                        ? 'bg-rose-500/20 text-rose-400'
                        : paper.difficulty === 'medium'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {paper.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-white">{paper.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{paper.description}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 font-bold">
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{paper.total_marks || 20} Marks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{paper.time_limit_minutes || 20} Mins</span>
                  </div>
                </div>

                {isAttempted && lastAttempt && (
                  <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-bold">
                      Completed: {lastAttempt.score}/{lastAttempt.maxScore} marks
                    </span>
                    <span className="text-emerald-400 font-black">{lastAttempt.accuracyPercentage}%</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                {accessCheck.allowed ? (
                  <>
                    <button
                      onClick={() => setRunningQuizContent(paper)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{isAttempted ? 'Retake Practice' : 'Start Practice'}</span>
                    </button>

                    {!paper.disable_download && downloadCheck.allowed && (
                      <a
                        href={paper.pdf_url || '#'}
                        download={`${paper.title}.pdf`}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </a>
                    )}
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between">
                    <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> {accessCheck.reason || 'Restricted Content'}
                    </span>
                    <button
                      onClick={onOpenRenewal}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
                    >
                      Upgrade Plan
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {runningQuizContent && (
        <InteractiveQuizRunner content={runningQuizContent} onClose={() => setRunningQuizContent(null)} />
      )}

      {readingContent && (
        <ProtectedPdfViewer content={readingContent} onClose={() => setReadingContent(null)} />
      )}
    </div>
  );
};
