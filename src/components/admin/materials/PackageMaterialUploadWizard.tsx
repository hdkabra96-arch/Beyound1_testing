import React, { useState, useMemo } from 'react';
import {
  PackageType,
  MaterialType,
  MaterialStatus,
  PackageMaterial,
  BasicPackageMetadata,
  ProPackageMetadata,
  TeacherPackageMetadata,
  SchoolPackageMetadata,
} from '../../../types/admin';
import { useAdminStore } from '../../../services/admin-store';
import { PackageSelectionCards, PACKAGE_DEFINITIONS } from './PackageSelectionCards';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  Layers,
  FolderOpen,
  ArrowRight,
  ArrowLeft,
  Crown,
  Building2,
  BookOpen,
  Eye,
  Download,
  Printer,
  ShieldCheck,
  Clock,
  Sparkles,
  Lock,
  Plus,
  Trash2,
  FileCheck,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

interface PackageMaterialUploadWizardProps {
  onNavigateToManage?: () => void;
}

export const PackageMaterialUploadWizard: React.FC<PackageMaterialUploadWizardProps> = ({
  onNavigateToManage,
}) => {
  const { classes, subjects, chapters, topics, addPackageMaterial } = useAdminStore();

  // Wizard Step Management (1: Package, 2: Academic, 3: Package Metadata, 4: File Upload, 5: Permissions, 6: Review)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Selected Package Tier
  const [selectedPackage, setSelectedPackage] = useState<PackageType>('basic');

  // Step 2: Academic Hierarchy
  const [selectedClassId, setSelectedClassId] = useState<string>('class_5');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('subj_5_math');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('ch_5_4');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('top_5_4_1');
  const [subTopic, setSubTopic] = useState<string>('Step-by-step problem sets & visual diagrams');
  const [academicYear, setAcademicYear] = useState<string>('2026-2027');
  const [board, setBoard] = useState<'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge' | 'Olympiad'>('CBSE');
  const [medium, setMedium] = useState<'English' | 'Hindi' | 'Bilingual'>('English');

  // Step 3: Package-Specific Metadata
  // Common Fields
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [materialType, setMaterialType] = useState<MaterialType>('chapter_pdf');

  // Pro Package State
  const [learningObjective, setLearningObjective] = useState<string>(
    'Master advanced problem solving techniques and high-order reasoning.'
  );
  const [difficultyLevel, setDifficultyLevel] = useState<'easy' | 'medium' | 'hard' | 'olympiad'>('hard');
  const [estimatedStudyTime, setEstimatedStudyTime] = useState<string>('45 mins');
  const [tagsInput, setTagsInput] = useState<string>('Olympiad, Mastery, Formulae, HOTS');
  const [keywords, setKeywords] = useState<string>('math, exam, competition, 2026');
  const [prerequisiteTopic, setPrerequisiteTopic] = useState<string>('Basic Fractions & Arithmetic');
  const [relatedMaterials, setRelatedMaterials] = useState<string>('Pro Olympiad Mock Set 1');
  const [solutionAvailable, setSolutionAvailable] = useState<boolean>(true);
  const [answerKeyAvailable, setAnswerKeyAvailable] = useState<boolean>(true);

  // Teacher's Package State
  const [teachingNotes, setTeachingNotes] = useState<string>(
    'Introduce concept with real-world physical models before problem solving. Address common student misconceptions.'
  );
  const [lessonPlan, setLessonPlan] = useState<string>(
    'Period 1 (45m): Concept building & blackboard proofs. Period 2 (45m): Group activity & diagnostic assessment.'
  );
  const [teachingDuration, setTeachingDuration] = useState<string>('2 Periods (45 mins each)');
  const [teachingMethod, setTeachingMethod] = useState<string>('Interactive Discussion & Flipped Classroom');
  const [requiredResources, setRequiredResources] = useState<string>(
    'Geometry protractor, grid graph sheets, interactive projector'
  );
  const [homeworkAssignment, setHomeworkAssignment] = useState<string>(
    'Complete Exercises 4.1 to 4.3 and prepare 2 peer questions.'
  );
  const [teacherAnswerKeyNotes, setTeacherAnswerKeyNotes] = useState<string>(
    'Step-by-step marking rubrics with deduction benchmarks for arithmetic errors.'
  );
  const [teacherInstructions, setTeacherInstructions] = useState<string>(
    'Keep student copies blind until in-class formative testing is concluded.'
  );
  const [evaluationNotes, setEvaluationNotes] = useState<string>('Class mastery passing bar set at 80% score.');

  // School Package State
  const [institutionName, setInstitutionName] = useState<string>('Delhi Public School (DPS)');
  const [institutionId, setInstitutionId] = useState<string>('DPS-CAMPUS-01');
  const [institutionType, setInstitutionType] = useState<string>('K-12 School Group');
  const [branch, setBranch] = useState<string>('North Campus');
  const [department, setDepartment] = useState<string>('Department of Mathematics & Analytics');
  const [divisionSection, setDivisionSection] = useState<string>('Sections 5A, 5B, 5C');
  const [schoolInstructions, setSchoolInstructions] = useState<string>(
    'Official periodic assessment paper. Standard 90-minute testing guidelines apply.'
  );
  const [assessmentInfo, setAssessmentInfo] = useState<string>('Mid-Term Examination Blueprint 2026');

  // Step 4: File Upload & Thumbnail
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('Class_5_Math_Special_Curriculum.pdf');
  const [fileSize, setFileSize] = useState<string>('2.4 MB');
  const [fileType, setFileType] = useState<string>('PDF');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(100);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Step 5: Access Control & Permissions
  // Basic
  const [basicAccessTier, setBasicAccessTier] = useState<'free' | 'basic_only' | 'public_preview'>('basic_only');
  const [basicDownloadLimit, setBasicDownloadLimit] = useState<number>(10);
  // Pro
  const [proAccessTier, setProAccessTier] = useState<'pro_only' | 'basic_pro' | 'public_preview'>('pro_only');
  const [proWatermarkEnabled, setProWatermarkEnabled] = useState<boolean>(true);
  const [proWatermarkText, setProWatermarkText] = useState<string>('BEYOND CLASSROOM PRO PASSPORT');
  const [proExpiryDate, setProExpiryDate] = useState<string>('2027-03-31');
  // Teacher's
  const [teacherAccessTier, setTeacherAccessTier] = useState<'teacher_only' | 'teacher_admin' | 'selected_teachers'>(
    'teacher_only'
  );
  const [selectedTeachersList, setSelectedTeachersList] = useState<string[]>(['adm_2', 'adm_3']);
  const [teacherAllowShare, setTeacherAllowShare] = useState<boolean>(true);
  const [teacherAllowCopy, setTeacherAllowCopy] = useState<boolean>(true);
  // School
  const [schoolAccessTier, setSchoolAccessTier] = useState<
    'all_institutions' | 'selected_institution' | 'selected_branch' | 'selected_class' | 'selected_section'
  >('selected_institution');

  // Universal flags
  const [viewOnline, setViewOnline] = useState<boolean>(true);
  const [downloadAllowed, setDownloadAllowed] = useState<boolean>(true);
  const [printAllowed, setPrintAllowed] = useState<boolean>(true);
  const [status, setStatus] = useState<MaterialStatus>('published');

  // Submit Feedback State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdMaterial, setCreatedMaterial] = useState<PackageMaterial | null>(null);

  // Dynamic dropdown hierarchies
  const availableSubjects = useMemo(() => {
    return subjects.filter((s) => s.classId === selectedClassId);
  }, [subjects, selectedClassId]);

  const availableChapters = useMemo(() => {
    return chapters.filter(
      (c) => c.classId === selectedClassId && c.subjectId === selectedSubjectId
    );
  }, [chapters, selectedClassId, selectedSubjectId]);

  const availableTopics = useMemo(() => {
    return topics.filter((t) => t.chapterId === selectedChapterId);
  }, [topics, selectedChapterId]);

  // Sync Subject/Chapter/Topic on change
  const handleClassChange = (clsId: string) => {
    setSelectedClassId(clsId);
    const subjs = subjects.filter((s) => s.classId === clsId);
    const firstSubj = subjs[0]?.id || '';
    setSelectedSubjectId(firstSubj);

    const chaps = chapters.filter((c) => c.classId === clsId && c.subjectId === firstSubj);
    const firstChap = chaps[0]?.id || '';
    setSelectedChapterId(firstChap);

    const tops = topics.filter((t) => t.chapterId === firstChap);
    setSelectedTopicId(tops[0]?.id || '');
  };

  const handleSubjectChange = (subjId: string) => {
    setSelectedSubjectId(subjId);
    const chaps = chapters.filter((c) => c.classId === selectedClassId && c.subjectId === subjId);
    const firstChap = chaps[0]?.id || '';
    setSelectedChapterId(firstChap);

    const tops = topics.filter((t) => t.chapterId === firstChap);
    setSelectedTopicId(tops[0]?.id || '');
  };

  const handleChapterChange = (chapId: string) => {
    setSelectedChapterId(chapId);
    const tops = topics.filter((t) => t.chapterId === chapId);
    setSelectedTopicId(tops[0]?.id || '');
  };

  // Process File Selection
  const processUploadedFile = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    setFileSize(`${sizeInMB} MB`);
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    setFileType(ext);

    if (!title) {
      const derived = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(derived);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  // Submit and Create PackageMaterial
  const handleFinalSubmit = (publishStatus: MaterialStatus) => {
    setIsSubmitting(true);

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    // Build Package Specific Metadata
    let basicData: BasicPackageMetadata | undefined;
    let proData: ProPackageMetadata | undefined;
    let teacherData: TeacherPackageMetadata | undefined;
    let schoolData: SchoolPackageMetadata | undefined;

    if (selectedPackage === 'basic') {
      basicData = {
        packageAccess: basicAccessTier,
        viewOnline,
        downloadAllowed,
        downloadLimit: basicDownloadLimit,
        printAllowed,
      };
    } else if (selectedPackage === 'pro') {
      proData = {
        detailedDescription: description,
        learningObjective,
        difficultyLevel,
        estimatedStudyTime,
        tags: tagsArray,
        keywords,
        prerequisiteTopic,
        relatedMaterials,
        solutionAvailable,
        answerKeyAvailable,
        packageAccess: proAccessTier,
        viewOnline,
        downloadAllowed,
        printAllowed,
        downloadLimit: -1,
        watermarkEnabled: proWatermarkEnabled,
        watermarkText: proWatermarkText,
        expiryDate: proExpiryDate,
      };
    } else if (selectedPackage === 'teachers') {
      teacherData = {
        teachingNotes,
        lessonPlan,
        teachingDuration,
        learningObjectives: learningObjective,
        teachingMethod,
        requiredResources,
        homeworkAssignment,
        answerKey: true,
        answerKeyNotes: teacherAnswerKeyNotes,
        teacherInstructions,
        evaluationNotes,
        packageAccess: teacherAccessTier,
        selectedTeacherIds: selectedTeachersList,
        viewAllowed: viewOnline,
        downloadAllowed,
        printAllowed,
        shareAllowed: teacherAllowShare,
        copyAllowed: teacherAllowCopy,
      };
    } else if (selectedPackage === 'school') {
      schoolData = {
        institutionName,
        institutionId,
        institutionType,
        branch,
        academicYear,
        department,
        divisionSection,
        learningObjective,
        instructions: schoolInstructions,
        assessmentInfo,
        institutionAccess: schoolAccessTier,
      };
    }

    const payload: Omit<PackageMaterial, 'id' | 'created_at' | 'updated_at'> = {
      package_type: selectedPackage,
      title: title || `${selectedPackage.toUpperCase()} Curriculum Sheet`,
      description,
      material_type: materialType,
      class_id: selectedClassId,
      subject_id: selectedSubjectId,
      chapter_id: selectedChapterId,
      topic_id: selectedTopicId,
      subtopic_title: subTopic,
      academic_year: academicYear,
      board,
      medium,
      file_url:
        selectedFile ? URL.createObjectURL(selectedFile) : 'https://cdn.example.com/math_worksheet.pdf',
      file_name: fileName,
      file_size: fileSize,
      file_type: fileType,
      thumbnail_url: thumbnailUrl || undefined,
      status: publishStatus,
      download_allowed: downloadAllowed,
      download_limit: downloadAllowed ? (selectedPackage === 'basic' ? basicDownloadLimit : -1) : 0,
      print_allowed: printAllowed,
      watermark_enabled: selectedPackage === 'pro' ? proWatermarkEnabled : false,
      created_by: 'Admin / Academic Team',
      access_level:
        selectedPackage === 'basic'
          ? basicAccessTier
          : selectedPackage === 'pro'
          ? proAccessTier
          : selectedPackage === 'teachers'
          ? teacherAccessTier
          : schoolAccessTier,
      visibility: publishStatus === 'published' ? 'public' : 'restricted',
      basic_data: basicData,
      pro_data: proData,
      teacher_data: teacherData,
      school_data: schoolData,
    };

    setTimeout(() => {
      const created = addPackageMaterial(payload);
      setCreatedMaterial(created);
      setIsSubmitting(false);
      setCurrentStep(7); // Success Step
    }, 400);
  };

  const currentPkgObj = PACKAGE_DEFINITIONS.find((p) => p.id === selectedPackage);

  const stepLabels = [
    { num: 1, title: 'Select Package' },
    { num: 2, title: 'Academic Info' },
    { num: 3, title: 'Package Metadata' },
    { num: 4, title: 'File Upload' },
    { num: 5, title: 'Permissions' },
    { num: 6, title: 'Review & Save' },
  ];

  return (
    <div className="space-y-6">
      {/* Wizard Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                Package-Based File Upload Module
              </span>
              <span className="text-xs font-medium text-slate-500 capitalize">
                • Active: {selectedPackage} Package
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Upload Material by Subscription Tier
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select target package to load custom pedagogical fields, user access controls, and security permissions.
            </p>
          </div>

          {onNavigateToManage && (
            <button
              onClick={onNavigateToManage}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium transition"
            >
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <span>Manage Materials Directory</span>
            </button>
          )}
        </div>

        {/* Progress Step Bar */}
        {currentStep <= 6 && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {stepLabels.map((s) => {
                const isActive = currentStep === s.num;
                const isPassed = currentStep > s.num;

                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (s.num <= currentStep || isPassed) {
                        setCurrentStep(s.num);
                      }
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left transition ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800'
                        : isPassed
                        ? 'bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-700'
                        : 'opacity-50 text-slate-400 border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <span className="text-xs font-medium truncate">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ================= STEP 1: SELECT PACKAGE ================= */}
      {currentStep === 1 && (
        <PackageSelectionCards
          selectedPackage={selectedPackage}
          onSelectPackage={(pkg) => {
            setSelectedPackage(pkg);
            // Default suitable title if empty
            if (!title) {
              if (pkg === 'basic') setTitle('Class 5 Mathematics Chapter 4 Basic Worksheet');
              if (pkg === 'pro') setTitle('Class 5 Olympiad HOTS Advanced Mastery Paper');
              if (pkg === 'teachers') setTitle('Class 5 Fractions Pedagogical Lesson Plan & Notes');
              if (pkg === 'school') setTitle('Class 5 Mathematics Mid-Term Assessment Blueprint');
            }
          }}
          onProceed={() => setCurrentStep(2)}
        />
      )}

      {/* ================= STEP 2: ACADEMIC INFORMATION ================= */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 2: Common Academic Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bind this material to the curriculum hierarchy across Grades 1 through 8.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 capitalize">
              {selectedPackage} Package
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Class */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Class Grade *
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Subject *
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {availableSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Chapter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Chapter *
              </label>
              <select
                value={selectedChapterId}
                onChange={(e) => handleChapterChange(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {availableChapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Topic *
              </label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {availableTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Sub-Topic */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Sub-topic / Micro Unit
              </label>
              <input
                type="text"
                value={subTopic}
                onChange={(e) => setSubTopic(e.target.value)}
                placeholder="e.g. Visual Fraction Strips & Multi-step word problems"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Year *
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="2026-2027">2026-2027 (Current)</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2027-2028">2027-2028</option>
              </select>
            </div>

            {/* Board */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Board *
              </label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="IB">IB</option>
                <option value="Cambridge">Cambridge</option>
                <option value="Olympiad">Olympiad</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Package Selection</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
            >
              <span>Continue to Package Metadata</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3: DYNAMIC PACKAGE-SPECIFIC METADATA ================= */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentPkgObj?.accentColor.lightBg}`}
              >
                {currentPkgObj?.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 3: {currentPkgObj?.name} Dynamic Metadata
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Custom metadata fields specifically tuned for {selectedPackage} subscriptions.
                </p>
              </div>
            </div>
          </div>

          {/* Common General Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Material Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 4 Fractions Practice Master Worksheet"
                className="w-full px-3 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Material Category *
              </label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value as any)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {selectedPackage === 'basic' && (
                  <>
                    <option value="chapter_pdf">Chapter PDF</option>
                    <option value="notes">Chapter Notes</option>
                    <option value="ncert_solution">NCERT Solution</option>
                    <option value="worksheet">Foundation Worksheet</option>
                  </>
                )}
                {selectedPackage === 'pro' && (
                  <>
                    <option value="hots_questions">HOTS Advanced Questions</option>
                    <option value="olympiad_bank">Olympiad Question Bank</option>
                    <option value="practice_paper">Pro Practice Paper</option>
                    <option value="question_bank">Mastery Question Bank</option>
                  </>
                )}
                {selectedPackage === 'teachers' && (
                  <>
                    <option value="lesson_plan">Lesson Plan</option>
                    <option value="teaching_notes">Educator Teaching Notes</option>
                    <option value="classroom_resource">Classroom Resource Pack</option>
                    <option value="rubric_guide">Marking Rubric & Diagnostic</option>
                  </>
                )}
                {selectedPackage === 'school' && (
                  <>
                    <option value="school_exam">Institutional Exam Paper</option>
                    <option value="term_blueprint">Term Blueprint & Specimen</option>
                    <option value="multi_section_test">Multi-Section Diagnostic</option>
                  </>
                )}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Summary / Curriculum Scope
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of concepts, competencies, or classroom context addressed in this document..."
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* PACKAGE SPECIFIC METADATA PANELS */}

          {/* 1. BASIC PACKAGE EXTRA FIELDS */}
          {selectedPackage === 'basic' && (
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-300">
                <BookOpen className="w-4 h-4" />
                <span>Basic Package Foundation Tagging</span>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-400">
                Standard foundation sheets are streamlined for student self-study. Detailed step solutions can be enabled if required.
              </p>
            </div>
          )}

          {/* 2. PRO PACKAGE EXTRA FIELDS */}
          {selectedPackage === 'pro' && (
            <div className="p-5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                <Crown className="w-4 h-4 text-amber-600" />
                <span>Pro Mastery & Olympiad Metadata</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Learning Objectives *
                  </label>
                  <input
                    type="text"
                    value={learningObjective}
                    onChange={(e) => setLearningObjective(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    placeholder="Specific competencies achieved by solving this paper"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    value={difficultyLevel}
                    onChange={(e) => setDifficultyLevel(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="easy">Easy (Foundational)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="hard">Hard (Competency)</option>
                    <option value="olympiad">Olympiad Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Study Time
                  </label>
                  <input
                    type="text"
                    value={estimatedStudyTime}
                    onChange={(e) => setEstimatedStudyTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    placeholder="e.g. 45 mins / 1 Hour"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Search Keywords
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Prerequisite Topic
                  </label>
                  <input
                    type="text"
                    value={prerequisiteTopic}
                    onChange={(e) => setPrerequisiteTopic(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={solutionAvailable}
                      onChange={(e) => setSolutionAvailable(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span>Include Step-by-Step Solutions</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={answerKeyAvailable}
                      onChange={(e) => setAnswerKeyAvailable(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span>Provide Dedicated Answer Key</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 3. TEACHER'S PACKAGE EXTRA FIELDS */}
          {selectedPackage === 'teachers' && (
            <div className="p-5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Teacher Toolkit & Pedagogical Directives</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teaching Notes & Misconception Guide *
                  </label>
                  <textarea
                    rows={2}
                    value={teachingNotes}
                    onChange={(e) => setTeachingNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Lesson Plan Outline (Period by Period) *
                  </label>
                  <input
                    type="text"
                    value={lessonPlan}
                    onChange={(e) => setLessonPlan(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teaching Duration
                  </label>
                  <input
                    type="text"
                    value={teachingDuration}
                    onChange={(e) => setTeachingDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teaching Method
                  </label>
                  <input
                    type="text"
                    value={teachingMethod}
                    onChange={(e) => setTeachingMethod(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Required Classroom Resources
                  </label>
                  <input
                    type="text"
                    value={requiredResources}
                    onChange={(e) => setRequiredResources(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Teacher Instructions
                  </label>
                  <input
                    type="text"
                    value={teacherInstructions}
                    onChange={(e) => setTeacherInstructions(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. SCHOOL PACKAGE EXTRA FIELDS */}
          {selectedPackage === 'school' && (
            <div className="p-5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Institutional Governance & Campus Distribution</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Institution ID
                  </label>
                  <input
                    type="text"
                    value={institutionId}
                    onChange={(e) => setInstitutionId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Campus / Branch
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Divisions / Sections *
                  </label>
                  <input
                    type="text"
                    value={divisionSection}
                    onChange={(e) => setDivisionSection(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    placeholder="e.g. Sections 5A, 5B, 5C or All"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Exam Instructions
                  </label>
                  <input
                    type="text"
                    value={schoolInstructions}
                    onChange={(e) => setSchoolInstructions(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Academic Info</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
            >
              <span>Continue to File Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 4: FILE UPLOAD & THUMBNAIL ================= */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 4: File Upload & Asset Processing
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload primary PDF, DOCX, PPTX, or ZIP document with optional preview thumbnail.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Allowed: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, PNG, ZIP
            </span>
          </div>

          {/* Drag and Drop Zone */}
          <div>
            <div
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processUploadedFile(e.dataTransfer.files[0]);
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/40 dark:bg-slate-800/30'
              }`}
            >
              <input
                type="file"
                id="wizard-file-input"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                onChange={handleFileInput}
              />
              <label htmlFor="wizard-file-input" className="cursor-pointer block">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                  Drag & drop educational material file here, or browse
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Automatic size calculation, format extraction, and secure cloud storage pipeline.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition">
                  <FolderOpen className="w-4 h-4" />
                  <span>Browse Device Files</span>
                </div>
              </label>
            </div>
          </div>

          {/* Uploaded File Summary Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {fileName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Format: <span className="font-semibold text-blue-600">{fileType}</span> • Size: {fileSize} • Upload Status: Ready
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <label
                htmlFor="wizard-file-input"
                className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace</span>
              </label>
            </div>
          </div>

          {/* Optional Thumbnail Upload */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Thumbnail / Cover Image URL (Optional)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or paste image URL"
                className="flex-1 px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() =>
                  setThumbnailUrl(
                    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=60'
                  )
                }
                className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition whitespace-nowrap"
              >
                Use Sample Cover
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Metadata</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
            >
              <span>Continue to Permissions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 5: ACCESS CONTROL & PERMISSIONS ================= */}
      {currentStep === 5 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 5: Access Control & Permissions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Configure subscriber tier gates, download allowances, and copyright watermark policies.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
              {selectedPackage} Rules
            </span>
          </div>

          {/* PACKAGE SPECIFIC PERMISSION BOXES */}
          {selectedPackage === 'basic' && (
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-4">
              <div className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                Basic Package Permissions
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Package Access Level
                  </label>
                  <select
                    value={basicAccessTier}
                    onChange={(e) => setBasicAccessTier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="basic_only">Basic Subscription Holders Only</option>
                    <option value="free">Free for All Registered Students</option>
                    <option value="public_preview">Public Sample Preview</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Download Quota Limit (Per Student)
                  </label>
                  <select
                    value={basicDownloadLimit}
                    onChange={(e) => setBasicDownloadLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value={5}>5 Downloads / Topic</option>
                    <option value={10}>10 Downloads / Topic (Standard)</option>
                    <option value={-1}>Unlimited Downloads</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {selectedPackage === 'pro' && (
            <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-4">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                Pro Access, Watermarks & Expiry
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Access Gate
                  </label>
                  <select
                    value={proAccessTier}
                    onChange={(e) => setProAccessTier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="pro_only">Pro Subscribers Only</option>
                    <option value="basic_pro">Basic & Pro Subscribers</option>
                    <option value="public_preview">Sample Unlocked</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Watermark Text
                  </label>
                  <input
                    type="text"
                    value={proWatermarkText}
                    onChange={(e) => setProWatermarkText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Document Expiry Date
                  </label>
                  <input
                    type="date"
                    value={proExpiryDate}
                    onChange={(e) => setProExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedPackage === 'teachers' && (
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-4">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                Teacher Access Governance
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Faculty Access Scope
                  </label>
                  <select
                    value={teacherAccessTier}
                    onChange={(e) => setTeacherAccessTier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="teacher_only">All Certified Teachers</option>
                    <option value="teacher_admin">Teachers + Admin Staff Only</option>
                    <option value="selected_teachers">Designated Selected Teachers</option>
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={teacherAllowShare}
                      onChange={(e) => setTeacherAllowShare(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Allow Sharing to Students</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={teacherAllowCopy}
                      onChange={(e) => setTeacherAllowCopy(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Allow Content Copying</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {selectedPackage === 'school' && (
            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 space-y-4">
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                Campus Multi-Branch Governance
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Institutional Access Level
                  </label>
                  <select
                    value={schoolAccessTier}
                    onChange={(e) => setSchoolAccessTier(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="selected_institution">Designated Institution Only ({institutionName})</option>
                    <option value="selected_branch">Designated Branch Campus Only</option>
                    <option value="all_institutions">All Enrolled School Partners</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Universal Permission Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              Standard View & Download Actions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <input
                  type="checkbox"
                  checked={viewOnline}
                  onChange={(e) => setViewOnline(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Allow Online Reading View
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <input
                  type="checkbox"
                  checked={downloadAllowed}
                  onChange={(e) => setDownloadAllowed(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Allow Offline PDF Download
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <input
                  type="checkbox"
                  checked={printAllowed}
                  onChange={(e) => setPrintAllowed(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Allow Direct Printing
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to File Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(6)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition"
            >
              <span>Continue to Summary Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 6: PREVIEW & REVIEW ================= */}
      {currentStep === 6 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Step 6: Review & Finalize Material
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verify academic binding, package tier metadata, and permission policies before publishing.
                </p>
              </div>
            </div>
          </div>

          {/* Master Summary Card */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            {/* Header banner with Package Accent */}
            <div
              className={`p-4 flex items-center justify-between ${currentPkgObj?.accentColor.bg} border-b border-slate-200 dark:border-slate-800`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                  {currentPkgObj?.icon}
                </div>
                <div>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${currentPkgObj?.accentColor.badgeBg} ${currentPkgObj?.accentColor.badgeText}`}
                  >
                    {currentPkgObj?.name}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {title || 'Untitled Material'}
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                {fileType} • {fileSize}
              </span>
            </div>

            {/* Academic Breadcrumb Strip */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Class & Subject</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedClassId.replace('_', ' ')} • {selectedSubjectId.replace('subj_', '').replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Chapter & Topic</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {selectedChapterId} • {selectedTopicId}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Board & Medium</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {board} ({medium})
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Academic Year</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{academicYear}</span>
              </div>
            </div>

            {/* Core details & Permissions */}
            <div className="p-5 space-y-4">
              {description && (
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-0.5">Description:</span>
                  <p className="text-xs text-slate-700 dark:text-slate-300">{description}</p>
                </div>
              )}

              {/* Package specific preview highlights */}
              {selectedPackage === 'pro' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-amber-800 dark:text-amber-300">
                    Pro Objectives & Olympiad Tags:
                  </div>
                  <p className="text-amber-900 dark:text-amber-200">{learningObjective}</p>
                  <div className="text-[11px] text-amber-700 dark:text-amber-400">
                    Difficulty: <span className="font-bold capitalize">{difficultyLevel}</span> • Watermark: {proWatermarkText}
                  </div>
                </div>
              )}

              {selectedPackage === 'teachers' && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">
                    Teacher Lesson Plan & Notes:
                  </div>
                  <p className="text-emerald-900 dark:text-emerald-200">{lessonPlan}</p>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Method: {teachingMethod} • Duration: {teachingDuration}
                  </div>
                </div>
              )}

              {selectedPackage === 'school' && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-indigo-800 dark:text-indigo-300">
                    Institutional Target:
                  </div>
                  <p className="text-indigo-900 dark:text-indigo-200">
                    {institutionName} ({branch}) • Divisions: {divisionSection}
                  </p>
                </div>
              )}

              {/* Badges of permissions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-blue-500" />
                  View: {viewOnline ? 'Enabled' : 'Disabled'}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  Download: {downloadAllowed ? 'Allowed' : 'Disabled'}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Printer className="w-3.5 h-3.5 text-purple-500" />
                  Print: {printAllowed ? 'Allowed' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Choice: Save as Draft vs Publish Now */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Permissions</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleFinalSubmit('draft')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition"
              >
                Save as Draft
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleFinalSubmit('published')}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Material Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 7: SUCCESS CONFIRMATION ================= */}
      {currentStep === 7 && createdMaterial && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 uppercase">
              Upload Successful
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              Material Saved to {createdMaterial.package_type.toUpperCase()} Repository
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Document &ldquo;{createdMaterial.title}&rdquo; is now indexed and available according to subscription tier permissions.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Document ID:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {createdMaterial.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Package Tier:</span>
              <span className="font-semibold text-blue-600 uppercase">
                {createdMaterial.package_type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">File Name:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {createdMaterial.file_name} ({createdMaterial.file_size})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-semibold text-emerald-600 capitalize">
                {createdMaterial.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                // Reset wizard for another upload
                setTitle('');
                setDescription('');
                setSelectedFile(null);
                setCurrentStep(1);
                setCreatedMaterial(null);
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Another Material</span>
            </button>

            {onNavigateToManage && (
              <button
                type="button"
                onClick={onNavigateToManage}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Go to Manage Materials</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
