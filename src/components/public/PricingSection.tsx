import React, { useState } from 'react';
import { PRICING_PLANS } from '../../data/public-content';
import { Check, Sparkles, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { PublicPage } from '../../types/public';

interface PricingSectionProps {
  onNavigate?: (page: PublicPage) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onNavigate, onOpenAuth }) => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  return (
    <section className="py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Affordable & Flexible Packages</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Choose the Perfect Math Plan
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Transparent pricing with no hidden fees. All packages include printable worksheets, answer keys, and student analytics.
        </p>

        {/* Currency Switcher */}
        <div className="pt-2 flex items-center justify-center">
          <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800 flex items-center gap-1 border border-slate-300/60 dark:border-slate-700">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                currency === 'INR'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🇮🇳 INR (₹)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                currency === 'USD'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🌐 USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {PRICING_PLANS.map((plan) => {
          const price = currency === 'INR' ? `₹${plan.priceINR.toLocaleString()}` : `$${plan.priceUSD}`;
          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 text-white border-2 border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-[1.02]'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-xl'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                  Most Popular Choice
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                    {plan.badge}
                  </span>
                  <h3 className="text-xl font-black mt-2">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <div className="py-2 border-y border-slate-200/60 dark:border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black tracking-tight">{price}</span>
                    <span className="text-xs text-slate-400 font-semibold">{plan.period}</span>
                  </div>
                  <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    {plan.gradesIncluded}
                  </p>
                </div>

                {/* Features list */}
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className={`w-full py-3 rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:opacity-95 text-white shadow-amber-500/25'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {plan.ctaText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4 text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>7-Day 100% Money Back Guarantee • Instant PDF & Digital Access</span>
      </div>
    </section>
  );
};
