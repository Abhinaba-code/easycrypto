
import { LandingPage } from '@/components/landing-page';
import { getTopCoins } from '@/lib/coingecko';

export default async function Home() {
  const initialCoins = await getTopCoins();
  return <LandingPage initialCoins={initialCoins} />;
}
