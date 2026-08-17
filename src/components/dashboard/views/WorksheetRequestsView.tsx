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
} from 'lucide-react';

export const WorksheetRequestsView: React.FC = () => {
  const { currentStudent, worksheetRequests, submitWorksheetRequest } = useStudent();
  const { subjects, chapters } = useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState<number>(15);
  const [marks, setMarks] = useState<number>(30);
  const [questionType, setQuestionType] = useState<WorksheetRequest['questionType']>('competency_based');
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  if (!currentStudent) return null;

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
    setIsModalOpen(true);
  };

  const handleSubjectChange = (subjId: string) => {
    setSelectedSubjectId(subjId);
    const chs = chapters.filter((c) => c.subjectId === subjId);
    if (chs.length > 0) {
      setSelectedChapterId(chs[0].id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert('Please enter a topic for the worksheet.');
      return;
    }

    submitWorksheetRequest({
      classId: currentStudent.classId,
      subjectId: selectedSubjectId || studentSubjects[0]?.id,
      chapterId: selectedChapterId || availableChapters[0]?.id,
      topic,
      difficulty,
      numberOfQuestions: Number(numberOfQuestions),
      marks: Number(marks),
      questionType,
      additionalRequirements,
    });

    setIsModalOpen(false);
  };

  // Filter requests for the current student
  const studentRequests = worksheetRequests.filter((r) => r.studentId === currentStudent.id);

  const getStatusBadge = (status: WorksheetRequestStatus) => {
    switch (status) {
      case 'ready':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Ready for Practice
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 animate-spin" /> In Preparation
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            Approved by Faculty
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
            Submitted / Under Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Custom Worksheet Request Center</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Need tailored practice for school tests, IMO olympiads, or difficult topics? Request custom question sets directly from our curriculum faculty.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-600/30 shrink-0 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Request Custom Worksheet</span>
        </button>
      </div>

      {/* Requests History List (Requirement 13) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">My Submitted Worksheet Requests</h2>
          <span className="text-xs text-slate-400 font-bold">{studentRequests.length} Total Requests</span>
        </div>

        {studentRequests.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No custom worksheets requested yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the button above to request tailored practice questions with solutions for any topic.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {studentRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(req.status)}
                    <span className="text-[10px] font-mono text-slate-500">{req.id}</span>
                    <span className="text-xs text-slate-400 font-semibold">• Requested on {req.requestedDate}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white">{req.topic}</h3>
                    <p className="text-xs text-indigo-400 font-semibold">
                      {req.subjectName} • {req.chapterTitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                    <span>
                      <strong className="text-slate-200">{req.numberOfQuestions}</strong> Questions
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-200">{req.marks}</strong> Marks
                    </span>
                    <span>•</span>
                    <span className="capitalize">
                      Difficulty: <strong className="text-amber-400">{req.difficulty}</strong>
                    </span>
                    <span>•</span>
                    <span className="capitalize">
                      Type: <strong className="text-indigo-300">{req.questionType.replace('_', ' ')}</strong>
                    </span>
                  </div>

                  {req.adminFeedback && (
                    <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 text-xs text-indigo-200 flex items-start gap-2 max-w-2xl">
                      <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-indigo-300 block text-[10px] uppercase">Faculty Response:</span>
                        <span>{req.adminFeedback}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 shrink-0">
                  {req.status === 'ready' || req.status === 'completed' ? (
                    <a
                      href={req.readyPdfUrl || '#'}
                      download={`Custom_Worksheet_${req.id}.pdf`}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Worksheet PDF</span>
                    </a>
                  ) : (
                    <div className="text-xs text-slate-500 font-semibold px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
                      Processing by Faculty
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-black text-white">Create Custom Worksheet Request</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {/* Subject Select */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Subject *</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
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
                <label className="font-bold text-slate-300">Chapter *</label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  required
                >
                  {availableChapters.map((c) => (
                    <option key={c.id} value={c.id}>
                      Chapter {c.chapterNumber}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topic */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Specific Topic / Concept *</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Word problems on equivalent fractions with diagrams"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Difficulty & Question Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="easy">Easy (Foundational)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="hard">Hard (Advanced HOTS)</option>
                    <option value="olympiad">Olympiad Level (IMO Prep)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Question Format</label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as WorksheetRequest['questionType'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="competency_based">Competency / Application</option>
                    <option value="objective">Objective (Multiple Choice)</option>
                    <option value="subjective">Subjective / Step Proofs</option>
                    <option value="case_based">Case-Based Scenario</option>
                    <option value="mixed">Mixed Assessment</option>
                  </select>
                </div>
              </div>

              {/* Number of questions & Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Number of Questions</label>
                  <select
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={25}>25 Questions</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Total Marks</label>
                  <select
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={10}>10 Marks</option>
                    <option value={20}>20 Marks</option>
                    <option value={25}>25 Marks</option>
                    <option value={30}>30 Marks</option>
                    <option value={50}>50 Marks</option>
                    <option value={100}>100 Marks</option>
                  </select>
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Additional Instructions (Optional)</label>
                <textarea
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  placeholder="e.g. Please include 3 real life speed & distance scenarios with answer steps..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Worksheet Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
