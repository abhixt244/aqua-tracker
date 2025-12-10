import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { WaterUsage, WaterUsageInsert, UsageSummary, UsageCategory } from '@/types/database';
import { startOfWeek, endOfWeek, subWeeks, format, parseISO, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

const CATEGORY_ORDER: UsageCategory[] = ['Shower', 'Cooking', 'Cleaning', 'Drinking', 'Other'];

export function useWaterUsage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: usageData = [], isLoading, refetch } = useQuery({
    queryKey: ['water-usage', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('water_usage')
        .select('*')
        .eq('user_id', user.id)
        .order('usage_date', { ascending: false });

      if (error) throw error;
      return data as WaterUsage[];
    },
    enabled: !!user,
  });

  const addUsageMutation = useMutation({
    mutationFn: async (usage: WaterUsageInsert) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('water_usage')
        .insert({
          user_id: user.id,
          amount: usage.amount,
          category: usage.category,
          usage_date: usage.usage_date,
          notes: usage.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-usage', user?.id] });
      toast.success('Water usage logged successfully!');
    },
    onError: (error) => {
      toast.error('Failed to log water usage: ' + error.message);
    },
  });

  const deleteUsageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('water_usage')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-usage', user?.id] });
      toast.success('Entry deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete entry: ' + error.message);
    },
  });

  const calculateSummary = (): UsageSummary => {
    const today = new Date();
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });

    // Total usage
    const totalUsage = usageData.reduce((sum, entry) => sum + Number(entry.amount), 0);

    // Days with data
    const uniqueDates = new Set(usageData.map(entry => entry.usage_date));
    const daysWithData = uniqueDates.size || 1;
    const averageDailyUsage = totalUsage / daysWithData;

    // Daily totals for finding highest day
    const dailyTotals: Record<string, number> = {};
    usageData.forEach(entry => {
      dailyTotals[entry.usage_date] = (dailyTotals[entry.usage_date] || 0) + Number(entry.amount);
    });

    // Highest usage day
    let highestUsageDay: { date: string; amount: number } | null = null;
    Object.entries(dailyTotals).forEach(([date, amount]) => {
      if (!highestUsageDay || amount > highestUsageDay.amount) {
        highestUsageDay = { date, amount };
      }
    });

    // Category breakdown
    const categoryTotals: Record<UsageCategory, number> = {
      Shower: 0,
      Cooking: 0,
      Cleaning: 0,
      Drinking: 0,
      Other: 0,
    };
    usageData.forEach(entry => {
      categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + Number(entry.amount);
    });

    const categoryBreakdown = CATEGORY_ORDER.map(category => ({
      category,
      amount: categoryTotals[category],
      percentage: totalUsage > 0 ? (categoryTotals[category] / totalUsage) * 100 : 0,
    })).filter(c => c.amount > 0);

    // Most used category
    let mostUsedCategory = categoryBreakdown.length > 0 
      ? categoryBreakdown.reduce((max, curr) => curr.amount > max.amount ? curr : max)
      : null;

    // Weekly comparison
    const thisWeekUsage = usageData
      .filter(entry => {
        const date = parseISO(entry.usage_date);
        return date >= thisWeekStart && date <= thisWeekEnd;
      })
      .reduce((sum, entry) => sum + Number(entry.amount), 0);

    const lastWeekUsage = usageData
      .filter(entry => {
        const date = parseISO(entry.usage_date);
        return date >= lastWeekStart && date <= lastWeekEnd;
      })
      .reduce((sum, entry) => sum + Number(entry.amount), 0);

    const percentageChange = lastWeekUsage > 0 
      ? ((thisWeekUsage - lastWeekUsage) / lastWeekUsage) * 100 
      : thisWeekUsage > 0 ? 100 : 0;

    // Daily trend (last 14 days)
    const dailyTrend: { date: string; amount: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      dailyTrend.push({
        date: dateStr,
        amount: dailyTotals[dateStr] || 0,
      });
    }

    // Generate personalized tips
    const suggestedImprovements = generateTips(categoryBreakdown, percentageChange, averageDailyUsage);

    return {
      totalUsage,
      averageDailyUsage,
      highestUsageDay,
      mostUsedCategory,
      weeklyComparison: {
        thisWeek: thisWeekUsage,
        lastWeek: lastWeekUsage,
        percentageChange,
      },
      categoryBreakdown,
      dailyTrend,
      suggestedImprovements,
    };
  };

  return {
    usageData,
    isLoading,
    refetch,
    addUsage: addUsageMutation.mutate,
    deleteUsage: deleteUsageMutation.mutate,
    isAdding: addUsageMutation.isPending,
    summary: calculateSummary(),
  };
}

function generateTips(
  categoryBreakdown: Array<{ category: UsageCategory; amount: number; percentage: number }>,
  weeklyChange: number,
  avgDaily: number
): string[] {
  const tips: string[] = [];

  // Check shower usage
  const showerUsage = categoryBreakdown.find(c => c.category === 'Shower');
  if (showerUsage && showerUsage.percentage > 40) {
    tips.push("💧 Your shower usage accounts for over 40% of total consumption. Try reducing shower time by 2 minutes to save up to 20 liters per shower!");
  }

  // Check if usage increased
  if (weeklyChange > 15) {
    tips.push(`📈 Your water usage increased by ${Math.round(weeklyChange)}% this week. Consider tracking which activities use the most water and find alternatives.`);
  } else if (weeklyChange < -10) {
    tips.push(`🎉 Great job! You reduced your water usage by ${Math.abs(Math.round(weeklyChange))}% compared to last week. Keep up the excellent conservation habits!`);
  }

  // High daily usage
  if (avgDaily > 150) {
    tips.push("⚠️ Your average daily usage is above 150L. The recommended average is around 80-100L per person. Look for ways to reduce consumption.");
  }

  // Cooking tips
  const cookingUsage = categoryBreakdown.find(c => c.category === 'Cooking');
  if (cookingUsage && cookingUsage.percentage > 25) {
    tips.push("🍳 Consider reusing water from washing vegetables to water plants, and try steaming instead of boiling to conserve water while cooking.");
  }

  // Cleaning tips
  const cleaningUsage = categoryBreakdown.find(c => c.category === 'Cleaning');
  if (cleaningUsage && cleaningUsage.percentage > 30) {
    tips.push("🧹 For cleaning, use a bucket instead of running water. This simple switch can save up to 50 liters per cleaning session!");
  }

  // Default tips if none generated
  if (tips.length === 0) {
    tips.push("💡 Fix any leaky faucets - a single dripping tap can waste over 5,000 liters per year!");
    tips.push("🚿 Install water-efficient showerheads and faucet aerators to reduce flow without sacrificing pressure.");
    tips.push("🌱 Water plants in the early morning or evening to minimize evaporation and maximize absorption.");
  }

  return tips.slice(0, 4);
}
