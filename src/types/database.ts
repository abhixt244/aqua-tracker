export type UsageCategory = 'Shower' | 'Cooking' | 'Cleaning' | 'Drinking' | 'Other';

export interface WaterUsage {
  id: string;
  user_id: string;
  amount: number;
  category: UsageCategory;
  usage_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WaterUsageInsert {
  amount: number;
  category: UsageCategory;
  usage_date: string;
  notes?: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UsageSummary {
  totalUsage: number;
  averageDailyUsage: number;
  highestUsageDay: {
    date: string;
    amount: number;
  } | null;
  mostUsedCategory: {
    category: UsageCategory;
    amount: number;
    percentage: number;
  } | null;
  weeklyComparison: {
    thisWeek: number;
    lastWeek: number;
    percentageChange: number;
  };
  categoryBreakdown: Array<{
    category: UsageCategory;
    amount: number;
    percentage: number;
  }>;
  dailyTrend: Array<{
    date: string;
    amount: number;
  }>;
  suggestedImprovements: string[];
}
