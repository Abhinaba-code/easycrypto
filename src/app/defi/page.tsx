
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Zap, Banknote } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { NewsSection } from "@/components/news-section";

const protocols = [
  { name: "Lido", tvl: "$30.5B", change: "+2.5%", category: "Liquid Staking", chain: "Ethereum" },
  { name: "EigenLayer", tvl: "$18.9B", change: "+1.8%", category: "Restaking", chain: "Ethereum" },
  { name: "Aave", tvl: "$11.8B", change: "-0.5%", category: "Lending", chain: "Multiple" },
  { name: "MakerDAO", tvl: "$7.9B", change: "+0.2%", category: "CDP", chain: "Ethereum" },
  { name: "Uniswap", tvl: "$6.2B", change: "+3.1%", category: "DEX", chain: "Multiple" },
];


export default function DefiPage() {
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
      <NewsSection />
    </>
  );
}
