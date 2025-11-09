
import { getCoinDetails, getMarketChart } from '@/lib/coingecko';
import { getNews } from '@/lib/cryptocompare';
import { CoinDetails } from '@/components/coin-details';

export default async function CoinDetailsPage({ params }: { params: { id: string } }) {
  const coin = await getCoinDetails(params.id);
  const initialChartData = await getMarketChart(params.id, 7);
  const news = await getNews(coin.symbol);
  const isNewsConfigured = !!process.env.CRYPTOCOMPARE_API_KEY;

  return (
    <CoinDetails
      coin={coin}
      initialChartData={initialChartData}
      news={news}
      isNewsConfigured={isNewsConfigured}
    />
  );
}
