import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function TrendingPage() {
  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <TrendingUp className="h-8 w-8" />
        <h1 className="text-3xl font-headline font-bold">Trending Coins</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will display the top 7 trending cryptocurrencies on CoinGecko. This section is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
