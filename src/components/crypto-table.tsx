
'use client';
import Image from 'next/image';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Coin } from '@/lib/types';
import { SparklineChart } from './sparkline-chart';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { useRouter } from 'next/navigation';

interface CryptoTableProps {
  coins: Coin[];
  onRecommend: (coin: Coin) => void;
}

export function CryptoTable({ coins, onRecommend }: CryptoTableProps) {
  const router = useRouter();

  const handleRowClick = (coinId: string) => {
    router.push(`/coin/${coinId}`);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] text-center">#</TableHead>
            <TableHead>Coin</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h %</TableHead>
            <TableHead className="text-right hidden md:table-cell">24h High</TableHead>
            <TableHead className="text-right hidden md:table-cell">24h Low</TableHead>
            <TableHead className="text-right hidden lg:table-cell">Market Cap</TableHead>
            <TableHead className="text-right hidden lg:table-cell">Circulating Supply</TableHead>
            <TableHead className="text-center hidden sm:table-cell">Last 7 Days</TableHead>
            <TableHead className="w-[120px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coins.map((coin) => (
            <TableRow key={coin.id} onClick={() => handleRowClick(coin.id)} className="cursor-pointer">
              <TableCell className="text-center text-muted-foreground">{coin.market_cap_rank}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={coin.image}
                    alt={coin.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-bold">{coin.name}</div>
                    <div className="text-muted-foreground text-sm uppercase">{coin.symbol}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${coin.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </TableCell>
              <TableCell className={cn(
                "text-right font-medium",
                coin.price_change_percentage_24h != null && coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
              )}>
                {coin.price_change_percentage_24h != null ? `${coin.price_change_percentage_24h.toFixed(2)}%` : 'N/A'}
              </TableCell>
              <TableCell className="text-right hidden md:table-cell text-green-500">
                {coin.high_24h != null ? `$${coin.high_24h.toLocaleString()}`: 'N/A'}
              </TableCell>
              <TableCell className="text-right hidden md:table-cell text-red-500">
                {coin.low_24h != null ? `$${coin.low_24h.toLocaleString()}`: 'N/A'}
              </TableCell>
              <TableCell className="text-right hidden lg:table-cell">
                ${coin.market_cap.toLocaleString()}
              </TableCell>
               <TableCell className="text-right hidden lg:table-cell">
                {coin.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
              </TableCell>
              <TableCell className="w-[150px] h-[60px] hidden sm:table-cell">
                <SparklineChart 
                  data={coin.sparkline_in_7d.price} 
                  isPositive={coin.price_change_percentage_24h > 0} 
                />
              </TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={(e) => { e.stopPropagation(); onRecommend(coin); }}>Get Recs</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
