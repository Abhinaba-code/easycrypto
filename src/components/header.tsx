'use client';

import Link from 'next/link';
import {
  Menu,
  Rocket,
  Settings,
  LogOut,
  User,
  CreditCard,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '@/components/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/', label: 'Top Coins' },
  { href: '/trending', label: 'Trending' },
  { href: '/exchanges', label: 'Exchanges' },
  { href: '/nft', label: 'NFTs' },
  { href: '/defi', label: 'DeFi' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/games', label: 'Arcade' },
];

const mobileNavLinks = [...navLinks, { href: '/profile', label: 'Profile' }, { href: '/settings', label: 'Settings' }];

export function Header() {
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
  
  if (!hasMounted) {
    return (
       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <Logo />
          </div>
        </div>
      </header>
    )
  }

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
            <div className="flex flex-1 items-center justify-end space-x-4">
              <Button asChild>
                <Link href="#">Sign Up</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Your Name
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        your.name@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
