import React from 'react';
import { useStudent } from '../../../services/student-context';
import { useAdminStore } from '../../../services/admin-store';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Award,
  Sparkles,
  Calendar,
  Layers,
  FileText,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface MyPackageViewProps {
  onOpenRenewal: () => void;
}

export const MyPackageView: React.FC<MyPackageViewProps> = ({ onOpenRenewal }) => {
  const { currentStudent, activeEntitlement, daysRemaining, daysTotal, expiryStatus, isExpired } = useStudent();
  const { packages } = useAdminStore();

  if (!currentStudent || !activeEntitlement) return null;

  const pkg = packages.find((p) => p.id === activeEntitlement.packageId) || packages[1];
  const validityPercent = Math.min(100, Math.max(0, Math.round((daysRemaining / (daysTotal || 365)) * 100)));

  // Matrix feature descriptions for high clarity
  const featuresList = [
    {
      title: 'Full Curriculum Access',
      desc: 'All NCERT and ICSE standard chapters, animated notes, and theory summaries.',
      enabled: activeEntitlement.features.curriculumAccess,
    },
    {
      title: 'Practice Papers with Step Solutions',
      desc: 'Standard homework practice papers with verified mathematical proofs and answer keys.',
      enabled: activeEntitlement.features.practicePapers,
    },
    {
      title: 'PDF & Notes Protected Reader',
      desc: 'Digital online access to verified curriculum chapter notes and formula cheat sheets.',
      enabled: activeEntitlement.features.chapterNotes,
    },
    {
      title: 'Direct PDF Downloads',
      desc: 'Download printable offline practice test papers and worksheets (Subject to copyright notes protection).',
      enabled: activeEntitlement.features.pdfDownloads,
    },
    {
      title: 'Custom Worksheet Generator & Requests',
      desc: 'Request tailored competency worksheets with custom difficulty and question format.',
      enabled: activeEntitlement.features.customWorksheetGenerator,
    },
    {
      title: 'Olympiad & IMO Preparation Module',
      desc: 'Advanced HOTS and International Mathematics Olympiad Level 1 & Level 2 question sets.',
      enabled: activeEntitlement.features.olympiadHOTS,
    },
    {
      title: 'Live Interactive Quizzes with Instant Scoring',
      desc: 'Timed multiple choice sprints with immediate scoring and accuracy analytics.',
      enabled: activeEntitlement.features.interactiveQuizzes,
    },
    {
      title: 'Priority Academic Faculty Support',
      desc: 'Get prompt feedback and evaluation on custom worksheet submissions from teachers.',
      enabled: activeEntitlement.features.prioritySupport,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My Package & Subscription Entitlement</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review your active academic plan, validity timeline, and entitled learning capabilities.
          </p>
        </div>
        <button
          onClick={onOpenRenewal}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>Renew / Upgrade Plan</span>
        </button>
      </div>

      {/* Main Entitlement Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-black uppercase">
                {activeEntitlement.className}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                  isExpired
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isExpired ? 'Expired' : 'Active Plan'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">{activeEntitlement.packageName}</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">{pkg.tagline || 'Complete Academic Mathematical Journey'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center shrink-0 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Pass Fee Paid</span>
            <span className="text-2xl font-black text-amber-400">₹{activeEntitlement.amountPaid.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-400 font-bold block">Verified Active</span>
          </div>
        </div>

        {/* 6 Key Subscription Fields Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] font-black uppercase text-slate-500 block">Class Grade</span>
            <span className="text-xs font-black text-white mt-0.5 block">{activeEntitlement.className}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] font-black uppercase text-slate-500 block">Purchase Date</span>
            <span className="text-xs font-black text-white mt-0.5 block">{activeEntitlement.purchaseDate}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] font-black uppercase text-slate-500 block">Activation Date</span>
            <span className="text-xs font-black text-white mt-0.5 block">{activeEntitlement.activationDate}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] font-black uppercase text-slate-500 block">Expiry Date</span>
            <span className="text-xs font-black text-white mt-0.5 block">{activeEntitlement.expiryDate}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] font-black uppercase text-slate-500 block">Days Remaining</span>
            <span
              className={`text-xs font-black mt-0.5 block ${
                daysRemaining <= 7 ? 'text-rose-400 font-bold' : daysRemaining <= 30 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {daysRemaining} Days
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
            <span className="text-[10px] font-black uppercase text-slate-500 block">Custom Worksheets</span>
            <span className="text-xs font-black text-indigo-400 mt-0.5 block">
              {activeEntitlement.customPaperLimit === -1 ? 'Unlimited' : `${activeEntitlement.customPaperLimit} / Month`}
            </span>
          </div>
        </div>

        {/* Validity Meter */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400">Subscription Validity Meter</span>
            <span className={daysRemaining <= 30 ? 'text-amber-400' : 'text-emerald-400'}>
              {daysRemaining} Days of {daysTotal} Days Total ({validityPercent}% remaining)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all ${
                daysRemaining <= 7
                  ? 'bg-rose-500'
                  : daysRemaining <= 30
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
              }`}
              style={{ width: `${validityPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* "What You Have Access To" Entitlement Checklist (Requirement 11) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-black text-white">What You Have Access To</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {featuresList.map((feat, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                feat.enabled
                  ? 'bg-slate-900 border-slate-800 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/40 text-slate-500 opacity-60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  feat.enabled
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {feat.enabled ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-white">{feat.title}</h3>
                  {!feat.enabled && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      Upgrade Needed
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
