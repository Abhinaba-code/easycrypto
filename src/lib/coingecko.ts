
import type { Coin, CoinDetails, MarketChart } from '@/lib/types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
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


export async function getTopCoins(page: number = 1): Promise<Coin[]> {
  try {
    const data = await fetchAPI<Coin[]>(`/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=true&price_change_percentage=24h`, { cache: 'no-store' });
    return data;
  } catch (error) {
    return []; // Return empty array on error to prevent crashing the page
  }
}

export async function getMarketChart(coinId: string, days: number = 7): Promise<MarketChart> {
    return fetchAPI<MarketChart>(`/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
}

export async function getCoinDetails(coinId: string): Promise<CoinDetails> {
  const data = await fetchAPI<any>(`/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`);
  
  // The coingecko API for coin details returns 'image' as an object with different sizes
  // We need to pick one, so we'll use the 'large' one.
  // It also sometimes returns empty strings for links, which we should handle.
  return {
    ...data,
    image: data.image?.large || '',
    links: {
      ...data.links,
      homepage: data.links.homepage?.filter((l:string) => l) || [],
      blockchain_site: data.links.blockchain_site?.filter((l:string) => l) || [],
      official_forum_url: data.links.official_forum_url?.filter((l:string) => l) || [],
      chat_url: data.links.chat_url?.filter((l:string) => l) || [],
      announcement_url: data.links.announcement_url?.filter((l:string) => l) || [],
    }
  }
}
