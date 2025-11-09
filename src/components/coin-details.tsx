'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Globe, MessageCircle, Twitter, TrendingUp, TrendingDown, AlertTriangle, Gamepad2, CreditCard, Copy, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CoinChart } from '@/components/coin-chart';
import type { NewsArticle, CoinDetails as CoinDetailsType, MarketChart } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const formatCurrency = (amount?: number, currency: string = 'usd') => {
  if (typeof amount !== 'number') return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
};

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
  );
};

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

interface CoinDetailsProps {
  coin: CoinDetailsType;
  initialChartData: MarketChart;
  news: NewsArticle[];
  isNewsConfigured: boolean;
}

export function CoinDetails({ coin, initialChartData, news, isNewsConfigured }: CoinDetailsProps) {
  const { toast } = useToast();
  const walletAddress = `0x1A2b3C4d5E6f7G8h9I0jK1L2m3N4o5P6q7R8s9T0`;
  const [buyStep, setBuyStep] = useState<'selectAmount' | 'showQr'>('selectAmount');
  const [selectedAmount, setSelectedAmount] = useState<number | string>(100);
  const [customAmount, setCustomAmount] = useState('');
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied!",
      description: "The wallet address has been copied to your clipboard.",
    });
  };

  const handleContinue = () => {
    let amount = selectedAmount;
    if (selectedAmount === 'custom') {
      const parsedCustom = parseFloat(customAmount);
      if (isNaN(parsedCustom) || parsedCustom <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid custom amount.' });
        return;
      }
      amount = parsedCustom;
    }
    setSelectedAmount(amount);
    setBuyStep('showQr');
  };
  
  const purchaseOptions = [
    { value: 100, label: '$100', discount: '5% bonus' },
    { value: 250, label: '$250', discount: '7% bonus' },
    { value: 500, label: '$500', discount: '10% bonus' },
    { value: 750, label: '$750', discount: '12% bonus' },
  ];

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
              <CoinChart coinId={coin.id} initialData={initialChartData} />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              {coin.description.en ? (
                <div
                  className="prose dark:prose-invert text-muted-foreground max-w-none"
                  dangerouslySetInnerHTML={{ __html: coin.description.en }}
                />
              ) : <p className="text-muted-foreground">No description available.</p>}
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
      
      <div className="grid md:grid-cols-2 gap-8 my-8">
        <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Gamepad2 className="h-6 w-6 text-primary" />
                <CardTitle>Earn Crypto</CardTitle>
              </div>
              <CardDescription>Play games in the Crypto Arcade to earn virtual rewards.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center">
              <p className="mb-4 text-muted-foreground">Test your luck and skill in the arcade!</p>
              <Button asChild size="lg">
                <Link href="/games">Go to Arcade</Link>
              </Button>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" />
                <CardTitle>Buy {coin.name}</CardTitle>
              </div>
              <CardDescription>Purchase {coin.symbol.toUpperCase()} directly through our partners.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center">
              <p className="mb-4 text-muted-foreground">Seamlessly add to your portfolio.</p>
              <Dialog onOpenChange={(open) => { if (!open) setBuyStep('selectAmount'); }}>
                <DialogTrigger asChild>
                  <Button size="lg">Buy Now</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                   <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {buyStep === 'showQr' && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setBuyStep('selectAmount')}>
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                      )}
                      Buy {coin.name} ({coin.symbol.toUpperCase()})
                    </DialogTitle>
                    <DialogDescription>
                      {buyStep === 'selectAmount'
                        ? 'Select an amount to purchase.'
                        : `Send ${formatCurrency(Number(selectedAmount))} to the address below.`}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {buyStep === 'selectAmount' ? (
                     <div className="py-4 space-y-6">
                        <RadioGroup defaultValue="100" className="grid grid-cols-2 gap-4" onValueChange={(val) => setSelectedAmount(val === 'custom' ? 'custom' : Number(val))}>
                          {purchaseOptions.map(opt => (
                            <Label key={opt.value} htmlFor={`amount-${opt.value}`} className="flex flex-col items-start gap-2 rounded-lg border p-3 hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors cursor-pointer">
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value={String(opt.value)} id={`amount-${opt.value}`} />
                                <span className="font-bold text-lg">{opt.label}</span>
                              </div>
                              <span className="text-xs text-green-500 ml-6">{opt.discount}</span>
                            </Label>
                          ))}
                          <Label htmlFor="amount-custom" className="flex flex-col items-start gap-2 rounded-lg border p-3 hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary transition-colors cursor-pointer col-span-2">
                             <div className="flex items-center gap-2">
                                <RadioGroupItem value="custom" id="amount-custom" />
                                <span className="font-bold text-lg">Custom Amount</span>
                              </div>
                              {selectedAmount === 'custom' && (
                                <Input 
                                  type="number" 
                                  placeholder="Enter amount" 
                                  className="mt-2"
                                  value={customAmount}
                                  onChange={(e) => setCustomAmount(e.target.value)}
                                  onClick={(e) => e.preventDefault()}
                                />
                              )}
                          </Label>
                        </RadioGroup>
                       <Button onClick={handleContinue} className="w-full">Continue</Button>
                      </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=bitcoin:${walletAddress}?amount=${selectedAmount}`}
                        alt="QR Code"
                        width={200}
                        height={200}
                        className="rounded-lg border p-2"
                      />
                      <div className="w-full space-y-2 pt-2">
                        <Label htmlFor="wallet-address" className="text-left">Payment Address</Label>
                        <div className="relative">
                          <Input
                            id="wallet-address"
                            value={walletAddress}
                            readOnly
                            className="pr-10 text-muted-foreground font-mono text-sm"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                            onClick={copyToClipboard}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
        </Card>
      </div>

      {!isNewsConfigured && (
         <Alert variant="default" className="my-8 container">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>News Feature Not Configured</AlertTitle>
            <AlertDescription>
              To see the latest news for this coin, you need to add a free API key from CryptoCompare.
              <ol className="list-decimal list-inside mt-2">
                <li>Get your key from <a href="https://www.cryptocompare.com/cryptopian/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">CryptoCompare</a>.</li>
                <li>Create a file named <code>.env</code> in the project root.</li>
                <li>Add this line to it: <code>CRYPTOCOMPARE_API_KEY=your_api_key_here</code></li>
              </ol>
            </AlertDescription>
          </Alert>
      )}

      {isNewsConfigured && news && news.length > 0 && (
        <div className="py-12">
          <h2 className="text-2xl font-headline font-bold text-center mb-8">Latest News</h2>
          <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {news.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
