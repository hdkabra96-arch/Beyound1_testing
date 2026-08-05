import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/public-content';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('f1');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredFaqs =
    filterCategory === 'all'
      ? FAQ_ITEMS
      : FAQ_ITEMS.filter((item) => item.category === filterCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
          <span>Got Questions?</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Everything you need to know about Class 1 to Class 8 curriculum, printable worksheets, parent profiles, and subscriptions.
        </p>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 pt-3">
          {[
            { id: 'all', label: 'All FAQs' },
            { id: 'general', label: 'General' },
            { id: 'curriculum', label: 'Curriculum & Worksheets' },
            { id: 'subscriptions', label: 'Subscriptions & Refunds' },
            { id: 'technical', label: 'Technical & Access' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-md overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <span>{faq.question}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-500" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="p-5 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
