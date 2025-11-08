import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-headline font-bold mb-8">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This is where you can see an overview of your portfolio, watchlisted coins, and more. This page is currently under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
