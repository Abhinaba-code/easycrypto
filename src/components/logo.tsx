import Link from 'next/link';
import { Rocket } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Rocket className="h-6 w-6 text-primary" />
      <span className="font-bold font-headline text-lg text-primary-foreground">
        AstraPulse
      </span>
    </Link>
  );
}
