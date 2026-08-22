import React, { useState } from 'react';
import { PackageMaterial, MaterialStatus } from '../../../types/admin';
import { useAdminStore } from '../../../services/admin-store';
import {
  X,
  Save,
  FileText,
  BookOpen,
  Layers,
  Shield,
  GraduationCap,
  Building2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface EditMaterialModalProps {
  material: PackageMaterial | null;
  onClose: () => void;
  onSave: (id: string, updated: Partial<PackageMaterial>) => void;
}

export const EditMaterialModal: React.FC<EditMaterialModalProps> = ({
  material,
  onClose,
  onSave,
}) => {
  if (!material) return null;

  const { classes, subjects, chapters, topics } = useAdminStore();

  // Core Common Fields
  const [title, setTitle] = useState(material.title);
  const [description, setDescription] = useState(material.description || '');
  const [materialType, setMaterialType] = useState(material.material_type);
  const [selectedClassId, setSelectedClassId] = useState(material.class_id);
  const [selectedSubjectId, setSelectedSubjectId] = useState(material.subject_id);
  const [selectedChapterId, setSelectedChapterId] = useState(material.chapter_id);
  const [selectedTopicId, setSelectedTopicId] = useState(material.topic_id);
  const [academicYear, setAcademicYear] = useState(material.academic_year);
  const [board, setBoard] = useState(material.board);
  const [medium, setMedium] = useState(material.medium);
  const [status, setStatus] = useState<MaterialStatus>(material.status);

  // Common Permissions
  const [downloadAllowed, setDownloadAllowed] = useState(material.download_allowed);
  const [printAllowed, setPrintAllowed] = useState(material.print_allowed);
  const [watermarkEnabled, setWatermarkEnabled] = useState(material.watermark_enabled);

  // Package Specific State (Pro)
  const [learningObjective, setLearningObjective] = useState(
    material.pro_data?.learningObjective || material.school_data?.learningObjective || ''
  );
  const [difficultyLevel, setDifficultyLevel] = useState(
    material.pro_data?.difficultyLevel || 'medium'
  );
  const [estimatedStudyTime, setEstimatedStudyTime] = useState(
    material.pro_data?.estimatedStudyTime || '45 mins'
  );
  const [watermarkText, setWatermarkText] = useState(
    material.pro_data?.watermarkText || 'BEYOND CLASSROOM'
  );

  // Package Specific State (Teacher's)
  const [teachingNotes, setTeachingNotes] = useState(
    material.teacher_data?.teachingNotes || ''
  );
  const [lessonPlan, setLessonPlan] = useState(
    material.teacher_data?.lessonPlan || ''
  );
  const [teachingDuration, setTeachingDuration] = useState(
    material.teacher_data?.teachingDuration || '2 Periods (45 mins)'
  );
  const [teachingMethod, setTeachingMethod] = useState(
    material.teacher_data?.teachingMethod || 'Interactive Discussion'
  );
  const [requiredResources, setRequiredResources] = useState(
    material.teacher_data?.requiredResources || ''
  );

  // Package Specific State (School)
  const [institutionName, setInstitutionName] = useState(
    material.school_data?.institutionName || ''
  );
  const [branch, setBranch] = useState(material.school_data?.branch || '');
  const [divisionSection, setDivisionSection] = useState(
    material.school_data?.divisionSection || 'All Sections'
  );
  const [schoolInstructions, setSchoolInstructions] = useState(
    material.school_data?.instructions || ''
  );

  // Filtered dropdowns
  const availableSubjects = subjects.filter((s) => s.classId === selectedClassId);
  const availableChapters = chapters.filter(
    (c) => c.classId === selectedClassId && c.subjectId === selectedSubjectId
  );
  const availableTopics = topics.filter((t) => t.chapterId === selectedChapterId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Partial<PackageMaterial> = {
      title,
      description,
      material_type: materialType,
      class_id: selectedClassId,
      subject_id: selectedSubjectId,
      chapter_id: selectedChapterId,
      topic_id: selectedTopicId,
      academic_year: academicYear,
      board,
      medium,
      status,
      download_allowed: downloadAllowed,
      print_allowed: printAllowed,
      watermark_enabled: watermarkEnabled,
    };

    if (material.package_type === 'pro' && material.pro_data) {
      updated.pro_data = {
        ...material.pro_data,
        learningObjective,
        difficultyLevel: difficultyLevel as any,
        estimatedStudyTime,
        watermarkEnabled,
        watermarkText,
      };
    } else if (material.package_type === 'teachers' && material.teacher_data) {
      updated.teacher_data = {
        ...material.teacher_data,
        teachingNotes,
        lessonPlan,
        teachingDuration,
        teachingMethod,
        requiredResources,
        learningObjectives: learningObjective,
      };
    } else if (material.package_type === 'school' && material.school_data) {
      updated.school_data = {
        ...material.school_data,
        institutionName,
        branch,
        divisionSection,
        instructions: schoolInstructions,
        learningObjective,
      };
    }

    onSave(material.id, updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                  {material.package_type} Package
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: {material.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Edit Material Configuration
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Common Material Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              1. General Material Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description / Topic Summary
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Material Category
                </label>
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                >
                  <option value="chapter_pdf">Chapter PDF</option>
                  <option value="notes">Chapter Notes</option>
                  <option value="ncert_solution">NCERT Solution</option>
                  <option value="worksheet">Practice Worksheet</option>
                  <option value="hots_questions">HOTS Questions</option>
                  <option value="olympiad_bank">Olympiad Question Bank</option>
                  <option value="lesson_plan">Lesson Plan (Educators)</option>
                  <option value="school_exam">Institutional Exam Paper</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Publication Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                >
                  <option value="published">Published (Active)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Hierarchy */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              2. Academic Hierarchy & Tagging
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Class Grade
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                >
                  {availableSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Board
                </label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                >
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="IB">IB</option>
                  <option value="Cambridge">Cambridge</option>
                  <option value="Olympiad">Olympiad</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Medium
                </label>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Bilingual">Bilingual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Package-Specific Metadata */}
          {material.package_type === 'pro' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                3. Pro Package Properties
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Learning Objective
                  </label>
                  <input
                    type="text"
                    value={learningObjective}
                    onChange={(e) => setLearningObjective(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
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
              </div>
            </div>
          )}

          {material.package_type === 'teachers' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                3. Teacher Toolkit Metadata
              </h4>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Teaching Notes & Pedagogical Instructions
                </label>
                <textarea
                  rows={2}
                  value={teachingNotes}
                  onChange={(e) => setTeachingNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Lesson Plan Summary
                  </label>
                  <input
                    type="text"
                    value={lessonPlan}
                    onChange={(e) => setLessonPlan(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Teaching Method
                  </label>
                  <input
                    type="text"
                    value={teachingMethod}
                    onChange={(e) => setTeachingMethod(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {material.package_type === 'school' && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                3. Institutional Governance
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Branch Campus
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Division / Sections
                  </label>
                  <input
                    type="text"
                    value={divisionSection}
                    onChange={(e) => setDivisionSection(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Permissions & Security */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-500" />
              4. Permissions & Security
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <input
                  type="checkbox"
                  checked={downloadAllowed}
                  onChange={(e) => setDownloadAllowed(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Allow PDF Download
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <input
                  type="checkbox"
                  checked={printAllowed}
                  onChange={(e) => setPrintAllowed(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Allow Direct Printing
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <input
                  type="checkbox"
                  checked={watermarkEnabled}
                  onChange={(e) => setWatermarkEnabled(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Enable Watermark
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
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
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
