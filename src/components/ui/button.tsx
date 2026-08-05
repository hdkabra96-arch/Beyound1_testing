import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary-gradient'
  | 'accent-gradient'
  | 'success-gradient'
  | 'secondary'
  | 'glass'
  | 'outline'
  | 'ghost'
  | 'danger';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  'primary-gradient': 'gradient-btn-primary text-white border border-indigo-400/20',
  'accent-gradient': 'gradient-btn-accent text-white border border-teal-400/20',
  'success-gradient': 'gradient-btn-success text-white border border-emerald-400/20',
  secondary:
    'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60 shadow-sm',
  glass:
    'bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-800 dark:text-slate-100 border border-white/50 dark:border-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-800/80 shadow-sm',
  outline:
    'bg-transparent border-2 border-indigo-600/80 dark:border-indigo-400/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30',
  ghost:
    'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/20 hover:from-red-600 hover:to-rose-700 border border-red-400/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-xl gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-2xl gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-2xl gap-2.5',
  xl: 'px-6 py-3.5 text-lg font-bold rounded-2xl gap-3',
  icon: 'p-2.5 rounded-2xl text-sm flex items-center justify-center aspect-square',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary-gradient',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const isButtonDisabled = disabled || isLoading;

  return (
    <motion.button
      whileHover={isButtonDisabled ? undefined : { scale: 1.02 }}
      whileTap={isButtonDisabled ? undefined : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      disabled={isButtonDisabled}
      className={`
        inline-flex items-center justify-center transition-all cursor-pointer select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isButtonDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
