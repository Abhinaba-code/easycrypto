
import { getNews } from '@/lib/cryptocompare';
import type { NewsArticle } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const NewsCard = ({ article }: { article: NewsArticle }) => (
  <Card className="overflow-hidden">
    <Image src={article.imageurl} alt={article.title} width={400} height={200} className="w-full h-32 object-cover" />
    <CardContent className="p-4">
      <h3 className="font-bold text-sm leading-snug mb-2 line-clamp-2">{article.title}</h3>
      <p className="text-xs text-muted-foreground mb-2">{article.source}</p>
      <Button variant="link" size="sm" asChild className="p-0 h-auto">
        <Link href={article.url} target="_blank" rel="noopener noreferrer">
          Read More <ExternalLink className="ml-1 h-3 w-3" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);


export async function NewsSection({ coinSymbol }: { coinSymbol?: string }) {
  const isNewsConfigured = !!process.env.CRYPTOCOMPARE_API_KEY;
  const news = isNewsConfigured ? await getNews(coinSymbol) : [];

  return (
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
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {news.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
        </div>
      ) : (
          <div className="container text-center text-muted-foreground">
            <p>Could not fetch news articles at this time.</p>
          </div>
      )}
    </div>
  );
}
