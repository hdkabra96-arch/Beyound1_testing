import React from 'react';
import { Loader2, Calculator, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'math-pulse' | 'dots' | 'book';
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-16 h-16',
};

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  label,
  className = '',
}) => {
  if (variant === 'math-pulse') {
    return (
      <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="p-4 rounded-3xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 glass-card shadow-lg"
          >
            <Calculator className={sizeClasses[size]} />
          </motion.div>
          <motion.div
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1 -right-1 text-amber-500"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>
        {label && (
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 animate-pulse">
            {label}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'book') {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="p-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
        >
          <BookOpen className={sizeClasses[size]} />
        </motion.div>
        {label && (
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 inline-block"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600 dark:text-indigo-400`} />
      {label && (
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      )}
    </div>
  );
};
