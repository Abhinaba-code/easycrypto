import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-headline font-bold mb-8">User Profile</h1>
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <CardTitle>Your Name</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">This is your profile page. You'll be able to manage your account settings, view your game history, and customize your experience here. This page is currently under construction.</p>
            <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
