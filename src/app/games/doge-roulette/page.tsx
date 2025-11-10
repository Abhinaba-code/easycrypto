
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CircleDot, Loader2, ChevronsLeft, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type GameState = 'playing' | 'loading' | 'won' | 'lost';
type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

export default function DogeRoulettePage() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [result, setResult] = useState<GameResult>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleDogeRoulette = (bet: 'red' | 'black') => {
    setGameState('loading');
    setResult(null);
    setTimeout(() => {
      const winningNumber = Math.floor(Math.random() * 37); // 0-36
      const winningColor = winningNumber === 0 ? 'green' : (winningNumber % 2 === 0 ? 'black' : 'red');

      if (bet === winningColor) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `The ball landed on ${winningNumber} (${winningColor}). You chose ${bet}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `The ball landed on ${winningNumber} (${winningColor}). You chose ${bet}.` });
      }
    }, 1500);
  };
  
  const resetGame = () => {
      setGameState('playing');
      setResult(null);
  }

  const renderGameContent = () => {
    if (!user) {
      return (
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Log in to play Doge Roulette!</p>
          <Button size="lg" onClick={() => router.push('/login')}>
            <LogIn className="mr-2" />
            Login to Play
          </Button>
        </div>
      );
    }
    
    if(gameState === 'loading') {
        return <Loader2 className="animate-spin h-8 w-8 text-primary" />;
    }

    if (gameState === 'won' || gameState === 'lost') {
      return (
        <div className="text-center space-y-4">
          {result && (
            <Alert variant={result.variant} className="text-center">
              <AlertTitle className="text-xl font-bold">{result.title}</AlertTitle>
              <AlertDescription>{result.description}</AlertDescription>
            </Alert>
          )}
          <Button size="lg" variant="outline" onClick={resetGame}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </div>
      );
    }
    
    return (
        <div className="text-center space-y-4">
            <p className="text-2xl font-bold">Red or Black?</p>
            <p className="text-muted-foreground">Place your bet!</p>
            <div className="flex gap-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700" onClick={() => handleDogeRoulette('red')}>Red</Button>
                <Button size="lg" className="bg-black text-white hover:bg-gray-800" onClick={() => handleDogeRoulette('black')}>Black</Button>
            </div>
        </div>
    )
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <CircleDot className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline">Doge Roulette</CardTitle>
          <CardDescription>Bet on your lucky number. Will it be red or black?</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 min-h-[160px]">
          {renderGameContent()}
        </CardContent>
      </Card>
      <Button variant="outline" onClick={() => router.push('/games')}>
        <ChevronsLeft className="mr-2 h-4 w-4" />
        Back to Arcade
      </Button>
    </div>
  );
}
