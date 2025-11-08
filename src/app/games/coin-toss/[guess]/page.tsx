
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ChevronsLeft, Circle, HelpCircle } from 'lucide-react';

function CoinTossResultPage() {
  const params = useParams();
  const router = useRouter();

  const userGuess = params.guess as 'heads' | 'tails';
  
  const [gameState, setGameState] = useState<'loading' | 'finished'>('loading');
  const [result, setResult] = useState<'win' | 'loss' | null>(null);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);

  useEffect(() => {
    if (userGuess !== 'heads' && userGuess !== 'tails') {
      router.push('/games'); // Redirect if guess is invalid
      return;
    }

    const timer = setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setCoinResult(outcome);

      if (userGuess === outcome) {
        setResult('win');
      } else {
        setResult('loss');
      }
      setGameState('finished');
    }, 2000); // 2-second delay for suspense

    return () => clearTimeout(timer);
  }, [userGuess, router]);

  const renderResult = () => {
    if (gameState !== 'finished' || result === null || coinResult === null) return null;

    const isWin = result === 'win';

    return (
      <Alert variant={isWin ? 'default' : 'destructive'} className="text-center">
        <AlertTitle className="text-2xl font-bold">{isWin ? 'You Won!' : 'You Lost!'}</AlertTitle>
        <AlertDescription className="text-base mt-2">
          You guessed <span className="font-bold capitalize">{userGuess}</span>.
          <p className="my-2">The coin landed on...</p>
          <div className="flex justify-center items-center gap-2 text-3xl font-bold capitalize my-4">
             {coinResult === 'heads' ? <Circle className="h-8 w-8" /> : <HelpCircle className="h-8 w-8" />}
             {coinResult}
          </div>
        </AlertDescription>
      </Alert>
    );
  };
  
  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline">Coin Toss</CardTitle>
          <p className="text-muted-foreground">You guessed the coin would land on <span className="font-bold text-primary capitalize">{userGuess}</span>.</p>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full flex items-center justify-center">
            {gameState === 'loading' ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-lg">Flipping the coin...</p>
                </div>
            ) : (
                <div className="w-full">
                    {renderResult()}
                </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Button variant="outline" onClick={() => router.push('/games')}>
        <ChevronsLeft className="mr-2 h-4 w-4" />
        Back to Arcade
      </Button>
    </div>
  );
}

export default function CoinTossResultPageWrapper() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        }>
            <CoinTossResultPage />
        </Suspense>
    )
}
