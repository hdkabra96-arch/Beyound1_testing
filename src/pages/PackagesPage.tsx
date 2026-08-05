import React from 'react';
import { PricingSection } from '../components/public/PricingSection';
import { PublicPage } from '../types/public';
import { ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';

interface PackagesPageProps {
  onNavigate: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <div className="space-y-12 pb-12">
      <PricingSection onNavigate={onNavigate} onOpenAuth={onOpenAuth} />

      {/* Package Comparison Table */}
      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Feature Breakdown Comparison</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare what is included in Single Class, Primary Pass, Middle Pass, and K-8 All-Access.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 font-bold text-slate-700 dark:text-slate-200">
                <th className="p-4">Feature / Content</th>
                <th className="p-4 text-center">Single Class</th>
                <th className="p-4 text-center">Primary Pass (Class 1-5)</th>
                <th className="p-4 text-center">Middle Pass (Class 6-8)</th>
                <th className="p-4 text-center text-indigo-600 dark:text-indigo-400">K-8 All-Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">Grades Covered</td>
                <td className="p-4 text-center">1 Grade</td>
                <td className="p-4 text-center">5 Grades (Class 1-5)</td>
                <td className="p-4 text-center">3 Grades (Class 6-8)</td>
                <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">All 8 Grades</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">Printable Worksheets PDF</td>
                <td className="p-4 text-center">200+</td>
                <td className="p-4 text-center">800+</td>
                <td className="p-4 text-center">750+</td>
                <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">1,500+</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">Interactive Math Simulators</td>
                <td className="p-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">Olympiad & Speed Math Guides</td>
                <td className="p-4 text-center">Basic</td>
                <td className="p-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /></td>
                <td className="p-4 text-center"><CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">Multiple Student Profiles</td>
                <td className="p-4 text-center">1 Student</td>
                <td className="p-4 text-center">2 Students</td>
                <td className="p-4 text-center">2 Students</td>
                <td className="p-4 text-center font-bold text-indigo-600 dark:text-indigo-400">Up to 3 Siblings</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
