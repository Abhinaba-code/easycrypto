
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Loader2, ChevronsLeft, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type GameState = 'playing' | 'loading' | 'won' | 'lost';
type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

export default function BitcoinPokerPage() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [result, setResult] = useState<GameResult>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleBitcoinPoker = () => {
    setGameState('loading');
    setResult(null);
    setTimeout(() => {
      const hands = ["Royal Flush", "Straight Flush", "Four of a Kind", "Full House", "Flush", "Straight", "Three of a Kind", "Two Pair", "One Pair", "High Card"];
      const yourHand = hands[Math.floor(Math.random() * hands.length)];
      const opponentHand = hands[Math.floor(Math.random() * hands.length)];
      const yourHandIndex = hands.indexOf(yourHand);
      const opponentHandIndex = hands.indexOf(opponentHand);

      if (yourHandIndex < opponentHandIndex) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `Your ${yourHand} beats their ${opponentHand}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `Their ${opponentHand} beats your ${yourHand}.` });
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
          <p className="text-lg text-muted-foreground">Log in to play Bitcoin Poker!</p>
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
            <p className="text-2xl font-bold">Best Hand Wins!</p>
            <p className="text-muted-foreground">Click deal to see your hand.</p>
            <Button size="lg" onClick={handleBitcoinPoker}>Deal</Button>
        </div>
    )
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline">Bitcoin Poker</CardTitle>
          <CardDescription>Get the best hand to win the pot. Test your poker face!</CardDescription>
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
