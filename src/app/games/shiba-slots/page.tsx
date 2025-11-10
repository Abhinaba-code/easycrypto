
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Asterisk, Loader2, ChevronsLeft, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type GameState = 'playing' | 'loading' | 'won' | 'lost';
type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

const slotSymbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎'];

export default function ShibaSlotsPage() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [result, setResult] = useState<GameResult>(null);
  const [slots, setSlots] = useState(['🍒', '🍋', '🍊']);
  const router = useRouter();
  const { user } = useAuth();

  const handleShibaSlots = () => {
    setGameState('loading');
    setResult(null);
    setTimeout(() => {
      const newSlots = [
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
        slotSymbols[Math.floor(Math.random() * slotSymbols.length)],
      ];
      setSlots(newSlots);

      if (newSlots[0] === newSlots[1] && newSlots[1] === newSlots[2]) {
        setGameState('won');
        setResult({ title: "Jackpot!", variant: 'default', description: `You got three ${newSlots[0]}s!` });
      } else {
        setGameState('lost');
        setResult({ title: "Try Again!", variant: 'destructive', description: "No win this time." });
      }
    }, 1500);
  };
  
  const resetGame = () => {
      setGameState('playing');
      setResult(null);
      setSlots(['🍒', '🍋', '🍊']);
  }

  const renderGameContent = () => {
    if (!user) {
      return (
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Log in to play Shiba Slots!</p>
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
           <div className="flex items-center justify-center gap-4 text-4xl p-4 bg-muted/50 rounded-lg">
                <span>{slots[0]}</span>
                <span>{slots[1]}</span>
                <span>{slots[2]}</span>
            </div>
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
            <div className="flex items-center justify-center gap-4 text-4xl p-4 bg-muted/50 rounded-lg">
                <span>{slots[0]}</span>
                <span>{slots[1]}</span>
                <span>{slots[2]}</span>
            </div>
            <Button size="lg" onClick={handleShibaSlots} className="mt-4">Spin</Button>
        </div>
    )
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Asterisk className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline">Shiba Slots</CardTitle>
          <CardDescription>Spin the slots. Can you get a jackpot?</CardDescription>
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
