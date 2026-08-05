import React from 'react';
import { TYPOGRAPHY_SCALE } from '../../design-system/tokens';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  gradient?: 'indigo' | 'emerald' | 'amber' | 'none';
  children: React.ReactNode;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({
  level = 2,
  gradient = 'none',
  children,
  className = '',
  ...props
}) => {
  const gradientClass =
    gradient === 'indigo'
      ? 'gradient-text-indigo'
      : gradient === 'emerald'
      ? 'gradient-text-emerald'
      : gradient === 'amber'
      ? 'gradient-text-amber'
      : '';

  const Tag = `h${level}` as any;
  const scaleClass = TYPOGRAPHY_SCALE[`h${level}` as keyof typeof TYPOGRAPHY_SCALE];

  return (
    <Tag
      className={`
        ${scaleClass}
        ${gradientClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </Tag>
  );
};

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'lead' | 'body' | 'small' | 'caption' | 'code';
  children: React.ReactNode;
  className?: string;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  children,
  className = '',
  ...props
}) => {
  if (variant === 'code') {
    return (
      <code
        className={`
          font-mono text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80
          border border-slate-200 dark:border-slate-700/80 text-indigo-600 dark:text-indigo-400
          ${className}
        `}
      >
        {children}
      </code>
    );
  }

  const scaleClass = TYPOGRAPHY_SCALE[variant] || TYPOGRAPHY_SCALE.body;

  return (
    <p className={`${scaleClass} ${className}`} {...props}>
      {children}
    </p>
  );
};

export const GradientText: React.FC<{
  children: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber';
  className?: string;
}> = ({ children, variant = 'indigo', className = '' }) => {
  const cls =
    variant === 'indigo'
      ? 'gradient-text-indigo'
      : variant === 'emerald'
      ? 'gradient-text-emerald'
      : 'gradient-text-amber';

  return <span className={`${cls} ${className}`}>{children}</span>;
};
