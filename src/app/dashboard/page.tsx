import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Eye, Activity } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-headline font-bold mb-8">Your Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,345.67</div>
            <p className="text-xs text-muted-foreground">+2.1% from last day</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5 Coins</div>
            <p className="text-xs text-muted-foreground">BTC, ETH, SOL...</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Trades</div>
            <p className="text-xs text-muted-foreground">Last trade: 2 hours ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">A chart showing your portfolio breakdown will be here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Watchlist Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">A table with your watchlisted coins' performance will be here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
