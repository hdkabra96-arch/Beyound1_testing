import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type CardVariant = 'default' | 'glass' | 'elevated' | 'gradient-border' | 'outline';
export type CardRadius = 'xl' | '2xl' | '3xl';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: CardVariant;
  radius?: CardRadius;
  hoverGlow?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_20px_-4px_rgba(15,23,42,0.06)]',
  glass: 'glass-card',
  elevated:
    'bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]',
  'gradient-border':
    'bg-white dark:bg-slate-900 relative p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg',
  outline:
    'bg-transparent border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500/50',
};

const radiusClasses: Record<CardRadius, string> = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  radius = '2xl',
  hoverGlow = false,
  className = '',
  children,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverGlow ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`
        ${variantClasses[variant]}
        ${radiusClasses[radius]}
        ${hoverGlow ? 'hover:shadow-[0_0_25px_rgba(99,102,241,0.2)]' : ''}
        transition-all duration-300 overflow-hidden
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => <div className={`p-6 pb-3 space-y-1.5 ${className}`}>{children}</div>;

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <h3 className={`text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 ${className}`}>
    {children}
  </h3>
);

export const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <p className={`text-sm text-slate-500 dark:text-slate-400 leading-relaxed ${className}`}>
    {children}
  </p>
);

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <div className={`p-6 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between ${className}`}>
    {children}
  </div>
);
