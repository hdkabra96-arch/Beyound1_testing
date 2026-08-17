import React, { useState } from 'react';
import { EducationalContent } from '../../../types/admin';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import {
  FileText,
  Lock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Info,
  CheckCircle2,
  HelpCircle,
  X,
} from 'lucide-react';

interface ProtectedPdfViewerProps {
  content: EducationalContent;
  onClose: () => void;
}

export const ProtectedPdfViewer: React.FC<ProtectedPdfViewerProps> = ({ content, onClose }) => {
  const { currentStudent } = useStudent();
  const { canStudentDownloadPDF } = useAdminStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'summary' | 'examples'>('content');

  const pages = content.pdf_pages_content || [
    {
      pageNumber: 1,
      heading: content.title,
      subheading: 'Core Concept Notes & Standard Explanations',
      text: content.description || 'Detailed conceptual study material with mathematical definitions and diagrams.',
      keyPoints: content.key_summary_points || [
        'Understand fundamental place value notation and digit periods.',
        'Apply standard arithmetic operations in real-world scenarios.',
        'Verify step solutions using inverse operations.',
      ],
      formulaHighlight: 'Place Value = (Face Value) × (Value of the place)',
      exampleQuestion: {
        question: 'What is the place value and face value of 7 in the number 5,74,923?',
        stepSolution: '1. The face value of 7 is the digit itself: 7.\n2. In the Indian number system, 7 sits at the Ten-Thousands place (10,000).\n3. Place value = 7 × 10,000 = 70,000.',
        answer: 'Place Value = 70,000; Face Value = 7',
      },
    },
    {
      pageNumber: 2,
      heading: 'Methodologies & Step-by-Step Proofs',
      subheading: 'Advanced Problem Solving Techniques',
      text: 'When working with large figures, break them down into standard periods (Crores, Lakhs, Thousands, Ones). Use estimation to quickly verify the reasonableness of your final calculations.',
      keyPoints: [
        '1 Crore = 100 Lakhs = 10,000 Thousands = 10,000,000 Ones',
        'In the International system, periods are grouped in 3s (Millions, Thousands, Ones).',
        'Always align decimal points before adding or subtracting monetary units.',
      ],
      formulaHighlight: 'Speed = Distance / Time ; Total Cost = Unit Rate × Quantity',
      exampleQuestion: {
        question: 'A speed boat travels at 25 km/h. How far will it travel in 3 hours and 30 minutes?',
        stepSolution: '1. Convert 3 hours 30 mins to fractional hours: 3 + 1/2 = 3.5 hours.\n2. Distance = Speed × Time = 25 km/h × 3.5 h = 87.5 km.',
        answer: 'Distance = 87.5 km',
      },
    },
  ];

  const totalPages = pages.length;
  const activePageData = pages.find((p) => p.pageNumber === currentPage) || pages[0];

  // Access download rule check
  const downloadCheck = currentStudent
    ? canStudentDownloadPDF(currentStudent.id, content.id)
    : { allowed: false };
  const canDownload = !content.disable_download && downloadCheck.allowed;

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 80));

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 animate-fade-in ${
        isFullscreen ? 'p-0' : ''
      }`}
    >
      <div
        className={`bg-slate-900 border border-slate-700/80 rounded-3xl w-full flex flex-col overflow-hidden shadow-2xl transition-all ${
          isFullscreen ? 'h-full rounded-none' : 'max-w-5xl h-[90vh]'
        }`}
      >
        {/* Top Control Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 text-xs text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="font-bold text-white text-xs truncate">{content.title}</h3>
              <p className="text-[10px] text-slate-400 flex items-center gap-2">
                <span>Protected Document Viewer</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Authorized Study Session</span>
              </p>
            </div>
          </div>

          {/* Viewer Controls */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 80}
                className="p-1 hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-bold px-1 min-w-[36px] text-center">{zoomLevel}%</span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 160}
                className="p-1 hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold px-1.5 text-slate-300">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="p-1 hover:text-indigo-400 disabled:opacity-30 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Download Button (strictly disabled if notes/materials rule applied) */}
            {canDownload ? (
              <a
                href={content.pdf_url || '#'}
                download={content.pdf_filename || `${content.title}.pdf`}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-colors text-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>
            ) : (
              <div
                className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-400 font-semibold flex items-center gap-1 text-[11px]"
                title="Digital Protected Document: Direct download disabled to ensure copyright & curriculum integrity."
              >
                <Lock className="w-3 h-3 text-amber-400" />
                <span className="hidden md:inline">Protected Material</span>
              </div>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:text-indigo-400 cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              title="Close Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 py-2 flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'content' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            📖 Page {currentPage} Content
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'summary' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ Key Points & Formulas
          </button>
          <button
            onClick={() => setActiveTab('examples')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'examples' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            💡 Solved Worked Example
          </button>
        </div>

        {/* Document Content Canvas with Dynamic Watermark */}
        <div className="flex-1 bg-slate-950/90 overflow-y-auto p-4 sm:p-8 relative select-none">
          {/* Security Dynamic Watermark overlay (anti-leak protection) */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-around items-center opacity-[0.035] overflow-hidden rotate-[-25deg]">
            <p className="text-4xl sm:text-6xl font-black text-white whitespace-nowrap">
              BEYOND CLASSROOM • {currentStudent?.email || 'STUDENT ACCESS'} • CLASS {content.class_id.replace('class_', '')}
            </p>
            <p className="text-4xl sm:text-6xl font-black text-white whitespace-nowrap">
              AUTHORIZED TO: {currentStudent?.name?.toUpperCase() || 'STUDENT'} • DO NOT REPRODUCE
            </p>
            <p className="text-4xl sm:text-6xl font-black text-white whitespace-nowrap">
              BEYOND CLASSROOM MATHEMATICS PORTAL
            </p>
          </div>

          {/* Render Page in Document Sheet Container */}
          <div
            className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl text-slate-200 transition-transform origin-top space-y-6 relative"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {activeTab === 'content' && (
              <>
                <div className="border-b border-slate-800 pb-4 flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      Page {activePageData.pageNumber} of {totalPages}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-2 tracking-tight">
                      {activePageData.heading}
                    </h2>
                    {activePageData.subheading && (
                      <p className="text-xs text-indigo-300 font-semibold mt-0.5">{activePageData.subheading}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase block">Curriculum Std</span>
                    <span className="text-xs font-bold text-slate-300">NCERT / CBSE / ICSE</span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
                  <p className="whitespace-pre-line leading-relaxed">{activePageData.text}</p>
                </div>

                {activePageData.formulaHighlight && (
                  <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/80 space-y-1">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Formula & Rule to Remember</span>
                    </div>
                    <p className="text-sm font-black text-amber-300 font-mono tracking-wide">
                      {activePageData.formulaHighlight}
                    </p>
                  </div>
                )}

                {activePageData.keyPoints && activePageData.keyPoints.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Concept Key Highlights</h4>
                    <ul className="space-y-2">
                      {activePageData.keyPoints.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm border-b border-slate-800 pb-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3>Master Concept Summary & Formula Sheet</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {content.key_summary_points?.map((pt, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <span className="text-[10px] font-black text-indigo-400 uppercase">Concept Point #{idx + 1}</span>
                      <p className="text-slate-300 font-medium leading-relaxed">{pt}</p>
                    </div>
                  )) || (
                    <p className="text-xs text-slate-400 col-span-2">Comprehensive formula summary available for this chapter.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'examples' && activePageData.exampleQuestion && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-3">
                  <BookOpen className="w-5 h-5" />
                  <h3>Step-by-Step Solved Classroom Example</h3>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-amber-400">Problem Statement</span>
                  <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                    {activePageData.exampleQuestion.question}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60 space-y-2 text-xs text-slate-300">
                  <span className="text-[10px] font-extrabold uppercase text-indigo-400">Mathematical Solution Steps</span>
                  <p className="whitespace-pre-line leading-relaxed font-medium">
                    {activePageData.exampleQuestion.stepSolution}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span>Final Answer:</span>
                  <span className="font-mono font-black">{activePageData.exampleQuestion.answer}</span>
                </div>
              </div>
            )}

            {/* Bottom Security Footer Note */}
            <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                <span>Encrypted delivery • Beyond Classroom Mathematics K-8</span>
              </div>
              <span>Student ID: {currentStudent?.id || 'Active Member'}</span>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Navigation Footer */}
        <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-center">
            <span className="text-xs font-black text-white">
              Page {currentPage} of {totalPages}
            </span>
            <p className="text-[10px] text-slate-500">Use arrow buttons or controls to navigate</p>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
