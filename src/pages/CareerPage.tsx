import React from 'react';
import { JOB_OPENINGS } from '../data/public-content';
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/ui/toast';

export const CareerPage: React.FC = () => {
  const { addToast } = useToast();

  const handleApply = (jobTitle: string) => {
    addToast('success', 'Application Started', `Thank you for your interest in the ${jobTitle} role. Email your CV to careers@beyondclassroom.in`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 text-xs font-bold">
          <Briefcase className="w-3.5 h-3.5 text-amber-500" />
          <span>Join Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Build the Future of K-8 Math Education
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We are looking for creative thinkers, curriculum authors, and software engineers who want to make a lasting impact on millions of young learners.
        </p>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Current Job Openings</h2>

        <div className="space-y-4">
          {JOB_OPENINGS.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-500" /> {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> {job.type}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleApply(job.title)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{job.description}</p>

              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400">Key Requirements:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
