import React from 'react';
import { PublicPage } from '../types/public';
import {
  Sparkles,
  BookOpen,
  Sliders,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  GraduationCap,
  Users,
  HeartHandshake,
  Check,
  Compass,
  Layers,
  Sparkle
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* SECTION 1 — HERO */}
      <section className="relative pt-10 pb-8 overflow-hidden">
        {/* Soft Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[360px] bg-gradient-to-r from-emerald-500/12 via-cyan-500/12 via-blue-500/12 via-purple-500/12 to-orange-500/12 rounded-full blur-3xl pointer-events-none opacity-85" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/80 text-indigo-900 text-xs font-bold tracking-wide shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>🌟 Our Mission & Vision</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight leading-[1.18]">
            Redefining Mathematics Education <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#16A34A] via-[#2563EB] via-[#7C3AED] via-[#C026D3] to-[#F97316] bg-clip-text text-transparent">
              Beyond Classroom Walls
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Beyond Classroom is a dedicated platform for high-quality mathematics practice, created to support students from Grade 1 to Grade 8. Our focus is simple: provide structured, reliable, and flexible practice resources that make learning mathematics more effective and consistent.
          </p>
        </div>
      </section>

      {/* SECTION 2 — ABOUT BEYOND CLASSROOM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* LEFT: Mathematics Learning Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-2xl border border-slate-700 space-y-6 overflow-hidden">
              {/* Background Geometry Pattern */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48 border-[12px] border-cyan-500/20 rounded-full blur-xs pointer-events-none" />
              <div className="absolute -left-10 -top-10 w-40 h-40 border-[8px] border-purple-500/20 rounded-full blur-xs pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-cyan-400" />
                  <span className="font-extrabold text-sm tracking-wide text-slate-200">Beyond Classroom</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                  Grade 1 – 8 Math
                </span>
              </div>

              {/* Graphic Math Element */}
              <div className="py-4 space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Structured Progression</span>
                  <span className="text-xs font-bold text-cyan-400">Concept Mastery</span>
                </div>

                {/* Visual Infinity Loop Graphics */}
                <div className="relative py-6 flex items-center justify-center">
                  <svg className="w-48 h-20" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M50 40 C 20 10, 20 70, 50 40 C 80 10, 120 10, 150 40 C 180 70, 180 10, 150 40 C 120 70, 80 70, 50 40 Z"
                      stroke="url(#infinityGrad)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <defs>
                      <linearGradient id="infinityGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#16A34A" />
                        <stop offset="25%" stopColor="#06B6D4" />
                        <stop offset="50%" stopColor="#2563EB" />
                        <stop offset="75%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#F97316" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <p className="font-extrabold text-emerald-400 text-sm">Clear</p>
                    <p className="text-[11px] text-slate-400">Understanding</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <p className="font-extrabold text-purple-400 text-sm">Regular</p>
                    <p className="text-[11px] text-slate-400">Practice</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: About Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-extrabold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Platform Overview</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
              About Beyond Classroom
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Beyond Classroom is a dedicated platform for high-quality mathematics practice, created to support students from <span className="font-bold text-[#2563EB] bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100">Grade 1 to Grade 8</span>. Our focus is simple: provide structured, reliable, and flexible practice resources that make learning mathematics more effective and consistent.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We recognize that strong mathematical skills are built through <span className="font-bold text-[#16A34A] bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-100">regular practice</span> and <span className="font-bold text-[#7C3AED] bg-purple-50/80 px-2 py-0.5 rounded border border-purple-100">clear understanding</span>. At Beyond Classroom, every practice paper is thoughtfully designed by <span className="font-bold text-[#C026D3] bg-fuchsia-50/80 px-2 py-0.5 rounded border border-fuchsia-100">experienced educators</span> to ensure a meaningful and effective learning experience.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — WHAT WE DO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight">
            What We Do
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything students, parents and educators need for meaningful mathematics practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#16A34A] flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#111827]">Curated Practice Paper Library</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A comprehensive collection of ready-to-use practice papers covering key topics across Grades 1–8, aligned with school curricula.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-[#06B6D4] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#111827]">Customizable Practice Resources</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create tailored practice papers by selecting topics, formats, and difficulty levels to match specific learning goals.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-[#7C3AED] flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#111827]">Structured Progression</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Content organized by grade and concept to ensure a smooth and logical learning journey.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-[#F97316] flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#111827]">Assessment-Ready Materials</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Suitable for classwork, homework, revision, and testing purposes.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4 — OUR APPROACH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Pedagogical Foundation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight">
            Our Approach
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Our materials are developed with a focus on creating meaningful practice experiences that support both understanding and mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              num: '01',
              title: 'Concept clarity and step-by-step learning',
              color: 'text-[#16A34A]',
              bg: 'bg-emerald-50',
              border: 'border-emerald-200/80',
            },
            {
              num: '02',
              title: 'Balanced difficulty levels',
              color: 'text-[#06B6D4]',
              bg: 'bg-cyan-50',
              border: 'border-cyan-200/80',
            },
            {
              num: '03',
              title: 'Consistent practice for mastery',
              color: 'text-[#2563EB]',
              bg: 'bg-blue-50',
              border: 'border-blue-200/80',
            },
            {
              num: '04',
              title: 'Alignment with classroom expectations',
              color: 'text-[#7C3AED]',
              bg: 'bg-purple-50',
              border: 'border-purple-200/80',
            },
            {
              num: '05',
              title: 'Human-crafted content for a thoughtful, personalized touch',
              color: 'text-[#F97316]',
              bg: 'bg-amber-50',
              border: 'border-amber-200/80',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-white border ${item.border} shadow-md hover:shadow-lg transition-all space-y-3 relative overflow-hidden flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-black ${item.color}`}>{item.num}</span>
                <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center`}>
                  <Sparkle className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>
              <p className="text-xs font-bold text-slate-800 leading-snug">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5 — OUR VISION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 border border-indigo-100 shadow-xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#7C3AED]">Academic Aspiration</span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight">
              Our Vision
            </h2>
            <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed pt-2">
              “To become a trusted academic resource where mathematics learning extends beyond traditional boundaries—supporting students in building confidence, teachers in delivering effective instruction, and parents in guiding practice at home.”
            </p>
          </div>

          {/* Vision Impact Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative z-10">
            <div className="p-6 rounded-2xl bg-white/90 border border-blue-100 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] mx-auto flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-[#111827]">Students</h3>
              <p className="text-xs text-slate-600">Building Confidence in Math</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/90 border border-emerald-100 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] mx-auto flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-[#111827]">Teachers</h3>
              <p className="text-xs text-slate-600">Effective Instruction & Resources</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/90 border border-purple-100 shadow-sm text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] mx-auto flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-[#111827]">Parents</h3>
              <p className="text-xs text-slate-600">Guided Practice at Home</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — WHY CHOOSE BEYOND CLASSROOM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black text-[#111827] tracking-tight">
            Why Choose Beyond Classroom?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'Professionally designed and curriculum-aligned content',
            'Practice papers created with human insight and educational expertise',
            'Flexible practice paper creation tailored to individual needs',
            'Saves valuable time for educators and parents',
            'Encourages independent and confident learning',
            'Suitable for a wide range of learning environments',
          ].map((benefit, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7 — HUMAN-CENTERED PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xl relative overflow-hidden text-center max-w-4xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#16A34A] via-[#2563EB] to-[#7C3AED] text-white mx-auto flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Learning Is Personal
          </h2>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto">
            At Beyond Classroom, we believe that meaningful learning comes from a{' '}
            <span className="font-bold text-[#2563EB]">human understanding</span> of how students think and learn. That’s why our practice papers are{' '}
            <span className="font-bold text-[#16A34A]">crafted with care</span>—bringing a{' '}
            <span className="font-bold text-[#7C3AED]">personal, thoughtful approach</span> to mathematics practice.
          </p>
        </div>
      </section>

      {/* SECTION 8 — FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-900/50 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Make Mathematics Practice More Meaningful
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore structured mathematics resources designed to help students practice consistently, build confidence, and grow beyond the classroom.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('packages')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#16A34A] via-[#06B6D4] via-[#2563EB] to-[#7C3AED] text-white font-extrabold text-sm shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Our Packages</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => onNavigate('course-content')}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer backdrop-blur-md"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Explore Class 1–8 Curriculum</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

