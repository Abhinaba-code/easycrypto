
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, ChevronsLeft, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type GameState = 'playing' | 'finished' | 'won' | 'lost';
type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

export default function AiBlackjackPage() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [result, setResult] = useState<GameResult>(null);
  const [playerHand, setPlayerHand] = useState<number[]>([]);
  const [dealerHand, setDealerHand] = useState<number[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const router = useRouter();
  const { user } = useAuth();
  
  const calculateScore = (hand: number[]) => hand.reduce((a, b) => a + b, 0);

  const startGame = useCallback(() => {
    const newPlayerHand = [Math.floor(Math.random() * 10) + 2, Math.floor(Math.random() * 10) + 2];
    const newDealerHand = [Math.floor(Math.random() * 10) + 2, Math.floor(Math.random() * 10) + 2];
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setPlayerScore(calculateScore(newPlayerHand));
    setDealerScore(calculateScore(newDealerHand));
    setGameState('playing');
    setResult(null);
  }, []);

  useState(() => {
      if(user) {
          startGame();
      }
  });

  const handleHit = () => {
    const newCard = Math.floor(Math.random() * 10) + 2;
    const newHand = [...playerHand, newCard];
    const newScore = calculateScore(newHand);
    setPlayerHand(newHand);
    setPlayerScore(newScore);
    if (newScore > 21) {
      setGameState('lost');
      setResult({ title: "Bust!", variant: 'destructive', description: `You went over 21 with ${newScore}.` });
    }
  };

  const handleStand = () => {
    setGameState('finished');
    if (playerScore > dealerScore || dealerScore > 21) {
      setGameState('won');
      setResult({ title: "You Win!", variant: 'default', description: `Your ${playerScore} beats the dealer's ${dealerScore}.` });
    } else if (playerScore < dealerScore) {
      setGameState('lost');
      setResult({ title: "You Lose!", variant: 'destructive', description: `Dealer's ${dealerScore} beats your ${playerScore}.` });
    } else {
      setGameState('lost');
      setResult({ title: "Push!", variant: 'destructive', description: `You both have ${playerScore}.` });
    }
  };
  
  const resetGame = () => {
      startGame();
  }

  const renderGameContent = () => {
    if (!user) {
      return (
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Log in to play AI Blackjack!</p>
          <Button size="lg" onClick={() => router.push('/login')}>
            <LogIn className="mr-2" />
            Login to Play
          </Button>
        </div>
      );
    }
    
    if (gameState === 'won' || gameState === 'lost' || gameState === 'finished') {
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
            <div>
                <p className="text-sm text-muted-foreground">Dealer's Hand: {gameState === 'finished' ? dealerScore : '?'}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Your Hand: {playerScore}</p>
                <p className="text-xs">({playerHand.join(', ')})</p>
            </div>
            <div className="flex gap-4 justify-center mt-4">
                <Button size="lg" onClick={handleHit}>Hit</Button>
                <Button size="lg" onClick={handleStand}>Stand</Button>
            </div>
        </div>
    )
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Bot className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline">AI Blackjack</CardTitle>
          <CardDescription>Play against the AI dealer. Can you beat the house?</CardDescription>
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
