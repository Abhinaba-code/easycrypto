
import { LandingPage } from '@/components/landing-page';
import { getTopCoins } from '@/lib/coincap';

export default async function Home() {
  const initialCoins = await getTopCoins();
  return <LandingPage initialCoins={initialCoins} />;
}
