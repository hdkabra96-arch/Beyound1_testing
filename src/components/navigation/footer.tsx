import React, { useState } from 'react';
import { GraduationCap, Mail, ArrowRight, ShieldCheck, Heart, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { CLASS_GRADES } from '../../design-system/tokens';

export interface FooterProps {
  onGradeSelect?: (gradeId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onGradeSelect }) => {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full glass-panel border-t border-slate-200/80 dark:border-slate-800/80 pt-12 pb-8 mt-16 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Section: Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Beyond <span className="gradient-text-indigo">Classroom</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Empowering students from Class 1 to Class 8 with world-class Mathematics study materials, interactive worksheets, and conceptual clarity.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>NCERT & CBSE Curriculum Compliant</span>
            </div>
          </div>

          {/* Newsletter Glass Card */}
          <div className="lg:col-span-7 glass-card p-6 rounded-3xl border border-indigo-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-500" />
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Subscribe for Free Weekly Math Worksheets
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Get practice sets, formula books, and speed-math tricks sent directly to your inbox.
            </p>
            {subscribed ? (
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                🎉 Thanks for subscribing! Check your inbox for your first free Math worksheet bundle.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-1">
                <Input
                  type="email"
                  placeholder="Enter parent or teacher email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" variant="primary-gradient" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links Grid: Class 1 to Class 8 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 pt-6 border-t border-slate-200/60 dark:border-slate-800">
          {CLASS_GRADES.map((grade) => (
            <div key={grade.id} className="space-y-2">
              <button
                onClick={() => onGradeSelect?.(grade.id)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer block text-left"
              >
                {grade.name}
              </button>
              <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <li className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Worksheets</li>
                <li className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Formula Sheet</li>
                <li className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Quiz Sets</li>
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Currency & Copyright */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>© 2026 Beyond Classroom Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Multi-Currency Selector */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1" />
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  currency === 'INR' ? 'bg-indigo-600 text-white' : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  currency === 'USD' ? 'bg-indigo-600 text-white' : 'hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                USD ($)
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px]">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>for Math Champions</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
