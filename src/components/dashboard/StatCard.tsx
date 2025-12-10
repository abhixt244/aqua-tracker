import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'water-gradient text-primary-foreground',
  success: 'bg-success/10 border-success/30',
  warning: 'bg-warning/10 border-warning/30',
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  className,
  variant = 'default'
}: StatCardProps) {
  return (
    <div className={cn(
      "stat-card border rounded-2xl",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn(
            "text-sm font-medium",
            variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          <p className="text-3xl font-display font-bold tracking-tight">
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-sm",
              variant === 'primary' ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              "inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full",
              trend.value < 0 
                ? 'bg-success/20 text-success' 
                : trend.value > 0 
                  ? 'bg-warning/20 text-warning' 
                  : 'bg-muted text-muted-foreground'
            )}>
              <span>{trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'}</span>
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          variant === 'primary' 
            ? 'bg-primary-foreground/20' 
            : 'bg-primary/10'
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
