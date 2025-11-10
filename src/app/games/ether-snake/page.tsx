
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronsLeft, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    <path d="M11.5 15.5c0 1.1.9 2-2s2-.9 2-2" />
    <path d="M5.5 15.5c0 1.1.9 2-2s2-.9 2-2" />
    <path d="M12 2v2" />
    <path d="M12 10v4" />
    <path d="M12 20v2" />
    <path d="M20 12h2" />
    <path d="M18 12h-4" />
    <path d="M6 12H2" />
    <path d="M10 12H8" />
  </svg>
);

type GameState = 'playing' | 'loading' | 'won' | 'lost';
type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

export default function EtherSnakePage() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [result, setResult] = useState<GameResult>(null);
  const router = useRouter();
  const { user } = useAuth();

  const handleSnakeGame = () => {
    setGameState('loading');
    setResult(null);
    setTimeout(() => {
      const length = Math.floor(Math.random() * 20) + 5;
      if (length > 15) {
        setGameState('won');
        setResult({ title: "You Won!", variant: 'default', description: `Your snake grew to ${length}!` });
      } else {
        setGameState('lost');
        setResult({ title: "You Lost!", variant: 'destructive', description: `Your snake only grew to ${length}. Try again!` });
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
          <p className="text-lg text-muted-foreground">Log in to play Ether Snake!</p>
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
            <p className="text-2xl font-bold">Grow your Snake!</p>
            <p className="text-muted-foreground">Click play to see how long it gets.</p>
            <Button size="lg" onClick={handleSnakeGame}>Play</Button>
        </div>
    )
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <SnakeIcon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline">Ether Snake</CardTitle>
          <CardDescription>Grow your snake by eating ether tokens.</CardDescription>
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
