'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Mail, Bell, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/theme-context";
import { themes } from "@/lib/themes";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="container py-12">
      <div className="flex items-center gap-4 mb-8">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-headline font-bold">Settings</h1>
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the app. Select a theme below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {themes.map((t) => (
                <div key={t.name} className="space-y-2">
                   <Button
                    variant={"outline"}
                    className={cn(
                      "h-24 w-full justify-start p-4",
                      t.name === theme.name && "border-2 border-primary"
                    )}
                    onClick={() => setTheme(t.name)}
                  >
                    <div className="flex flex-col gap-2 w-full">
                       <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{t.name}</span>
                        {t.name === theme.name && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex gap-1">
                        <div className="h-8 flex-1 rounded" style={{ backgroundColor: `hsl(${t.colors.light.primary})` }} />
                        <div className="h-8 flex-1 rounded" style={{ backgroundColor: `hsl(${t.colors.light.accent})` }} />
                      </div>
                       <div className="flex gap-1">
                        <div className="h-8 flex-1 rounded" style={{ backgroundColor: `hsl(${t.colors.dark.primary})` }} />
                        <div className="h-8 flex-1 rounded" style={{ backgroundColor: `hsl(${t.colors.dark.accent})` }} />
                      </div>
                    </div>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <Mail />
                <span className="font-medium text-sm">Email Notifications</span>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <Bell />
                <span className="font-medium text-sm">Push Notifications</span>
              </div>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>
        
          <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">Change Password</Button>
            <Button variant="outline" className="w-full justify-start">Export My Data</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
