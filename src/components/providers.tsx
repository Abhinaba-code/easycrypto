
'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme.mode);
  }, [theme]);
  
  return (
    <AuthProvider>
      <div className="relative flex min-h-dvh flex-col">
        <Header />
        <main className={cn("flex-1 animate-fade-in")}>
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
    </AuthProvider>
  );
}
