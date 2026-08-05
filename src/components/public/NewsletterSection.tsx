import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, Download } from 'lucide-react';
import { useToast } from '../ui/toast';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('class_5');
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    addToast('success', 'Free Worksheet Bundle Sent!', 'Check your inbox for the Class 1-8 Mathematics sample packet.');
  };

  return (
    <section className="py-12 max-w-5xl mx-auto px-4">
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white border border-indigo-500/30 shadow-2xl overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Mail className="w-64 h-64 text-indigo-400" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Free Sample Worksheets PDF</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Download Free Class 1 to 8 Practice Worksheets
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Subscribe to our weekly math newsletter and instantly receive a curated 25-page PDF worksheet bundle with answer keys.
            </p>
          </div>

          {submitted ? (
            <div className="p-5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-extrabold">Worksheet Bundle Dispatched!</p>
                <p className="font-normal text-emerald-200">
                  We have sent the PDF package to <strong className="underline">{email}</strong>. Check your inbox!
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="class_1">Class 1 Math</option>
                  <option value="class_2">Class 2 Math</option>
                  <option value="class_3">Class 3 Math</option>
                  <option value="class_4">Class 4 Math</option>
                  <option value="class_5">Class 5 Math</option>
                  <option value="class_6">Class 6 Math</option>
                  <option value="class_7">Class 7 Math</option>
                  <option value="class_8">Class 8 Math</option>
                </select>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter parent or teacher email..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-900/90 border border-indigo-500/40 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 text-white text-xs font-extrabold shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Get PDF Bundle</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                🔒 We respect your privacy. Unsubscribe anytime with 1 click. No spam ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
