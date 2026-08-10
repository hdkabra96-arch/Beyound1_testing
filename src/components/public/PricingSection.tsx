import React, { useState } from 'react';
import { PRICING_PLANS } from '../../data/public-content';
import { Check, Sparkles, Star, Award, Building2, User, GraduationCap, CheckCircle2 } from 'lucide-react';
import { PublicPage } from '../../types/public';

interface PricingSectionProps {
  onNavigate?: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  selectedGrade?: number;
  onSelectGrade?: (grade: number) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onNavigate,
  onOpenAuth,
  selectedGrade: externalGrade,
  onSelectGrade
}) => {
  const [internalGrade, setInternalGrade] = useState<number>(5);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const selectedGrade = externalGrade !== undefined ? externalGrade : internalGrade;
  const handleGradeChange = (g: number) => {
    if (onSelectGrade) onSelectGrade(g);
    setInternalGrade(g);
  };

  return (
    <section className="space-y-12 relative">
      {/* SECTION 1 — HERO */}
      <div className="text-center max-w-4xl mx-auto space-y-5 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-900 text-xs font-bold tracking-wide shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Flexible Plans for Every Learning Need</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-[#111827] tracking-tight leading-[1.18]">
          Choose the Right{' '}
          <span className="bg-gradient-to-r from-[#16A34A] via-[#06B6D4] via-[#2563EB] via-[#7C3AED] via-[#C026D3] to-[#F97316] bg-clip-text text-transparent">
            Mathematics Practice Package
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Structured mathematics practice for students, teachers, parents, schools, and institutes — designed to make regular practice simpler, more effective, and more personalized.
        </p>

        {/* Currency Toggle */}
        <div className="pt-2 flex items-center justify-center">
          <div className="p-1 rounded-2xl bg-slate-100 border border-slate-200/90 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                currency === 'INR'
                  ? 'bg-white text-[#2563EB] shadow-md border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🇮🇳 INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-white text-[#2563EB] shadow-md border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🌐 USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2 — CLASS SELECTION */}
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-black text-[#111827]">Select Your Class</h2>
          <p className="text-xs text-slate-500">
            Choose a grade to view package compatibility. Each package is valid for 1 class for 365 Days.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => {
            const isSelected = selectedGrade === g;
            return (
              <button
                key={g}
                onClick={() => handleGradeChange(g)}
                className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-md scale-105 ring-2 ring-indigo-300'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/90'
                }`}
              >
                Class {g}
              </button>
            );
          })}
        </div>

        {/* Selected Grade Context Notice */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center text-xs font-semibold text-indigo-950 flex items-center justify-center gap-2 max-w-2xl mx-auto">
          <GraduationCap className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>
            Selected: <strong>Class {selectedGrade}</strong> — {selectedGrade <= 4 ? 'Basic Package eligible for Class 1–4' : 'Pro Package eligible for Class 5–8'}. Teachers and School packages apply to any chosen class.
          </span>
        </div>
      </div>

      {/* SECTION 3 — PACKAGE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {PRICING_PLANS.map((plan) => {
          const priceDisplay = currency === 'INR' ? `₹${plan.priceINR.toLocaleString()}` : `$${plan.priceUSD}`;
          const altPriceDisplay = currency === 'INR' ? `$${plan.priceUSD}` : `₹${plan.priceINR.toLocaleString()}`;

          // Specific card styling per package
          const isBasic = plan.id === 'basic';
          const isPro = plan.id === 'pro';
          const isTeachers = plan.id === 'teachers';
          const isSchool = plan.id === 'school_institute';

          // Determine card eligibility state based on selected grade
          const isGradeDisabled = (isBasic && selectedGrade > 4) || (isPro && selectedGrade <= 4);

          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative bg-white border ${
                isPro
                  ? 'border-2 border-[#2563EB] shadow-2xl shadow-indigo-500/10 scale-[1.02] ring-1 ring-indigo-200'
                  : 'border-slate-200/90 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Most Popular Badge for PRO */}
              {isPro && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span>⭐ Most Popular</span>
                </div>
              )}

              {/* Indicator for TEACHERS */}
              {isTeachers && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-100 text-[#2563EB] border border-blue-200 text-[10px] font-extrabold uppercase tracking-wider">
                  Designed for Educators
                </div>
              )}

              {/* Indicator for SCHOOL */}
              {isSchool && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] border border-purple-200 text-[10px] font-extrabold uppercase tracking-wider">
                  For Schools & Institutes
                </div>
              )}

              <div className="space-y-4 pt-2">
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {plan.badge}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      {plan.gradesIncluded}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#111827] mt-3">{plan.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed min-h-[32px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price block */}
                <div className="py-3 border-y border-slate-100 bg-slate-50/60 -mx-6 px-6 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#111827] tracking-tight">{priceDisplay}</span>
                    <span className="text-xs text-slate-500 font-bold">/ {plan.period}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Secondary: <span className="font-extrabold text-slate-700">{altPriceDisplay}</span>
                  </p>
                </div>

                {/* Grade mismatch warning badge */}
                {isGradeDisabled && (
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-semibold text-center">
                    Note: Designed for {isBasic ? 'Grade 1–4' : 'Grade 5–8'}.
                  </div>
                )}

                {/* Feature list */}
                <ul className="space-y-2.5 text-xs text-slate-700">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5 stroke-[2.5]" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className={`w-full py-3 rounded-2xl text-xs font-black transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 ${
                    isPro
                      ? 'bg-gradient-to-r from-[#16A34A] via-[#06B6D4] via-[#2563EB] to-[#7C3AED] hover:opacity-95 text-white shadow-indigo-500/20'
                      : isSchool
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#F97316] text-white hover:opacity-95'
                      : 'bg-[#111827] hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
