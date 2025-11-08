
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Coin } from '@/lib/types';
import { Button } from './ui/button';
import { CryptoTable } from './crypto-table';
import { RecommendationModal } from './recommendation-modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getTopCoins } from '@/lib/coingecko';
import { Skeleton } from './ui/skeleton';

interface LandingPageProps {
  initialCoins: Coin[];
  currentPage: number;
}

export function LandingPage({ initialCoins, currentPage }: LandingPageProps) {
  const [coins, setCoins] = useState<Coin[]>(initialCoins);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCoins(initialCoins);
  }, [initialCoins]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const freshCoins = await getTopCoins(currentPage);
        setCoins(freshCoins);
      } catch (error) {
        console.error("Failed to fetch fresh coin data", error);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [currentPage]);

  const handlePageChange = () => {
    setLoading(true);
  };

  const hasNextPage = coins.length === 50;

  return (
    <>
      <div className="container relative">
        <section className="mx-auto grid max-w-[980px] flex-1 gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-10">
          <div className="mx-auto flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-headline font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              <span className="animated-gradient bg-clip-text text-transparent">
                AstraPulse
              </span>
              : AI Crypto Insights
            </h1>
            <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
              Real-time crypto data, smart risk-tier recommendations, and a free
              arcade of fake-coin games.
            </p>
            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
              <Button size="lg" className="rounded-full">Get Started</Button>
              <Button size="lg" variant="outline" className="rounded-full">Learn More</Button>
            </div>
          </div>
        </section>

        <section className="pb-12">
            <h2 className="text-2xl font-headline font-bold text-center mb-8">Top Cryptocurrencies</h2>
            {loading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <CryptoTable coins={coins} onRecommend={setSelectedCoin} />
            )}
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button asChild variant="outline" disabled={currentPage <= 1}>
                <Link href={`/?page=${currentPage - 1}`} onClick={handlePageChange}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Link>
              </Button>
              <span className="text-muted-foreground">Page {currentPage}</span>
              <Button asChild variant="outline" disabled={!hasNextPage}>
                <Link href={`/?page=${currentPage + 1}`} onClick={handlePageChange}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
        </section>
      </div>

      {selectedCoin && (
        <RecommendationModal
          coin={selectedCoin}
          isOpen={!!selectedCoin}
          onClose={() => setSelectedCoin(null)}
        />
      )}
    </>
  );
}
