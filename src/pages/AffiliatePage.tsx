import React, { useState } from 'react';
import { DollarSign, Share2, Users, Gift, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '../components/ui/toast';

export const AffiliatePage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://beyondclassroom.in/?ref=MATH2026');
    setCopied(true);
    addToast('success', 'Affiliate Link Copied!', 'Share this referral code to earn 20% commission on every subscriber.');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-bold">
          <Gift className="w-3.5 h-3.5 text-amber-500" />
          <span>Earn While Empowering Learners</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Beyond Classroom Affiliate Program
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Earn <strong className="text-indigo-600 dark:text-indigo-400 font-extrabold">20% recurring commission</strong> on every parent, teacher, or school subscription referred through your unique link.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">1. Share Your Unique Link</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Share with parent groups, school communities, WhatsApp channels, or educational blogs.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">2. Parents & Schools Enroll</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Referred users receive an instant 10% discount on Single Grade, Primary, or K-8 All-Access passes.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">3. Get Paid Monthly</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Automatic monthly payouts directly to your UPI or Bank account with full referral dashboard tracking.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 text-white max-w-3xl mx-auto border border-slate-800 space-y-4 text-center shadow-2xl">
        <h3 className="text-xl font-extrabold">Generate Your Affiliate Referral Link</h3>
        <p className="text-xs text-slate-300">
          Sample referral code active for test preview mode:
        </p>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-400 flex items-center justify-between max-w-md mx-auto">
          <span>https://beyondclassroom.in/?ref=MATH2026</span>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-[11px] font-bold cursor-pointer"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
};
