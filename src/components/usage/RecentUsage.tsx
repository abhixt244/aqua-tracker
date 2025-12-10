import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWaterUsage } from '@/hooks/useWaterUsage';
import { format, parseISO } from 'date-fns';
import { Trash2, Droplets, ShowerHead, UtensilsCrossed, Sparkles, GlassWater, MoreHorizontal, Clock } from 'lucide-react';
import { UsageCategory } from '@/types/database';
import { cn } from '@/lib/utils';

const categoryIcons: Record<UsageCategory, React.ElementType> = {
  Shower: ShowerHead,
  Cooking: UtensilsCrossed,
  Cleaning: Sparkles,
  Drinking: GlassWater,
  Other: MoreHorizontal,
};

const categoryColors: Record<UsageCategory, string> = {
  Shower: 'bg-chart-shower/10 text-chart-shower border-chart-shower/30',
  Cooking: 'bg-chart-cooking/10 text-chart-cooking border-chart-cooking/30',
  Cleaning: 'bg-chart-cleaning/10 text-chart-cleaning border-chart-cleaning/30',
  Drinking: 'bg-chart-drinking/10 text-chart-drinking border-chart-drinking/30',
  Other: 'bg-chart-other/10 text-chart-other border-chart-other/30',
};

export function RecentUsage() {
  const { usageData, deleteUsage, isLoading } = useWaterUsage();

  const recentEntries = usageData.slice(0, 5);

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-secondary/20 border border-secondary/30">
            <Clock className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <CardTitle className="font-display">Recent Entries</CardTitle>
            <CardDescription>Your latest water usage logs</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {recentEntries.length === 0 ? (
          <div className="text-center py-12">
            <Droplets className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">No entries yet</p>
            <p className="text-sm text-muted-foreground/70">Start logging your water usage!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((entry, index) => {
              const Icon = categoryIcons[entry.category];
              return (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md",
                    "animate-fade-in bg-card/50 hover:bg-card"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2.5 rounded-xl border", categoryColors[entry.category])}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{entry.amount}L</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">{entry.category}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(parseISO(entry.usage_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteUsage(entry.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
