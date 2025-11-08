
import { getCoinDetails } from '@/lib/coingecko';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Github, Globe, MessageCircle, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function CoinDetailsPage({ params }: { params: { id: string } }) {
  const coin = await getCoinDetails(params.id);

  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(amount);
  }

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(2)}%`;
  }

  const SocialLink = ({ href, icon, label }: { href?: string; icon: React.ReactNode; label: string; }) => {
    if (!href) return null;
    return (
      <Button variant="outline" asChild className="w-full justify-start gap-2">
        <Link href={href} target="_blank">
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
                  <div className="text-4xl font-bold mt-2">
                    {formatCurrency(coin.market_data.current_price.usd)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-bold mb-4">Description</h3>
              <div
                className="prose dark:prose-invert text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: coin.description.en }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-bold">{formatCurrency(coin.market_data.market_cap.usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap Rank</span>
                <Badge>#{coin.market_cap_rank}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Volume</span>
                <span className="font-bold">{formatCurrency(coin.market_data.total_volume.usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Circulating Supply</span>
                <span className="font-bold">{coin.market_data.circulating_supply.toLocaleString()}</span>
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
              <SocialLink href={coin.links.twitter_screen_name ? `https://twitter.com/${coin.links.twitter_screen_name}` : undefined} icon={<Twitter />} label="Twitter" />
              <SocialLink href={coin.links.chat_url[0]} icon={<MessageCircle />} label="Chat" />
              <SocialLink href={coin.links.repos_url.github[0]} icon={<Github />} label="Github" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
