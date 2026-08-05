import React from 'react';
import { PARTNERS } from '../data/public-content';
import { PublicPage } from '../types/public';
import { Building2, Award, Users, CheckCircle2, Handshake } from 'lucide-react';

interface PartnersPageProps {
  onNavigate: (page: PublicPage) => void;
}

export const PartnersPage: React.FC<PartnersPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
          <Handshake className="w-3.5 h-3.5" />
          <span>Our Institutional Partners</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Partnering with Schools & Foundations
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We collaborate with top school networks, accreditation bodies, and educational trusts to empower teachers and transform math classrooms nationwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PARTNERS.map((partner) => (
          <div
            key={partner.id}
            className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-slate-800 px-4 py-2 rounded-2xl border border-indigo-100 dark:border-slate-700">
                {partner.logo}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {partner.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{partner.name}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{partner.description}</p>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 max-w-3xl mx-auto border border-slate-800">
        <h3 className="text-2xl font-bold">Become a Beyond Classroom School Partner</h3>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          Equip your school teachers with Class 1 to Class 8 digital math labs, automated worksheet generators, and class analytics.
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-amber-500 text-white font-bold text-xs shadow-md cursor-pointer"
        >
          Contact Partner Relations
        </button>
      </div>
    </div>
  );
};
