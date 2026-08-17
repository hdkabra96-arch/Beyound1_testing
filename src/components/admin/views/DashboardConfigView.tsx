import React from 'react';
import { useAdminStore } from '../../../services/admin-store';
import { DashboardFeatureConfig } from '../../../types/admin';
import {
  Sliders,
  CheckCircle2,
  XCircle,
  FileText,
  HelpCircle,
  Zap,
  Sparkles,
  BookOpen,
  BarChart3,
  Download,
  Bell,
  Radio,
  Bot,
  Layers,
  Shield,
} from 'lucide-react';

export const DashboardConfigView: React.FC = () => {
  const { dashboardConfig, updateDashboardConfig } = useAdminStore();

  const configItems: {
    key: keyof DashboardFeatureConfig;
    title: string;
    description: string;
    icon: React.ReactNode;
    category: 'Curriculum' | 'Tools & Utilities' | 'Analytics & AI' | 'Communication';
  }[] = [
    // Curriculum
    {
      key: 'practicePapers',
      title: 'Practice Papers Hub',
      description: 'Master toggle allowing students to view and solve chapter-wise practice papers.',
      icon: <FileText className="w-5 h-5 text-indigo-400" />,
      category: 'Curriculum',
    },
    {
      key: 'questionBank',
      title: 'Question Bank & Topic Pools',
      description: 'Display searchable pool of practice questions with hints and step explanations.',
      icon: <HelpCircle className="w-5 h-5 text-cyan-400" />,
      category: 'Curriculum',
    },
    {
      key: 'mcqs',
      title: 'Interactive Speed Quizzes & MCQs',
      description: 'Timed interactive tests with instant answer validation and scoring breakdown.',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      category: 'Curriculum',
    },
    {
      key: 'flashCards',
      title: 'Visual Memory Flash Cards',
      description: 'Formulas, mental math shortcuts, and mathematical definitions flip cards.',
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      category: 'Curriculum',
    },
    {
      key: 'notes',
      title: 'Chapter Notes & Revision Guides',
      description: 'Condensed conceptual revision notes for quick exam preparation.',
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      category: 'Curriculum',
    },
    {
      key: 'previousPapers',
      title: 'Previous Years Olympiad / Board Papers',
      description: 'Historical test papers with year-wise answer keys and marking rubrics.',
      icon: <Layers className="w-5 h-5 text-rose-400" />,
      category: 'Curriculum',
    },
    {
      key: 'solutions',
      title: 'Step-by-Step Worked Solutions',
      description: 'Display comprehensive solutions and mathematical proofs to students.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />,
      category: 'Curriculum',
    },

    // Tools & Utilities
    {
      key: 'customPracticePaper',
      title: 'Custom Practice Paper Generator',
      description: 'Allow students to generate custom question papers selecting their own chapters and marks.',
      icon: <Sliders className="w-5 h-5 text-indigo-400" />,
      category: 'Tools & Utilities',
    },
    {
      key: 'downloads',
      title: 'PDF Downloads & Offline Printables',
      description: 'Enable students to download watermarked printable PDF worksheets and solutions.',
      icon: <Download className="w-5 h-5 text-blue-400" />,
      category: 'Tools & Utilities',
    },

    // Analytics & AI
    {
      key: 'progress',
      title: 'Student Learning Progress Bar',
      description: 'Visual progress trackers showing percentage of curriculum completed.',
      icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
      category: 'Analytics & AI',
    },
    {
      key: 'reports',
      title: 'Accuracy & Performance Reports',
      description: 'Detailed analytics and speed benchmarking against peer averages.',
      icon: <BarChart3 className="w-5 h-5 text-cyan-400" />,
      category: 'Analytics & AI',
    },
    {
      key: 'aiTutor',
      title: 'Gemini AI Math Explainer & Hint Assistant',
      description: 'Interactive intelligent hints and contextual Socratic step-by-step guidance.',
      icon: <Bot className="w-5 h-5 text-pink-400" />,
      category: 'Analytics & AI',
    },

    // Communication
    {
      key: 'announcements',
      title: 'Class Announcements Board',
      description: 'Global and grade-specific announcements published by teachers.',
      icon: <Radio className="w-5 h-5 text-amber-400" />,
      category: 'Communication',
    },
    {
      key: 'notifications',
      title: 'Targeted Student Notification Center',
      description: 'Billing alerts, expiry reminders, and new content alerts.',
      icon: <Bell className="w-5 h-5 text-purple-400" />,
      category: 'Communication',
    },
  ];

  const categories = ['Curriculum', 'Tools & Utilities', 'Analytics & AI', 'Communication'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Dashboard Feature Switches</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30">
              Requirement 15
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global master toggles controlling what navigation modules and tools students can access inside their learning portal.
          </p>
        </div>
      </div>

      {/* Category Groups */}
      <div className="space-y-6">
        {categories.map((category) => {
          const items = configItems.filter((i) => i.category === category);

          return (
            <div key={category} className="space-y-3">
              <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                {category} Modules
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                  const isEnabled = dashboardConfig[item.key];

                  return (
                    <div
                      key={item.key}
                      className={`bg-slate-900/90 border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                        isEnabled ? 'border-slate-800 shadow-xl' : 'border-rose-900/40 bg-slate-950/60 opacity-60'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                              {item.icon}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-white text-xs">{item.title}</h3>
                              <span
                                className={`text-[10px] font-bold ${
                                  isEnabled ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {isEnabled ? 'Active Platform-wide' : 'Disabled Globally'}
                              </span>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <button
                            onClick={() => updateDashboardConfig(item.key, !isEnabled)}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              isEnabled ? 'bg-indigo-600' : 'bg-slate-800'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                                isEnabled ? 'left-7' : 'left-1'
                              }`}
                            />
                          </button>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed pt-1">{item.description}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-mono">{String(item.key)}</span>
                        <span
                          className={`font-bold flex items-center gap-1 ${
                            isEnabled ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          {isEnabled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {isEnabled ? 'Live' : 'Hidden'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
