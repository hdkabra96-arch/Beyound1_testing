import React from 'react';
import { TESTIMONIALS } from '../../data/public-content';
import { Star, Quote, Heart } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 text-xs font-bold">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Parent & Educator Stories</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Loved by Over 20,000+ Students
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Hear how Beyond Classroom is making math engaging, intuitive, and stress-free for families across Class 1 to Class 8.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {TESTIMONIALS.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-transform"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed">
                "{item.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
