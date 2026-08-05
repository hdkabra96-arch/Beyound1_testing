import React from 'react';
import { HeroSection } from '../components/public/HeroSection';
import { ClassCurriculumSection } from '../components/public/ClassCurriculumSection';
import { PricingSection } from '../components/public/PricingSection';
import { TestimonialsSection } from '../components/public/TestimonialsSection';
import { NewsletterSection } from '../components/public/NewsletterSection';
import { PublicPage } from '../types/public';
import { Sparkles, ShieldCheck, Award, Zap, BookOpen } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onGradeSelect?: (gradeId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenAuth, onGradeSelect }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <HeroSection onNavigate={onNavigate} onOpenAuth={onOpenAuth} />

      {/* 2. Feature Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Class 1 to 8 Structured Path</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Every chapter features step-by-step video theory, animated math manipulatives, and 20+ worksheet problem sets.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Speed Math & Olympiad Prep</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Shortcuts for mental multiplication, fraction conversions, and linear equations designed for competitive excellence.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Printable Vector Worksheets</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            High-resolution PDF workbooks with answer keys for effortless home or school practice.
          </p>
        </div>
      </section>

      {/* 3. Class 1-8 Curriculum Showcase */}
      <ClassCurriculumSection onNavigate={onNavigate} onGradeSelect={onGradeSelect} />

      {/* 4. Packages & Pricing */}
      <PricingSection onNavigate={onNavigate} onOpenAuth={onOpenAuth} />

      {/* 5. Testimonials */}
      <TestimonialsSection />

      {/* 6. Newsletter & Free PDF Download */}
      <NewsletterSection />
    </div>
  );
};
