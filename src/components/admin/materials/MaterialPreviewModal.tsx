import React, { useState } from 'react';
import { PackageMaterial } from '../../../types/admin';
import {
  X,
  FileText,
  Download,
  Printer,
  Shield,
  Clock,
  Calendar,
  Layers,
  GraduationCap,
  Building2,
  CheckCircle2,
  Lock,
  Tag,
  BookOpen,
  Info,
  User,
  Share2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface MaterialPreviewModalProps {
  material: PackageMaterial | null;
  onClose: () => void;
  onEdit?: (mat: PackageMaterial) => void;
  onChangePackage?: (mat: PackageMaterial) => void;
}

export const MaterialPreviewModal: React.FC<MaterialPreviewModalProps> = ({
  material,
  onClose,
  onEdit,
  onChangePackage,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  if (!material) return null;

  const getPackageBadgeColor = (pkg: string) => {
    switch (pkg) {
      case 'basic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200';
      case 'pro':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200';
      case 'teachers':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200';
      case 'school':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  const watermarkText =
    material.pro_data?.watermarkText ||
    (material.watermark_enabled ? 'BEYOND CLASSROOM SECURE PREVIEW' : null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${getPackageBadgeColor(
                    material.package_type
                  )}`}
                >
                  {material.package_type} Package
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {material.material_type}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {material.file_type} • {material.file_size}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                {material.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(material);
                }}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition"
              >
                Edit Details
              </button>
            )}
            {onChangePackage && (
              <button
                onClick={() => {
                  onClose();
                  onChangePackage(material);
                }}
                className="px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 rounded-lg transition"
              >
                Change Package
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: 2 Columns (Preview on Left, Metadata & Package Info on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: Simulated PDF / Document Viewer (7 Cols) */}
          <div className="lg:col-span-7 p-6 bg-slate-100 dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div>
              {/* Document Header Controls */}
              <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono">{material.file_name}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Simulated Paper Canvas with Optional Dynamic Watermark */}
              <div className="relative aspect-[3/4] bg-white rounded-xl shadow-md border border-slate-200 p-8 text-slate-800 flex flex-col justify-between overflow-hidden">
                {/* Watermark Diagonal Overlay */}
                {material.watermark_enabled && watermarkText && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none opacity-15 rotate-[-35deg]">
                    <span className="text-2xl font-black text-slate-800 uppercase tracking-widest text-center px-4">
                      {watermarkText}
                    </span>
                  </div>
                )}

                {/* Page Content Simulation */}
                <div>
                  <div className="flex items-center justify-between border-b pb-3 mb-4 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                    <span>Beyond Classroom Mathematics Curriculum</span>
                    <span>{material.board} Standard</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    {material.title}
                  </h4>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">
                    {material.description}
                  </p>

                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-100">
                      <div className="font-semibold text-blue-900 text-xs mb-1">
                        Curriculum Unit Overview
                      </div>
                      <p className="text-[11px] text-blue-800 leading-relaxed">
                        Academic Topic: {material.topic_id || 'Standard Topic'}. Designed for high comprehension and systematic exam readiness.
                      </p>
                    </div>

                    {material.pro_data?.learningObjective && (
                      <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-100">
                        <div className="font-semibold text-amber-900 text-xs mb-1">
                          Key Learning Objective
                        </div>
                        <p className="text-[11px] text-amber-800 leading-relaxed">
                          {material.pro_data.learningObjective}
                        </p>
                      </div>
                    )}

                    {material.teacher_data?.teachingNotes && (
                      <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100">
                        <div className="font-semibold text-emerald-900 text-xs mb-1">
                          Teacher Pedagogical Directive
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-relaxed">
                          {material.teacher_data.teachingNotes}
                        </p>
                      </div>
                    )}

                    {material.school_data?.instructions && (
                      <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-100">
                        <div className="font-semibold text-indigo-900 text-xs mb-1">
                          Institutional Examination Instructions
                        </div>
                        <p className="text-[11px] text-indigo-800 leading-relaxed">
                          {material.school_data.instructions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulated Paper Footer */}
                <div className="border-t pt-3 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span>Confidential Educational Material</span>
                </div>
              </div>
            </div>

            {/* Permission Control Bar underneath Canvas */}
            <div className="mt-4 flex items-center justify-between gap-3 text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  View: Online
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Download
                    className={`w-3.5 h-3.5 ${
                      material.download_allowed ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  />
                  Download: {material.download_allowed ? 'Allowed' : 'Disabled'}
                </span>
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Printer
                    className={`w-3.5 h-3.5 ${
                      material.print_allowed ? 'text-emerald-500' : 'text-slate-400'
                    }`}
                  />
                  Print: {material.print_allowed ? 'Allowed' : 'Disabled'}
                </span>
              </div>

              {material.download_allowed && (
                <a
                  href={material.file_url}
                  download={material.file_name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Full Metadata & Package Specific Properties (5 Cols) */}
          <div className="lg:col-span-5 p-6 space-y-5 overflow-y-auto">
            {/* Academic Information Card */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                Academic Hierarchy
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Class</span>
                  <span className="font-semibold text-slate-900 dark:text-white capitalize">
                    {material.class_id.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Subject</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {material.subject_id.replace('subj_', '').replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Board</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{material.board}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Medium</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{material.medium}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Academic Year</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {material.academic_year}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Status</span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold capitalize ${
                      material.status === 'published' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {material.status}
                  </span>
                </div>
              </div>
            </div>

            {/* PACKAGE-SPECIFIC PAYLOAD DETAILS */}
            {/* 1. Pro Package Specific Details */}
            {material.package_type === 'pro' && material.pro_data && (
              <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-900/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Pro Package Metadata
                </h4>
                {material.pro_data.learningObjective && (
                  <div>
                    <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 block">
                      Learning Objective:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {material.pro_data.learningObjective}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Difficulty</span>
                    <span className="font-semibold text-slate-900 dark:text-white capitalize">
                      {material.pro_data.difficultyLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Est. Time</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {material.pro_data.estimatedStudyTime || '45 mins'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Solutions</span>
                    <span className="font-semibold text-emerald-600">
                      {material.pro_data.solutionAvailable ? 'Included' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Answer Key</span>
                    <span className="font-semibold text-emerald-600">
                      {material.pro_data.answerKeyAvailable ? 'Included' : 'No'}
                    </span>
                  </div>
                </div>
                {material.pro_data.tags && material.pro_data.tags.length > 0 && (
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Tags:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {material.pro_data.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. Teacher's Package Specific Details */}
            {material.package_type === 'teachers' && material.teacher_data && (
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Teacher Toolkit Details
                </h4>
                <div>
                  <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 block">
                    Lesson Plan Outline:
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {material.teacher_data.lessonPlan || 'Standard curriculum lesson plan.'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Method</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {material.teacher_data.teachingMethod}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Duration</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {material.teacher_data.teachingDuration}
                    </span>
                  </div>
                </div>
                {material.teacher_data.requiredResources && (
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Required Resources:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {material.teacher_data.requiredResources}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. School Package Specific Details */}
            {material.package_type === 'school' && material.school_data && (
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  School Institution Data
                </h4>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Institution: </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {material.school_data.institutionName} ({material.school_data.institutionId})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Branch: </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {material.school_data.branch}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Target Divisions: </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {material.school_data.divisionSection}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata Footer */}
            <div className="text-[11px] text-slate-400 dark:text-slate-500 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div>Uploaded by: {material.created_by}</div>
              <div>Upload Date: {material.created_at} (Last updated: {material.updated_at})</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
