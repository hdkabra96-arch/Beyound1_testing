import React, { useState } from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { PackageItem } from '../../../types/admin';
import {
  CreditCard,
  Plus,
  Edit2,
  CheckCircle2,
  XCircle,
  Sliders,
  Shield,
  Layers,
  Sparkles,
  Zap,
  Download,
  Users,
  Eye,
  EyeOff,
  Check,
  FileText,
  HelpCircle,
  Award,
  Clock,
  Tag,
} from 'lucide-react';

export const PackageManagementView: React.FC = () => {
  const { packages, updatePackage, togglePackageStatus, updatePackageFeatureMatrix, addPackage } = useAdminStore();

  const [editModalPkg, setEditModalPkg] = useState<PackageItem | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form state for creating new package
  const [formData, setFormData] = useState<Partial<PackageItem>>({
    name: '',
    code: '',
    description: '',
    targetAudience: 'Students (Class 1–8)',
    priceINR: 1499,
    priceUSD: 24,
    currency: 'INR',
    validityDays: 365,
    practicePaperLimit: 150,
    customPaperLimit: 25,
    questionsPerPaper: 20,
    customPracticeEnabled: true,
    pdfDownloadEnabled: true,
    difficultyLevels: ['easy', 'medium', 'hard'],
    questionTypes: ['mcq', 'fill_blanks', 'true_false', 'subjective'],
    competencyBasedQuestions: true,
    caseBasedQuestions: true,
    hasAnswerKey: true,
    hasSolutions: true,
    badge: 'Popular',
    eligibleClassIds: ['class_1', 'class_2', 'class_3', 'class_4', 'class_5', 'class_6', 'class_7', 'class_8'],
    isEnabled: true,
    features: {
      allCurriculumAccess: true,
      practicePapers: true,
      detailedStepSolutions: true,
      pdfDownload: true,
      mcqs: true,
      flashCards: true,
      customPapers: true,
      aiFeatures: false,
      analyticsDashboard: true,
      teacherBranding: false,
      batchManagement: false,
      prioritySupport: false,
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    addPackage({
      code: formData.code || `PKG_${formData.name.substring(0, 4).toUpperCase()}`,
      name: formData.name,
      description: formData.description || `${formData.name} subscription plan.`,
      targetAudience: formData.targetAudience || 'Students (Class 1–8)',
      priceINR: Number(formData.priceINR || 0),
      priceUSD: Number(formData.priceUSD || 0),
      currency: formData.currency || 'INR',
      validityDays: Number(formData.validityDays || 365),
      eligibleClassIds: formData.eligibleClassIds || ['class_1', 'class_2', 'class_3', 'class_4', 'class_5', 'class_6', 'class_7', 'class_8'],
      practicePaperLimit: Number(formData.practicePaperLimit ?? 150),
      customPaperLimit: Number(formData.customPaperLimit ?? 25),
      questionsPerPaper: Number(formData.questionsPerPaper || 20),
      customPracticeEnabled: formData.customPracticeEnabled ?? true,
      pdfDownloadEnabled: formData.pdfDownloadEnabled ?? true,
      difficultyLevels: formData.difficultyLevels || ['easy', 'medium', 'hard'],
      questionTypes: formData.questionTypes || ['mcq', 'fill_blanks', 'true_false', 'subjective'],
      competencyBasedQuestions: formData.competencyBasedQuestions ?? true,
      caseBasedQuestions: formData.caseBasedQuestions ?? true,
      hasAnswerKey: formData.hasAnswerKey ?? true,
      hasSolutions: formData.hasSolutions ?? true,
      badge: formData.badge,
      isEnabled: true,
      features: formData.features || {
        allCurriculumAccess: true,
        practicePapers: true,
        detailedStepSolutions: true,
        pdfDownload: true,
        mcqs: true,
        flashCards: true,
        customPapers: true,
        aiFeatures: false,
        analyticsDashboard: true,
        teacherBranding: false,
        batchManagement: false,
        prioritySupport: false,
      },
    });

    setAddModalOpen(false);
  };

  const featureKeys: { key: keyof PackageItem['features']; label: string; icon: React.ReactNode }[] = [
    { key: 'allCurriculumAccess', label: 'All Curriculum Access (Class 1–8)', icon: <Layers className="w-3.5 h-3.5 text-indigo-400" /> },
    { key: 'practicePapers', label: 'Curated Practice Papers', icon: <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> },
    { key: 'detailedStepSolutions', label: 'Step-by-Step Solutions & Answer Keys', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { key: 'pdfDownload', label: 'PDF Download & Offline Printables', icon: <Download className="w-3.5 h-3.5 text-blue-400" /> },
    { key: 'mcqs', label: 'Interactive MCQs & Timed Quizzes', icon: <Zap className="w-3.5 h-3.5 text-amber-400" /> },
    { key: 'flashCards', label: 'Visual Memory Flash Cards', icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" /> },
    { key: 'customPapers', label: 'AI/Dynamic Custom Paper Generator', icon: <Sliders className="w-3.5 h-3.5 text-indigo-400" /> },
    { key: 'aiFeatures', label: 'Gemini AI Math Explainer & Step Hinting', icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" /> },
    { key: 'analyticsDashboard', label: 'Detailed Speed & Accuracy Analytics', icon: <Shield className="w-3.5 h-3.5 text-teal-400" /> },
    { key: 'teacherBranding', label: 'Custom Watermark / Institute Branding', icon: <Users className="w-3.5 h-3.5 text-amber-400" /> },
    { key: 'batchManagement', label: 'Batch & Student Multi-Roster Access', icon: <Users className="w-3.5 h-3.5 text-purple-400" /> },
    { key: 'prioritySupport', label: 'Dedicated WhatsApp / Phone Priority Support', icon: <Shield className="w-3.5 h-3.5 text-rose-400" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Package & Entitlement Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              Database-Driven Packages
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure dynamic limits, total questions per paper, difficulty tiers, question types, and real-time student entitlements.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              code: '',
              description: '',
              targetAudience: 'Students (Class 1–8)',
              priceINR: 1499,
              priceUSD: 24,
              currency: 'INR',
              validityDays: 365,
              practicePaperLimit: 150,
              customPaperLimit: 25,
              questionsPerPaper: 20,
              customPracticeEnabled: true,
              pdfDownloadEnabled: true,
              difficultyLevels: ['easy', 'medium', 'hard'],
              questionTypes: ['mcq', 'fill_blanks', 'true_false', 'subjective'],
              competencyBasedQuestions: true,
              caseBasedQuestions: true,
              hasAnswerKey: true,
              hasSolutions: true,
              badge: 'New Tier',
              eligibleClassIds: ['class_1', 'class_2', 'class_3', 'class_4', 'class_5', 'class_6', 'class_7', 'class_8'],
              isEnabled: true,
              features: {
                allCurriculumAccess: true,
                practicePapers: true,
                detailedStepSolutions: true,
                pdfDownload: true,
                mcqs: true,
                flashCards: true,
                customPapers: true,
                aiFeatures: false,
                analyticsDashboard: true,
                teacherBranding: false,
                batchManagement: false,
                prioritySupport: false,
              },
            });
            setAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Packages Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-slate-900/90 border rounded-3xl p-5 flex flex-col justify-between transition-all relative ${
              pkg.isEnabled ? 'border-slate-800 shadow-xl' : 'border-rose-900/40 bg-slate-950/60 opacity-70'
            }`}
          >
            {pkg.badge && (
              <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-extrabold text-white shadow">
                {pkg.badge}
              </span>
            )}

            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">{pkg.code}</span>
                  <h3 className="font-extrabold text-white text-base">{pkg.name}</h3>
                </div>
                <button
                  onClick={() => togglePackageStatus(pkg.id)}
                  className={`p-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    pkg.isEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}
                  title={pkg.isEnabled ? 'Active in store' : 'Disabled'}
                >
                  {pkg.isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-black text-white">
                    {pkg.priceINR === 0 ? 'Free' : `₹${pkg.priceINR}`}
                  </span>
                  {pkg.priceINR > 0 && <span className="text-xs text-slate-500 font-bold ml-1">(${pkg.priceUSD})</span>}
                </div>
                <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {pkg.validityDays} Days
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{pkg.description}</p>

              {/* Dynamic Package Limits & Controls */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Practice Papers:
                  </span>
                  <span className="font-bold text-emerald-400">
                    {pkg.practicePaperLimit === -1 ? 'Unlimited' : `${pkg.practicePaperLimit} Papers`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Sliders className="w-3 h-3" /> Custom Generator:
                  </span>
                  <span className={`font-bold ${pkg.customPracticeEnabled ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {pkg.customPracticeEnabled
                      ? pkg.customPaperLimit === -1
                        ? 'Unlimited'
                        : `${pkg.customPaperLimit} Quota`
                      : 'Disabled'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" /> Questions / Paper:
                  </span>
                  <span className="font-bold text-slate-200">{pkg.questionsPerPaper || 20} Questions</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Download className="w-3 h-3" /> PDF Download:
                  </span>
                  <span className={`font-bold ${pkg.pdfDownloadEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pkg.pdfDownloadEnabled ? 'Allowed' : 'Disabled'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Award className="w-3 h-3" /> Difficulties:
                  </span>
                  <span className="font-bold text-slate-300 capitalize text-[11px]">
                    {pkg.difficultyLevels?.length ? pkg.difficultyLevels.join(', ') : 'All'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <button
                onClick={() => setEditModalPkg(pkg)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Full Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Package Feature Permissions Matrix (Requirement 10) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div>
          <h2 className="text-base font-extrabold text-white">Interactive Feature Permissions Matrix</h2>
          <p className="text-xs text-slate-400">
            Click any cell to immediately toggle student capability on that package tier. Changes apply instantly in real-time.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Platform Feature / Capability</th>
                {packages.map((pkg) => (
                  <th key={pkg.id} className="p-4 text-center">
                    <span className="font-extrabold text-white block">{pkg.name}</span>
                    <span className="text-[10px] text-indigo-400 font-normal">
                      {pkg.priceINR === 0 ? 'Free' : `₹${pkg.priceINR}`}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {featureKeys.map((feat) => (
                <tr key={feat.key} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-2.5">
                      {feat.icon}
                      <span className="font-semibold text-slate-200 text-xs">{feat.label}</span>
                    </div>
                  </td>

                  {packages.map((pkg) => {
                    const isEnabled = pkg.features[feat.key];
                    return (
                      <td key={pkg.id} className="p-4 text-center">
                        <button
                          onClick={() => updatePackageFeatureMatrix(pkg.id, feat.key, !isEnabled)}
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl transition-all cursor-pointer ${
                            isEnabled
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 opacity-60'
                          }`}
                          title={`Toggle ${feat.label} for ${pkg.name}`}
                        >
                          {isEnabled ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Edit Package Modal */}
      {editModalPkg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">Edit Package: {editModalPkg.name}</h3>
                <p className="text-[11px] text-slate-400">Update pricing, durations, quotas, and granular feature toggles</p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono font-bold text-[11px]">
                {editModalPkg.code}
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updatePackage(editModalPkg.id, editModalPkg);
                setEditModalPkg(null);
              }}
              className="space-y-4"
            >
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    value={editModalPkg.name}
                    onChange={(e) => setEditModalPkg({ ...editModalPkg, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={editModalPkg.targetAudience}
                    onChange={(e) => setEditModalPkg({ ...editModalPkg, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editModalPkg.description}
                  onChange={(e) => setEditModalPkg({ ...editModalPkg, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Pricing & Validity */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Pricing & Validity</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Price (INR ₹)</label>
                    <input
                      type="number"
                      value={editModalPkg.priceINR}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, priceINR: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Price (USD $)</label>
                    <input
                      type="number"
                      value={editModalPkg.priceUSD}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, priceUSD: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Validity (Days)</label>
                    <input
                      type="number"
                      value={editModalPkg.validityDays}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, validityDays: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Paper & Generator Limits */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Paper & Question Limits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Curated Paper Limit (-1 = ∞)</label>
                    <input
                      type="number"
                      value={editModalPkg.practicePaperLimit}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, practicePaperLimit: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Custom Request Quota (-1 = ∞)</label>
                    <input
                      type="number"
                      value={editModalPkg.customPaperLimit}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, customPaperLimit: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Questions / Paper</label>
                    <input
                      type="number"
                      value={editModalPkg.questionsPerPaper || 20}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, questionsPerPaper: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editModalPkg.customPracticeEnabled ?? true}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, customPracticeEnabled: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-200 font-bold">Enable Custom Practice Papers</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editModalPkg.pdfDownloadEnabled ?? true}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, pdfDownloadEnabled: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-200 font-bold">Enable PDF Download & Printing</span>
                  </label>
                </div>
              </div>

              {/* Difficulty & Question Types */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Granular Academic Controls</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editModalPkg.competencyBasedQuestions ?? true}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, competencyBasedQuestions: e.target.checked })}
                      className="w-3.5 h-3.5 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-300 text-[11px] font-bold">Competency Qs</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editModalPkg.caseBasedQuestions ?? true}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, caseBasedQuestions: e.target.checked })}
                      className="w-3.5 h-3.5 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-300 text-[11px] font-bold">Case-Based Qs</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editModalPkg.hasAnswerKey ?? true}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, hasAnswerKey: e.target.checked })}
                      className="w-3.5 h-3.5 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-300 text-[11px] font-bold">Answer Key</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editModalPkg.hasSolutions ?? true}
                      onChange={(e) => setEditModalPkg({ ...editModalPkg, hasSolutions: e.target.checked })}
                      className="w-3.5 h-3.5 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-300 text-[11px] font-bold">Full Solutions</span>
                  </label>
                </div>

                <div className="pt-2">
                  <label className="text-slate-400 font-medium block mb-1">Badge / Tag (e.g. Popular, Best Value)</label>
                  <input
                    type="text"
                    value={editModalPkg.badge || ''}
                    onChange={(e) => setEditModalPkg({ ...editModalPkg, badge: e.target.value })}
                    placeholder="e.g. Most Popular"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalPkg(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Save Package Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Package Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl animate-fade-in text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-white">Create New Package Tier</h3>
                <p className="text-[11px] text-slate-400">Configure new dynamic subscription offering for Beyond Classroom</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Olympiad Champion Track"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={formData.targetAudience || ''}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="e.g. Class 3–8 Students"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of what the package offers..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Pricing & Validity</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Price (INR ₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.priceINR}
                      onChange={(e) => setFormData({ ...formData, priceINR: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Price (USD $)</label>
                    <input
                      type="number"
                      required
                      value={formData.priceUSD}
                      onChange={(e) => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Validity (Days)</label>
                    <input
                      type="number"
                      required
                      value={formData.validityDays}
                      onChange={(e) => setFormData({ ...formData, validityDays: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Paper & Question Limits</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Curated Paper Limit (-1 = ∞)</label>
                    <input
                      type="number"
                      value={formData.practicePaperLimit}
                      onChange={(e) => setFormData({ ...formData, practicePaperLimit: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Custom Request Quota (-1 = ∞)</label>
                    <input
                      type="number"
                      value={formData.customPaperLimit}
                      onChange={(e) => setFormData({ ...formData, customPaperLimit: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium block mb-1">Questions / Paper</label>
                    <input
                      type="number"
                      value={formData.questionsPerPaper || 20}
                      onChange={(e) => setFormData({ ...formData, questionsPerPaper: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.customPracticeEnabled ?? true}
                      onChange={(e) => setFormData({ ...formData, customPracticeEnabled: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-200 font-bold">Enable Custom Practice Papers</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pdfDownloadEnabled ?? true}
                      onChange={(e) => setFormData({ ...formData, pdfDownloadEnabled: e.target.checked })}
                      className="w-4 h-4 accent-indigo-600 rounded"
                    />
                    <span className="text-slate-200 font-bold">Enable PDF Download & Printing</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Create Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
