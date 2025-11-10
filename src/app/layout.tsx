
import type { Metadata } from 'next';
import { Inter, Source_Code_Pro, Space_Grotesk } from 'next/font/google';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-code',
});


export const metadata: Metadata = {
  title: 'EasyCrypto: Crypto Buy & Sell',
  description: 'Buy and sell cryptocurrencies with ease. Real-time data and a free arcade of games.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", inter.variable, spaceGrotesk.variable, sourceCodePro.variable)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
