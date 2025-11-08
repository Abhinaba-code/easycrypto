
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { getCoinDetails, getMarketChart } from '@/lib/coingecko';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, TrendingDown, ChevronsLeft } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

function CryptoFlipResultPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();

  const initialPriceStr = searchParams.get('price');
  const userGuess = params.guess as 'up' | 'down';
  
  const [gameState, setGameState] = useState<'loading' | 'finished'>('loading');
  const [initialPrice, setInitialPrice] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [chartData, setChartData] = useState<{ time: number; price: number; }[]>([]);
  const [result, setResult] = useState<'win' | 'loss' | null>(null);

  useEffect(() => {
    if (!initialPriceStr) {
      router.push('/games'); // Redirect if price is missing
      return;
    }
    const price = parseFloat(initialPriceStr);
    setInitialPrice(price);
    setChartData([{ time: Date.now() - 3000, price: price }]);

    const timer = setTimeout(async () => {
      try {
        const coin = await getCoinDetails('bitcoin');
        const newPrice = coin.market_data.current_price.usd;
        setFinalPrice(newPrice);
        setChartData(prev => [...prev, { time: Date.now(), price: newPrice }]);

        const priceWentUp = newPrice > price;
        if ((userGuess === 'up' && priceWentUp) || (userGuess === 'down' && !priceWentUp)) {
          setResult('win');
        } else {
          setResult('loss');
        }
      } catch (error) {
        console.error("Failed to fetch final price", error);
        setResult('loss'); // Assume loss on error
      } finally {
        setGameState('finished');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [initialPriceStr, userGuess, router]);

  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })}`;

  const renderResult = () => {
    if (gameState !== 'finished' || result === null || initialPrice === null || finalPrice === null) return null;

    const isWin = result === 'win';
    const priceChange = finalPrice - initialPrice;
    const priceChangePercent = (priceChange / initialPrice) * 100;

    return (
      <Alert variant={isWin ? 'default' : 'destructive'} className="text-center">
        <AlertTitle className="text-2xl font-bold">{isWin ? 'You Won!' : 'You Lost!'}</AlertTitle>
        <AlertDescription className="text-base">
          You guessed the price would go <span className="font-bold">{userGuess}</span>.
          <div className="flex justify-center items-center gap-4 my-2">
            <div className="text-lg">{formatCurrency(initialPrice)}</div>
            <div className={`flex items-center ${isWin ? 'text-green-500' : 'text-red-500'}`}>
              {priceChange >= 0 ? <TrendingUp /> : <TrendingDown />}
            </div>
            <div className="text-lg">{formatCurrency(finalPrice)}</div>
          </div>
          <p>The price changed by {formatCurrency(priceChange)} ({priceChangePercent.toFixed(2)}%).</p>
        </AlertDescription>
      </Alert>
    );
  };
  
  if (!initialPrice) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline">Crypto Flip</CardTitle>
          <p className="text-muted-foreground">You guessed the price will go <span className="font-bold text-primary">{userGuess}</span> from an initial price of <span className="font-bold text-primary">{formatCurrency(initialPrice)}</span>.</p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {gameState === 'loading' ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg">Flipping the coin... waiting for the result...</p>
                </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                   <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  <XAxis dataKey="time" tickFormatter={(time) => new Date(time).toLocaleTimeString()} hide />
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <p className="text-sm text-primary">{formatCurrency(payload[0].value as number)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="url(#colorPrice)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-6 min-h-[140px] flex items-center justify-center">
            {renderResult()}
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" onClick={() => router.push('/games')}>
        <ChevronsLeft className="mr-2 h-4 w-4" />
        Back to Arcade
      </Button>
    </div>
  );
}

export default function CryptoFlipResultPageWrapper() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        }>
            <CryptoFlipResultPage />
        </Suspense>
    )
}

    