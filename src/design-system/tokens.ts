export interface GradeMetadata {
  id: string;
  name: string;
  shortName: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  gradient: string;
  description: string;
  iconName: string;
  accentColor: string;
}

export const COLOR_PALETTE = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Indigo Primary
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  accent: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#10b981', // Emerald Math Accent
    600: '#059669',
    700: '#047857',
  },
  amber: {
    50: '#fffbeb',
    500: '#f59e0b', // Math Trophy Accent
    600: '#d97706',
  },
  cyan: {
    50: '#ecfeff',
    500: '#06b6d4',
    600: '#0891b2',
  },
  dark: {
    bg: '#ffffff',
    card: '#ffffff',
    border: '#e2e8f0',
    text: '#000000',
    subtext: '#1e293b',
  },
  light: {
    bg: '#ffffff',
    card: '#ffffff',
    border: '#e2e8f0',
    text: '#000000',
    subtext: '#1e293b',
  },
};

export const CLASS_GRADES: GradeMetadata[] = [
  {
    id: 'class_1',
    name: 'Class 1',
    shortName: 'C1',
    badgeBg: 'bg-pink-500/10 dark:bg-pink-500/20',
    badgeText: 'text-pink-600 dark:text-pink-400',
    borderColor: 'border-pink-500/30',
    gradient: 'from-pink-500 to-rose-500',
    description: 'Numbers, Basic Addition, Shapes & Patterns',
    iconName: 'Shapes',
    accentColor: '#ec4899',
  },
  {
    id: 'class_2',
    name: 'Class 2',
    shortName: 'C2',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeText: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-500/30',
    gradient: 'from-purple-500 to-indigo-500',
    description: 'Place Value, Subtraction, Money & Time',
    iconName: 'Sparkles',
    accentColor: '#a855f7',
  },
  {
    id: 'class_3',
    name: 'Class 3',
    shortName: 'C3',
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-indigo-500/30',
    gradient: 'from-indigo-500 to-blue-500',
    description: 'Multiplication Tables, Division Intro, Measurement',
    iconName: 'Calculator',
    accentColor: '#6366f1',
  },
  {
    id: 'class_4',
    name: 'Class 4',
    shortName: 'C4',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-500/20',
    badgeText: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500/30',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Fractions, Multi-digit Arithmetic, Perimeter',
    iconName: 'PieChart',
    accentColor: '#3b82f6',
  },
  {
    id: 'class_5',
    name: 'Class 5',
    shortName: 'C5',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-500/30',
    gradient: 'from-cyan-500 to-teal-500',
    description: 'Decimals, Percentage Intro, Area & Volume',
    iconName: 'Compass',
    accentColor: '#06b6d4',
  },
  {
    id: 'class_6',
    name: 'Class 6',
    shortName: 'C6',
    badgeBg: 'bg-teal-500/10 dark:bg-teal-500/20',
    badgeText: 'text-teal-600 dark:text-teal-400',
    borderColor: 'border-teal-500/30',
    gradient: 'from-teal-500 to-emerald-500',
    description: 'Integers, Algebra Basics, Ratio & Proportion',
    iconName: 'Variable',
    accentColor: '#14b8a6',
  },
  {
    id: 'class_7',
    name: 'Class 7',
    shortName: 'C7',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500/30',
    gradient: 'from-emerald-500 to-green-600',
    description: 'Rational Numbers, Linear Equations, Triangles',
    iconName: 'Triangle',
    accentColor: '#10b981',
  },
  {
    id: 'class_8',
    name: 'Class 8',
    shortName: 'C8',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeText: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500/30',
    gradient: 'from-amber-500 to-orange-500',
    description: 'Linear Equations, Geometry Proofs, Exponents & Roots',
    iconName: 'Binary',
    accentColor: '#f59e0b',
  },
];

export const TYPOGRAPHY_SCALE = {
  h1: 'text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight',
  h2: 'text-3xl sm:text-4xl font-bold tracking-tight',
  h3: 'text-2xl sm:text-3xl font-bold tracking-tight',
  h4: 'text-xl sm:text-2xl font-semibold tracking-tight',
  h5: 'text-lg sm:text-xl font-semibold',
  h6: 'text-base font-semibold',
  lead: 'text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed',
  body: 'text-base text-slate-700 dark:text-slate-300 leading-relaxed',
  small: 'text-sm text-slate-500 dark:text-slate-400',
  caption: 'text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider',
};

export const SHADOW_PRESETS = {
  soft: 'shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.03)]',
  glow: 'shadow-[0_0_25px_rgba(99,102,241,0.25)]',
  card: 'shadow-[0_8px_20px_-4px_rgba(15,23,42,0.06),0_2px_6px_-1px_rgba(15,23,42,0.04)]',
  elevated: 'shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]',
};
