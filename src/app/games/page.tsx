'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Coins, Loader2, RefreshCw, Wallet, PiggyBank, Car, Users, Bot, CircleDot, Asterisk, CandlestickChart, Rocket, Hand, Diamond, Clapperboard, Puzzle, Swords, Dice5, Target, Zap } from 'lucide-react';
import { getCoinDetails } from '@/lib/coingecko';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

type GameState = 'playing' | 'loading' | 'won' | 'lost';

const SnakeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11.5 8.5c0-1.1.9-2 2-2s2 .9 2 2" />
    <path d="M11.5 15.5c0 1.1.9 2 2-2s2-.9 2-2" />
    <path d="M5.5 15.5c0 1.1.9 2 2-2s2-.9 2-2" />
    <path d="M12 2v2" />
    <path d="M12 10v4" />
    <path d="M12 20v2" />
    <path d="M20 12h2" />
    <path d="M18 12h-4" />
    <path d="M6 12H2" />
    <path d="M10 12H8" />
  </svg>
);


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
      return { title: "You Won!", variant: 'default' as const, description: `The price went from $${initialPrice?.toLocaleString()} to $${finalPrice?.toLocaleString()}.` };
    }
    if (gameState === 'lost') {
      return { title: "You Lost!", variant: 'destructive' as const, description: `The price went from $${initialPrice?.toLocaleString()} to $${finalPrice?.toLocaleString()}.` };
    }
    return null;
  };

  const result = getResultContent();

  const ComingSoonCard = ({ title, icon }: { title: string, icon: React.ReactNode }) => (
    <Card className="border-dashed flex flex-col justify-center items-center text-center">
      <CardHeader>
        <div className="flex justify-center mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">A new crypto game. Coming soon!</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Gamepad2 className="h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">Crypto Arcade</h1>
        </div>
        <Card className="w-full sm:w-auto">
          <CardHeader className="flex flex-row items-center gap-4 p-4">
            <Wallet className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-sm font-medium leading-none">Virtual Wallet</CardTitle>
              <p className="text-2xl font-bold">$1,000</p>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
        
        <ComingSoonCard title="Crypto Ludo" icon={<PiggyBank className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Ether Snake" icon={<SnakeIcon className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Crypto Racers" icon={<Car className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Bitcoin Poker" icon={<Users className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="AI Blackjack" icon={<Bot className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Doge Roulette" icon={<CircleDot className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Shiba Slots" icon={<Asterisk className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Futures Trading Sim" icon={<CandlestickChart className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="To The Moon Rocket" icon={<Rocket className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Crypto Hold'em" icon={<Hand className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Diamond Hands" icon={<Diamond className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="NFT Bingo" icon={<Clapperboard className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="DeFi Puzzle" icon={<Puzzle className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Chainlink Champions" icon={<Swords className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Ripple Dice" icon={<Dice5 className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Coin Toss" icon={<Coins className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Bullseye Bets" icon={<Target className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Token Tussle" icon={<Users className="h-8 w-8 text-muted-foreground" />} />
        <ComingSoonCard title="Gas Fee Gamble" icon={<Zap className="h-8 w-8 text-muted-foreground" />} />

      </div>
    </div>
  );
}
