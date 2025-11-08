'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Coins, Loader2, RefreshCw } from 'lucide-react';
import { getCoinDetails } from '@/lib/coingecko';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type GameState = 'playing' | 'loading' | 'won' | 'lost';

export default function ArcadePage() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [initialPrice, setInitialPrice] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [userGuess, setUserGuess] = useState<'up' | 'down' | null>(null);

  const fetchBtcPrice = useCallback(async () => {
    try {
      const btc = await getCoinDetails('bitcoin');
      return btc.market_data.current_price.usd;
    } catch (error) {
      console.error("Failed to fetch Bitcoin price", error);
      return null;
    }
  }, []);

  const resetGame = useCallback(() => {
    setGameState('loading');
    setUserGuess(null);
    setFinalPrice(null);
    fetchBtcPrice().then(price => {
      setInitialPrice(price);
      setGameState('playing');
    });
  }, [fetchBtcPrice]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleGuess = (guess: 'up' | 'down') => {
    setUserGuess(guess);
    setGameState('loading');

    setTimeout(async () => {
      const newPrice = await fetchBtcPrice();
      if (newPrice && initialPrice) {
        setFinalPrice(newPrice);
        const priceWentUp = newPrice > initialPrice;
        if ((guess === 'up' && priceWentUp) || (guess === 'down' && !priceWentUp)) {
          setGameState('won');
        } else {
          setGameState('lost');
        }
      } else {
        // Handle error if price fetch fails
        resetGame();
      }
    }, 3000); // 3-second "flip" time
  };

  const getResultContent = () => {
    if (gameState === 'won') {
      return { title: "You Won!", variant: 'default', description: `The price went from $${initialPrice?.toLocaleString()} to $${finalPrice?.toLocaleString()}.` };
    }
    if (gameState === 'lost') {
      return { title: "You Lost!", variant: 'destructive', description: `The price went from $${initialPrice?.toLocaleString()} to $${finalPrice?.toLocaleString()}.` };
    }
    return null;
  };

  const result = getResultContent();

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Gamepad2 className="h-8 w-8" />
        <h1 className="text-3xl font-headline font-bold">Crypto Arcade</h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Coins className="h-6 w-6 text-primary" />
              <CardTitle>Crypto Flip</CardTitle>
            </div>
            <CardDescription>Guess if the price of Bitcoin will go up or down in the next 3 seconds. Test your market instincts!</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            {result ? (
               <Alert variant={result.variant} className="text-center">
                 <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                 <AlertDescription>{result.description}</AlertDescription>
               </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">BTC</p>
                <p className="text-lg text-muted-foreground">
                  {initialPrice ? `Current Price: $${initialPrice.toLocaleString()}` : <Loader2 className="animate-spin" />}
                </p>
              </>
            )}


            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" className="bg-green-500 hover:bg-green-600" onClick={() => handleGuess('up')} disabled={!initialPrice}>Up</Button>
                <Button size="lg" className="bg-red-500 hover:bg-red-600" onClick={() => handleGuess('down')} disabled={!initialPrice}>Down</Button>
              </div>
            )}
            {gameState === 'loading' && userGuess && (
                <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    <p className="text-muted-foreground">Flipping the coin... you guessed <span className={cn(userGuess === 'up' ? 'text-green-500' : 'text-red-500', "font-bold")}>{userGuess}</span>!</p>
                </div>
            )}
            {(gameState === 'won' || gameState === 'lost') && (
                <Button size="lg" variant="outline" onClick={resetGame}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Play Again
                </Button>
            )}

          </CardContent>
        </Card>
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>More Games Coming Soon!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">We're building more fun, crypto-themed games for you to enjoy.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
