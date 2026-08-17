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
} from 'lucide-react';

export const PackageManagementView: React.FC = () => {
  const { packages, classes, updatePackage, togglePackageStatus, updatePackageFeatureMatrix, addPackage } = useAdminStore();

  const [editModalPkg, setEditModalPkg] = useState<PackageItem | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form state
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newPriceINR, setNewPriceINR] = useState(1499);
  const [newPriceUSD, setNewPriceUSD] = useState(24);
  const [newValidityDays, setNewValidityDays] = useState(365);
  const [newAudience, setNewAudience] = useState('Students (Class 1–8)');
  const [newPaperLimit, setNewPaperLimit] = useState(150);
  const [newCustomPaperLimit, setNewCustomPaperLimit] = useState(25);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    addPackage({
      code: newCode || `PKG_${newName.substring(0, 4).toUpperCase()}`,
      name: newName,
      description: `${newName} subscription tier.`,
      targetAudience: newAudience,
      priceINR: Number(newPriceINR),
      priceUSD: Number(newPriceUSD),
      validityDays: Number(newValidityDays),
      eligibleClassIds: ['class_1', 'class_2', 'class_3', 'class_4', 'class_5', 'class_6', 'class_7', 'class_8'],
      practicePaperLimit: Number(newPaperLimit),
      customPaperLimit: Number(newCustomPaperLimit),
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

    setAddModalOpen(false);
    setNewName('');
    setNewCode('');
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
              Requirements 9 & 10
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure pricing, validity durations, and live toggle feature privileges across all subscription plans.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Package Tier</span>
        </button>
      </div>

      {/* Packages Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-slate-900/90 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
              pkg.isEnabled ? 'border-slate-800 shadow-xl' : 'border-rose-900/40 bg-slate-950/60 opacity-70'
            }`}
          >
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
                  <span className="text-xl font-black text-white">₹{pkg.priceINR}</span>
                  <span className="text-xs text-slate-500 font-bold ml-1">(${pkg.priceUSD})</span>
                </div>
                <span className="text-[11px] font-bold text-indigo-400">{pkg.validityDays} Days Pass</span>
              </div>

              <p className="text-xs text-slate-400">{pkg.description}</p>

              <div className="space-y-1 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span className="text-slate-500">Audience:</span>
                  <span className="font-bold text-slate-300">{pkg.targetAudience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Practice Papers:</span>
                  <span className="font-bold text-emerald-400">{pkg.practicePaperLimit === -1 ? 'Unlimited' : `${pkg.practicePaperLimit} Papers`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Custom Generator:</span>
                  <span className="font-bold text-indigo-400">{pkg.customPaperLimit === -1 ? 'Unlimited (∞)' : `${pkg.customPaperLimit} Tests`}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80">
              <button
                onClick={() => setEditModalPkg(pkg)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Pricing & Limits
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
                    <span className="text-[10px] text-indigo-400 font-normal">₹{pkg.priceINR}</span>
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

      {/* Edit Package Modal */}
      {editModalPkg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Edit {editModalPkg.name}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditModalPkg(null);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-slate-300 font-bold block mb-1">Package Name</label>
                <input
                  type="text"
                  value={editModalPkg.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    updatePackage(editModalPkg.id, { name: val });
                    setEditModalPkg({ ...editModalPkg, name: val });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Price (INR ₹)</label>
                  <input
                    type="number"
                    value={editModalPkg.priceINR}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updatePackage(editModalPkg.id, { priceINR: val });
                      setEditModalPkg({ ...editModalPkg, priceINR: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Price (USD $)</label>
                  <input
                    type="number"
                    value={editModalPkg.priceUSD}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updatePackage(editModalPkg.id, { priceUSD: val });
                      setEditModalPkg({ ...editModalPkg, priceUSD: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Validity (Days)</label>
                  <input
                    type="number"
                    value={editModalPkg.validityDays}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updatePackage(editModalPkg.id, { validityDays: val });
                      setEditModalPkg({ ...editModalPkg, validityDays: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Custom Test Quota</label>
                  <input
                    type="number"
                    value={editModalPkg.customPaperLimit}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      updatePackage(editModalPkg.id, { customPaperLimit: val });
                      setEditModalPkg({ ...editModalPkg, customPaperLimit: val });
                    }}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalPkg(null)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Package Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-fade-in text-xs">
            <h3 className="text-base font-extrabold text-white">Create New Package Plan</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Package Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Olympiad Elite Pass"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Price INR (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPriceINR}
                    onChange={(e) => setNewPriceINR(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Price USD ($)</label>
                  <input
                    type="number"
                    required
                    value={newPriceUSD}
                    onChange={(e) => setNewPriceUSD(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Validity (Days)</label>
                  <input
                    type="number"
                    required
                    value={newValidityDays}
                    onChange={(e) => setNewValidityDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Custom Test Limit</label>
                  <input
                    type="number"
                    value={newCustomPaperLimit}
                    onChange={(e) => setNewCustomPaperLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
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
