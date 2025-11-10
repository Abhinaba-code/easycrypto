
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { NewsSection } from "@/components/news-section";
import type { NewsArticle } from '@/lib/types';
import { getNews } from "@/lib/cryptocompare";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const nfts = [
  {
    id: 1,
    name: "CryptoPunk #7804",
    collection: "CryptoPunks",
    image: "https://picsum.photos/seed/101/400/400",
    hint: "pixel art",
  },
  {
    id: 2,
    name: "Bored Ape #8817",
    collection: "Bored Ape Yacht Club",
    image: "https://picsum.photos/seed/102/400/400",
    hint: "ape cartoon",
  },
  {
    id: 3,
    name: "Art Blocks #123",
    collection: "Art Blocks Curated",
    image: "https://picsum.photos/seed/103/400/400",
    hint: "generative art",
  },
  {
    id: 4,
    name: "Meebit #456",
    collection: "Meebits",
    image: "https://picsum.photos/seed/104/400/400",
    hint: "voxel character",
  },
  {
    id: 5,
    name: "Pudgy Penguin #789",
    collection: "Pudgy Penguins",
    image: "https://picsum.photos/seed/105/400/400",
    hint: "cute penguin",
  },
  {
    id: 6,
    name: "Azuki #321",
    collection: "Azuki",
    image: "https://picsum.photos/seed/106/400/400",
    hint: "anime character",
  },
   {
    id: 7,
    name: "Cool Cat #555",
    collection: "Cool Cats",
    image: "https://picsum.photos/seed/107/400/400",
    hint: "blue cat",
  },
  {
    id: 8,
    name: "Doodles #888",
    collection: "Doodles",
    image: "https://picsum.photos/seed/108/400/400",
    hint: "pastel drawing",
  },
];

export default async function NftPage() {
  const isNewsConfigured = !!process.env.CRYPTOCOMPARE_API_KEY;
  let news: NewsArticle[] = [];
  if (isNewsConfigured) {
    news = await getNews();
  }

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
              <div className="aspect-square bg-muted">
                 <Image 
                  src={nft.image} 
                  alt={nft.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  data-ai-hint={nft.hint}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{nft.name}</h3>
                <p className="text-sm text-muted-foreground">{nft.collection}</p>
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
