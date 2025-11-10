

import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { NewsSection } from "@/components/news-section";
import type { NewsArticle, Nft } from '@/lib/types';
import { getNews } from "@/lib/cryptocompare";
import { getNfts } from "@/lib/coingecko";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function NftPage() {
  const isNewsConfigured = !!process.env.CRYPTOCOMPARE_API_KEY;
  let news: NewsArticle[] = [];
  if (isNewsConfigured) {
    news = await getNews();
  }
  const nfts: Nft[] = await getNfts();

  return (
    <>
      <div className="container py-12">
        <div className="flex items-center gap-4 mb-8">
          <ImageIcon className="h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">NFT Marketplace</h1>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <Card key={nft.id} className="overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center">
                 {nft.thumb ? (
                  <Image 
                    src={nft.thumb} 
                    alt={nft.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                 ) : (
                  <ImageIcon className="h-16 w-16 text-muted-foreground" />
                 )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg truncate">{nft.name}</h3>
                <p className="text-sm text-muted-foreground uppercase">{nft.symbol}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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
