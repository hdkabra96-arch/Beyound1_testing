import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { Student, StudentContentOverrides } from '../../../types/admin';
import {
  KeyRound,
  Shield,
  UserCheck,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  FolderOpen,
  FileText,
  Layers,
  GraduationCap,
  Download,
  Zap,
  Sliders,
  ChevronRight,
  ChevronDown,
  Info,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface StudentAccessControlViewProps {
  initialStudentId?: string;
}

export const StudentAccessControlView: React.FC<StudentAccessControlViewProps> = ({
  initialStudentId,
}) => {
  const {
    students,
    classes,
    subjects,
    chapters,
    contents,
    updateStudentOverrides,
    canUserAccessContent,
    canStudentUseFeature,
    canStudentDownloadPDF,
  } = useAdminStore();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (students[0]?.id ?? '')
  );

  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({
    class_5: true,
    class_6: true,
  });
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
    subj_core_5: true,
  });

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const toggleClassExpand = (classId: string) => {
    setExpandedClasses((prev) => ({ ...prev, [classId]: !prev[classId] }));
  };

  const toggleSubjectExpand = (subjId: string) => {
    setExpandedSubjects((prev) => ({ ...prev, [subjId]: !prev[subjId] }));
  };

  if (!selectedStudent) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-3xl">
        No students available to manage access control.
      </div>
    );
  }

  const overrides: StudentContentOverrides = selectedStudent.accessOverrides || {
    disabledContentIds: [],
    disabledChapterIds: [],
    disabledSubjectIds: [],
    extraAllowedContentIds: [],
    extraAllowedChapterIds: [],
    extraAllowedClassIds: [],
    downloadsDisabled: false,
    customPaperGenerationDisabled: false,
  };

  // Helper toggle functions
  const toggleContentBlock = (contentId: string) => {
    const isCurrentlyBlocked = overrides.disabledContentIds?.includes(contentId);
    const updatedBlocked = isCurrentlyBlocked
      ? overrides.disabledContentIds?.filter((id) => id !== contentId) || []
      : [...(overrides.disabledContentIds || []), contentId];

    // Remove from extra allowed if blocking
    const updatedExtra = overrides.extraAllowedContentIds?.filter((id) => id !== contentId) || [];

    updateStudentOverrides(selectedStudent.id, {
      ...overrides,
      disabledContentIds: updatedBlocked,
      extraAllowedContentIds: updatedExtra,
    });
  };

  const toggleContentExtraGrant = (contentId: string) => {
    const isCurrentlyGranted = overrides.extraAllowedContentIds?.includes(contentId);
    const updatedGranted = isCurrentlyGranted
      ? overrides.extraAllowedContentIds?.filter((id) => id !== contentId) || []
      : [...(overrides.extraAllowedContentIds || []), contentId];

    const updatedBlocked = overrides.disabledContentIds?.filter((id) => id !== contentId) || [];

    updateStudentOverrides(selectedStudent.id, {
      ...overrides,
      extraAllowedContentIds: updatedGranted,
      disabledContentIds: updatedBlocked,
    });
  };

  const toggleChapterBlock = (chapterId: string) => {
    const isBlocked = overrides.disabledChapterIds?.includes(chapterId);
    const updatedBlocked = isBlocked
      ? overrides.disabledChapterIds?.filter((id) => id !== chapterId) || []
      : [...(overrides.disabledChapterIds || []), chapterId];

    const updatedExtra = overrides.extraAllowedChapterIds?.filter((id) => id !== chapterId) || [];

    updateStudentOverrides(selectedStudent.id, {
      ...overrides,
      disabledChapterIds: updatedBlocked,
      extraAllowedChapterIds: updatedExtra,
    });
  };

  const toggleClassGrant = (classId: string) => {
    const isGranted = overrides.extraAllowedClassIds?.includes(classId);
    const updatedExtra = isGranted
      ? overrides.extraAllowedClassIds?.filter((id) => id !== classId) || []
      : [...(overrides.extraAllowedClassIds || []), classId];

    updateStudentOverrides(selectedStudent.id, {
      ...overrides,
      extraAllowedClassIds: updatedExtra,
    });
  };

  const toggleFeatureDownload = () => {
    updateStudentOverrides(selectedStudent.id, {
      ...overrides,
      downloadsDisabled: !overrides.downloadsDisabled,
    });
  };

  const toggleFeatureCustomPaper = () => {
    updateStudentOverrides(selectedStudent.id, {
      ...overrides,
      customPaperGenerationDisabled: !overrides.customPaperGenerationDisabled,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Student-Specific Access Control & Permissions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              Requirement 11
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Override platform access on a granular level. Block or unlock specific classes, chapters, individual practice papers, and feature capabilities.
          </p>
        </div>

        {/* Student Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-400">Target Student:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-4 py-2.5 bg-slate-900 border border-indigo-500/40 rounded-2xl text-xs font-bold text-white focus:outline-none focus:border-indigo-400"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.classId.replace('_', ' ').toUpperCase()} • {s.packageName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Student Snapshot Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-600/30 shrink-0">
            {selectedStudent.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-sm font-black text-white truncate">{selectedStudent.name}</h2>
            <p className="text-xs text-slate-400 truncate">{selectedStudent.email}</p>
            <p className="text-[11px] text-indigo-400 font-bold mt-0.5">
              Enrolled: {selectedStudent.classId.replace('_', ' ').toUpperCase()} ({selectedStudent.board})
            </p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Package</span>
          <p className="text-xs font-black text-white">{selectedStudent.packageName}</p>
          <p className="text-[11px] text-emerald-400 font-semibold">
            Status: {selectedStudent.packageStatus.toUpperCase()} (Exp: {selectedStudent.expiryDate})
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Custom Practice Quota</span>
          <p className="text-xs font-black text-white">
            {selectedStudent.customPaperCountUsed} / {selectedStudent.customPaperLimit === -1 ? 'Unlimited' : selectedStudent.customPaperLimit} Used
          </p>
          <p className="text-[11px] text-slate-400">
            {selectedStudent.customPaperLimit === -1 ? 'No cap' : `${selectedStudent.customPaperLimit - selectedStudent.customPaperCountUsed} papers remaining`}
          </p>
        </div>

        {/* Global Feature Toggles for this student */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Feature Switches</span>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">PDF Downloads:</span>
            <button
              onClick={toggleFeatureDownload}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                overrides.downloadsDisabled
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {overrides.downloadsDisabled ? 'BLOCKED' : 'ENABLED'}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-300">Custom Generator:</span>
            <button
              onClick={toggleFeatureCustomPaper}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                overrides.customPaperGenerationDisabled
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {overrides.customPaperGenerationDisabled ? 'BLOCKED' : 'ENABLED'}
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum & Content Granular Override Hierarchy Tree */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white">Curriculum Granular Override Tree</h2>
            <p className="text-xs text-slate-400">
              Click toggles to grant cross-grade access, block specific chapters, or override individual paper permissions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Allowed
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <XCircle className="w-3.5 h-3.5" /> Blocked / Restricted
            </div>
            <div className="flex items-center gap-1.5 text-purple-400">
              <Sparkles className="w-3.5 h-3.5" /> Explicit Extra Grant
            </div>
          </div>
        </div>

        {/* Classes Accordion Tree */}
        <div className="space-y-3 pt-2">
          {classes.map((cls) => {
            const isClassExpanded = expandedClasses[cls.id];
            const isEnrolledClass = cls.id === selectedStudent.classId;
            const isExtraClassGranted = overrides.extraAllowedClassIds?.includes(cls.id);
            const classSubjects = subjects.filter((s) => s.classId === cls.id);

            return (
              <div
                key={cls.id}
                className={`rounded-2xl border transition-all ${
                  isEnrolledClass
                    ? 'border-indigo-500/50 bg-slate-950/80'
                    : isExtraClassGranted
                    ? 'border-purple-500/50 bg-slate-950/60'
                    : 'border-slate-800 bg-slate-950/40'
                }`}
              >
                {/* Class Row Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleClassExpand(cls.id)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      {isClassExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-indigo-400" />
                      <span className="font-extrabold text-sm text-white">{cls.name}</span>
                      {isEnrolledClass && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                          PRIMARY ENROLLED GRADE
                        </span>
                      )}
                      {isExtraClassGranted && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-[10px] font-bold">
                          EXTRA UNLOCKED GRADE
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!isEnrolledClass && (
                      <button
                        onClick={() => toggleClassGrant(cls.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isExtraClassGranted
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isExtraClassGranted ? 'Revoke Extra Grade Access' : 'Unlock Entire Grade for Student'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-items when expanded */}
                {isClassExpanded && (
                  <div className="p-4 pt-0 pl-10 space-y-3 border-t border-slate-800/60 mt-1">
                    {classSubjects.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">No subjects defined in this grade.</p>
                    ) : (
                      classSubjects.map((subj) => {
                        const isSubjExpanded = expandedSubjects[subj.id];
                        const isSubjBlocked = overrides.disabledSubjectIds?.includes(subj.id);
                        const subjChapters = chapters.filter((ch) => ch.subjectId === subj.id);

                        return (
                          <div
                            key={subj.id}
                            className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleSubjectExpand(subj.id)}
                                  className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                                >
                                  {isSubjExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </button>
                                <Layers className="w-4 h-4 text-cyan-400" />
                                <span className="font-bold text-xs text-slate-200">{subj.name}</span>
                                <span className="text-[10px] text-slate-500">({subjChapters.length} Chapters)</span>
                              </div>
                            </div>

                            {/* Chapters & Content */}
                            {isSubjExpanded && (
                              <div className="pl-6 space-y-2 pt-2">
                                {subjChapters.map((chap) => {
                                  const isChapBlocked = overrides.disabledChapterIds?.includes(chap.id);
                                  const chapContents = contents.filter((c) => c.chapter_id === chap.id);

                                  return (
                                    <div
                                      key={chap.id}
                                      className={`p-3 rounded-xl border text-xs ${
                                        isChapBlocked
                                          ? 'bg-rose-950/20 border-rose-800/50'
                                          : 'bg-slate-950/40 border-slate-800/60'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <FolderOpen className="w-4 h-4 text-amber-400" />
                                          <span className="font-bold text-white">
                                            Ch {chap.chapterNumber}: {chap.title}
                                          </span>
                                          {isChapBlocked && (
                                            <span className="text-[10px] font-bold text-rose-400">
                                              (CHAPTER BLOCKED)
                                            </span>
                                          )}
                                        </div>

                                        <button
                                          onClick={() => toggleChapterBlock(chap.id)}
                                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                            isChapBlocked
                                              ? 'bg-rose-600 text-white'
                                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                          }`}
                                        >
                                          {isChapBlocked ? 'Unblock Chapter' : 'Block Chapter for Student'}
                                        </button>
                                      </div>

                                      {/* Individual Content Items */}
                                      <div className="pl-6 pt-2 space-y-1.5">
                                        {chapContents.map((cnt) => {
                                          const accessCheck = canUserAccessContent(selectedStudent.id, cnt.id);
                                          const isExplicitBlocked = overrides.disabledContentIds?.includes(cnt.id);
                                          const isExplicitGranted = overrides.extraAllowedContentIds?.includes(cnt.id);

                                          return (
                                            <div
                                              key={cnt.id}
                                              className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/60"
                                            >
                                              <div className="flex items-center gap-2 truncate pr-2">
                                                <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                                <span className="text-[11px] font-medium text-slate-200 truncate">
                                                  {cnt.title}
                                                </span>
                                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase font-bold shrink-0">
                                                  {cnt.content_type.replace('_', ' ')}
                                                </span>
                                              </div>

                                              <div className="flex items-center gap-2 shrink-0">
                                                {/* Live Status Badge */}
                                                <span
                                                  className={`text-[10px] font-bold flex items-center gap-1 ${
                                                    accessCheck.allowed ? 'text-emerald-400' : 'text-rose-400'
                                                  }`}
                                                  title={accessCheck.reason}
                                                >
                                                  {accessCheck.allowed ? (
                                                    <>
                                                      <CheckCircle2 className="w-3 h-3" /> Accessible
                                                    </>
                                                  ) : (
                                                    <>
                                                      <XCircle className="w-3 h-3" /> Restricted
                                                    </>
                                                  )}
                                                </span>

                                                {/* Quick Action Toggle */}
                                                <button
                                                  onClick={() => toggleContentBlock(cnt.id)}
                                                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                                    isExplicitBlocked
                                                      ? 'bg-rose-500 text-white'
                                                      : 'bg-slate-800 text-slate-400 hover:text-white'
                                                  }`}
                                                >
                                                  {isExplicitBlocked ? 'Blocked' : 'Block'}
                                                </button>

                                                <button
                                                  onClick={() => toggleContentExtraGrant(cnt.id)}
                                                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                                    isExplicitGranted
                                                      ? 'bg-purple-600 text-white'
                                                      : 'bg-slate-800 text-slate-400 hover:text-white'
                                                  }`}
                                                >
                                                  {isExplicitGranted ? 'Granted' : 'Grant Extra'}
                                                </button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
