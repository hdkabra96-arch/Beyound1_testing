import React from 'react';
import { PackageType } from '../../../types/admin';
import {
  BookOpen,
  Crown,
  GraduationCap,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  Printer,
  Users,
  Layers,
} from 'lucide-react';

interface PackageSelectionCardsProps {
  selectedPackage: PackageType | null;
  onSelectPackage: (pkg: PackageType) => void;
  onProceed?: () => void;
}

interface PackageCardDef {
  id: PackageType;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  accentColor: {
    border: string;
    bg: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    button: string;
    lightBg: string;
  };
  features: string[];
  targetAudience: string;
  allowedFormats: string[];
}

export const PACKAGE_DEFINITIONS: PackageCardDef[] = [
  {
    id: 'basic',
    name: 'Basic Package',
    badge: 'Standard Pass',
    tagline: 'Core Curriculum & Foundation Sheets',
    description:
      'Standard access material for everyday student practice. Includes chapter notes, NCERT solutions, foundational worksheets, and basic practice sheets with controlled downloads.',
    icon: <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    accentColor: {
      border: 'border-blue-500',
      bg: 'bg-blue-50/50 dark:bg-blue-950/20',
      text: 'text-blue-600 dark:text-blue-400',
      badgeBg: 'bg-blue-100 dark:bg-blue-900/60',
      badgeText: 'text-blue-700 dark:text-blue-300',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      lightBg: 'bg-blue-50 dark:bg-blue-900/30',
    },
    features: [
      'Core chapter notes & NCERT solutions',
      'Configurable download limits (5–10 per topic)',
      'Web-based reading view & print control',
      'Free or Basic-only access toggles',
    ],
    targetAudience: 'Class 1 to 8 Foundation Students',
    allowedFormats: ['PDF', 'DOCX', 'JPG', 'PNG'],
  },
  {
    id: 'pro',
    name: 'Pro Package',
    badge: 'Most Popular',
    tagline: 'Olympiad, HOTS & Mastery Suite',
    description:
      'Advanced high-order thinking skills (HOTS), Olympiad problem banks, step-by-step solutions, difficulty tags, estimated study times, dynamic watermarks, and full expiry rules.',
    icon: <Crown className="w-6 h-6 text-amber-500" />,
    accentColor: {
      border: 'border-amber-500',
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      text: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
      badgeText: 'text-amber-800 dark:text-amber-300',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
      lightBg: 'bg-amber-50 dark:bg-amber-900/30',
    },
    features: [
      'Competency & Olympiad difficulty levels',
      'Learning objectives & prerequisite mapping',
      'Explanatory solutions & answer keys',
      'Dynamic security watermarks & expiry dates',
    ],
    targetAudience: 'Top Rankers, Olympiad Aspirants & Pro Subscribers',
    allowedFormats: ['PDF', 'DOCX', 'PPTX', 'ZIP'],
  },
  {
    id: 'teachers',
    name: "Teacher's Package",
    badge: 'Educator Toolkit',
    tagline: 'Lesson Plans & Classroom Resources',
    description:
      'Tailored pedagogical materials for educators and tutors. Includes lesson plans, teaching duration, pedagogical methods, classroom resources, teacher-only notes, and selective teacher delegation.',
    icon: <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
    accentColor: {
      border: 'border-emerald-500',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      lightBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    },
    features: [
      'Comprehensive lesson plans & period durations',
      'Teaching notes & common misconception guides',
      'Searchable teacher delegation & access lists',
      'Print, copy & classroom sharing rights',
    ],
    targetAudience: 'School Teachers, Private Tutors & Faculty',
    allowedFormats: ['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX'],
  },
  {
    id: 'school',
    name: 'School / Institution',
    badge: 'Enterprise Suite',
    tagline: 'Campus Blueprint & Branch Assessments',
    description:
      'Enterprise institutional management. Assign materials to specific school campuses, departments, branches, divisions/sections (A/B/C/D), with custom examination blueprints.',
    icon: <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
    accentColor: {
      border: 'border-indigo-500',
      bg: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      text: 'text-indigo-600 dark:text-indigo-400',
      badgeBg: 'bg-indigo-100 dark:bg-indigo-900/60',
      badgeText: 'text-indigo-700 dark:text-indigo-300',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      lightBg: 'bg-indigo-50 dark:bg-indigo-900/30',
    },
    features: [
      'Campus, branch & department metadata',
      'Multi-division (Section A, B, C, D) targeting',
      'Official institutional assessment instructions',
      'Bulk school-wide permission governance',
    ],
    targetAudience: 'K-12 Partner Schools & Coaching Chains',
    allowedFormats: ['PDF', 'DOCX', 'XLSX', 'ZIP', 'PPTX'],
  },
];

export const PackageSelectionCards: React.FC<PackageSelectionCardsProps> = ({
  selectedPackage,
  onSelectPackage,
  onProceed,
}) => {
  return (
    <div className="space-y-6">
      {/* Header instructions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                Step 1 of 7
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Select Package Tier for Upload
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Please choose exactly one package option. The upload form, metadata fields, access tiers, and permissions will adapt dynamically to your selection.
            </p>
          </div>

          {selectedPackage && onProceed && (
            <button
              onClick={onProceed}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition shadow-sm whitespace-nowrap"
            >
              <span>Continue to Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 4 Professional Selectable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {PACKAGE_DEFINITIONS.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;

          return (
            <div
              key={pkg.id}
              onClick={() => onSelectPackage(pkg.id)}
              className={`relative flex flex-col justify-between rounded-xl p-5 border-2 transition-all cursor-pointer bg-white dark:bg-slate-900 shadow-sm hover:shadow-md ${
                isSelected
                  ? `${pkg.accentColor.border} ring-2 ring-blue-500/20 ${pkg.accentColor.bg}`
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Selected indicator check badge */}
              {isSelected && (
                <div className="absolute -top-2.5 -right-2.5 bg-blue-600 text-white p-1 rounded-full shadow">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}

              <div>
                {/* Header row with Icon and Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${pkg.accentColor.lightBg}`}
                  >
                    {pkg.icon}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${pkg.accentColor.badgeBg} ${pkg.accentColor.badgeText}`}
                  >
                    {pkg.badge}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">
                  {pkg.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                  {pkg.tagline}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {pkg.description}
                </p>

                {/* Key Features Bullet List */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 mb-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Package Capabilities
                  </div>
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className={`text-xs mt-0.5 ${pkg.accentColor.text}`}>•</span>
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer with Selection Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage(pkg.id);
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? `${pkg.accentColor.button} shadow-sm font-semibold`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selected Package</span>
                    </>
                  ) : (
                    <span>Select {pkg.name}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
