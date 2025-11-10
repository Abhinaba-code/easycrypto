
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Diamond, ChevronsLeft, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type GameState = 'playing' | 'holding' | 'finished' | 'won' | 'lost';
type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

export default function DiamondHandsPage() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [result, setResult] = useState<GameResult>(null);
  const [holdTime, setHoldTime] = useState(0);
  const [holdInterval, setHoldInterval] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    return () => {
      if (holdInterval) clearInterval(holdInterval);
    };
  }, [holdInterval]);

  const startHolding = () => {
    if (gameState !== 'playing') return;
    setGameState('holding');
    setResult(null);
    setHoldTime(0);
    const interval = setInterval(() => {
      setHoldTime(prev => prev + 0.1);
    }, 100);
    setHoldInterval(interval);
  };

  const stopHolding = () => {
    if (!holdInterval) return;
    clearInterval(holdInterval);
    setHoldInterval(null);
    
    if (holdTime < 3) {
      setGameState('lost');
      setResult({ title: "Paper Hands!", variant: 'destructive', description: `You only held for ${holdTime.toFixed(1)} seconds. Try again!` });
    } else {
      const winnings = Math.floor(holdTime * 100);
      setGameState('won');
      setResult({ title: "Diamond Hands!", variant: 'default', description: `You held for ${holdTime.toFixed(1)} seconds and won $${winnings}!` });
    }
  };
  
  const resetGame = () => {
      setGameState('playing');
      setResult(null);
      setHoldTime(0);
  }

  const renderGameContent = () => {
    if (!user) {
      return (
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Log in to play Diamond Hands!</p>
          <Button size="lg" onClick={() => router.push('/login')}>
            <LogIn className="mr-2" />
            Login to Play
          </Button>
        </div>
      );
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
            <p className="text-4xl font-bold">
                {gameState === 'holding' ? `${holdTime.toFixed(1)}s` : "Hold!"}
            </p>
            <p className="text-lg text-muted-foreground">Hold the button to win.</p>
            <Button 
                size="lg" 
                onMouseDown={startHolding} 
                onMouseUp={stopHolding}
                onTouchStart={startHolding}
                onTouchEnd={stopHolding}
                disabled={gameState === 'holding'}
            >
                {gameState === 'holding' ? "Holding..." : "Hold On"}
            </Button>
        </div>
    )
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Diamond className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline">Diamond Hands</CardTitle>
          <CardDescription>Hold on for dear life! How long can you last?</CardDescription>
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
