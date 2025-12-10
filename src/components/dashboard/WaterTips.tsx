import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWaterUsage } from '@/hooks/useWaterUsage';
import { Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WaterTips() {
  const { summary, isLoading } = useWaterUsage();

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display">Water Saving Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 water-gradient opacity-5 blur-3xl" />
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-warning/10 border border-warning/30">
            <Lightbulb className="h-5 w-5 text-warning" />
          </div>
          <div>
            <CardTitle className="font-display">Personalized Water Saving Tips</CardTitle>
            <CardDescription>Based on your usage patterns</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          {summary.suggestedImprovements.map((tip, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-xl border border-border/50 bg-muted/30 transition-all",
                "hover:bg-muted/50 hover:border-primary/30 hover:shadow-md",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm leading-relaxed">{tip}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
