import type { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'teal' | 'amber' | 'rose' | 'violet';
  delay?: number;
}

const colorClasses = {
  teal: 'from-teal-500 to-emerald-500',
  amber: 'from-amber-500 to-orange-500',
  rose: 'from-rose-500 to-pink-500',
  violet: 'from-violet-500 to-purple-500',
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = 'teal',
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-display font-bold text-slate-900 mt-2">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                'text-sm mt-2 font-medium',
                trendUp ? 'text-success-600' : 'text-danger-600'
              )}
            >
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        <div
          className={cn(
            'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg',
            colorClasses[color]
          )}
        >
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
}
