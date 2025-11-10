
import { getTrendingCoins, getNews } from '@/lib/coingecko';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { NewsSection } from '@/components/news-section';
import type { NewsArticle } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default async function TrendingPage() {
  const trendingCoins = await getTrendingCoins();
  const isNewsConfigured = !!process.env.CRYPTOCOMPARE_API_KEY;
  let news: NewsArticle[] = [];
  if (isNewsConfigured) {
    news = await getNews();
  }

  return (
    <>
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
      <div className="py-12 border-t">
        <h2 className="text-2xl font-headline font-bold text-center mb-8">Latest News</h2>
        {!isNewsConfigured ? (
          <Alert variant="default" className="container max-w-4xl">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>News Feature Not Configured</AlertTitle>
              <AlertDescription>
                To see the latest news, you need to add a free API key from CryptoCompare.
                <ol className="list-decimal list-inside mt-2">
                  <li>Get your key from <a href="https://www.cryptocompare.com/cryptopian/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">CryptoCompare</a>.</li>
                  <li>Create a file named <code>.env</code> in the project root.</li>
                  <li>Add this line to it: <code>CRYPTOCOMPARE_API_KEY=your_api_key_here</code></li>
                </ol>
              </AlertDescription>
            </Alert>
        ) : news.length > 0 ? (
          <NewsSection news={news} />
        ): (
          <div className="container text-center text-muted-foreground">
            <p>Could not fetch news articles at this time.</p>
          </div>
        )}
      </div>
    </>
  );
}
