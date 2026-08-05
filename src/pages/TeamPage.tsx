import React from 'react';
import { TEAM_MEMBERS } from '../data/public-content';
import { Users, GraduationCap, Award, Sparkles } from 'lucide-react';

export const TeamPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span>Our Academic Team</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Meet the Minds Behind Beyond Classroom
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          A dedicated team of mathematicians, pedagogy researchers, child psychologists, and interaction designers passionate about making math joyous for Class 1 to Class 8.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.id}
            className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
              />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{member.role}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{member.qualification}</p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{member.bio}</p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800">
              <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-1.5">Areas of Expertise</p>
              <div className="flex flex-wrap gap-1">
                {member.expertise.map((exp, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-slate-800 text-[10px] font-bold text-indigo-600 dark:text-indigo-300"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
