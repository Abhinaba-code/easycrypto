
import { getCoinDetails } from '@/lib/coingecko';
import { getMarketChart } from '@/lib/coincap';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Globe, MessageCircle, Twitter, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CoinChart } from '@/components/coin-chart';

export default async function CoinDetailsPage({ params }: { params: { id: string } }) {
  const coin = await getCoinDetails(params.id);
  const initialChartData = await getMarketChart(params.id, 7);

  const formatCurrency = (amount?: number, currency: string = 'usd') => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount);
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

  const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M16.5 10c-.99 0-1.8.4-2.4 1-.6-.6-1.41-1-2.4-1-.99 0-1.8.4-2.4 1-.6-.6-1.41-1-2.4-1-1.4 0-2.5 1.1-2.5 2.5 0 1.15.75 2.1 1.75 2.4L6.5 18H8v-2.5c0-.28.22-.5.5-.5h7c.28 0 .5.22.5.5V18h1.5l.75-3.1c1-.3 1.75-1.25 1.75-2.4 0-1.4-1.1-2.5-2.5-2.5z" />
      <circle cx="8.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="15.5" cy="10.5" r=".5" fill="currentColor" />
    </svg>
  );

  return (
    <div className="container py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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
              <CoinChart coinId={params.id} initialData={initialChartData} />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {coin.description.en && (
                <div
                  className="prose dark:prose-invert text-muted-foreground max-w-none"
                  dangerouslySetInnerHTML={{ __html: coin.description.en }}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-sm">
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
              <SocialLink href={coin.links.subreddit_url} icon={<RedditIcon className="h-4 w-4" />} label="Reddit" />
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
