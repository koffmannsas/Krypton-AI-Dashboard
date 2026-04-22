import React from 'react';
import Card from './Card';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  key?: React.Key;
}

export default function StatCard({ title, value, trend, trendUp = true, icon, ...props }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:border-primary/50 transition-all duration-300" {...props}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-surface rounded-lg text-primary border border-border group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5",
            trendUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
          )}>
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-muted text-xs font-medium uppercase tracking-wider mb-1 opacity-70">{title}</p>
        <h3 className="text-2xl font-display font-bold text-ink tracking-tight">{value}</h3>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700" />
    </Card>
  );
}
