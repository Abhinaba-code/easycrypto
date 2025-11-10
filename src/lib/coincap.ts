
import type { Coin, CoinCapAsset, MarketChart } from '@/lib/types';

const API_BASE_URL = 'https://api.coincap.io/v2';

interface ApiResponse<T> {
  data: T;
  timestamp: number;
}

async function fetchAPI<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`Failed to fetch from CoinCap: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from CoinCap:', error);
    throw error;
  }
}

function transformCoinData(asset: CoinCapAsset): Coin {
  return {
    id: asset.id,
    symbol: asset.symbol.toLowerCase(),
    name: asset.name,
    image: `https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`,
    current_price: parseFloat(asset.priceUsd),
    market_cap: parseFloat(asset.marketCapUsd),
    market_cap_rank: parseInt(asset.rank, 10),
    fully_diluted_valuation: null,
    total_volume: parseFloat(asset.volumeUsd24Hr),
    high_24h: null, // Not available in this endpoint
    low_24h: null, // Not available in this endpoint
    price_change_24h: 0, // Not available directly
    price_change_percentage_24h: parseFloat(asset.changePercent24Hr),
    market_cap_change_24h: 0, // Not available directly
    market_cap_change_percentage_24h: 0, // Not available directly
    circulating_supply: parseFloat(asset.supply),
    total_supply: parseFloat(asset.maxSupply || asset.supply),
    max_supply: asset.maxSupply ? parseFloat(asset.maxSupply) : null,
    ath: 0,
    ath_change_percentage: 0,
    ath_date: '',
    atl: 0,
    atl_change_percentage: 0,
    atl_date: '',
    roi: null,
    last_updated: '',
    // This API doesn't provide sparkline data in the main endpoint
    sparkline_in_7d: {
      price: [],
    },
    price_change_percentage_24h_in_currency: parseFloat(asset.changePercent24Hr),
  };
}

export async function getTopCoins(): Promise<Coin[]> {
  try {
    const { data } = await fetchAPI<CoinCapAsset[]>('/assets?limit=50');
    
    const coins = data.map(transformCoinData);
    
    // Fetch sparkline data separately
    const sparklinePromises = coins.map(coin => 
      getMarketChart(coin.id, 7).then(chartData => ({
        ...coin,
        sparkline_in_7d: {
          price: chartData.prices.map(p => p[1])
        }
      }))
    );

    return Promise.all(sparklinePromises);

  } catch (error) {
    return []; // Return empty array on error to prevent crashing the page
  }
}

interface MarketHistory {
    priceUsd: string;
    time: number;
}

function getIntervalForDays(days: number): string {
    if (days <= 2) return 'm30';   // 30 minute interval for up to 2 days
    if (days <= 30) return 'h2';   // 2 hour interval for up to 30 days
    if (days <= 90) return 'h12';  // 12 hour interval for up to 90 days
    return 'd1';                   // 1 day interval for over 90 days
}

export async function getMarketChart(coinId: string, days: number = 7): Promise<MarketChart> {
  try {
    const interval = getIntervalForDays(days);
    const end = Date.now();
    const start = end - (days * 24 * 60 * 60 * 1000);

    const { data } = await fetchAPI<MarketHistory[]>(`/assets/${coinId}/history?interval=${interval}&start=${start}&end=${end}`);
    
    const prices = data.map(item => [item.time, parseFloat(item.priceUsd)]);
    
    // CoinCap doesn't provide market cap or volume history in this endpoint.
    // We will return empty arrays to match the expected data structure.
    return { prices, market_caps: [], total_volumes: [] };
  } catch (error) {
    console.error(`Failed to get market chart for ${coinId} from CoinCap`, error);
    return { prices: [], market_caps: [], total_volumes: [] };
  }
}
