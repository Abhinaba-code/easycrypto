
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Car, ChevronsLeft, Flag, Trophy, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const carColors = [
  'text-red-500',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-purple-500',
];

const carNames = ["Your Car", "Blue Falcon", "Green Hornet", "Yellow Jacket", "Purple Phantom"];

export default function CryptoRacersPage() {
  const router = useRouter();
  const [carPositions, setCarPositions] = useState([0, 0, 0, 0, 0]);
  const [raceState, setRaceState] = useState<'idle' | 'racing' | 'finished'>('idle');
  const [winner, setWinner] = useState<number | null>(null);

  const startRace = useCallback(() => {
    setRaceState('racing');
    setWinner(null);
    setCarPositions([0, 0, 0, 0, 0]);

    const raceInterval = setInterval(() => {
      setCarPositions(prevPositions => {
        const newPositions = prevPositions.map(p => p + Math.random() * 3);
        const leader = newPositions.find(p => p >= 100);
        
        if (leader) {
          clearInterval(raceInterval);
          setRaceState('finished');
          const winnerIndex = newPositions.indexOf(leader);
          setWinner(winnerIndex);
        }
        
        return newPositions;
      });
    }, 100);
  }, []);

  const resetRace = () => {
    setRaceState('idle');
    setWinner(null);
    setCarPositions([0, 0, 0, 0, 0]);
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline">Crypto Racers</CardTitle>
          <CardDescription>Click "Start Race" and may the best car win!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20 relative overflow-hidden">
            {carPositions.map((position, index) => (
              <div key={index} className="relative w-full h-10 bg-muted rounded-full">
                <div 
                  className={cn("absolute top-0 left-0 h-10 flex items-center transition-all duration-100 ease-linear", carColors[index])}
                  style={{ transform: `translateX(calc(${Math.min(position, 100)}% - 40px))` }}
                >
                  <Car className="w-10 h-10" />
                </div>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">{carNames[index]}</span>
              </div>
            ))}
            <Flag className="absolute top-0 right-4 h-full w-8 text-muted-foreground" />
          </div>
          
          <div className="mt-6 flex flex-col items-center justify-center gap-4 min-h-[120px]">
            {raceState === 'idle' && (
              <Button size="lg" onClick={startRace}>Start Race</Button>
            )}
            {raceState === 'racing' && (
              <p className="text-lg text-primary animate-pulse font-medium">Race in progress...</p>
            )}
            {raceState === 'finished' && winner !== null && (
              <>
                <Alert variant={winner === 0 ? 'default' : 'destructive'} className="text-center">
                  {winner === 0 ? <Trophy className="mx-auto h-6 w-6 mb-2 text-yellow-500" /> : <XCircle className="mx-auto h-6 w-6 mb-2" />}
                  <AlertTitle className="text-2xl font-bold">
                    {winner === 0 ? "You Won!" : "You Lost!"}
                  </AlertTitle>
                  <AlertDescription>
                    {carNames[winner]} finished first!
                  </AlertDescription>
                </Alert>
                <Button onClick={resetRace}>Race Again</Button>
              </>
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

    