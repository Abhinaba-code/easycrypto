
'use client';

import Link from 'next/link';
import {
  Menu,
  Settings,
  LogOut,
  User,
  CreditCard,
  LogIn,
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
import { useAuth } from '@/context/auth-context';

const navLinks = [
  { href: '/', label: 'Top Coins' },
  { href: '/trending', label: 'Trending' },
  { href: '/exchanges', label: 'Exchanges' },
  { href: '/nft', label: 'NFTs' },
  { href: '/defi', label: 'DeFi' },
];

const authNavLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/games', label: 'Arcade' },
];

export function Header() {
  const isMobile = useIsMobile();
  const [hasMounted, setHasMounted] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const allNavLinks = user ? [...navLinks, ...authNavLinks] : navLinks;
  const mobileNavLinks = user ? [...allNavLinks, { href: '/profile', label: 'Profile' }, { href: '/settings', label: 'Settings' }] : allNavLinks;

  const navContent = (links: typeof allNavLinks) => (
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
                 <div className="flex flex-col space-y-3 pt-6 border-t mt-6">
                  {!user ? (
                     <>
                      <Button variant={pathname === '/login' ? 'secondary' : 'ghost'} asChild className="justify-start">
                        <Link href="/login"><LogIn className="mr-2 h-4 w-4" />Login</Link>
                      </Button>
                      <Button variant={pathname === '/signup' ? 'secondary' : 'ghost'} asChild className="justify-start">
                        <Link href="/signup"><User className="mr-2 h-4 w-4" />Sign Up</Link>
                      </Button>
                    </>
                  ) : (
                     <Button variant='ghost' onClick={logout} className="justify-start">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            <nav className="flex items-center space-x-1 text-sm font-medium">
              {navContent(allNavLinks)}
            </nav>
            <div className="flex flex-1 items-center justify-end space-x-4">
              {!user ? (
                 <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/8.x/bottts/svg?seed=${user.email}`}
                          alt={user.name}
                        />
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
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
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
