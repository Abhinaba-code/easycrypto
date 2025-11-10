
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle, Loader2, ChevronsLeft, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type GameState = 'playing' | 'loading' | 'won' | 'lost';
type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

export default function DefiPuzzlePage() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [result, setResult] = useState<GameResult>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleDefiPuzzle = (isCorrect: boolean) => {
    setGameState('loading');
    setResult(null);
    setTimeout(() => {
      if(isCorrect) {
        setGameState('won');
        setResult({ title: "Correct!", variant: 'default', description: `You solved the puzzle!` });
      } else {
        setGameState('lost');
        setResult({ title: "Incorrect!", variant: 'destructive', description: "That's not the right answer. Try again." });
      }
    }, 1000);
  }
  
  const resetGame = () => {
      setGameState('playing');
      setResult(null);
  }

  const renderGameContent = () => {
    if (!user) {
      return (
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Log in to play the DeFi Puzzle!</p>
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
        <div className="w-full text-center space-y-4">
            <p className="text-muted-foreground">What does "TVL" stand for in DeFi?</p>
            <div className="flex flex-col gap-2 w-full mt-2">
                <Button variant="outline" onClick={() => handleDefiPuzzle(false)}>Total Value Lent</Button>
                <Button variant="outline" onClick={() => handleDefiPuzzle(true)}>Total Value Locked</Button>
                <Button variant="outline" onClick={() => handleDefiPuzzle(false)}>Total Volume Logged</Button>
            </div>
        </div>
    )
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Puzzle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline">DeFi Puzzle</CardTitle>
          <CardDescription>Solve the puzzle to unlock DeFi secrets.</CardDescription>
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
