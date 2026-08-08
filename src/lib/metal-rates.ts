const TROY_OZ_TO_10G = 3.11035;

const FALLBACK_RATES = {
  gold: { price: 75000, change: 0 },
  silver: { price: 1800, change: 0 },
  platinum: { price: 50000, change: 0 },
};

export interface MetalRates {
  gold: { price: number; change: number };
  silver: { price: number; change: number };
  platinum: { price: number; change: number };
  timestamp: number;
}

export async function fetchMetalRates(): Promise<MetalRates> {
  try {
    const [goldRes, silverRes, platinumRes] = await Promise.allSettled([
      fetch('https://api.gold-api.com/price/XAU/INR'),
      fetch('https://api.gold-api.com/price/XAG/INR'),
      fetch('https://api.gold-api.com/price/XPT/INR'),
    ]);

    const rates: MetalRates = {
      gold: { price: FALLBACK_RATES.gold.price, change: 0 },
      silver: { price: FALLBACK_RATES.silver.price, change: 0 },
      platinum: { price: FALLBACK_RATES.platinum.price, change: 0 },
      timestamp: Date.now(),
    };

    if (goldRes.status === 'fulfilled') {
      const data = await goldRes.value.json();
      if (data.price) {
        rates.gold.price = Math.round(data.price / TROY_OZ_TO_10G);
        rates.gold.change = data.change || 0;
      }
    }
    if (silverRes.status === 'fulfilled') {
      const data = await silverRes.value.json();
      if (data.price) {
        rates.silver.price = Math.round(data.price / TROY_OZ_TO_10G);
        rates.silver.change = data.change || 0;
      }
    }
    if (platinumRes.status === 'fulfilled') {
      const data = await platinumRes.value.json();
      if (data.price) {
        rates.platinum.price = Math.round(data.price / TROY_OZ_TO_10G);
        rates.platinum.change = data.change || 0;
      }
    }

    return rates;
  } catch {
    return { ...FALLBACK_RATES, timestamp: Date.now() } as MetalRates;
  }
}
