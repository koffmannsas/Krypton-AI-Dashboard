import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Card({ children, className, ...props }: CardProps) {
  const { onDrag, onDragEnd, onDragStart, onAnimationStart, ...safeProps } = props as any;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300",
        className
      )}
      {...safeProps}
    >
      {children}
    </motion.div>
  );
}
