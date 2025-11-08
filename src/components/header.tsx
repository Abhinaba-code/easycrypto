'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '@/components/logo';

const navLinks = [
  { href: '/', label: 'Top Coins' },
  { href: '/trending', label: 'Trending' },
  { href: '/exchanges', label: 'Exchanges' },
  { href: '/nft', label: 'NFTs' },
  { href: '/defi', label: 'DeFi' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/games', label: 'Arcade' },
];

const mobileNavLinks = [...navLinks, { href: '/profile', label: 'Profile' }];

export function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const navContent = (links: typeof navLinks) => (
    <>
      {links.map((link) => (
        <Button
          key={link.href}
          variant={pathname === link.href ? 'secondary' : 'ghost'}
          asChild
          className="justify-start"
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
                <div className="flex flex-col space-y-3 pt-6">
                  {navContent(mobileNavLinks)}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            <nav className="flex items-center space-x-1 text-sm font-medium">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  asChild
                  size="sm"
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </nav>
            <div className="flex flex-1 items-center justify-end space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/profile">Profile</Link>
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
