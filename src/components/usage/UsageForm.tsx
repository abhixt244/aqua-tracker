import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Droplets, Loader2, ShowerHead, UtensilsCrossed, Sparkles, GlassWater, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useWaterUsage } from '@/hooks/useWaterUsage';
import { UsageCategory } from '@/types/database';

const categories: { value: UsageCategory; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'Shower', label: 'Shower', icon: ShowerHead, color: 'text-chart-shower' },
  { value: 'Cooking', label: 'Cooking', icon: UtensilsCrossed, color: 'text-chart-cooking' },
  { value: 'Cleaning', label: 'Cleaning', icon: Sparkles, color: 'text-chart-cleaning' },
  { value: 'Drinking', label: 'Drinking', icon: GlassWater, color: 'text-chart-drinking' },
  { value: 'Other', label: 'Other', icon: MoreHorizontal, color: 'text-chart-other' },
];

export function UsageForm() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<UsageCategory | ''>('');
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState('');
  
  const { addUsage, isAdding } = useWaterUsage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) return;

    addUsage({
      amount: parseFloat(amount),
      category: category as UsageCategory,
      usage_date: format(date, 'yyyy-MM-dd'),
      notes: notes || undefined,
    }, {
      onSuccess: () => {
        setAmount('');
        setCategory('');
        setNotes('');
        setDate(new Date());
      }
    });
  };

  return (
    <Card className="glass-card overflow-hidden">
      <div className="absolute inset-0 water-gradient opacity-5" />
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl water-gradient shadow-water">
            <Droplets className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="font-display text-2xl">Log Water Usage</CardTitle>
            <CardDescription>Track your daily water consumption</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount (Liters)
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Enter amount in liters"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-12 h-12 text-lg"
                required
              />
              <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <div className="grid grid-cols-5 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    category === cat.value
                      ? "border-primary bg-primary/10 shadow-water"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <cat.icon className={cn("h-6 w-6", category === cat.value ? "text-primary" : cat.color)} />
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this usage..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-semibold water-gradient shadow-water hover:shadow-water-lg transition-all"
            disabled={!amount || !category || isAdding}
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Droplets className="mr-2 h-5 w-5" />
                Log Usage
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
