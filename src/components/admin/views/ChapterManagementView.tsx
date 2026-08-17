import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { AcademicChapter, EducationalContent } from '../../../types/admin';
import {
  FolderOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  FileText,
  Layers,
  GraduationCap,
  Sparkles,
  BookOpen,
  Lock,
  UploadCloud,
  CheckCircle2,
  X,
  Clock,
  Award,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { ProtectedPdfViewerModal } from '../../ui/ProtectedPdfViewerModal';

export const ChapterManagementView: React.FC = () => {
  const {
    classes,
    subjects,
    chapters,
    contents,
    addChapter,
    updateChapter,
    deleteChapter,
    toggleChapterStatus,
    addContent,
    deleteContent,
  } = useAdminStore();

  const [selectedClassFilter, setSelectedClassFilter] = useState('class_5');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalChapter, setEditModalChapter] = useState<AcademicChapter | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [notesModalChapter, setNotesModalChapter] = useState<AcademicChapter | null>(null);
  const [previewNoteContent, setPreviewNoteContent] = useState<EducationalContent | null>(null);

  // Form states for Add Chapter
  const [newChapNumber, setNewChapNumber] = useState<number>(1);
  const [newChapTitle, setNewChapTitle] = useState('');
  const [newChapClass, setNewChapClass] = useState('class_5');
  const [newChapSubject, setNewChapSubject] = useState('subj_5_math');
  const [newChapDesc, setNewChapDesc] = useState('');
  const [attachInitialPdfNotes, setAttachInitialPdfNotes] = useState(true);
  const [initialPdfNoteTitle, setInitialPdfNoteTitle] = useState('');
  const [initialPdfFileName, setInitialPdfFileName] = useState('Chapter_Concept_Notes.pdf');

  // Form states for Add Note inside Chapter Notes Modal
  const [addNoteTitle, setAddNoteTitle] = useState('');
  const [addNoteDesc, setAddNoteDesc] = useState('');
  const [addNotePagesCount, setAddNotePagesCount] = useState<number>(3);
  const [addNoteFileSize, setAddNoteFileSize] = useState('2.4 MB');
  const [addNoteFileName, setAddNoteFileName] = useState('Chapter_Revision_Notes.pdf');
  const [addNoteReadingMinutes, setAddNoteReadingMinutes] = useState<number>(20);
  const [addNoteAccessType, setAddNoteAccessType] = useState<'free' | 'package_restricted'>('package_restricted');
  const [addNoteKeyPoints, setAddNoteKeyPoints] = useState('');
  const [addNoteFormula, setAddNoteFormula] = useState('');
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);

  const classSubjects = subjects.filter((s) => s.classId === selectedClassFilter);

  const filteredChapters = chapters.filter((ch) => {
    const matchesClass = selectedClassFilter === 'all' || ch.classId === selectedClassFilter;
    const matchesSubject = selectedSubjectFilter === 'all' || ch.subjectId === selectedSubjectFilter;
    const matchesSearch =
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesSubject && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapTitle) return;

    const newChapterId = `ch_${Date.now()}`;

    addChapter({
      classId: newChapClass,
      subjectId: newChapSubject,
      chapterNumber: Number(newChapNumber),
      title: newChapTitle,
      description: newChapDesc || `Chapter ${newChapNumber} study material and worksheets.`,
      isEnabled: true,
      sortOrder: chapters.length + 1,
    });

    // If admin chose to attach PDF notes simultaneously
    if (attachInitialPdfNotes) {
      addContent({
        class_id: newChapClass,
        subject_id: newChapSubject,
        chapter_id: newChapterId,
        content_type: 'notes',
        title: initialPdfNoteTitle || `${newChapTitle} — Chapter Study Notes & Formula Blueprint (PDF)`,
        description: `Official concept notes and revision summary for ${newChapTitle}. Protected online-only study material.`,
        difficulty: 'medium',
        access_type: 'package_restricted',
        package_ids: ['pkg_pro', 'pkg_basic', 'pkg_school'],
        is_published: true,
        is_enabled: true,
        time_limit_minutes: 25,
        total_marks: 0,
        question_count: 0,
        pdf_url: `/documents/${newChapClass}_ch${newChapNumber}_notes.pdf`,
        pdf_filename: initialPdfFileName || `Class_Ch${newChapNumber}_Notes.pdf`,
        pdf_pages_count: 3,
        pdf_file_size: '2.1 MB',
        disable_download: true,
        key_summary_points: [
          'Core mathematical axioms and definitions.',
          'Step-by-step worked illustrations.',
          'Exam memory checklist & formulas.',
        ],
        sort_order: 1,
      });
    }

    setAddModalOpen(false);
    setNewChapTitle('');
    setNewChapDesc('');
    setInitialPdfNoteTitle('');
  };

  const handleAddNoteToChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesModalChapter || !addNoteTitle) return;

    const keyPointsArray = addNoteKeyPoints
      ? addNoteKeyPoints.split('\n').filter((line) => line.trim().length > 0)
      : [
          'Core mathematical definitions & properties',
          'Exam memorization rules & time-saving shortcuts',
          'Worked illustrations with step breakdown',
        ];

    addContent({
      class_id: notesModalChapter.classId,
      subject_id: notesModalChapter.subjectId,
      chapter_id: notesModalChapter.id,
      content_type: 'notes',
      title: addNoteTitle.includes('(PDF)') ? addNoteTitle : `${addNoteTitle} (PDF)`,
      description: addNoteDesc || `Detailed chapter revision notes and study material for ${notesModalChapter.title}.`,
      difficulty: 'medium',
      access_type: addNoteAccessType,
      package_ids: addNoteAccessType === 'free' ? ['pkg_free', 'pkg_pro', 'pkg_basic', 'pkg_school'] : ['pkg_pro', 'pkg_school'],
      is_published: true,
      is_enabled: true,
      time_limit_minutes: Number(addNoteReadingMinutes),
      total_marks: 0,
      question_count: 0,
      pdf_url: `/documents/${notesModalChapter.classId}_${notesModalChapter.id}_notes.pdf`,
      pdf_filename: addNoteFileName || 'Chapter_Study_Notes.pdf',
      pdf_pages_count: Number(addNotePagesCount) || 3,
      pdf_file_size: addNoteFileSize || '2.2 MB',
      disable_download: true,
      key_summary_points: keyPointsArray,
      pdf_pages_content: [
        {
          pageNumber: 1,
          heading: `Part 1: Key Concepts & Theorems`,
          subheading: `${notesModalChapter.title} — Syllabus Fundamentals`,
          text: addNoteDesc || `Comprehensive concept notes created for Grade ${notesModalChapter.classId.replace('class_', '')} students.`,
          keyPoints: keyPointsArray,
          formulaHighlight: addNoteFormula || `Core Rule: Review all standard theorem applications carefully.`,
          exampleQuestion: {
            question: `Standard Assessment Drill for ${notesModalChapter.title}`,
            stepSolution: 'Step 1: Write down given values.\nStep 2: Apply the fundamental theorem.\nStep 3: Verify calculations.',
            answer: 'Verified Result',
          },
        },
      ],
      sort_order: contents.length + 1,
    });

    setAddNoteTitle('');
    setAddNoteDesc('');
    setAddNoteKeyPoints('');
    setAddNoteFormula('');
    setShowAddNoteForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Chapter Repository & Notes</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
              {filteredChapters.length} Chapters
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build and manage structured chapters with attached <strong>PDF Chapter Notes & Study Materials</strong> (Protected student view with download disabled).
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Chapter with PDF Notes</span>
        </button>
      </div>

      {/* Filter cluster */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chapters by title or topic..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={selectedClassFilter}
            onChange={(e) => {
              setSelectedClassFilter(e.target.value);
              setSelectedSubjectFilter('all');
            }}
            className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Subjects</option>
            {classSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chapters Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Chapter #</th>
                <th className="p-4">Chapter Title & Details</th>
                <th className="p-4">Grade & Subject</th>
                <th className="p-4">PDF Notes & Materials</th>
                <th className="p-4">Total Content</th>
                <th className="p-4">Visibility</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredChapters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No chapters found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredChapters.map((chap) => {
                  const classObj = classes.find((c) => c.id === chap.classId);
                  const subjObj = subjects.find((s) => s.id === chap.subjectId);
                  const chapContents = contents.filter((c) => c.chapter_id === chap.id);
                  const chapNotes = chapContents.filter((c) => c.content_type === 'notes');

                  return (
                    <tr key={chap.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Chapter Number Badge */}
                      <td className="p-4 pl-6">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-sm flex items-center justify-center">
                          {chap.chapterNumber}
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="p-4">
                        <h4 className="font-extrabold text-white text-xs">{chap.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{chap.description}</p>
                      </td>

                      {/* Grade & Subject */}
                      <td className="p-4">
                        <span className="font-bold text-indigo-300">{classObj?.shortName || chap.classId}</span>
                        <span className="block text-[10px] text-cyan-400">{subjObj?.name || chap.subjectId}</span>
                      </td>

                      {/* PDF Notes & Materials Column */}
                      <td className="p-4">
                        <button
                          onClick={() => setNotesModalChapter(chap)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            chapNotes.length > 0
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                          <span>{chapNotes.length} PDF Notes</span>
                          <span className="text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded text-amber-400 border border-amber-500/20">
                            Manage
                          </span>
                        </button>
                      </td>

                      {/* Content count */}
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-purple-400 font-bold text-[10px]">
                          {chapContents.length} Items Total
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => toggleChapterStatus(chap.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            chap.isEnabled
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {chap.isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{chap.isEnabled ? 'Published' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setNotesModalChapter(chap)}
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors cursor-pointer"
                            title="Manage Chapter Notes (PDF)"
                          >
                            <BookOpen className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setEditModalChapter(chap)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                            title="Edit Chapter"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Delete chapter ${chap.title}?`)) {
                                deleteChapter(chap.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            title="Delete Chapter"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chapter Notes & PDF Material Manager Drawer / Modal */}
      {notesModalChapter && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-fade-in text-xs custom-scrollbar">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30 mb-1.5">
                  <BookOpen className="w-3 h-3 text-amber-400" />
                  <span>Chapter PDF Study Material & Notes Manager</span>
                </div>
                <h3 className="text-base font-extrabold text-white">
                  Chapter {notesModalChapter.chapterNumber}: {notesModalChapter.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Attached PDF notes are visible to students in a secure protected reader with download strictly disabled.
                </p>
              </div>

              <button
                onClick={() => {
                  setNotesModalChapter(null);
                  setShowAddNoteForm(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List of Attached PDF Notes for this Chapter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Attached Notes & Materials (
                  {contents.filter((c) => c.chapter_id === notesModalChapter.id && c.content_type === 'notes').length}
                  )
                </h4>
                {!showAddNoteForm && (
                  <button
                    onClick={() => setShowAddNoteForm(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New PDF Note</span>
                  </button>
                )}
              </div>

              {contents
                .filter((c) => c.chapter_id === notesModalChapter.id && c.content_type === 'notes')
                .length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2">
                  <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-slate-400 font-medium">No PDF study notes attached to this chapter yet.</p>
                  <button
                    onClick={() => setShowAddNoteForm(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add First Chapter Note (PDF)</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {contents
                    .filter((c) => c.chapter_id === notesModalChapter.id && c.content_type === 'notes')
                    .map((note) => (
                      <div
                        key={note.id}
                        className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <h5 className="font-extrabold text-white text-xs">{note.title}</h5>
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{note.description}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px]">
                                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                                  📄 {note.pdf_filename || 'Notes.pdf'}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                                  {note.pdf_pages_count || 3} Pages
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Download Disabled</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold">
                                  {note.access_type.toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => setPreviewNoteContent(note)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                              title="Test Student Protected View"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Test View</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Remove note "${note.title}"?`)) {
                                  deleteContent(note.id);
                                }
                              }}
                              className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title="Delete Note"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Key Summary points preview */}
                        {note.key_summary_points && note.key_summary_points.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300">
                            <span className="font-bold text-amber-400 block mb-1">Key Revision Highlights:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                              {note.key_summary_points.slice(0, 3).map((pt, i) => (
                                <li key={i} className="truncate">{pt}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Add New Note Form Section */}
            {showAddNoteForm && (
              <form onSubmit={handleAddNoteToChapter} className="p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Chapter Note & Material (PDF)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowAddNoteForm(false)}
                    className="text-slate-500 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Note Title *</label>
                    <input
                      type="text"
                      required
                      value={addNoteTitle}
                      onChange={(e) => setAddNoteTitle(e.target.value)}
                      placeholder={`e.g. ${notesModalChapter.title} — Comprehensive Revision & Formula Sheet`}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Description / Syllabus Overview</label>
                    <textarea
                      rows={2}
                      value={addNoteDesc}
                      onChange={(e) => setAddNoteDesc(e.target.value)}
                      placeholder="Summary of formulas, rules, and theorems covered..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">PDF File Name</label>
                      <input
                        type="text"
                        value={addNoteFileName}
                        onChange={(e) => setAddNoteFileName(e.target.value)}
                        placeholder="notes.pdf"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Total Pages</label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={addNotePagesCount}
                        onChange={(e) => setAddNotePagesCount(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Est. Reading Time (Mins)</label>
                      <input
                        type="number"
                        min={5}
                        value={addNoteReadingMinutes}
                        onChange={(e) => setAddNoteReadingMinutes(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Student Access Permission</label>
                    <select
                      value={addNoteAccessType}
                      onChange={(e) => setAddNoteAccessType(e.target.value as 'free' | 'package_restricted')}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                    >
                      <option value="package_restricted">Subscribed Students Only (Paid Package Required)</option>
                      <option value="free">Free Preview (Accessible to all registered trial students)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Key Revision Takeaways (1 per line)</label>
                    <textarea
                      rows={3}
                      value={addNoteKeyPoints}
                      onChange={(e) => setAddNoteKeyPoints(e.target.value)}
                      placeholder="Rule 1: Always align decimal places&#10;Rule 2: Convert improper fraction to mixed&#10;Rule 3: Memorize formula a² + b²"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Formula Highlight / Key Rule</label>
                    <input
                      type="text"
                      value={addNoteFormula}
                      onChange={(e) => setAddNoteFormula(e.target.value)}
                      placeholder="e.g. Area = Length × Breadth | Perimeter = 2 × (L + B)"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono"
                    />
                  </div>

                  {/* Security Notice */}
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-[11px]">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Protected Security Built-in:</strong> Students will only be able to read this PDF document online. Download and printing are permanently blocked.
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddNoteForm(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer shadow-md"
                  >
                    Save & Attach Note (PDF)
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Chapter Modal */}
      {editModalChapter && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Edit Chapter</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditModalChapter(null);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Chapter #</label>
                  <input
                    type="number"
                    value={editModalChapter.chapterNumber}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateChapter(editModalChapter.id, { chapterNumber: val });
                      setEditModalChapter({ ...editModalChapter, chapterNumber: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-300 font-bold block mb-1">Chapter Title</label>
                  <input
                    type="text"
                    value={editModalChapter.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      updateChapter(editModalChapter.id, { title: val });
                      setEditModalChapter({ ...editModalChapter, title: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editModalChapter.description}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateChapter(editModalChapter.id, { description: val });
                    setEditModalChapter({ ...editModalChapter, description: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalChapter(null)}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Chapter Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-extrabold text-white">Add New Chapter & Study Material</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Class Grade</label>
                  <select
                    value={newChapClass}
                    onChange={(e) => {
                      setNewChapClass(e.target.value);
                      const matchingSubjs = subjects.filter((s) => s.classId === e.target.value);
                      if (matchingSubjs.length > 0) setNewChapSubject(matchingSubjs[0].id);
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Subject</label>
                  <select
                    value={newChapSubject}
                    onChange={(e) => setNewChapSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    {subjects
                      .filter((s) => s.classId === newChapClass)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Chapter #</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newChapNumber}
                    onChange={(e) => setNewChapNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-300 font-bold block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newChapTitle}
                    onChange={(e) => setNewChapTitle(e.target.value)}
                    placeholder="e.g. Decimals & Percentages"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newChapDesc}
                  onChange={(e) => setNewChapDesc(e.target.value)}
                  placeholder="Topics covered, practice guidelines..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              {/* Attach Initial Chapter Notes in PDF option */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-bold text-amber-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={attachInitialPdfNotes}
                    onChange={(e) => setAttachInitialPdfNotes(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Attach Initial Chapter Notes & Formula Sheet (PDF)</span>
                </label>

                {attachInitialPdfNotes && (
                  <div className="space-y-2 pt-1">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-0.5">PDF Note Title</label>
                      <input
                        type="text"
                        value={initialPdfNoteTitle}
                        onChange={(e) => setInitialPdfNoteTitle(e.target.value)}
                        placeholder="e.g. Chapter Concept Notes & Blueprint (PDF)"
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs"
                      />
                    </div>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Protected View is automatically enabled (No download for students).</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Protected PDF Viewer Modal Preview (Test Student View) */}
      {previewNoteContent && (
        <ProtectedPdfViewerModal
          content={previewNoteContent}
          onClose={() => setPreviewNoteContent(null)}
          studentName="Previewing as Student"
          studentGrade="Grade 5 Curriculum"
        />
      )}
    </div>
  );
};
