import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Coins } from "lucide-react";

export default function ArcadePage() {
  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Gamepad2 className="h-8 w-8" />
        <h1 className="text-3xl font-headline font-bold">Crypto Arcade</h1>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Coins className="h-6 w-6 text-primary" />
              <CardTitle>Crypto Flip</CardTitle>
            </div>
            <CardDescription>Guess if the coin will go up or down. Test your market instincts!</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <p className="text-4xl font-bold">BTC</p>
            <p className="text-lg text-muted-foreground">Current Price: $65,432.10</p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-green-500 hover:bg-green-600">Up</Button>
              <Button size="lg" className="bg-red-500 hover:bg-red-600">Down</Button>
            </div>
          </CardContent>
        </Card>
         <Card className="border-dashed">
          <CardHeader>
            <CardTitle>More Games Coming Soon!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">We're building more fun, crypto-themed games for you to enjoy.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
