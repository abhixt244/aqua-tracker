import { MainLayout } from '@/components/layout/MainLayout';
import { UsageForm } from '@/components/usage/UsageForm';
import { RecentUsage } from '@/components/usage/RecentUsage';

export default function LogUsage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Log <span className="water-gradient-text">Water Usage</span>
          </h1>
          <p className="text-muted-foreground">
            Record your daily water consumption to track patterns
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          <UsageForm />
          <RecentUsage />
        </div>
      </div>
    </MainLayout>
  );
}
