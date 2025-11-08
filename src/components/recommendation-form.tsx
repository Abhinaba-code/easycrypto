'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import {
  generateCryptoRecommendation,
  type GenerateCryptoRecommendationOutput,
} from '@/ai/flows/generate-crypto-recommendation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Coin, MarketChart } from '@/lib/types';
import { calculateMomentumScore, calculateVolatilityScore, getMarketCapBucket, calculateVolumeSpike } from '@/lib/signals';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const formSchema = z.object({
  riskProfile: z.string().min(1, 'Risk profile is required.'),
  investmentHorizon: z.string().min(1, 'Investment horizon is required.'),
  experienceYears: z.coerce.number().min(0, 'Experience must be positive.'),
  preferences: z.string().optional(),
});

type RecommendationFormValues = z.infer<typeof formSchema>;

interface RecommendationFormProps {
  coin: Coin;
  marketChart: MarketChart;
}

export function RecommendationForm({ coin, marketChart }: RecommendationFormProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateCryptoRecommendationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      riskProfile: 'Medium',
      investmentHorizon: 'Medium',
      experienceYears: 1,
      preferences: '',
    },
  });

  const onSubmit = async (values: RecommendationFormValues) => {
    setLoading(true);
    setResult(null);
    try {
      const momentumScore = calculateMomentumScore(marketChart.prices.map(p => p[1]));
      const volatilityScore = calculateVolatilityScore(marketChart.prices.map(p => p[1]));
      const volumeSpike = calculateVolumeSpike(marketChart.total_volumes.map(v => v[1]));
      const marketCapBucket = getMarketCapBucket(coin.market_cap_rank);

      const recommendation = await generateCryptoRecommendation({
        ...values,
        coinId: coin.id,
        momentumScore,
        volatilityScore,
        volumeSpike,
        marketCapBucket,
      });
      setResult(recommendation);
    } catch (error) {
      console.error('Failed to generate recommendation:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate recommendation. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (result) {
    return (
      <Card className="bg-secondary border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Recommendation Result
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Risk Tier</p>
            <Badge variant="default" className="text-base">{result.riskTier}</Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Confidence</p>
              <p className="text-2xl font-bold">{result.confidence}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Allocation</p>
              <p className="text-2xl font-bold">{result.suggestedAllocationPct}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hold Days</p>
              <p className="text-2xl font-bold">{result.suggestedHoldDays}+</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reasoning</p>
            <p className="text-sm">{result.reasonSummary}</p>
          </div>
           <Button onClick={() => setResult(null)} variant="outline" className="w-full">
            Generate New Recommendation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="riskProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Profile</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select your risk profile" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Very Low">Very Low</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Super High">Super High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="investmentHorizon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investment Horizon</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select your investment horizon" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Short">Short-term (&lt; 1 year)</SelectItem>
                  <SelectItem value="Medium">Medium-term (1-3 years)</SelectItem>
                  <SelectItem value="Long">Long-term (3+ years)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experienceYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Crypto Experience</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferences (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., interested in DeFi, NFTs, specific coins..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Recommendation
        </Button>
      </form>
    </Form>
  );
}
