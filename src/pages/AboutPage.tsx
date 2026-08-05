import React from 'react';
import { PublicPage } from '../types/public';
import { Sparkles, Target, Award, Heart, CheckCircle2, Users, BookOpen } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Our Mission & Vision</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Redefining Mathematics Education Beyond Classroom Walls
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Founded by mathematicians and educators, Beyond Classroom was built on a simple premise: Every child can fall in love with math when numbers become visual, intuitive, and interactive.
        </p>
      </div>

      {/* Core Values 3-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Conceptual Mastery</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            We replace rote formula memorization with geometric proofs, fraction visualizers, and interactive balance scales.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Class 1 to 8 Continuity</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            A continuous curriculum bridge preventing grade-transition drop-offs from primary numbers to middle school algebra.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Child-Centric Delight</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Calm, high-contrast, distraction-free design crafted specifically for young eyes and focused problem solving.
          </p>
        </div>
      </div>

      {/* Story Showcase */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white border border-indigo-500/30 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Built for Parents, Teachers, and Tomorrow’s Thinkers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Over the past 5 years, Beyond Classroom has supported over 20,000 students and 400+ schools with high-grade worksheets, video micro-lessons, and instant solution keys.
          </p>
          <div className="space-y-2 text-xs font-semibold">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100% Curriculum alignment with CBSE, ICSE, and IB frameworks
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified by National Math Pedagogy Boards
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Over 1,500 printable worksheets with full answer keys
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('team')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Meet Our Academic Team
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <p className="text-3xl font-black text-amber-400">20,000+</p>
            <p className="text-xs text-slate-300">Enrolled Learners</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <p className="text-3xl font-black text-cyan-400">1,500+</p>
            <p className="text-xs text-slate-300">Printable PDF Worksheets</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <p className="text-3xl font-black text-emerald-400">45+</p>
            <p className="text-xs text-slate-300">School Partners</p>
          </div>
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-1">
            <p className="text-3xl font-black text-indigo-400">98%</p>
            <p className="text-xs text-slate-300">Parent Satisfaction</p>
          </div>
        </div>
      </div>
    </div>
  );
};
