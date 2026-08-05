import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table' | 'chart';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  if (variant === 'circular') {
    return (
      <div
        className={`animate-shimmer rounded-full bg-slate-200/80 dark:bg-slate-800/80 ${className}`}
      />
    );
  }

  if (variant === 'text') {
    return (
      <div
        className={`animate-shimmer rounded-lg bg-slate-200/80 dark:bg-slate-800/80 h-4 w-full ${className}`}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={`glass-card p-6 rounded-3xl space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <Skeleton variant="circular" className="w-12 h-12" />
          <Skeleton variant="text" className="w-20 h-6" />
        </div>
        <Skeleton variant="text" className="w-3/4 h-6" />
        <Skeleton variant="text" className="w-full h-4" />
        <Skeleton variant="text" className="w-5/6 h-4" />
        <div className="pt-2 flex gap-2">
          <Skeleton variant="text" className="w-24 h-8 rounded-xl" />
          <Skeleton variant="text" className="w-24 h-8 rounded-xl" />
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`glass-card p-6 rounded-3xl space-y-4 ${className}`}>
        <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-slate-800">
          <Skeleton variant="text" className="w-32 h-6" />
          <Skeleton variant="text" className="w-24 h-8 rounded-xl" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-3 w-1/3">
              <Skeleton variant="circular" className="w-8 h-8" />
              <Skeleton variant="text" className="w-24 h-4" />
            </div>
            <Skeleton variant="text" className="w-20 h-4" />
            <Skeleton variant="text" className="w-16 h-6 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={`glass-card p-6 rounded-3xl space-y-4 ${className}`}>
        <div className="flex justify-between items-center">
          <Skeleton variant="text" className="w-40 h-6" />
          <Skeleton variant="text" className="w-24 h-6" />
        </div>
        <div className="h-48 w-full flex items-end gap-3 pt-6">
          {[40, 70, 55, 90, 65, 80, 45].map((h, idx) => (
            <div
              key={idx}
              style={{ height: `${h}%` }}
              className="flex-1 animate-shimmer rounded-t-xl bg-slate-200/80 dark:bg-slate-800/80"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`animate-shimmer rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 ${className}`}
    />
  );
};
