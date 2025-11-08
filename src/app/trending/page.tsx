
import { getTrendingCoins } from '@/lib/coingecko';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

export default async function TrendingPage() {
  const trendingCoins = await getTrendingCoins();

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <TrendingUp className="h-8 w-8" />
        <h1 className="text-3xl font-headline font-bold">Trending Coins</h1>
      </div>
      {trendingCoins.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {trendingCoins.map((coin) => (
                <li key={coin.item.id}>
                  <Link href={`/coin/${coin.item.id}`}>
                    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                      <Image src={coin.item.small} alt={coin.item.name} width={40} height={40} className="rounded-full" />
                      <div className="flex-1">
                        <div className="font-bold">{coin.item.name} <span className="text-sm text-muted-foreground">({coin.item.symbol})</span></div>
                        <p className="text-sm text-muted-foreground">Score: {coin.item.score}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${coin.item.price_btc.toFixed(8)} BTC</p>
                        <Badge variant="secondary">Rank: {coin.item.market_cap_rank}</Badge>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
         <Card>
          <CardHeader>
            <CardTitle>No Trending Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Could not fetch trending coins data at this moment. Please try again later.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
