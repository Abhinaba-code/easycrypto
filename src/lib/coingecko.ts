import type { Coin, MarketChart } from '@/lib/types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    if (!response.ok) {
        const errorData = await response.text();
        console.error(`API Error: ${response.status} ${response.statusText}`, errorData);
        throw new Error(`Failed to fetch from CoinGecko: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error);
    throw error;
  }
}


export async function getTopCoins(): Promise<Coin[]> {
  try {
    const data = await fetchAPI<Coin[]>('/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h');
    return data;
  } catch (error) {
    return []; // Return empty array on error to prevent crashing the page
  }
}

export async function getMarketChart(coinId: string, days: number = 7): Promise<MarketChart> {
    return fetchAPI<MarketChart>(`/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
}
