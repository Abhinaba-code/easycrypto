
import type { NewsArticle } from '@/lib/types';

const API_BASE_URL = 'https://min-api.cryptocompare.com/data/v2';

interface CryptoCompareResponse<T> {
  Message: string;
  Type: number;
  Data: T;
}

async function fetchAPI<T>(endpoint: string): Promise<CryptoCompareResponse<T>> {
  const apiKey = process.env.CRYPTOCOMPARE_API_KEY;
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (apiKey) {
    url.searchParams.append('api_key', apiKey);
  }

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`, errorData);
      throw new Error(`Failed to fetch from CryptoCompare: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from CryptoCompare:', error);
    throw error;
  }
}

export async function getNews(coinSymbol: string): Promise<NewsArticle[]> {
  if (!process.env.CRYPTOCOMPARE_API_KEY) {
    console.warn('CryptoCompare API key not found. Skipping news fetch.');
    return [];
  }
  
  try {
    const response = await fetchAPI<{ Articles: NewsArticle[] }>(`/news/?lang=EN&categories=${coinSymbol}`);
    if (response.Type === 100) { // Success code from CryptoCompare
      return response.Data.Articles.slice(0, 4); // Return top 4 articles
    }
    console.warn(`CryptoCompare returned non-success code: ${response.Type}`, response.Message);
    return [];
  } catch (error) {
    return [];
  }
}
