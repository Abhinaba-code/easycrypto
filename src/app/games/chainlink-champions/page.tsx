
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Swords, Loader2, ChevronsLeft, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type GameState = 'playing' | 'loading' | 'won' | 'lost';
type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

export default function ChainlinkChampionsPage() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [result, setResult] = useState<GameResult>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleChainlinkChampions = () => {
    setGameState('loading');
    setResult(null);
    setTimeout(() => {
      const yourAttack = Math.floor(Math.random() * 100) + 1;
      const opponentAttack = Math.floor(Math.random() * 100) + 1;
      if (yourAttack > opponentAttack) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `Your attack of ${yourAttack} beat the opponent's ${opponentAttack}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `Your opponent's attack of ${opponentAttack} beat your ${yourAttack}.` });
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
          <p className="text-lg text-muted-foreground">Log in to play Chainlink Champions!</p>
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
            <p className="text-2xl font-bold">Battle!</p>
            <p className="text-muted-foreground">Click 'Fight' to see who is stronger.</p>
            <Button size="lg" onClick={handleChainlinkChampions}>Fight</Button>
        </div>
    )
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Swords className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline">Chainlink Champions</CardTitle>
          <CardDescription>Battle other champions. Who will be victorious?</CardDescription>
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
