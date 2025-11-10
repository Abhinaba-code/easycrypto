
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clapperboard, Loader2, ChevronsLeft, LogIn, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type GameState = 'playing' | 'loading' | 'won' | 'lost';
type GameResult = {
  title: string;
  variant: 'default' | 'destructive';
  description: string;
} | null;

const bingoSymbols = ['🐵', '🤖', '👽', '💀', '🎨'];

export default function NftBingoPage() {
  const [gameState, setGameState] = useState<GameState>('playing');
  const [result, setResult] = useState<GameResult>(null);
  const [bingoCard, setBingoCard] = useState<string[][]>([[],[],[]]);
  const [drawnSymbol, setDrawnSymbol] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  
  const resetGame = useCallback(() => {
    const newCard = Array(3).fill(0).map(() => 
        Array(3).fill(0).map(() => bingoSymbols[Math.floor(Math.random() * bingoSymbols.length)])
    );
    setBingoCard(newCard);
    setDrawnSymbol(null);
    setGameState('playing');
    setResult(null);
  }, []);
  
  useEffect(() => {
      if(user) {
          resetGame();
      }
  }, [user, resetGame]);

  const handleNftBingo = () => {
    setGameState('loading');
    setTimeout(() => {
      const newDrawnSymbol = bingoSymbols[Math.floor(Math.random() * bingoSymbols.length)];
      setDrawnSymbol(newDrawnSymbol);

      const newCard = bingoCard.map(row => row.map(cell => cell === newDrawnSymbol ? '✅' : cell));
      setBingoCard(newCard);

      // Check for win condition (any row, column, or diagonal of '✅')
      let hasWon = false;
      for(let i=0; i<3; i++) {
        if(newCard[i].every(c => c === '✅') || newCard.every(row => row[i] === '✅')) hasWon = true;
      }
      if((newCard[0][0] === '✅' && newCard[1][1] === '✅' && newCard[2][2] === '✅') || 
         (newCard[0][2] === '✅' && newCard[1][1] === '✅' && newCard[2][0] === '✅')) hasWon = true;
      
      if(hasWon) {
        setGameState('won');
        setResult({ title: "Bingo!", variant: 'default', description: `You completed a line!` });
      } else {
        setGameState('playing');
        setResult(null);
      }
    }, 1000);
  };
  

  const renderGameContent = () => {
    if (!user) {
      return (
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Log in to play NFT Bingo!</p>
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

    if (gameState === 'won') {
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
            <div className="flex flex-col items-center gap-2">
                <div className="grid grid-cols-3 gap-2 p-2 bg-muted/50 rounded-lg">
                  {bingoCard.flat().map((symbol, index) => (
                    <div key={index} className="flex items-center justify-center h-10 w-10 text-2xl rounded-md bg-background">
                      {symbol}
                    </div>
                  ))}
                </div>
                {drawnSymbol && <p className="text-sm text-muted-foreground">Drawn: <span className="text-2xl">{drawnSymbol}</span></p>}
            </div>
            <Button size="lg" onClick={handleNftBingo} className="mt-4">Draw NFT</Button>
        </div>
    )
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Clapperboard className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline">NFT Bingo</CardTitle>
          <CardDescription>Match three NFT icons in a row to win!</CardDescription>
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
