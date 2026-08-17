import React, { useState, useEffect, useCallback } from 'react';
import { EducationalContent } from '../../types/admin';
import {
  X,
  FileText,
  Lock,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface ProtectedPdfViewerModalProps {
  content: EducationalContent | null;
  onClose: () => void;
  studentName?: string;
  studentGrade?: string;
}

export const ProtectedPdfViewerModal: React.FC<ProtectedPdfViewerModalProps> = ({
  content,
  onClose,
  studentName = 'Student (Enrolled)',
  studentGrade,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);

  const totalPages =
    content?.pdf_pages_content && content.pdf_pages_content.length > 0
      ? content.pdf_pages_content.length
      : content?.pdf_pages_count || 3;

  // Intercept keyboard shortcuts like Ctrl+S, Ctrl+P, PrintScreen, etc.
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P' || e.key === 'u' || e.key === 'U')
    ) {
      e.preventDefault();
      e.stopPropagation();
      setSecurityWarning('Download, save, and print actions are strictly disabled for this protected study document.');
      setTimeout(() => setSecurityWarning(null), 4000);
    }
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      setSecurityWarning('Screen recording and captures are prohibited by copyright policies.');
      setTimeout(() => setSecurityWarning(null), 4000);
    }
    if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!content) return null;

  const currentContentPage = content.pdf_pages_content?.find(
    (p) => p.pageNumber === currentPage
  ) || {
    pageNumber: currentPage,
    heading: `Section ${currentPage}: Key Concepts & Properties`,
    subheading: 'Core Syllabus Breakdown & Solved Illustrations',
    text: content.description || 'Essential mathematical rules and worked examples for this chapter unit.',
    keyPoints: content.key_summary_points || [
      'Master core definitions and verify inverse properties.',
      'Always simplify equations step-by-step.',
      'Check units before finalizing the calculated result.',
    ],
    formulaHighlight: 'Core Rule: Verify each intermediate step before computing final answers.',
    exampleQuestion: {
      question: `Sample Assessment Problem for Chapter Unit ${currentPage}`,
      stepSolution: 'Step 1: Identify given quantities and constraints.\nStep 2: Apply the standard theorem or place value breakdown.\nStep 3: Calculate the result and check boundary cases.',
      answer: 'Correct Result verified via standard method.',
    },
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSecurityWarning('Right-click context menu is disabled to prevent unauthorized copying.');
    setTimeout(() => setSecurityWarning(null), 3000);
  };

  return (
    <div
      id="protected-pdf-modal"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 select-none"
      onContextMenu={handleContextMenu}
    >
      {/* Container Box */}
      <div
        className={`bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full transition-all duration-200 ${
          isFullscreen ? 'fixed inset-2 h-[98vh] max-w-none' : 'max-w-5xl h-[92vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-xs sm:text-sm truncate max-w-md">
                  {content.title}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 shrink-0">
                  <Lock className="w-2.5 h-2.5" />
                  <span>Protected Document (No Download)</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {content.pdf_filename || 'Chapter_Study_Notes.pdf'} • {content.pdf_file_size || '2.2 MB'} • {totalPages} Pages
              </p>
            </div>
          </div>

          {/* Right Action Controls: Zoom, Page Navigation, Close */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              <button
                id="btn-pdf-zoom-out"
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[10px] font-bold text-slate-300 min-w-[42px] text-center">
                {zoomLevel}%
              </span>
              <button
                id="btn-pdf-zoom-in"
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 140))}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                id="btn-pdf-zoom-reset"
                onClick={() => setZoomLevel(100)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer border-l border-slate-800 ml-0.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
              <button
                id="btn-pdf-prev-page"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 rounded-lg cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-[11px] font-extrabold text-amber-400">
                {currentPage} / {totalPages}
              </span>
              <button
                id="btn-pdf-next-page"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 rounded-lg cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              id="btn-pdf-fullscreen"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer hidden sm:block"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              id="btn-pdf-close"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Security Warning Notification Banner */}
        {securityWarning && (
          <div className="bg-amber-500/20 border-b border-amber-500/40 text-amber-300 px-4 py-2 text-xs flex items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{securityWarning}</span>
            </div>
            <button
              onClick={() => setSecurityWarning(null)}
              className="text-amber-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Notice Bar for Students */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 px-4 py-1.5 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              Viewing as <strong className="text-slate-200">{studentName}</strong> • {studentGrade || 'Enrolled Grade'}
            </span>
          </div>
          <span className="text-slate-500 text-[10px]">
            🔒 Watermarked & Protected View • Direct PDF Download Prohibited
          </span>
        </div>

        {/* PDF Reader Canvas Area */}
        <div className="flex-1 bg-slate-950 overflow-y-auto p-4 sm:p-8 flex justify-center relative custom-scrollbar">
          {/* Document Sheet (Styled as an authentic high-grade educational PDF page) */}
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-3xl min-h-[840px] p-6 sm:p-10 flex flex-col justify-between relative transition-transform duration-150 border border-slate-300"
          >
            {/* Watermark Diagonal Overlay across the PDF */}
            <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center rotate-[-30deg] overflow-hidden">
              <div className="text-center font-black text-4xl sm:text-5xl text-slate-900 tracking-widest leading-loose">
                BEYOND CLASSROOM
                <br />
                STUDENT ONLINE COPY
                <br />
                DO NOT DISTRIBUTE
              </div>
            </div>

            {/* Document Header */}
            <div className="border-b-2 border-indigo-600 pb-4 relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>Beyond Classroom Math Masterclass</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
                    {content.title.replace(' (PDF)', '')}
                  </h1>
                  <p className="text-xs text-indigo-700 font-semibold mt-0.5">
                    Official Chapter Study Notes & Formula Blueprint
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    BC
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 block mt-1">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              </div>
            </div>

            {/* Page Main Content Body */}
            <div className="my-6 space-y-6 flex-1 relative z-10 text-xs sm:text-sm text-slate-800 leading-relaxed">
              {/* Unit Header */}
              <div className="bg-indigo-50/70 border-l-4 border-indigo-600 p-4 rounded-r-xl">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 block">
                  {currentContentPage.subheading || 'Curriculum Focus'}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                  {currentContentPage.heading}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-normal">
                  {currentContentPage.text}
                </p>
              </div>

              {/* Key Concept Points */}
              {currentContentPage.keyPoints && currentContentPage.keyPoints.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Mathematical Rules & Principles</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {currentContentPage.keyPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formula Highlight Box */}
              {currentContentPage.formulaHighlight && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Quick Formula & Exam Memorization Hook</span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm font-extrabold text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-300/80">
                    {currentContentPage.formulaHighlight}
                  </div>
                </div>
              )}

              {/* Solved Example Problem Walkthrough */}
              {currentContentPage.exampleQuestion && (
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-3 shadow-md">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Step-by-Step Solved Illustration</span>
                    </span>
                    <span className="text-[10px] font-bold bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-md">
                      Exam Benchmark
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white mb-1.5">
                      Q: {currentContentPage.exampleQuestion.question}
                    </h4>
                    <div className="text-[11px] text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono whitespace-pre-line leading-relaxed">
                      {currentContentPage.exampleQuestion.stepSolution}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Final Evaluated Answer:</span>
                    <span className="font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-500/40">
                      {currentContentPage.exampleQuestion.answer}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Document Footer */}
            <div className="border-t border-slate-200 pt-3 mt-4 flex items-center justify-between text-[10px] text-slate-500 relative z-10">
              <span>© Beyond Classroom Education Ltd. • Protected Intellectual Property</span>
              <span className="font-bold text-indigo-700">
                Grade Curriculum Standard • Page {currentPage}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Bar */}
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-2.5 flex items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto max-w-[50%]">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                id={`btn-page-thumb-${pg}`}
                onClick={() => setCurrentPage(pg)}
                className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                  currentPage === pg
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Page {pg}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-bottom-prev"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold cursor-pointer"
            >
              Previous Page
            </button>
            <button
              id="btn-bottom-next"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold shadow-md cursor-pointer"
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
