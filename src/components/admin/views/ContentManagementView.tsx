import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { EducationalContent, ContentType, AccessType, DifficultyLevel } from '../../../types/admin';
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Copy,
  Lock,
  Unlock,
  Download,
  Calendar,
  Sparkles,
  Zap,
  HelpCircle,
  Clock,
  Layers,
  GraduationCap,
  FolderOpen,
  BookOpen,
} from 'lucide-react';
import { ProtectedPdfViewerModal } from '../../ui/ProtectedPdfViewerModal';

interface ContentManagementViewProps {
  initialTypeFilter?: ContentType | 'all';
}

export const ContentManagementView: React.FC<ContentManagementViewProps> = ({
  initialTypeFilter = 'all',
}) => {
  const {
    classes,
    subjects,
    chapters,
    contents,
    packages,
    addContent,
    updateContent,
    deleteContent,
    toggleContentPublish,
    toggleContentEnabled,
  } = useAdminStore();

  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>(initialTypeFilter);
  const [selectedClassFilter, setSelectedClassFilter] = useState('all');
  const [selectedAccessFilter, setSelectedAccessFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [editDrawerContent, setEditDrawerContent] = useState<EducationalContent | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<EducationalContent | null>(null);
  const [protectedPdfPreview, setProtectedPdfPreview] = useState<EducationalContent | null>(null);

  // Add Content Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ContentType>('practice_paper');
  const [newClass, setNewClass] = useState('class_5');
  const [newSubject, setNewSubject] = useState('subj_core_5');
  const [newChapter, setNewChapter] = useState('ch_5_1');
  const [newDesc, setNewDesc] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<DifficultyLevel>('medium');
  const [newAccessType, setNewAccessType] = useState<AccessType>('package_restricted');
  const [newSelectedPackages, setNewSelectedPackages] = useState<string[]>(['pkg_pro', 'pkg_basic']);
  const [newTimeMinutes, setNewTimeMinutes] = useState(45);
  const [newTotalMarks, setNewTotalMarks] = useState(50);
  const [newQuestionCount, setNewQuestionCount] = useState(15);
  const [newPdfUrl, setNewPdfUrl] = useState('/downloads/practice_paper_std5.pdf');
  const [newPdfFileName, setNewPdfFileName] = useState('Chapter_Study_Notes.pdf');
  const [newPdfPagesCount, setNewPdfPagesCount] = useState(3);
  const [newPdfFileSize, setNewPdfFileSize] = useState('2.4 MB');
  const [newDisableDownload, setNewDisableDownload] = useState(true);
  const [newKeyPoints, setNewKeyPoints] = useState('');
  const [newHasAnswerKey, setNewHasAnswerKey] = useState(true);
  const [newHasStepByStep, setNewHasStepByStep] = useState(true);
  const [newHasHints, setNewHasHints] = useState(true);

  const filteredContents = contents.filter((cnt) => {
    const matchesType = selectedTypeFilter === 'all' || cnt.content_type === selectedTypeFilter;
    const matchesClass = selectedClassFilter === 'all' || cnt.class_id === selectedClassFilter;
    const matchesAccess = selectedAccessFilter === 'all' || cnt.access_type === selectedAccessFilter;
    const matchesSearch =
      cnt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cnt.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesClass && matchesAccess && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const keyPointsArray = newKeyPoints
      ? newKeyPoints.split('\n').filter((l) => l.trim().length > 0)
      : [
          'Core mathematical definitions and rules.',
          'Step-by-step worked illustrations.',
          'Formulas and exam checklist.',
        ];

    addContent({
      class_id: newClass,
      subject_id: newSubject,
      chapter_id: newChapter,
      title: newType === 'notes' && !newTitle.includes('(PDF)') ? `${newTitle} (PDF)` : newTitle,
      content_type: newType,
      description: newDesc || `Standard curriculum material for ${newClass.replace('_', ' ').toUpperCase()}.`,
      difficulty: newDifficulty,
      access_type: newAccessType,
      package_ids: newSelectedPackages,
      is_published: true,
      is_enabled: true,
      time_limit_minutes: Number(newTimeMinutes),
      total_marks: Number(newTotalMarks),
      question_count: Number(newQuestionCount),
      pdf_url: newPdfUrl,
      pdf_filename: newPdfFileName || 'Chapter_Notes.pdf',
      pdf_pages_count: Number(newPdfPagesCount) || 3,
      pdf_file_size: newPdfFileSize || '2.4 MB',
      disable_download: newType === 'notes' ? true : newDisableDownload,
      key_summary_points: newType === 'notes' ? keyPointsArray : undefined,
      pdf_pages_content:
        newType === 'notes'
          ? [
              {
                pageNumber: 1,
                heading: `Section 1: Fundamental Concepts & Axioms`,
                subheading: `${newTitle} — Essential Curriculum Unit`,
                text: newDesc || 'Core study notes and key mathematical properties.',
                keyPoints: keyPointsArray,
                formulaHighlight: 'Core Rule: Check calculations and verify boundary steps.',
                exampleQuestion: {
                  question: `Key Conceptual Problem for ${newTitle}`,
                  stepSolution: 'Step 1: Identify given variables.\nStep 2: Apply fundamental theorem.\nStep 3: Solve and simplify.',
                  answer: 'Standard Verified Solution',
                },
              },
            ]
          : undefined,
      has_answer_key: newHasAnswerKey,
      has_step_by_step_solutions: newHasStepByStep,
      has_hints: newHasHints,
      sort_order: contents.length + 1,
    });

    setAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewKeyPoints('');
  };

  const handleDuplicate = (cnt: EducationalContent) => {
    addContent({
      ...cnt,
      title: `${cnt.title} (Copy)`,
      is_published: false,
    });
  };

  const getTypeBadge = (type: ContentType) => {
    switch (type) {
      case 'practice_paper':
        return <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">PRACTICE PAPER</span>;
      case 'mcq':
        return <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold">INTERACTIVE MCQ</span>;
      case 'flash_cards':
        return <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-bold">FLASH CARDS</span>;
      case 'notes':
        return <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-bold">CHAPTER NOTES</span>;
      case 'question_bank':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">QUESTION BANK</span>;
      case 'previous_papers':
        return <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 text-[10px] font-bold">PREVIOUS PAPER</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-500/20 text-slate-400 text-[10px] font-bold">{type}</span>;
    }
  };

  const getAccessBadge = (access: AccessType) => {
    switch (access) {
      case 'public':
      case 'free':
        return <span className="text-[10px] font-bold text-emerald-400">FREE / PUBLIC</span>;
      case 'paid':
      case 'package_restricted':
        return <span className="text-[10px] font-bold text-indigo-400">PACKAGE PASS</span>;
      case 'class_restricted':
        return <span className="text-[10px] font-bold text-purple-400">CLASS ENROLLED</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Educational Content Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
              {filteredContents.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete management over Practice Papers, MCQs, Flash Cards, Chapter Notes, Solved Step-by-Step Examples, and PDF Downloads.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Educational Content</span>
        </button>
      </div>

      {/* Filter Cluster */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search papers, questions, topics..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Content Types</option>
            <option value="practice_paper">Practice Papers</option>
            <option value="mcq">MCQs & Quizzes</option>
            <option value="flash_cards">Flash Cards</option>
            <option value="notes">Chapter Notes</option>
            <option value="question_bank">Question Bank</option>
            <option value="previous_papers">Previous Papers</option>
          </select>

          {/* Class Filter */}
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Grades (1-8)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Access Filter */}
          <select
            value={selectedAccessFilter}
            onChange={(e) => setSelectedAccessFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Access Tiers</option>
            <option value="free">Free / Public Sample</option>
            <option value="package_restricted">Package Pass Restricted</option>
          </select>
        </div>
      </div>

      {/* Content Items Table (Requirement 8) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Material Details</th>
                <th className="p-4">Type & Difficulty</th>
                <th className="p-4">Class & Chapter</th>
                <th className="p-4">Features Included</th>
                <th className="p-4">Access Tier</th>
                <th className="p-4">Publish State</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredContents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No curriculum content matches search filters.
                  </td>
                </tr>
              ) : (
                filteredContents.map((cnt) => {
                  const classObj = classes.find((c) => c.id === cnt.class_id);
                  const chapObj = chapters.find((ch) => ch.id === cnt.chapter_id);

                  return (
                    <tr key={cnt.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Title & Info */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-extrabold text-white text-xs">{cnt.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{cnt.description}</p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                              <span>{cnt.question_count} Questions</span>
                              <span>•</span>
                              <span>{cnt.total_marks} Marks</span>
                              <span>•</span>
                              <span>{cnt.time_limit_minutes} Mins</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type & Difficulty */}
                      <td className="p-4">
                        {getTypeBadge(cnt.content_type)}
                        <span className="block text-[10px] text-slate-400 uppercase font-bold mt-1">
                          Diff: <strong className="text-amber-400">{cnt.difficulty}</strong>
                        </span>
                      </td>

                      {/* Class & Chapter */}
                      <td className="p-4">
                        <span className="font-bold text-indigo-300">{classObj?.shortName || cnt.class_id}</span>
                        <span className="block text-[10px] text-slate-400 truncate max-w-[140px]">
                          {chapObj?.title || cnt.chapter_id}
                        </span>
                      </td>

                      {/* Solutions & Hints */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 text-[9px] font-bold">
                          {cnt.has_answer_key && <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">Answer Key</span>}
                          {cnt.has_step_by_step_solutions && <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400">Step Solutions</span>}
                          {cnt.has_hints && <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">Hints</span>}
                          {cnt.pdf_url && <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400">PDF Ready</span>}
                        </div>
                      </td>

                      {/* Access Tier */}
                      <td className="p-4">{getAccessBadge(cnt.access_type)}</td>

                      {/* Publish / Enabled Toggles */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <button
                            onClick={() => toggleContentPublish(cnt.id)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                              cnt.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {cnt.is_published ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{cnt.is_published ? 'Published' : 'Draft'}</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview modal */}
                          <button
                            onClick={() => {
                              if (cnt.content_type === 'notes') {
                                setProtectedPdfPreview(cnt);
                              } else {
                                setPreviewContent(cnt);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-indigo-400 hover:bg-slate-700 transition-colors cursor-pointer"
                            title={cnt.content_type === 'notes' ? 'Preview Protected PDF Notes' : 'Preview Content'}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicate(cnt)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                            title="Duplicate Material"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Edit Drawer */}
                          <button
                            onClick={() => setEditDrawerContent(cnt)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                            title="Edit Content"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete content ${cnt.title}?`)) {
                                deleteContent(cnt.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                            title="Delete Content"
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

      {/* Edit Content Drawer Modal */}
      {editDrawerContent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-fade-in text-xs custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white">Edit Educational Material</h3>
              <button onClick={() => setEditDrawerContent(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditDrawerContent(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-slate-300 font-bold block mb-1">Title</label>
                <input
                  type="text"
                  value={editDrawerContent.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateContent(editDrawerContent.id, { title: val });
                    setEditDrawerContent({ ...editDrawerContent, title: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Type</label>
                  <select
                    value={editDrawerContent.content_type}
                    onChange={(e: any) => {
                      const val = e.target.value;
                      updateContent(editDrawerContent.id, { content_type: val });
                      setEditDrawerContent({ ...editDrawerContent, content_type: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="practice_paper">Practice Paper</option>
                    <option value="mcq">MCQ / Quiz</option>
                    <option value="flash_cards">Flash Cards</option>
                    <option value="notes">Chapter Notes</option>
                    <option value="question_bank">Question Bank</option>
                    <option value="previous_papers">Previous Papers</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Difficulty</label>
                  <select
                    value={editDrawerContent.difficulty}
                    onChange={(e: any) => {
                      const val = e.target.value;
                      updateContent(editDrawerContent.id, { difficulty: val });
                      setEditDrawerContent({ ...editDrawerContent, difficulty: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="olympiad">Olympiad Level</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Access Rule</label>
                  <select
                    value={editDrawerContent.access_type}
                    onChange={(e: any) => {
                      const val = e.target.value;
                      updateContent(editDrawerContent.id, { access_type: val });
                      setEditDrawerContent({ ...editDrawerContent, access_type: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="free">Free / Public Sample</option>
                    <option value="package_restricted">Package Restricted</option>
                    <option value="class_restricted">Class Enrolled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Questions Count</label>
                  <input
                    type="number"
                    value={editDrawerContent.question_count}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateContent(editDrawerContent.id, { question_count: val });
                      setEditDrawerContent({ ...editDrawerContent, question_count: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={editDrawerContent.total_marks}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateContent(editDrawerContent.id, { total_marks: val });
                      setEditDrawerContent({ ...editDrawerContent, total_marks: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Time (Mins)</label>
                  <input
                    type="number"
                    value={editDrawerContent.time_limit_minutes}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updateContent(editDrawerContent.id, { time_limit_minutes: val });
                      setEditDrawerContent({ ...editDrawerContent, time_limit_minutes: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">PDF Attachment Download URL</label>
                <input
                  type="text"
                  value={editDrawerContent.pdf_url || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    updateContent(editDrawerContent.id, { pdf_url: val });
                    setEditDrawerContent({ ...editDrawerContent, pdf_url: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              {/* Toggles for Solutions & Hints */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editDrawerContent.has_answer_key}
                    onChange={(e) => {
                      const val = e.target.checked;
                      updateContent(editDrawerContent.id, { has_answer_key: val });
                      setEditDrawerContent({ ...editDrawerContent, has_answer_key: val });
                    }}
                    className="rounded text-indigo-600"
                  />
                  <span>Answer Key</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editDrawerContent.has_step_by_step_solutions}
                    onChange={(e) => {
                      const val = e.target.checked;
                      updateContent(editDrawerContent.id, { has_step_by_step_solutions: val });
                      setEditDrawerContent({ ...editDrawerContent, has_step_by_step_solutions: val });
                    }}
                    className="rounded text-indigo-600"
                  />
                  <span>Step Solutions</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editDrawerContent.has_hints}
                    onChange={(e) => {
                      const val = e.target.checked;
                      updateContent(editDrawerContent.id, { has_hints: val });
                      setEditDrawerContent({ ...editDrawerContent, has_hints: val });
                    }}
                    className="rounded text-indigo-600"
                  />
                  <span>Hints Enabled</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditDrawerContent(null)}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Save Material Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewContent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">{previewContent.title}</h3>
                <p className="text-[11px] text-slate-400">{previewContent.content_type.toUpperCase()} • {previewContent.difficulty.toUpperCase()}</p>
              </div>
              <button onClick={() => setPreviewContent(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <p className="text-slate-300">{previewContent.description}</p>
              <div className="grid grid-cols-3 gap-2 text-center text-slate-400">
                <div className="p-2 bg-slate-900 rounded-xl">
                  <span className="block font-bold text-white">{previewContent.question_count}</span>
                  <span className="text-[10px]">Questions</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl">
                  <span className="block font-bold text-white">{previewContent.total_marks}</span>
                  <span className="text-[10px]">Marks</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl">
                  <span className="block font-bold text-white">{previewContent.time_limit_minutes}m</span>
                  <span className="text-[10px]">Time Limit</span>
                </div>
              </div>
            </div>

            {previewContent.pdf_url && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                <span>PDF Download Link Attached</span>
                <span className="font-mono text-[11px]">{previewContent.pdf_url}</span>
              </div>
            )}

            <button
              onClick={() => setPreviewContent(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Add Content Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-fade-in text-xs custom-scrollbar">
            <h3 className="text-base font-extrabold text-white">Create New Educational Material</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Master Assessment Paper - Class 5 Fractions"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="practice_paper">Practice Paper</option>
                    <option value="mcq">MCQ / Speed Quiz</option>
                    <option value="flash_cards">Flash Cards</option>
                    <option value="notes">Chapter Notes</option>
                    <option value="question_bank">Question Bank</option>
                    <option value="previous_papers">Previous Years Paper</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Class Grade</label>
                  <select
                    value={newClass}
                    onChange={(e) => {
                      setNewClass(e.target.value);
                      const subjs = subjects.filter((s) => s.classId === e.target.value);
                      if (subjs.length > 0) setNewSubject(subjs[0].id);
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
                  <label className="text-slate-300 font-bold block mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e: any) => setNewDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="olympiad">Olympiad Level</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summary, marks distribution, guidelines..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Questions Count</label>
                  <input
                    type="number"
                    value={newQuestionCount}
                    onChange={(e) => setNewQuestionCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={newTotalMarks}
                    onChange={(e) => setNewTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Time (Mins)</label>
                  <input
                    type="number"
                    value={newTimeMinutes}
                    onChange={(e) => setNewTimeMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Access Rule</label>
                <select
                  value={newAccessType}
                  onChange={(e: any) => setNewAccessType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                >
                  <option value="package_restricted">Package Pass Restricted</option>
                  <option value="free">Free / Public Sample</option>
                </select>
              </div>

              {/* PDF Specific Fields for Notes */}
              {newType === 'notes' && (
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>Protected Chapter Notes & Material (PDF)</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-300 text-[11px] flex items-center gap-2 border border-cyan-500/20">
                    <Lock className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                    <span>
                      <strong>Protected Mode Active:</strong> Students can view every page in the custom secure reader, but downloading, printing, and context-menu saving are strictly disabled.
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">PDF File Name</label>
                      <input
                        type="text"
                        value={newPdfFileName}
                        onChange={(e) => setNewPdfFileName(e.target.value)}
                        placeholder="e.g. Chapter_5_Notes.pdf"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">Total Pages</label>
                      <input
                        type="number"
                        min={1}
                        value={newPdfPagesCount}
                        onChange={(e) => setNewPdfPagesCount(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">File Size</label>
                      <input
                        type="text"
                        value={newPdfFileSize}
                        onChange={(e) => setNewPdfFileSize(e.target.value)}
                        placeholder="e.g. 2.4 MB"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">Key Summary & Revision Bullet Points (One per line)</label>
                    <textarea
                      rows={3}
                      value={newKeyPoints}
                      onChange={(e) => setNewKeyPoints(e.target.value)}
                      placeholder="• Prime number definitions and sieve of Eratosthenes&#10;• Step-by-step simplification formulas&#10;• Important examination points"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold"
                >
                  Publish Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Protected PDF Viewer Modal Preview */}
      {protectedPdfPreview && (
        <ProtectedPdfViewerModal
          isOpen={true}
          content={protectedPdfPreview}
          onClose={() => setProtectedPdfPreview(null)}
          studentName="Administrator (Preview Mode)"
          studentGrade={classes.find((c) => c.id === protectedPdfPreview.class_id)?.name || 'Class Curriculum'}
        />
      )}
    </div>
  );
};
