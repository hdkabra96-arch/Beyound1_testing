import React from 'react';
import { CLASS_GRADES } from '../../design-system/tokens';

export type BadgeVariant =
  | 'class-1'
  | 'class-2'
  | 'class-3'
  | 'class-4'
  | 'class-5'
  | 'class-6'
  | 'class-7'
  | 'class-8'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'glass'
  | 'outline';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs font-medium rounded-lg gap-1',
  md: 'px-2.5 py-1 text-xs font-semibold rounded-xl gap-1.5',
  lg: 'px-3.5 py-1.5 text-sm font-semibold rounded-xl gap-2',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  dot = false,
  className = '',
}) => {
  // Check if it's a class grade variant
  const gradeMatch = CLASS_GRADES.find(
    (g) => g.id.replace('_', '-') === variant || g.name.toLowerCase().replace(' ', '-') === variant
  );

  let variantClass = '';

  if (gradeMatch) {
    variantClass = `${gradeMatch.badgeBg} ${gradeMatch.badgeText} border ${gradeMatch.borderColor}`;
  } else {
    switch (variant) {
      case 'primary':
        variantClass =
          'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
        break;
      case 'success':
        variantClass =
          'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        break;
      case 'warning':
        variantClass =
          'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
        break;
      case 'danger':
        variantClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
        break;
      case 'info':
        variantClass = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20';
        break;
      case 'glass':
        variantClass =
          'bg-white/40 dark:bg-slate-800/40 backdrop-blur-md text-slate-800 dark:text-slate-200 border border-white/40 dark:border-slate-700/40 shadow-sm';
        break;
      case 'outline':
        variantClass =
          'bg-transparent border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300';
        break;
      default:
        variantClass =
          'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
    }
  }

  return (
    <span
      className={`
        inline-flex items-center justify-center whitespace-nowrap tracking-wide transition-all
        ${sizeClasses[size]}
        ${variantClass}
        ${className}
      `}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0" />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
