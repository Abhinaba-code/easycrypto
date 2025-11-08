
'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Source+Code+Pro:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
        <title>AstraPulse: Crypto Arcade</title>
        <meta name="description" content="Real-time crypto data, smart risk-tier recommendations, and a free arcade of fake-coin games." />
      </head>
      <body className={cn("font-body antialiased", "bg-background text-foreground")}>
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
