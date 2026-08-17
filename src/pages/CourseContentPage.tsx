import React, { useState } from 'react';
import { CURRICULUM_GRADES } from '../data/public-content';
import { PublicPage } from '../types/public';
import { BookOpen, Download, FileText, CheckCircle2, Search, ArrowRight, Lock, Eye, Sparkles } from 'lucide-react';
import { useAdminStore } from '../services/admin-store';
import { ProtectedPdfViewerModal } from '../components/ui/ProtectedPdfViewerModal';
import { EducationalContent } from '../types/admin';

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
  const [readingNoteContent, setReadingNoteContent] = useState<EducationalContent | null>(null);

  const { chapters, contents } = useAdminStore();

  const activeGrade = CURRICULUM_GRADES.find((g) => g.id === activeGradeId) || CURRICULUM_GRADES[4];

  // Dynamic chapters from Admin Store matching this class grade
  const gradeChapters = chapters.filter(
    (ch) => ch.classId === activeGradeId && ch.isEnabled
  );

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
          Browse comprehensive chapter topics, video modules, practice problem sets, and protected digital PDF notes across all 8 grades.
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
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Curriculum Units & Chapter Notes ({gradeChapters.length > 0 ? gradeChapters.length : activeGrade.keyTopics.length} Units)
            </h3>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Protected Viewer: PDF Notes are viewable on screen (Download Disabled)</span>
            </span>
          </div>

          {/* Admin Managed Dynamic Chapters */}
          {gradeChapters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gradeChapters.map((chap) => {
                const chapNotes = contents.filter(
                  (c) => c.chapter_id === chap.id && c.content_type === 'notes' && c.is_published
                );
                const chapPapers = contents.filter(
                  (c) => c.chapter_id === chap.id && c.content_type !== 'notes' && c.is_published
                );
                const firstNote = chapNotes[0];

                return (
                  <div
                    key={chap.id}
                    className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between gap-4 hover:border-indigo-500/40 transition-all shadow-sm"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center shrink-0">
                        {chap.chapterNumber}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{chap.title}</h4>
                          {chapNotes.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 text-[10px] font-extrabold flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>{chapNotes.length} PDF Notes</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {chap.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {chapPapers.length} Practice Sets Available
                      </span>

                      <div className="flex items-center gap-2">
                        {firstNote ? (
                          <button
                            onClick={() => setReadingNoteContent(firstNote)}
                            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 cursor-pointer flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Read PDF Notes</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              // Create instant preview item for student
                              setReadingNoteContent({
                                id: `temp_note_${chap.id}`,
                                class_id: chap.classId,
                                subject_id: chap.subjectId,
                                chapter_id: chap.id,
                                title: `${chap.title} — Study Notes & Formulas`,
                                content_type: 'notes',
                                description: chap.description,
                                difficulty: 'medium',
                                access_type: 'free',
                                package_ids: [],
                                is_published: true,
                                is_enabled: true,
                                time_limit_minutes: 20,
                                total_marks: 0,
                                question_count: 0,
                                pdf_filename: `${chap.title.replace(/\s+/g, '_')}_Notes.pdf`,
                                pdf_pages_count: 3,
                                pdf_file_size: '2.2 MB',
                                disable_download: true,
                                key_summary_points: [
                                  `Core concepts of ${chap.title} explained with visuals`,
                                  'Standard formulas and problem solving axioms',
                                  'Exam tips and common arithmetic pitfalls',
                                ],
                                pdf_pages_content: [
                                  {
                                    pageNumber: 1,
                                    heading: `Chapter ${chap.chapterNumber}: ${chap.title}`,
                                    subheading: 'Fundamental Axioms & Properties',
                                    text: chap.description,
                                    keyPoints: [
                                      'Key theoretical theorems and notations',
                                      'Fundamental operations and shortcuts',
                                      'Memorization checklist',
                                    ],
                                    formulaHighlight: 'Core Rule: Perform operations in strict sequence.',
                                    exampleQuestion: {
                                      question: `Standard textbook example for ${chap.title}`,
                                      stepSolution: 'Step 1: Write down given values.\nStep 2: Apply the formula.\nStep 3: State the final verified answer.',
                                      answer: 'Verified Final Solution',
                                    },
                                  },
                                ],
                                sort_order: 1,
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Preview Notes</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
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
                        15+ Practice Worksheets • Video Theory • Protected PDF Notes
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setReadingNoteContent({
                        id: `topic_${idx}`,
                        class_id: activeGradeId,
                        subject_id: 'subj_math',
                        chapter_id: `ch_${idx + 1}`,
                        title: `${topic} — Official Study Notes (PDF)`,
                        content_type: 'notes',
                        description: `Comprehensive study notes, theorems, and step solutions for ${topic}.`,
                        difficulty: 'medium',
                        access_type: 'free',
                        package_ids: [],
                        is_published: true,
                        is_enabled: true,
                        time_limit_minutes: 25,
                        total_marks: 0,
                        question_count: 0,
                        pdf_filename: `${topic.replace(/\s+/g, '_')}_Notes.pdf`,
                        pdf_pages_count: 3,
                        pdf_file_size: '2.1 MB',
                        disable_download: true,
                        key_summary_points: [
                          'Mastery of core concepts and definitions',
                          'Step-by-step breakdown with diagrams',
                          'Practice guidelines for Class ' + activeGrade.gradeNumber,
                        ],
                        sort_order: idx + 1,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View PDF Notes</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Protected PDF Viewer Modal for Students */}
      {readingNoteContent && (
        <ProtectedPdfViewerModal
          isOpen={true}
          content={readingNoteContent}
          onClose={() => setReadingNoteContent(null)}
          studentName="Enrolled Student Reader"
          studentGrade={`Class ${activeGrade.gradeNumber} Mathematics`}
        />
      )}
    </div>
  );
};
