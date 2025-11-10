
import Link from 'next/link';

const EasyCryptoLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M15 9h-5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5" />
    <path d="M8 12h5" />
  </svg>
);


export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <EasyCryptoLogo className="h-6 w-6 text-primary" />
      <span className="font-bold font-headline text-lg">
        EasyCrypto
      </span>
    </Link>
  );
}
