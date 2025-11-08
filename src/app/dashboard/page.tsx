
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Eye, Activity, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

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
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <CardTitle>Earn Money</CardTitle>
            </div>
            <CardDescription>Play games in the Crypto Arcade to earn virtual rewards.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center p-6">
            <p className="mb-4 text-muted-foreground">Ready to test your luck and skill? Head to the arcade!</p>
            <Button asChild size="lg">
              <Link href="/games">Go to Arcade</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
