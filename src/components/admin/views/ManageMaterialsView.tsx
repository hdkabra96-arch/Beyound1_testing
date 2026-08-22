import React, { useState, useMemo } from 'react';
import { PackageMaterial, PackageType, MaterialStatus } from '../../../types/admin';
import { useAdminStore } from '../../../services/admin-store';
import { MaterialPreviewModal } from '../materials/MaterialPreviewModal';
import { ChangePackageModal } from '../materials/ChangePackageModal';
import { EditMaterialModal } from '../materials/EditMaterialModal';
import { ReplaceFileModal } from '../materials/ReplaceFileModal';
import {
  FolderOpen,
  Search,
  Filter,
  Plus,
  FileText,
  Crown,
  GraduationCap,
  Building2,
  BookOpen,
  Eye,
  Download,
  Printer,
  Shield,
  Edit,
  RefreshCw,
  Copy,
  Trash2,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Archive,
  Layers,
  ArrowUpDown,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface ManageMaterialsViewProps {
  onNavigateToUpload?: () => void;
}

export const ManageMaterialsView: React.FC<ManageMaterialsViewProps> = ({
  onNavigateToUpload,
}) => {
  const {
    packageMaterials,
    classes,
    subjects,
    chapters,
    updatePackageMaterial,
    changeMaterialPackage,
    duplicatePackageMaterial,
    replaceMaterialFile,
    deletePackageMaterial,
    toggleMaterialStatus,
  } = useAdminStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [packageFilter, setPackageFilter] = useState<'all' | PackageType>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | MaterialStatus>('all');
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('all');

  // Active Modals State
  const [previewMaterial, setPreviewMaterial] = useState<PackageMaterial | null>(null);
  const [editMaterial, setEditMaterial] = useState<PackageMaterial | null>(null);
  const [changePkgMaterial, setChangePkgMaterial] = useState<PackageMaterial | null>(null);
  const [replaceFileMat, setReplaceFileMat] = useState<PackageMaterial | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Statistics counters
  const totalCount = packageMaterials.length;
  const basicCount = packageMaterials.filter((m) => m.package_type === 'basic').length;
  const proCount = packageMaterials.filter((m) => m.package_type === 'pro').length;
  const teachersCount = packageMaterials.filter((m) => m.package_type === 'teachers').length;
  const schoolCount = packageMaterials.filter((m) => m.package_type === 'school').length;
  const publishedCount = packageMaterials.filter((m) => m.status === 'published').length;

  // Filtered Materials
  const filteredMaterials = useMemo(() => {
    return packageMaterials.filter((m) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesDesc = (m.description || '').toLowerCase().includes(q);
        const matchesFile = m.file_name.toLowerCase().includes(q);
        const matchesTopic = m.topic_id.toLowerCase().includes(q);
        const matchesAuthor = m.created_by.toLowerCase().includes(q);
        const matchesInstitution = (m.school_data?.institutionName || '').toLowerCase().includes(q);
        const matchesKeywords = (m.pro_data?.keywords || '').toLowerCase().includes(q);

        if (
          !matchesTitle &&
          !matchesDesc &&
          !matchesFile &&
          !matchesTopic &&
          !matchesAuthor &&
          !matchesInstitution &&
          !matchesKeywords
        ) {
          return false;
        }
      }

      // Package filter
      if (packageFilter !== 'all' && m.package_type !== packageFilter) {
        return false;
      }

      // Class filter
      if (classFilter !== 'all' && m.class_id !== classFilter) {
        return false;
      }

      // Subject filter
      if (subjectFilter !== 'all' && m.subject_id !== subjectFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && m.status !== statusFilter) {
        return false;
      }

      // Academic year filter
      if (academicYearFilter !== 'all' && m.academic_year !== academicYearFilter) {
        return false;
      }

      return true;
    });
  }, [
    packageMaterials,
    searchQuery,
    packageFilter,
    classFilter,
    subjectFilter,
    statusFilter,
    academicYearFilter,
  ]);

  // Package color helper
  const getPackageBadge = (pkg: PackageType) => {
    switch (pkg) {
      case 'basic':
        return {
          label: 'Basic',
          bg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
          icon: <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
        };
      case 'pro':
        return {
          label: 'Pro',
          bg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
        };
      case 'teachers':
        return {
          label: "Teacher's",
          bg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
        };
      case 'school':
        return {
          label: 'School',
          bg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          icon: <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                Package-Based File Management
              </span>
              <span className="text-xs font-medium text-slate-500">
                • {totalCount} Total Indexed Materials
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Curriculum & Package Materials Repository
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage subscription-tier materials, swap files, modify access rules, and migrate documents between package tiers.
            </p>
          </div>

          {onNavigateToUpload && (
            <button
              onClick={onNavigateToUpload}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Material</span>
            </button>
          )}
        </div>

        {/* Quick Statistics Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div
            onClick={() => setPackageFilter('all')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              packageFilter === 'all'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-medium text-slate-500">All Materials</div>
            <div className="text-xl font-black text-slate-900 dark:text-white">{totalCount}</div>
          </div>

          <div
            onClick={() => setPackageFilter('basic')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              packageFilter === 'basic'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Basic Tier
            </div>
            <div className="text-xl font-black text-blue-700 dark:text-blue-300">{basicCount}</div>
          </div>

          <div
            onClick={() => setPackageFilter('pro')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              packageFilter === 'pro'
                ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Crown className="w-3 h-3" /> Pro Tier
            </div>
            <div className="text-xl font-black text-amber-700 dark:text-amber-300">{proCount}</div>
          </div>

          <div
            onClick={() => setPackageFilter('teachers')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              packageFilter === 'teachers'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <GraduationCap className="w-3 h-3" /> Teacher Tier
            </div>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">
              {teachersCount}
            </div>
          </div>

          <div
            onClick={() => setPackageFilter('school')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              packageFilter === 'school'
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> School Tier
            </div>
            <div className="text-xl font-black text-indigo-700 dark:text-indigo-300">{schoolCount}</div>
          </div>

          <div
            onClick={() => setStatusFilter(statusFilter === 'published' ? 'all' : 'published')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              statusFilter === 'published'
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Published
            </div>
            <div className="text-xl font-black text-emerald-600">{publishedCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by material title, topic, author, keywords, or institution..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-white"
            />
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            {/* Package Filter */}
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value as any)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium shrink-0"
            >
              <option value="all">All Packages</option>
              <option value="basic">Basic Only</option>
              <option value="pro">Pro Only</option>
              <option value="teachers">Teacher&apos;s Only</option>
              <option value="school">School Only</option>
            </select>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium shrink-0"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium shrink-0"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            {/* Academic Year Filter */}
            <select
              value={academicYearFilter}
              onChange={(e) => setAcademicYearFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium shrink-0"
            >
              <option value="all">All Years</option>
              <option value="2026-2027">2026-2027</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">Material / Document</th>
                <th className="py-3.5 px-3">Package Tier</th>
                <th className="py-3.5 px-3">Academic Hierarchy</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Permissions</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Author & Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredMaterials.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      No materials found matching your filters
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try clearing search parameters or upload a new material.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredMaterials.map((mat) => {
                  const pkgDef = getPackageBadge(mat.package_type);

                  return (
                    <tr
                      key={mat.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition"
                    >
                      {/* Column 1: Title & File */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div
                              onClick={() => setPreviewMaterial(mat)}
                              className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate"
                            >
                              {mat.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                              <span className="font-mono">{mat.file_name}</span>
                              <span>•</span>
                              <span>{mat.file_size}</span>
                              {mat.watermark_enabled && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 font-semibold">
                                  Watermarked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Package Tier */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${pkgDef.bg}`}
                        >
                          {pkgDef.icon}
                          <span>{pkgDef.label}</span>
                        </span>
                      </td>

                      {/* Column 3: Academic Hierarchy */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-900 dark:text-white capitalize">
                          {mat.class_id.replace('_', ' ')} • {mat.subject_id.replace('subj_', '').replace('_', ' ')}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                          {mat.topic_id} ({mat.board})
                        </div>
                      </td>

                      {/* Column 4: Category */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium capitalize">
                          {mat.material_type.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Column 5: Permissions */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Eye
                            className="w-3.5 h-3.5 text-blue-500"
                            title="Online View Enabled"
                          />
                          <Download
                            className={`w-3.5 h-3.5 ${
                              mat.download_allowed ? 'text-emerald-500' : 'text-slate-300'
                            }`}
                            title={mat.download_allowed ? 'Download Allowed' : 'Download Disabled'}
                          />
                          <Printer
                            className={`w-3.5 h-3.5 ${
                              mat.print_allowed ? 'text-purple-500' : 'text-slate-300'
                            }`}
                            title={mat.print_allowed ? 'Print Allowed' : 'Print Disabled'}
                          />
                        </div>
                      </td>

                      {/* Column 6: Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <button
                          onClick={() =>
                            toggleMaterialStatus(
                              mat.id,
                              mat.status === 'published' ? 'draft' : 'published'
                            )
                          }
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize transition ${
                            mat.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                              : mat.status === 'draft'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{mat.status}</span>
                        </button>
                      </td>

                      {/* Column 7: Author & Date */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="text-slate-900 dark:text-white font-medium">
                          {mat.created_by}
                        </div>
                        <div className="text-[11px] text-slate-400">{mat.created_at}</div>
                      </td>

                      {/* Column 8: Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* Preview Button */}
                          <button
                            onClick={() => setPreviewMaterial(mat)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                            title="Preview Document & Access Rules"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit Details */}
                          <button
                            onClick={() => setEditMaterial(mat)}
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition"
                            title="Edit Metadata & Academic Tags"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Change Package Tier */}
                          <button
                            onClick={() => setChangePkgMaterial(mat)}
                            className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition"
                            title="Migrate Package Tier (Basic/Pro/Teacher/School)"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          {/* Replace File */}
                          <button
                            onClick={() => setReplaceFileMat(mat)}
                            className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition"
                            title="Replace Document File"
                          >
                            <FolderOpen className="w-4 h-4" />
                          </button>

                          {/* Duplicate */}
                          <button
                            onClick={() => duplicatePackageMaterial(mat.id)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition"
                            title="Duplicate Material"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(mat.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition"
                            title="Delete Material"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Delete Material Document?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently delete this material? Students enrolled in its package tier will no longer have access to this document.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deletePackageMaterial(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition"
              >
                Yes, Delete Material
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {previewMaterial && (
        <MaterialPreviewModal
          material={previewMaterial}
          onClose={() => setPreviewMaterial(null)}
          onEdit={(mat) => setEditMaterial(mat)}
          onChangePackage={(mat) => setChangePkgMaterial(mat)}
        />
      )}

      {editMaterial && (
        <EditMaterialModal
          material={editMaterial}
          onClose={() => setEditMaterial(null)}
          onSave={(id, updated) => updatePackageMaterial(id, updated)}
        />
      )}

      {changePkgMaterial && (
        <ChangePackageModal
          material={changePkgMaterial}
          onClose={() => setChangePkgMaterial(null)}
          onConfirmChange={(id, newPkg, payload) => changeMaterialPackage(id, newPkg, payload)}
        />
      )}

      {replaceFileMat && (
        <ReplaceFileModal
          material={replaceFileMat}
          onClose={() => setReplaceFileMat(null)}
          onConfirmReplace={(id, fileData) => replaceMaterialFile(id, fileData)}
        />
      )}
    </div>
  );
};
