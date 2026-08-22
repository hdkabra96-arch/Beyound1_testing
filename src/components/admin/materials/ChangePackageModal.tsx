import React, { useState } from 'react';
import { PackageMaterial, PackageType } from '../../../types/admin';
import { PACKAGE_DEFINITIONS } from './PackageSelectionCards';
import {
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

interface ChangePackageModalProps {
  material: PackageMaterial | null;
  onClose: () => void;
  onConfirmChange: (
    materialId: string,
    newPackage: PackageType,
    updatedPayload: Partial<PackageMaterial>
  ) => void;
}

export const ChangePackageModal: React.FC<ChangePackageModalProps> = ({
  material,
  onClose,
  onConfirmChange,
}) => {
  if (!material) return null;

  const [targetPackage, setTargetPackage] = useState<PackageType>(
    material.package_type === 'basic'
      ? 'pro'
      : material.package_type === 'pro'
      ? 'teachers'
      : material.package_type === 'teachers'
      ? 'school'
      : 'basic'
  );

  // Additional dynamic inputs required when changing package
  const [learningObjective, setLearningObjective] = useState(
    material.pro_data?.learningObjective ||
      'Students will solve multi-step problems with accuracy and deep conceptual clarity.'
  );
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard' | 'olympiad'>(
    material.pro_data?.difficultyLevel || 'hard'
  );
  const [watermarkEnabled, setWatermarkEnabled] = useState(
    material.watermark_enabled || targetPackage === 'pro'
  );
  const [watermarkText, setWatermarkText] = useState(
    material.pro_data?.watermarkText || 'BEYOND CLASSROOM PRO PASSPORT'
  );

  const [teachingNotes, setTeachingNotes] = useState(
    material.teacher_data?.teachingNotes ||
      'Pedagogical instructions for classroom instruction and student misconceptions.'
  );
  const [lessonPlan, setLessonPlan] = useState(
    material.teacher_data?.lessonPlan ||
      'Period 1: Foundational review. Period 2: Practice & diagnostic rubric.'
  );

  const [institutionName, setInstitutionName] = useState(
    material.school_data?.institutionName || 'Delhi Public School'
  );
  const [branch, setBranch] = useState(
    material.school_data?.branch || 'Main Campus'
  );
  const [divisionSection, setDivisionSection] = useState(
    material.school_data?.divisionSection || 'All Sections (A, B, C)'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<PackageMaterial> = {
      watermark_enabled: watermarkEnabled,
    };

    if (targetPackage === 'basic') {
      payload.access_level = 'basic_only';
      payload.basic_data = {
        packageAccess: 'basic_only',
        viewOnline: true,
        downloadAllowed: true,
        downloadLimit: 10,
        printAllowed: true,
      };
    } else if (targetPackage === 'pro') {
      payload.access_level = 'pro_only';
      payload.pro_data = {
        detailedDescription: material.description,
        learningObjective,
        difficultyLevel,
        estimatedStudyTime: '45 mins',
        tags: ['Pro', 'Olympiad', 'Mastery'],
        keywords: 'pro, mastery, solution',
        solutionAvailable: true,
        answerKeyAvailable: true,
        packageAccess: 'pro_only',
        viewOnline: true,
        downloadAllowed: true,
        printAllowed: true,
        downloadLimit: -1,
        watermarkEnabled,
        watermarkText,
      };
    } else if (targetPackage === 'teachers') {
      payload.access_level = 'teacher_only';
      payload.visibility = 'restricted';
      payload.teacher_data = {
        teachingNotes,
        lessonPlan,
        teachingDuration: '2 Periods (45 mins)',
        learningObjectives: learningObjective,
        teachingMethod: 'Interactive Discussion',
        requiredResources: 'Worksheets & Geometry Box',
        homeworkAssignment: 'Assigned Homework',
        answerKey: true,
        answerKeyNotes: 'Step solutions with rubrics',
        teacherInstructions: 'Do not distribute solution to students before attempt.',
        evaluationNotes: 'Class mastery target 85%',
        packageAccess: 'teacher_only',
        selectedTeacherIds: ['adm_2', 'adm_3'],
        viewAllowed: true,
        downloadAllowed: true,
        printAllowed: true,
        shareAllowed: true,
        copyAllowed: true,
      };
    } else if (targetPackage === 'school') {
      payload.access_level = 'selected_school';
      payload.visibility = 'restricted';
      payload.school_data = {
        institutionName,
        institutionId: 'INST-CUSTOM-01',
        institutionType: 'Group of Schools',
        branch,
        academicYear: material.academic_year || '2026-2027',
        department: 'Senior Mathematics Wing',
        divisionSection,
        learningObjective,
        instructions: 'Official School Examination Guidelines apply.',
        assessmentInfo: 'Full term assessment',
        institutionAccess: 'selected_institution',
      };
    }

    onConfirmChange(material.id, targetPackage, payload);
    onClose();
  };

  const currentPkgDef = PACKAGE_DEFINITIONS.find((p) => p.id === material.package_type);
  const targetPkgDef = PACKAGE_DEFINITIONS.find((p) => p.id === targetPackage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-purple-50/50 dark:bg-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Change Material Package Tier
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Migrate this material across subscription package categories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Target Material Summary */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {material.title}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Current Package: <span className="font-semibold capitalize">{material.package_type}</span> • {material.file_name} ({material.file_size})
              </div>
            </div>
          </div>

          {/* Select New Package */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Target Package
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PACKAGE_DEFINITIONS.map((pkg) => {
                const isSelected = targetPackage === pkg.id;
                const isCurrent = material.package_type === pkg.id;

                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setTargetPackage(pkg.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                          {pkg.id}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                        {pkg.tagline}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="mt-2 text-purple-600 dark:text-purple-400 text-xs flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Warning Note */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Changing package will automatically adjust user access tiers, download rights, and security watermarks. Common academic tags (Class, Subject, Chapter, Topic) and the uploaded document file will remain intact.
            </p>
          </div>

          {/* Package-specific inputs that appear dynamically */}
          {targetPackage === 'pro' && (
            <div className="space-y-3 p-4 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Pro Package Additional Fields
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Learning Objective
                </label>
                <input
                  type="text"
                  value={learningObjective}
                  onChange={(e) => setLearningObjective(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="olympiad">Olympiad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {targetPackage === 'teachers' && (
            <div className="space-y-3 p-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                Teacher Toolkit Fields
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Teaching Notes
                </label>
                <textarea
                  rows={2}
                  value={teachingNotes}
                  onChange={(e) => setTeachingNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Lesson Plan
                </label>
                <input
                  type="text"
                  value={lessonPlan}
                  onChange={(e) => setLessonPlan(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  required
                />
              </div>
            </div>
          )}

          {targetPackage === 'school' && (
            <div className="space-y-3 p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-xl">
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                Institution Assignment
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Branch Campus
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Division / Section
                  </label>
                  <input
                    type="text"
                    value={divisionSection}
                    onChange={(e) => setDivisionSection(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition"
            >
              <span>Confirm & Apply Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
