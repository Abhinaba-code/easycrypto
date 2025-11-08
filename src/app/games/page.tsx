import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";

export default function ArcadePage() {
  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Gamepad2 className="h-8 w-8" />
        <h1 className="text-3xl font-headline font-bold">Crypto Arcade</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Get ready for some fun, crypto-themed games where you can test your knowledge and instincts with fake coins. This section is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
