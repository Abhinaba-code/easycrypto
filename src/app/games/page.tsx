'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, Coins, Loader2, RefreshCw, Wallet, PiggyBank, Car, Users, Bot, CircleDot, Asterisk, CandlestickChart, Rocket, Hand, Diamond, Clapperboard, Puzzle, Swords, Dice5, Target, Zap } from 'lucide-react';
import { getCoinDetails } from '@/lib/coingecko';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';


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


type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

interface GameCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  isActive?: boolean;
  gameType: 'crypto-flip' | 'coin-toss' | 'coming-soon';
}

const GameCard: React.FC<GameCardProps> = ({ title, icon, description, isActive = false, gameType }) => {
  const [gameState, setGameState] = useState<'playing' | 'loading' | 'won' | 'lost'>('playing');
  const [initialPrice, setInitialPrice] = useState<number | null>(null);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  const [userGuess, setUserGuess] = useState<string | null>(null);
  const [result, setResult] = useState<GameResult>(null);

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
    setGameState('playing');
    setUserGuess(null);
    setResult(null);
    if (gameType === 'crypto-flip') {
      setGameState('loading');
      fetchBtcPrice().then(price => {
        setInitialPrice(price);
        setGameState('playing');
      });
    }
  }, [fetchBtcPrice, gameType]);

  useEffect(() => {
    if (isActive) {
      resetGame();
    }
  }, [resetGame, isActive]);

  const handleCryptoFlipGuess = (guess: 'up' | 'down') => {
    setUserGuess(guess);
    setGameState('loading');
    setTimeout(async () => {
      const newPrice = await fetchBtcPrice();
      if (newPrice && initialPrice) {
        setFinalPrice(newPrice);
        const priceWentUp = newPrice > initialPrice;
        if ((guess === 'up' && priceWentUp) || (guess === 'down' && !priceWentUp)) {
          setGameState('won');
          setResult({ title: "You Won!", variant: 'default', description: `The price went from $${initialPrice?.toLocaleString()} to $${newPrice?.toLocaleString()}.` });
        } else {
          setGameState('lost');
          setResult({ title: "You Lost!", variant: 'destructive', description: `The price went from $${initialPrice?.toLocaleString()} to $${newPrice?.toLocaleString()}.` });
        }
      } else {
        resetGame();
      }
    }, 3000);
  };
  
  const handleCoinTossGuess = (guess: 'heads' | 'tails') => {
    setUserGuess(guess);
    setGameState('loading');
    setTimeout(() => {
      const coinResult = Math.random() > 0.5 ? 'heads' : 'tails';
      if (guess === coinResult) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `It was ${coinResult}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `It was ${coinResult}!` });
      }
    }, 1500);
  };


  if (!isActive) {
    return (
       <Dialog>
        <DialogTrigger asChild>
          <Card className="border-dashed flex flex-col justify-center items-center text-center hover:border-primary hover:shadow-lg transition-all cursor-pointer">
            <CardHeader>
              <div className="flex justify-center mb-2">{icon}</div>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title} - Coming Soon!</DialogTitle>
            <DialogDescription>
              This game is currently under development. Check back later to play!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const renderGameContent = () => {
    switch (gameType) {
      case 'crypto-flip':
        return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">BTC</p>
                <p className="text-lg text-muted-foreground">
                  {gameState === 'loading' && !userGuess ? <Loader2 className="animate-spin" /> : `Current Price: $${initialPrice?.toLocaleString()}`}
                </p>
              </>
            )}

            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" className="bg-green-500 hover:bg-green-600" onClick={() => handleCryptoFlipGuess('up')} disabled={!initialPrice}>Up</Button>
                <Button size="lg" className="bg-red-500 hover:bg-red-600" onClick={() => handleCryptoFlipGuess('down')} disabled={!initialPrice}>Down</Button>
              </div>
            )}
          </>
        );
      case 'coin-toss':
         return (
          <>
            {result ? (
              <Alert variant={result.variant} className="text-center">
                <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
                <AlertDescription>{result.description}</AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-4xl font-bold">Heads or Tails?</p>
                <p className="text-lg text-muted-foreground">
                  Call it in the air!
                </p>
              </>
            )}

            {gameState === 'playing' && (
              <div className="flex gap-4">
                <Button size="lg" onClick={() => handleCoinTossGuess('heads')}>Heads</Button>
                <Button size="lg" onClick={() => handleCoinTossGuess('tails')}>Tails</Button>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };


  return (
    <Card className="border-primary border-2 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 min-h-[160px]">
        {renderGameContent()}
        {gameState === 'loading' && userGuess && (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
             <p className="text-muted-foreground">Flipping... you guessed <span className="font-bold">{userGuess}</span>!</p>
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
  );
};

const games = [
    { title: "Crypto Flip", icon: <Coins className="h-6 w-6 text-primary" />, description: "Guess if Bitcoin's price will rise or fall in the next 3 seconds.", gameType: 'crypto-flip', isActive: true },
    { title: "Coin Toss", icon: <Coins className="h-8 w-8 text-muted-foreground" />, description: "A classic fifty-fifty. Heads or Tails? You decide.", gameType: 'coin-toss', isActive: true },
    { title: "Crypto Ludo", icon: <PiggyBank className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Ether Snake", icon: <SnakeIcon className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Crypto Racers", icon: <Car className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Bitcoin Poker", icon: <Users className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "AI Blackjack", icon: <Bot className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Doge Roulette", icon: <CircleDot className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Shiba Slots", icon: <Asterisk className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Futures Trading Sim", icon: <CandlestickChart className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "To The Moon Rocket", icon: <Rocket className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Crypto Hold'em", icon: <Hand className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Diamond Hands", icon: <Diamond className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "NFT Bingo", icon: <Clapperboard className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "DeFi Puzzle", icon: <Puzzle className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Chainlink Champions", icon: <Swords className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Ripple Dice", icon: <Dice5 className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Bullseye Bets", icon: <Target className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Token Tussle", icon: <Users className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
    { title: "Gas Fee Gamble", icon: <Zap className="h-8 w-8 text-muted-foreground" />, description: "A new crypto game. Click to learn more!", gameType: 'coming-soon' },
];


export default function ArcadePage() {
  
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
        {games.map(game => (
            <GameCard key={game.title} {...game} />
        ))}
      </div>
    </div>
  );
}
