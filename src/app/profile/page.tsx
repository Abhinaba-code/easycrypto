import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Shield, Activity } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="text-3xl">Your Name</CardTitle>
              <CardDescription>Joined May 2024</CardDescription>
            </div>
            <Button variant="outline">Edit Profile</Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activity">
                <Activity className="mr-2 h-4 w-4" /> Activity
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" /> Security
              </TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="py-6">
               <h3 className="text-lg font-medium mb-4">Recent Game History</h3>
               <p className="text-muted-foreground">No game activity yet. Go play some games in the Arcade!</p>
            </TabsContent>
            <TabsContent value="settings" className="py-6">
              <h3 className="text-lg font-medium mb-4">Account Settings</h3>
              <p className="text-muted-foreground">Manage your account preferences here. Section under construction.</p>
            </TabsContent>
            <TabsContent value="security" className="py-6">
              <h3 className="text-lg font-medium mb-4">Security & Privacy</h3>
              <p className="text-muted-foreground">Manage your security settings here. Section under construction.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
