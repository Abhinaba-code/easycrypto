
import type { NewsArticle } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

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

export function NewsSection({ news }: { news: NewsArticle[] }) {
  return (
    <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {news.map(article => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
