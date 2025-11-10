
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, ChevronsLeft, LogIn } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function CoinTossPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleCoinTossGuess = (guess: 'heads' | 'tails') => {
    router.push(`/games/coin-toss/${guess}`);
  };

  return (
    <div className="container py-12 flex flex-col items-center gap-8">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                 <div className="flex justify-center mb-2">
                    <Coins className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-4xl font-headline">Coin Toss</CardTitle>
                <CardDescription>A classic fifty-fifty. Heads or Tails? You decide.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 min-h-[160px]">
                {!user ? (
                    <div className="text-center space-y-4">
                        <p className="text-lg text-muted-foreground">Log in to play Coin Toss!</p>
                        <Button size="lg" onClick={() => router.push('/login')}>
                            <LogIn className="mr-2" />
                            Login to Play
                        </Button>
                    </div>
                ) : (
                    <>
                        <p className="text-2xl font-bold">Heads or Tails?</p>
                        <p className="text-muted-foreground">Call it in the air!</p>
                        <div className="flex gap-4">
                            <Button size="lg" onClick={() => handleCoinTossGuess('heads')}>Heads</Button>
                            <Button size="lg" onClick={() => handleCoinTossGuess('tails')}>Tails</Button>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
        <Button variant="outline" onClick={() => router.push('/games')}>
            <ChevronsLeft className="mr-2 h-4 w-4" />
            Back to Arcade
        </Button>
    </div>
  );
}
