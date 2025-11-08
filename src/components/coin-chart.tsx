
'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getMarketChart } from '@/lib/coingecko';
import type { MarketChart as MarketChartType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from './ui/skeleton';
import { format } from 'date-fns';

interface CoinChartProps {
  coinId: string;
  initialData: MarketChartType;
}

const timeRanges = [
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '1M', days: 30 },
  { label: '1Y', days: 365 },
];

export function CoinChart({ coinId, initialData }: CoinChartProps) {
  const [data, setData] = useState(initialData);
  const [days, setDays] = useState<number>(7);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (days === 7 && initialData) {
      setData(initialData);
      return;
    }
    
    setLoading(true);
    getMarketChart(coinId, days)
      .then(setData)
      .finally(() => setLoading(false));
  }, [coinId, days, initialData]);

  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  })}`;
  
  const formatDate = (value: number) => {
    if (days === 1) {
      return format(new Date(value), 'p');
    }
    return format(new Date(value), 'MMM d, yyyy');
  };

  const ChartTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-background border border-border p-2 rounded-lg shadow-lg text-sm">
          <p className="font-bold">{formatDate(label)}</p>
          {payload.map((p: any) => (
             <p key={p.dataKey} style={{ color: p.color }}>
              {`${p.name}: ${formatCurrency(p.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const Chart = ({ dataKey, name, color }: { dataKey: 'prices' | 'market_caps' | 'total_volumes', name: string, color: string }) => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data[dataKey]} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <defs>
          <linearGradient id={`color${name}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="0" 
          tickFormatter={formatDate}
          minTickGap={80}
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis 
          tickFormatter={formatCurrency}
          orientation="right"
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="1" name={name} stroke={color} fill={`url(#color${name})`} />
      </AreaChart>
    </ResponsiveContainer>
  );

  return (
    <div>
      <div className="flex justify-end gap-1 mb-4">
        {timeRanges.map(range => (
          <Button
            key={range.label}
            variant={days === range.days ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setDays(range.days)}
            disabled={loading}
          >
            {range.label}
          </Button>
        ))}
      </div>
      {loading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <Tabs defaultValue="price">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="market_cap">Market Cap</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
          </TabsList>
          <TabsContent value="price">
            <Chart dataKey="prices" name="Price" color="hsl(var(--primary))" />
          </TabsContent>
          <TabsContent value="market_cap">
             <Chart dataKey="market_caps" name="Market Cap" color="hsl(var(--accent))" />
          </TabsContent>
          <TabsContent value="volume">
             <Chart dataKey="total_volumes" name="Volume" color="hsl(var(--secondary-foreground))" />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
