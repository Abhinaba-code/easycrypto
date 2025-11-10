
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Loader2, ChevronsLeft, LogIn } from 'lucide-react';
import { getCoinDetails } from '@/lib/coingecko';
import { useAuth } from '@/context/auth-context';

export default function CryptoFlipPage() {
  const [initialPrice, setInitialPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();

  const fetchBtcPrice = useCallback(async () => {
    setLoading(true);
    try {
      const btc = await getCoinDetails('bitcoin');
      setInitialPrice(btc.market_data.current_price.usd);
    } catch (error) {
      console.error("Failed to fetch Bitcoin price", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchBtcPrice();
    }
  }, [user, fetchBtcPrice]);

  const handleCryptoFlipGuess = (guess: 'up' | 'down') => {
    if (!initialPrice) return;
    router.push(`/games/crypto-flip/${guess}?price=${initialPrice}`);
  };
  
  const renderGameContent = () => {
    if (!user) {
        return (
            <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">Log in to play Crypto Flip!</p>
                <Button size="lg" onClick={() => router.push('/login')}>
                    <LogIn className="mr-2" />
                    Login to Play
                </Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center space-y-2">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
                <p className="text-muted-foreground">Loading Game...</p>
            </div>
        )
    }

    return (
        <div className="text-center space-y-4">
            <p className="text-4xl font-bold">BTC</p>
            <p className="text-lg text-muted-foreground">
                Current Price: ${initialPrice?.toLocaleString()}
            </p>

            <div className="flex gap-4 justify-center">
                <Button size="lg" className="bg-green-500 hover:bg-green-600" onClick={() => handleCryptoFlipGuess('up')} disabled={!initialPrice}>Up</Button>
                <Button size="lg" className="bg-red-500 hover:bg-red-600" onClick={() => handleCryptoFlipGuess('down')} disabled={!initialPrice}>Down</Button>
            </div>
        </div>
    );
  };


  return (
    <div className="container py-12 flex flex-col items-center gap-8">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                    <Coins className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-4xl font-headline">Crypto Flip</CardTitle>
                <CardDescription>Guess if Bitcoin's price will rise or fall in the next 3 seconds.</CardDescription>
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
