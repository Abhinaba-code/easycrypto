import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function DefiPage() {
  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <Briefcase className="h-8 w-8" />
        <h1 className="text-3xl font-headline font-bold">DeFi</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This page will display data about the decentralized finance (DeFi) market. This section is under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
