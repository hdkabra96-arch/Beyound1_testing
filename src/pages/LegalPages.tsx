import React from 'react';
import { PublicPage } from '../types/public';
import { ShieldCheck, FileText, RotateCcw, Lock } from 'lucide-react';

interface LegalPagesProps {
  type: 'privacy' | 'refund' | 'terms';
}

export const LegalPages: React.FC<LegalPagesProps> = ({ type }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {type === 'privacy' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Lock className="w-6 h-6" />
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
          </div>
          <p className="text-xs text-slate-400">Last updated: August 2026</p>

          <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
            <p>
              Beyond Classroom Technologies Pvt Ltd collects minimal personal data required to deliver customized Class 1 to Class 8 educational services. This includes student name, parent/educator email, enrolled grade level, and problem set accuracy analytics.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Child Privacy & COPPA/GDPR Compliance</h2>
            <p>
              We do not collect personal contact information directly from minor children. Parent or educator consent is required for creating accounts for students under 18 years of age. No student performance data is ever sold or shared with third-party advertisers.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Data Encryption & Storage Security</h2>
            <p>
              All password credentials and billing communications are transmitted over TLS 1.3 encrypted sockets and stored in compliant cloud database centers with strict access control security rules.
            </p>
          </div>
        </div>
      )}

      {type === 'refund' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <RotateCcw className="w-6 h-6" />
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Refund & Cancellation Policy</h1>
          </div>
          <p className="text-xs text-slate-400">Last updated: August 2026</p>

          <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. 7-Day 100% Money-Back Guarantee</h2>
            <p>
              We stand behind the quality of Beyond Classroom. If you purchase any Single Grade, Primary Pass, Middle Pass, or K-8 All-Access subscription and are not completely satisfied, you may request a 100% full refund within 7 days of purchase.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Refund Request Process</h2>
            <p>
              To initiate a refund, simply email support@beyondclassroom.in with your registered email and order number. Refunds are processed back to the original UPI, debit/credit card, or netbanking source within 3-5 business days.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Subscription Auto-Renewal Cancellation</h2>
            <p>
              You can turn off automatic renewal at any time directly from your Account Settings menu with zero cancellation penalty fees.
            </p>
          </div>
        </div>
      )}

      {type === 'terms' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <FileText className="w-6 h-6" />
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Terms & Conditions</h1>
          </div>
          <p className="text-xs text-slate-400">Last updated: August 2026</p>

          <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing Beyond Classroom, you agree to comply with these terms. The platform provides educational mathematics material for Class 1 through Class 8 for personal, non-commercial home or classroom use.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Intellectual Property & Worksheets Usage</h2>
            <p>
              All worksheets, vector diagrams, formula blueprints, and interactive software simulators are the exclusive property of Beyond Classroom Technologies Pvt Ltd. Enrolled parents and teachers are granted a non-transferable license to print worksheets for personal or classroom students.
            </p>

            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Platform Availability</h2>
            <p>
              While we strive for 99.9% platform uptime, scheduled server maintenance may occur periodically. We continuously update content to match updated CBSE, ICSE, and global curriculum standards.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
