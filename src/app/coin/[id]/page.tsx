
import { getCoinDetails } from '@/lib/coingecko';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Github, Globe, MessageCircle, Twitter, TrendingUp, TrendingDown, Clock, BarChart, Reddit } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function CoinDetailsPage({ params }: { params: { id: string } }) {
  const coin = await getCoinDetails(params.id);

  const formatCurrency = (amount?: number, currency: string = 'usd') => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount);
  }

  const formatPercentage = (percentage?: number) => {
    if (typeof percentage !== 'number') return 'N/A';
    return `${percentage.toFixed(2)}%`;
  }
  
  const Percentage = ({ value }: { value?: number }) => {
    if (typeof value !== 'number') {
      return <span className="text-muted-foreground">N/A</span>;
    }
    const isPositive = value > 0;
    return (
      <span className={cn(isPositive ? 'text-green-500' : 'text-red-500', 'font-medium flex items-center')}>
        {isPositive ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
        {value.toFixed(2)}%
      </span>
    );
  };

  const SocialLink = ({ href, icon, label }: { href?: string; icon: React.ReactNode; label: string; }) => {
    if (!href) return null;
    return (
      <Button variant="outline" asChild className="w-full justify-start gap-2">
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {icon} {label}
        </Link>
      </Button>
    )
  }

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                {coin.image && <Image src={coin.image} alt={coin.name} width={64} height={64} />}
                <div>
                  <CardTitle className="text-4xl font-headline">{coin.name} <span className="text-2xl text-muted-foreground uppercase">{coin.symbol}</span></CardTitle>
                  <div className="flex items-baseline gap-4 mt-2">
                    <div className="text-4xl font-bold">
                      {formatCurrency(coin.market_data.current_price.usd)}
                    </div>
                     <Percentage value={coin.market_data.price_change_percentage_24h} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {coin.description.en && (
                <>
                  <h3 className="text-xl font-bold mb-4">Description</h3>
                  <div
                    className="prose dark:prose-invert text-muted-foreground max-w-none"
                    dangerouslySetInnerHTML={{ __html: coin.description.en }}
                  />
                </>
              )}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Price Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">24h</span>
                  <Percentage value={coin.market_data.price_change_percentage_24h} />
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">7d</span>
                  <Percentage value={coin.market_data.price_change_percentage_7d} />
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">30d</span>
                  <Percentage value={coin.market_data.price_change_percentage_30d} />
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-muted-foreground">1y</span>
                  <Percentage value={coin.market_data.price_change_percentage_1y} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-bold">{formatCurrency(coin.market_data.market_cap.usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap Rank</span>
                <Badge>#{coin.market_cap_rank}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h High</span>
                <span className="font-bold text-green-500">{formatCurrency(coin.market_data.high_24h.usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Low</span>
                <span className="font-bold text-red-500">{formatCurrency(coin.market_data.low_24h.usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Volume</span>
                <span className="font-bold">{formatCurrency(coin.market_data.total_volume.usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Circulating Supply</span>
                <span className="font-bold">{coin.market_data.circulating_supply?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Supply</span>
                <span className="font-bold">{coin.market_data.total_supply?.toLocaleString() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Max Supply</span>
                <span className="font-bold">{coin.market_data.max_supply?.toLocaleString() || '∞'}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <SocialLink href={coin.links.homepage[0]} icon={<Globe />} label="Website" />
              <SocialLink href={coin.links.blockchain_site[0]} icon={<ExternalLink />} label="Explorer" />
              <SocialLink href={coin.links.subreddit_url} icon={<Reddit />} label="Reddit" />
              <SocialLink href={coin.links.twitter_screen_name ? `https://twitter.com/${coin.links.twitter_screen_name}` : undefined} icon={<Twitter />} label="Twitter" />
              <SocialLink href={coin.links.chat_url.filter(c => c)[0]} icon={<MessageCircle />} label="Chat" />
              <SocialLink href={coin.links.repos_url.github[0]} icon={<Github />} label="Github" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
