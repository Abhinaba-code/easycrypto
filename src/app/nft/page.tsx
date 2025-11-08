import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

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

export default function NftPage() {
  return (
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
  );
}
