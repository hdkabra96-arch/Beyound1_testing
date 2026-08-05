import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface MotionWrapperProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<MotionWrapperProps> = ({
  children,
  delay = 0,
  duration = 0.4,
  className = '',
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideUp: React.FC<MotionWrapperProps & { distance?: number }> = ({
  children,
  delay = 0,
  duration = 0.4,
  distance = 20,
  className = '',
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, y: distance }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration, delay, type: 'spring', stiffness: 300, damping: 25 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const ScaleIn: React.FC<MotionWrapperProps> = ({
  children,
  delay = 0,
  duration = 0.3,
  className = '',
  ...props
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration, delay, type: 'spring', stiffness: 350, damping: 22 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className = '' }) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const GlassHover: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    className={`glass-card ${className}`}
  >
    {children}
  </motion.div>
);
