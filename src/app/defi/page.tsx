
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Zap, Banknote, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { NewsSection } from "@/components/news-section";
import { getNews } from "@/lib/cryptocompare";
import type { NewsArticle } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const protocols = [
  { name: "Lido", tvl: "$30.5B", change: "+2.5%", category: "Liquid Staking", chain: "Ethereum" },
  { name: "EigenLayer", tvl: "$18.9B", change: "+1.8%", category: "Restaking", chain: "Ethereum" },
  { name: "Aave", tvl: "$11.8B", change: "-0.5%", category: "Lending", chain: "Multiple" },
  { name: "MakerDAO", tvl: "$7.9B", change: "+0.2%", category: "CDP", chain: "Ethereum" },
  { name: "Uniswap", tvl: "$6.2B", change: "+3.1%", category: "DEX", chain: "Multiple" },
];


export default async function DefiPage() {
  const isNewsConfigured = !!process.env.CRYPTOCOMPARE_API_KEY;
  let news: NewsArticle[] = [];
  if (isNewsConfigured) {
    news = await getNews();
  }
  
  return (
    <>
      <div className="container py-12 space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <Briefcase className="h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">DeFi Overview</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Value Locked (TVL)
              </CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$105.7B</div>
              <p className="text-xs text-muted-foreground">
                +1.2% from last day
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Protocol
              </CardTitle>
               <Image src="https://icons.llamao.fi/lido.png" alt="Lido" width={16} height={16} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Lido</div>
              <p className="text-xs text-muted-foreground">
                $30.5B TVL
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Dominance</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Liquid Staking</div>
              <p className="text-xs text-muted-foreground">35.8% of DeFi TVL</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Top DeFi Protocols</CardTitle>
            <CardDescription>The largest protocols by Total Value Locked (TVL).</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">TVL</TableHead>
                  <TableHead className="text-right">1-Day Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {protocols.map((protocol) => (
                  <TableRow key={protocol.name}>
                    <TableCell className="font-medium">{protocol.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{protocol.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{protocol.tvl}</TableCell>
                    <TableCell className={`text-right ${protocol.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {protocol.change}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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
