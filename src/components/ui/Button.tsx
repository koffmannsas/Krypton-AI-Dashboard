import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  disabled?: boolean;
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  // Omit motion-conflicting props
  const { onDrag, onDragEnd, onDragStart, onAnimationStart, ...safeProps } = props as any;
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20',
    outline: 'border border-border text-ink hover:bg-surface transition-colors',
    ghost: 'text-muted hover:text-ink hover:bg-surface transition-colors',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'rounded-lg font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...safeProps}
    />
  );
}
