import React from 'react';
import { Sparkles, ArrowRight, BookOpen, CheckCircle, Award, ShieldCheck } from 'lucide-react';
import { PublicPage } from '../../types/public';

interface HeroSectionProps {
  onNavigate: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <section className="relative pt-8 pb-16 overflow-hidden">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[380px] bg-gradient-to-r from-emerald-500/18 via-cyan-500/18 via-blue-500/18 via-purple-500/18 to-orange-500/18 rounded-full blur-3xl pointer-events-none opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Top Badges & Main Headlines */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/80 text-indigo-900 text-xs font-bold tracking-wide shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Class 1 to Class 8 Mathematics Excellence</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span className="text-indigo-700 font-extrabold">CBSE & ICSE Aligned</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Master Math Visually & Confidently <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#16A34A] via-[#2563EB] via-[#7C3AED] via-[#C026D3] to-[#F97316] bg-clip-text text-transparent">
              Beyond Classroom
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed">
            Empowering students from <strong className="text-slate-900 font-extrabold">Class 1 to Class 8</strong> with interactive math manipulatives, step-by-step problem solvers, printable practice worksheets, and structured grade curriculums.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('packages')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#16A34A] via-[#06B6D4] via-[#2563EB] to-[#7C3AED] text-white font-extrabold text-sm shadow-xl shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Packages & Pricing</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => onNavigate('course-content')}
              className="px-6 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 font-extrabold text-sm hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#2563EB]" />
              <span>Class 1-8 Curriculum</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              1,500+ Printable Worksheets
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              Dual Parent & Student Portals
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              Olympiad Prep Included
            </span>
          </div>
        </div>

        {/* Impact Numbers Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xl">
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              8 Grades
            </p>
            <p className="text-xs text-slate-800 font-extrabold">Class 1 to Class 8 Complete</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              20,000+
            </p>
            <p className="text-xs text-slate-800 font-extrabold">Active Enrolled Students</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              1,500+
            </p>
            <p className="text-xs text-slate-800 font-extrabold">Printable Worksheets PDF</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              98.4%
            </p>
            <p className="text-xs text-slate-800 font-extrabold">Score Improvement Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};
