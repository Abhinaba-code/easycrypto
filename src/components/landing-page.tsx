'use client';

import { useState } from 'react';
import type { Coin } from '@/lib/types';
import { Button } from './ui/button';
import { CryptoTable } from './crypto-table';
import { RecommendationModal } from './recommendation-modal';

interface LandingPageProps {
  initialCoins: Coin[];
}

export function LandingPage({ initialCoins }: LandingPageProps) {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);

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
            <h2 className="text-2xl font-headline font-bold text-center mb-8">Top 50 Cryptocurrencies</h2>
            <CryptoTable coins={initialCoins} onRecommend={setSelectedCoin} />
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
