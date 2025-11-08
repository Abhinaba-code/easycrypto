export function getMarketCapBucket(rank: number): 'Mega' | 'Large' | 'Mid' | 'Small' {
  if (rank <= 10) return 'Mega';
  if (rank <= 50) return 'Large';
  if (rank <= 200) return 'Mid';
  return 'Small';
}

function normalize(value: number, min: number, max: number): number {
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function calculateMomentumScore(prices: number[]): number {
  if (prices.length < 2) return 0.5;
  
  const sevenDayChange = (prices[prices.length - 1] - prices[0]) / prices[0];
  const normalizedChange = normalize(sevenDayChange, -0.5, 0.5); // Assume 7d change is between -50% and +50%

  // Simplified slope calculation
  const slope = prices.slice(1).reduce((acc, price, i) => acc + (price - prices[i]), 0);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const relativeSlope = slope / avgPrice;
  const normalizedSlope = normalize(relativeSlope, -0.2, 0.2); // Assume relative slope is between -20% and 20%

  return (normalizedChange * 0.6 + normalizedSlope * 0.4);
}

export function calculateVolatilityScore(prices: number[]): number {
  if (prices.length < 2) return 0.5;

  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  const stddev = Math.sqrt(variance);
  const relativeStddev = stddev / mean;

  return normalize(relativeStddev, 0.01, 0.15); // Normalize based on typical crypto volatility range
}

export function calculateVolumeSpike(volumes: number[]): number {
  if (volumes.length < 2) return 0;
  
  const latestVolume = volumes[volumes.length - 1];
  const avgVolume = volumes.slice(0, -1).reduce((sum, vol) => sum + vol, 0) / (volumes.length - 1);
  
  if (avgVolume === 0) return latestVolume > 0 ? 1 : 0;
  
  const spikeRatio = latestVolume / avgVolume;
  
  return normalize(spikeRatio, 1, 5); // A spike of 5x or more is considered high.
}
