
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  title: 'AstraPulse: Crypto Arcade',
  description: 'Real-time crypto data, smart risk-tier recommendations, and a free arcade of fake-coin games.',
};

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
      </head>
      <body className={cn("font-body antialiased", "bg-background text-foreground")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
