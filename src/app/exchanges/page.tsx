import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark } from "lucide-react";

export default function ExchangesPage() {
  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Landmark className="h-8 w-8" />
        <h1 className="text-3xl font-headline font-bold">Crypto Exchanges</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will display a list of top cryptocurrency exchanges. This section is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
