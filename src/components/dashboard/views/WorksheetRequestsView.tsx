import React, { useState } from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import { WorksheetRequest, WorksheetRequestStatus } from '../../../types/student';
import { DifficultyLevel } from '../../../types/admin';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Sparkles,
  Layers,
  HelpCircle,
  X,
  Send,
  MessageSquare,
  UploadCloud,
  FileCheck,
  Paperclip,
  Trash2,
  Calendar,
  Award,
  ShieldAlert,
} from 'lucide-react';

export const WorksheetRequestsView: React.FC = () => {
  const { currentStudent, worksheetRequests, submitWorksheetRequest, activeEntitlement } = useStudent();
  const { subjects, chapters, packages } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(15);
  const [totalMarks, setTotalMarks] = useState<40 | 60 | 80>(40);
  const [questionType, setQuestionType] = useState<WorksheetRequest['questionType']>('competency_based');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploadFileName, setUploadFileName] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (!currentStudent) return null;

  // Student's active package limits
  const currentPackage = packages.find((p) => p.id === currentStudent.packageId) || packages[0];
  const canRequestCustom = currentPackage?.features?.allowCustomPaperRequests !== false;
  const customPaperLimit = currentPackage?.features?.customPaperLimit ?? 5;
  const usedRequestsCount = worksheetRequests.filter((r) => r.studentId === currentStudent.id).length;
  const remainingRequests = Math.max(0, customPaperLimit - usedRequestsCount);

  // Filter subjects for the student's class
  const studentSubjects = subjects.filter((s) => s.classId === currentStudent.classId);
  const availableChapters = chapters.filter((c) => c.subjectId === (selectedSubjectId || studentSubjects[0]?.id));

  const handleOpenModal = () => {
    if (studentSubjects.length > 0) {
      setSelectedSubjectId(studentSubjects[0].id);
      const chs = chapters.filter((c) => c.subjectId === studentSubjects[0].id);
      if (chs.length > 0) {
        setSelectedChapterId(chs[0].id);
      }
    }
    setTopic('');
    setAdditionalRequirements('');
    setAttachments([]);
    setTotalMarks(40);
    setIsModalOpen(true);
  };

  const handleSubjectChange = (subjId: string) => {
    setSelectedSubjectId(subjId);
    const chs = chapters.filter((c) => c.subjectId === subjId);
    if (chs.length > 0) {
      setSelectedChapterId(chs[0].id);
    }
  };

  const handleAddAttachment = () => {
    if (!uploadFileName.trim()) return;
    setAttachments((prev) => [...prev, uploadFileName.trim()]);
    setUploadFileName('');
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canRequestCustom) {
      alert('Your current active package does not support custom practice paper requests. Please upgrade your package.');
      return;
    }

    if (remainingRequests <= 0) {
      alert(`You have reached the limit of ${customPaperLimit} custom paper requests for this billing cycle.`);
      return;
    }

    submitWorksheetRequest({
      classId: currentStudent.classId,
      subjectId: selectedSubjectId || studentSubjects[0]?.id,
      chapterId: selectedChapterId || availableChapters[0]?.id,
      topic: topic.trim() || undefined,
      difficulty,
      numberOfQuestions: Number(numberOfQuestions),
      totalMarks: totalMarks,
      marks: totalMarks,
      questionType,
      additionalRequirements: additionalRequirements.trim() || undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    setIsModalOpen(false);
  };

  // Filter requests for the current student
  const studentRequests = worksheetRequests
    .filter((r) => r.studentId === currentStudent.id)
    .filter((r) => {
      const matchSearch =
        searchFilter === '' ||
        r.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (r.topic && r.topic.toLowerCase().includes(searchFilter.toLowerCase())) ||
        r.subjectName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        r.chapterTitle.toLowerCase().includes(searchFilter.toLowerCase());

      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchSearch && matchStatus;
    });

  const getStatusBadge = (status: WorksheetRequestStatus) => {
    switch (status) {
      case 'ready':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paper Ready
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 animate-spin" /> In Preparation (48h)
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30">
            Approved by Faculty
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30">
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            Submitted / Under Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Custom Practice Paper Request Center</h1>
            </div>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              Need personalized practice for school unit tests, term exams, or Olympiads? Submit a request with optional reference material and custom marks. Our academic faculty designs and delivers your verified paper <strong className="text-amber-300 underline underline-offset-2">within 48 hours</strong>.
            </p>
            
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 flex items-center gap-1.5 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Delivery: Guaranteed 48 Hours
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 flex items-center gap-1.5 font-bold">
                <Award className="w-3.5 h-3.5 text-indigo-400" /> Marks Allowed: 40 / 60 / 80
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-200 flex items-center gap-1.5 font-bold">
                Quota: <strong className="text-white">{remainingRequests} of {customPaperLimit} remaining</strong>
              </span>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            disabled={!canRequestCustom || remainingRequests <= 0}
            className={`px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl shrink-0 transition-all ${
              canRequestCustom && remainingRequests > 0
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20 cursor-pointer scale-100 hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-70'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Request Custom Paper</span>
          </button>
        </div>
      </div>

      {/* Quota Exhaustion Warning */}
      {!canRequestCustom && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center gap-3 text-xs">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-500" />
          <div>
            <strong>Custom Paper Requests Not Included in Current Plan:</strong> Your active package ({currentPackage?.name}) does not include personalized on-demand practice paper requests. Upgrade to the Pro or Olympiad Package to unlock on-demand requests.
          </div>
        </div>
      )}

      {/* Requests History List Header & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">My Practice Paper Requests</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track status, reviewer notes, and download ready papers with answer keys</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Search by ID (e.g. BC-...) or topic"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="text-xs px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="in_progress">In Preparation</option>
              <option value="ready">Ready for Download</option>
            </select>
          </div>
        </div>

        {studentRequests.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-3">
            <FileText className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No custom practice paper requests found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Submit your first request using the button above to receive a verified custom paper within 48 hours.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {studentRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 hover:border-indigo-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {getStatusBadge(req.status)}
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {req.id}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Submitted: {req.requestedDate}
                    </span>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Delivery: {req.expectedDelivery || 'Within 48 Hours'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      {req.topic ? req.topic : <span className="text-slate-400 italic font-normal">Topic: Not specified (Comprehensive)</span>}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                      {req.subjectName} • {req.chapterTitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                      {req.totalMarks || req.marks || 40} Marks Total
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200">{req.numberOfQuestions}</strong> Questions
                    </span>
                    <span>•</span>
                    <span className="capitalize">
                      Difficulty: <strong className="text-amber-600 dark:text-amber-400">{req.difficulty}</strong>
                    </span>
                    <span>•</span>
                    <span className="capitalize">
                      Format: <strong className="text-slate-800 dark:text-slate-200">{req.questionType.replace('_', ' ')}</strong>
                    </span>
                  </div>

                  {req.attachments && req.attachments.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.attachments.length} reference file(s) attached:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{req.attachments.join(', ')}</span>
                    </div>
                  )}

                  {req.adminFeedback && (
                    <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-indigo-700 dark:text-indigo-300 block text-[11px] uppercase tracking-wider">Faculty Notes:</span>
                        <span>{req.adminFeedback}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 shrink-0 pt-2 lg:pt-0">
                  {req.status === 'ready' || req.status === 'completed' ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                      <a
                        href={req.readyPdfUrl || '#'}
                        download={`Practice_Paper_${req.id}.pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Paper (PDF)</span>
                      </a>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold px-4 py-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>Faculty drafting in progress (48h)</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl text-slate-900 dark:text-white">
            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-black">Request Custom Practice Paper</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Notice Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <strong className="block">Delivery Notice:</strong> Custom verified practice papers with step-by-step solutions are delivered within 48 hours of submission.
                </div>
              </div>

              {/* Subject Select */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Subject *</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  required
                >
                  {studentSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Select */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Chapter *</label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  required
                >
                  {availableChapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      Chapter {c.chapterNumber}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Topic */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Specific Topic / Concept (Optional)</label>
                  <span className="text-[10px] text-slate-400">Leave blank for full chapter coverage</span>
                </div>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Word problems on LCM & HCF with step-by-step model diagrams"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Total Marks: 40 / 60 / 80 */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Total Marks Specification *</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[40, 60, 80].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTotalMarks(m as 40 | 60 | 80)}
                      className={`py-3 rounded-xl font-black text-center text-xs transition-all border ${
                        totalMarks === m
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {m} Marks Paper
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty & Question Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="easy">Easy (Foundational Concepts)</option>
                    <option value="medium">Medium (Standard School Exam)</option>
                    <option value="hard">Hard (Advanced HOTS / Competency)</option>
                    <option value="olympiad">Olympiad Level (IMO Prep)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Question Format</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as WorksheetRequest['questionType'])}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="competency_based">Competency / Application</option>
                    <option value="objective">Objective (Multiple Choice)</option>
                    <option value="subjective">Subjective (Long Steps)</option>
                    <option value="case_based">Case-Based Scenario</option>
                    <option value="mixed">Mixed Assessment Structure</option>
                  </select>
                </div>
              </div>

              {/* Number of questions */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Target Question Count</label>
                <select
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions (Recommended)</option>
                  <option value={20}>20 Questions</option>
                  <option value={25}>25 Questions</option>
                  <option value={30}>30 Questions</option>
                </select>
              </div>

              {/* Reference Uploads */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 dark:text-slate-300">Reference Material / Sample Paper Upload (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    placeholder="Enter file name (e.g. Unit_Test_Question_Paper_Term1.pdf)"
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Attach
                  </button>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200">
                        <span className="flex items-center gap-1.5 text-[11px] font-semibold">
                          <Paperclip className="w-3 h-3 text-indigo-500" /> {file}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(idx)}
                          className="text-rose-500 hover:text-rose-700 cursor-pointer p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Requirements */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Special Instructions for Faculty (Optional)</label>
                <textarea
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="e.g. Please emphasize multi-step fraction division and include real-world word problems..."
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Paper Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
