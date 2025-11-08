
import Image from 'next/image';
import Link from 'next/link';
import { getExchanges } from '@/lib/coingecko';
import type { Exchange } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Landmark } from 'lucide-react';

export default async function ExchangesPage() {
  const exchanges = await getExchanges();

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Landmark className="h-8 w-8" />
        <h1 className="text-3xl font-headline font-bold">Top Crypto Exchanges</h1>
      </div>
      {exchanges.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Rank</TableHead>
                  <TableHead>Exchange</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Trust Score</TableHead>
                  <TableHead className="text-right hidden md:table-cell">24h Trade Volume (BTC)</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Year Established</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchanges.map((exchange: Exchange) => (
                  <TableRow key={exchange.id}>
                    <TableCell className="text-center font-medium">{exchange.trust_score_rank}</TableCell>
                    <TableCell>
                      <Link href={exchange.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:underline">
                        <Image
                          src={exchange.image}
                          alt={exchange.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="font-bold">{exchange.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell">
                        <Badge variant={exchange.trust_score > 7 ? 'default' : (exchange.trust_score > 4 ? 'secondary' : 'destructive')}>{exchange.trust_score}</Badge>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell">{exchange.trade_volume_24h_btc.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                    <TableCell className="text-center text-muted-foreground hidden lg:table-cell">{exchange.year_established || 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Exchange Data Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Could not fetch exchanges data at this moment. Please try again later.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
