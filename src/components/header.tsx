'use client';

import Link from 'next/link';
import { Menu, Rocket } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Top Coins' },
  { href: '/trending', label: 'Trending' },
  { href: '/exchanges', label: 'Exchanges' },
  { href: '/nft', label: 'NFTs' },
  { href: '/defi', label: 'DeFi' },
];

export function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const navContent = (
    <>
      {navLinks.map((link) => (
        <Button
          key={link.href}
          variant={pathname === link.href ? 'secondary' : 'ghost'}
          asChild
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Logo />
        </div>

        {isMobile ? (
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <div className="mr-4 flex items-center">
                  <Logo />
                </div>
                <div className="flex flex-col space-y-3 pt-6">{navContent}</div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            <nav className="flex items-center space-x-2 text-sm font-medium">
              {navContent}
            </nav>
            <div className="flex flex-1 items-center justify-end space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
