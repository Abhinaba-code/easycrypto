
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Shield, User, LogIn } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    login(values.name, values.email);
    toast({
      title: "Profile Updated",
      description: "Your details have been successfully updated.",
    });
    setIsDialogOpen(false); 
  };
  
  if (!user) {
    return (
        <div className="container py-12 flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-2xl font-bold">Please Log In</h2>
            <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
            <Button onClick={() => router.push('/login')}>
                <LogIn className="mr-2" />
                Go to Login
            </Button>
        </div>
    )
  }

  const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
        <User className="h-8 w-8" />
        <h1 className="text-3xl font-headline font-bold">Your Profile</h1>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.email}`} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="text-3xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <CardDescription className="mt-1">Joined May 2024</CardDescription>
            </div>
             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Your Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity">
                <Activity className="mr-2 h-4 w-4" /> Activity
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" /> Security
              </TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="py-6">
               <h3 className="text-lg font-medium mb-4">Recent Game History</h3>
               <p className="text-muted-foreground">No game activity yet. Go play some games in the Arcade!</p>
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
