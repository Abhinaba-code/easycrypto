
import type { Coin, CoinCapAsset } from '@/lib/types';

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
    high_24h: 0, // Not available in this endpoint
    low_24h: 0, // Not available in this endpoint
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
    return data.map(transformCoinData);
  } catch (error) {
    return []; // Return empty array on error to prevent crashing the page
  }
}

interface MarketHistory {
    priceUsd: string;
    time: number;
}

export async function getMarketChart(coinId: string, days: number = 7): Promise<{ prices: [number, number][], market_caps: [], total_volumes: [] }> {
  try {
    const interval = 'h1'; // Use 1-hour interval for 7 days
    const end = Date.now();
    const start = end - (days * 24 * 60 * 60 * 1000);

    const { data } = await fetchAPI<MarketHistory[]>(`/assets/${coinId}/history?interval=${interval}&start=${start}&end=${end}`);
    
    const prices = data.map(item => [item.time, parseFloat(item.priceUsd)]);
    
    return { prices, market_caps: [], total_volumes: [] };
  } catch (error) {
    console.error(`Failed to get market chart for ${coinId}`, error);
    return { prices: [], market_caps: [], total_volumes: [] };
  }
}

