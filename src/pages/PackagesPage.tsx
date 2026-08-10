import React, { useState } from 'react';
import { PricingSection } from '../components/public/PricingSection';
import { PublicPage } from '../types/public';
import {
  Check,
  Minus,
  User,
  GraduationCap,
  Users,
  Building2,
  BookOpen,
  Target,
  FileText,
  Sliders,
  Sparkles,
  ArrowRight,
  Info,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface PackagesPageProps {
  onNavigate: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ onNavigate, onOpenAuth }) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(5);

  return (
    <div className="space-y-16 pb-16">
      {/* SECTION 1, 2, 3 — HERO, CLASS SELECTION & PACKAGE CARDS */}
      <div className="relative overflow-hidden pt-6">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 via-blue-500/10 via-purple-500/10 via-fuchsia-500/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none opacity-80" />
        <PricingSection
          onNavigate={onNavigate}
          onOpenAuth={onOpenAuth}
          selectedGrade={selectedGrade}
          onSelectGrade={setSelectedGrade}
        />
      </div>

      {/* SECTION 4 — PACKAGE COMPARISON TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-[#2563EB] text-xs font-extrabold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            <span>Side-by-Side Comparison</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight">
            Compare Our Packages
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Detailed feature breakdown to help you make the best choice for your learning or teaching goals.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-xl">
          <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 font-black text-slate-800">
                <th className="p-4 sm:p-5 w-1/4 text-sm">Feature</th>
                <th className="p-4 sm:p-5 text-center w-1/5 bg-emerald-50/40 text-[#16A34A]">BASIC</th>
                <th className="p-4 sm:p-5 text-center w-1/5 bg-blue-50/40 text-[#2563EB]">PRO ⭐</th>
                <th className="p-4 sm:p-5 text-center w-1/5 bg-purple-50/40 text-[#7C3AED]">TEACHERS</th>
                <th className="p-4 sm:p-5 text-center w-1/5 bg-amber-50/40 text-[#F97316]">SCHOOL / INSTITUTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Suitable For</td>
                <td className="p-4 text-center">Students & Parents (Grades 1–4)</td>
                <td className="p-4 text-center font-semibold text-[#2563EB]">Students & Parents (Grades 5–8)</td>
                <td className="p-4 text-center">Teachers & Educators</td>
                <td className="p-4 text-center font-semibold text-[#7C3AED]">Schools & Institutes</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Class Range</td>
                <td className="p-4 text-center">Grades 1–4</td>
                <td className="p-4 text-center">Grades 5–8</td>
                <td className="p-4 text-center">Any 1 Selected Class</td>
                <td className="p-4 text-center">Any 1 Selected Class</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Validity</td>
                <td className="p-4 text-center font-bold text-slate-900">365 Days</td>
                <td className="p-4 text-center font-bold text-slate-900">365 Days</td>
                <td className="p-4 text-center font-bold text-slate-900">365 Days</td>
                <td className="p-4 text-center font-bold text-slate-900">365 Days</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Practice Papers / Topic</td>
                <td className="p-4 text-center">5 Papers</td>
                <td className="p-4 text-center font-semibold text-[#2563EB]">10 Papers</td>
                <td className="p-4 text-center">Includes Basic + Pro</td>
                <td className="p-4 text-center">Includes Basic + Pro</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Questions / Paper</td>
                <td className="p-4 text-center">20 Questions</td>
                <td className="p-4 text-center">20 Questions</td>
                <td className="p-4 text-center">20 Questions</td>
                <td className="p-4 text-center">20 Questions</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Hints & Solved Examples</td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#111827]">PDF Download</td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Answer Key</td>
                <td className="p-4 text-center">Included</td>
                <td className="p-4 text-center font-semibold text-[#2563EB]">With Solutions</td>
                <td className="p-4 text-center font-semibold text-[#2563EB]">With Solutions</td>
                <td className="p-4 text-center font-semibold text-[#2563EB]">With Solutions</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Difficulty Levels</td>
                <td className="p-4 text-center text-slate-500">Standard</td>
                <td className="p-4 text-center font-bold text-slate-900">Basic / Medium / Hard</td>
                <td className="p-4 text-center font-bold text-slate-900">Basic / Medium / Hard</td>
                <td className="p-4 text-center font-bold text-slate-900">Basic / Medium / Hard</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Subjective Questions</td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Competitive Questions</td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Competency-Based Questions</td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Case-Based Questions</td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Customized Practice Papers</td>
                <td className="p-4 text-center font-bold text-[#16A34A]">Unlimited</td>
                <td className="p-4 text-center font-semibold text-slate-800">Up to 50</td>
                <td className="p-4 text-center font-semibold text-slate-800">Up to 100</td>
                <td className="p-4 text-center font-bold text-[#7C3AED]">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#111827]">40 / 80 Mark Papers</td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Teacher Details Watermark</td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center font-bold text-[#7C3AED]">✓ Included</td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Teacher Name on Website</td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center font-bold text-[#7C3AED]">✓ Included</td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="p-4 sm:p-5 font-bold text-[#111827]">School / Institute Branding</td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center"><Minus className="w-5 h-5 text-slate-300 mx-auto" /></td>
                <td className="p-4 text-center font-bold text-[#F97316]">✓ Logo & Name</td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-[#111827]">Priority Support</td>
                <td className="p-4 text-center text-slate-500">Standard</td>
                <td className="p-4 text-center text-slate-500">Standard</td>
                <td className="p-4 text-center text-slate-500">Standard</td>
                <td className="p-4 text-center font-bold text-[#F97316]">✓ Priority Support</td>
              </tr>
              <tr className="bg-slate-50/30">
                <td className="p-4 sm:p-5 font-bold text-[#111827]">All Boards Included</td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
                <td className="p-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto stroke-[2.5]" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 5 — WHO SHOULD CHOOSE WHICH PACKAGE? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-[#16A34A] text-xs font-extrabold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>Targeted Recommendations</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight">
            Which Package Is Right for You?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Select the plan matched to your role and academic requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#16A34A] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#111827]">Basic Package</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For students in Grades 1–4 looking for structured mathematics practice.
              </p>
            </div>
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16A34A] font-extrabold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Get Basic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#111827]">Pro Package</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For students in Grades 5–8 who need deeper practice, multiple difficulty levels, and competency-based questions.
              </p>
            </div>
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-extrabold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Get Pro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 text-[#7C3AED] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#111827]">Teachers Package</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For educators who create practice papers regularly and want teacher-focused resources.
              </p>
            </div>
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-extrabold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Get Teachers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-[#F97316] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#111827]">School / Institute</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For institutions that need branded practice resources, unlimited customization, and priority support.
              </p>
            </div>
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#F97316] font-extrabold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Get School Package</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6 — PACKAGE BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
              Every Package Is Built Around Better Practice
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Four core principles designed to maximize learning efficiency and confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
              <div className="text-2xl">📚</div>
              <h3 className="font-extrabold text-sm text-[#111827]">Structured Practice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Organized content designed for consistent mathematics practice.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
              <div className="text-2xl">🎯</div>
              <h3 className="font-extrabold text-sm text-[#111827]">Targeted Learning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose resources according to class, topic and learning needs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
              <div className="text-2xl">📝</div>
              <h3 className="font-extrabold text-sm text-[#111827]">Ready-to-Use Papers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Practice papers designed for revision, homework, classwork and assessment.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2">
              <div className="text-2xl">💡</div>
              <h3 className="font-extrabold text-sm text-[#111827]">Flexible Customization</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Create customized practice papers according to your requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — IMPORTANT INFORMATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Important Package Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300 font-medium">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-amber-400 font-bold">•</span>
              <span>Each package is valid for one class only.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-amber-400 font-bold">•</span>
              <span>All packages have a validity period of 365 days.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-amber-400 font-bold">•</span>
              <span>Package availability depends on the selected class.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-amber-400 font-bold">•</span>
              <span>Basic is designed for Grades 1–4.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-amber-400 font-bold">•</span>
              <span>Pro is designed for Grades 5–8.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-amber-400 font-bold">•</span>
              <span>Teachers and School/Institute packages include the features specified above.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 md:col-span-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>All boards are included as specified in each package.</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-900/50 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Ready to Make Mathematics Practice More Effective?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Choose the package that fits your learning or teaching needs and start building a more consistent mathematics practice routine.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#16A34A] via-[#06B6D4] via-[#2563EB] to-[#7C3AED] text-white font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => onNavigate('course-content')}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Explore Curriculum</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
