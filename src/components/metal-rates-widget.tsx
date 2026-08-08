'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface MetalRate {
  price: number;
  change: number;
}

interface Rates {
  gold: MetalRate;
  silver: MetalRate;
  platinum: MetalRate;
  timestamp: number;
}

export function MetalRatesWidget() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/metal-rates');
      const data = await res.json();
      if (data.success) setRates(data.data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 120000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => price.toLocaleString('en-IN');

  const metalConfig = [
    { key: 'gold' as const, label: 'Gold', symbol: 'Au', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/20' },
    { key: 'silver' as const, label: 'Silver', symbol: 'Ag', color: 'text-slate-400', bg: 'bg-slate-50 dark:bg-slate-950/20' },
    { key: 'platinum' as const, label: 'Platinum', symbol: 'Pt', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/20' },
  ];

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
      ) : rates ? (
        metalConfig.map((m) => {
          const rate = rates[m.key];
          if (!rate) return null;
          return (
            <div key={m.key} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${m.bg} text-xs`}>
              <span className={`font-semibold ${m.color}`}>{m.symbol}</span>
              <span className="font-medium tabular-nums">₹{formatPrice(rate.price)}</span>
              {rate.change !== 0 && (
                rate.change > 0
                  ? <TrendingUp className="h-3 w-3 text-green-500" />
                  : <TrendingDown className="h-3 w-3 text-red-500" />
              )}
            </div>
          );
        })
      ) : null}
    </div>
  );
}
