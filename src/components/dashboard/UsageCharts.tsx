import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useWaterUsage } from '@/hooks/useWaterUsage';
import { format, parseISO } from 'date-fns';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const CATEGORY_COLORS = {
  Shower: '#0ea5e9',
  Cooking: '#f59e0b',
  Cleaning: '#22c55e',
  Drinking: '#14b8a6',
  Other: '#a855f7',
};

export function UsageCharts() {
  const { summary, isLoading } = useWaterUsage();

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass-card">
            <CardContent className="h-[350px] flex items-center justify-center">
              <div className="h-full w-full bg-muted animate-pulse rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const dailyData = summary.dailyTrend.map(d => ({
    ...d,
    date: format(parseISO(d.date), 'MMM d'),
  }));

  const categoryData = summary.categoryBreakdown;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Daily Trend Line Chart */}
      <Card className="glass-card lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/30">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-display">Daily Usage Trend</CardTitle>
              <CardDescription>Your water consumption over the last 14 days</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  className="text-muted-foreground text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  className="text-muted-foreground text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `${value}L`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.75rem',
                    boxShadow: '0 8px 32px -8px hsl(var(--primary) / 0.25)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [`${value.toFixed(1)}L`, 'Usage']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(199 89% 48%)"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(199 89% 48%)', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(199 89% 48%)', stroke: 'hsl(var(--background))', strokeWidth: 3 }}
                  fill="url(#colorAmount)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Bar Chart */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/30">
              <BarChart3 className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="font-display">Usage by Category</CardTitle>
              <CardDescription>Liters used per category</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis 
                    type="number"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `${value}L`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="category"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.75rem',
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}L`, 'Usage']}
                  />
                  <Bar 
                    dataKey="amount" 
                    radius={[0, 8, 8, 0]}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Pie Chart */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/30">
              <PieChartIcon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="font-display">Usage Distribution</CardTitle>
              <CardDescription>Percentage breakdown by category</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="category"
                    label={({ category, percentage }) => `${category} ${percentage.toFixed(0)}%`}
                    labelLine={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.75rem',
                    }}
                    formatter={(value: number, name: string, props) => [
                      `${value.toFixed(1)}L (${props.payload.percentage.toFixed(1)}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
