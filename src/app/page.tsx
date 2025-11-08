
import { LandingPage } from '@/components/landing-page';
import { getTopCoins } from '@/lib/coingecko';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const coins = await getTopCoins(page);

  return <LandingPage initialCoins={coins} currentPage={page} />;
}
