import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { UsageCharts } from '@/components/dashboard/UsageCharts';
import { WaterTips } from '@/components/dashboard/WaterTips';
import { useWaterUsage } from '@/hooks/useWaterUsage';
import { Droplets, TrendingUp, Calendar, Award } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function Dashboard() {
  const { summary, isLoading } = useWaterUsage();

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Water Usage <span className="water-gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Track your consumption and discover ways to save water
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Usage"
            value={`${summary.totalUsage.toFixed(1)}L`}
            subtitle="All time"
            icon={<Droplets className="h-6 w-6 text-primary-foreground" />}
            variant="primary"
          />
          <StatCard
            title="Daily Average"
            value={`${summary.averageDailyUsage.toFixed(1)}L`}
            subtitle="Per day"
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="This Week"
            value={`${summary.weeklyComparison.thisWeek.toFixed(1)}L`}
            trend={{
              value: summary.weeklyComparison.percentageChange,
              isPositive: summary.weeklyComparison.percentageChange < 0,
            }}
            icon={<Calendar className="h-6 w-6 text-secondary" />}
          />
          <StatCard
            title="Top Category"
            value={summary.mostUsedCategory?.category || 'N/A'}
            subtitle={summary.mostUsedCategory 
              ? `${summary.mostUsedCategory.percentage.toFixed(0)}% of usage`
              : 'Log data to see'}
            icon={<Award className="h-6 w-6 text-warning" />}
            variant="warning"
          />
        </div>

        {/* Charts */}
        <UsageCharts />

        {/* Tips */}
        <WaterTips />
      </div>
    </MainLayout>
  );
}
