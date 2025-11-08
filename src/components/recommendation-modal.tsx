
'use client';

import { useEffect, useState } from 'react';
import type { Coin } from '@/lib/types';
import { getMarketChart } from '@/lib/coincap';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { RecommendationForm } from './recommendation-form';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertTriangle } from 'lucide-react';

interface RecommendationModalProps {
  coin: Coin;
  isOpen: boolean;
  onClose: () => void;
}

interface MarketChart {
    prices: [number, number][]; // [timestamp, price]
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

export function RecommendationModal({ coin, isOpen, onClose }: RecommendationModalProps) {
  const [marketChart, setMarketChart] = useState<MarketChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setMarketChart(null);

      getMarketChart(coin.id)
        .then((data) => {
          setMarketChart(data as MarketChart);
          setLoading(false);
        })
        .catch(() => {
          setError('Could not load market data. Please try again later.');
          setLoading(false);
        });
    }
  }, [isOpen, coin.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Recommendation for {coin.name}</DialogTitle>
          <DialogDescription>
            Fill in your profile to get a personalized crypto recommendation from our AI.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {!loading && !error && marketChart && (
            <RecommendationForm coin={coin} marketChart={marketChart} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
