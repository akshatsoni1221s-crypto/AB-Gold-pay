'use client';

import { useState, useEffect } from 'react';
import { TopBar } from '@/components/stitch/top-bar';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  metalType: string;
  sellingPrice: string;
  stockQuantity: number;
  grossWeight: number;
  netWeight: number;
  images: string;
  description: string;
}

const metalColors: Record<string, string> = {
  GOLD: 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700/30 dark:text-yellow-300',
  SILVER: 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800/30 dark:border-gray-600/30 dark:text-gray-300',
  DIAMOND: 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-700/30 dark:text-blue-300',
  PLATINUM: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800/30 dark:border-slate-600/30 dark:text-slate-300',
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inventory?limit=100')
      .then((r) => r.json())
      .then((d) => { if (d.success) setProducts(d.data); })
      .catch(() => toast.error('Failed to load inventory'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.toLowerCase().includes(search.toLowerCase())
  );

  const getImage = (p: Product): string => {
    try {
      const parsed = JSON.parse(p.images || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {
      // ignore
    }
    return '';
  };

  const totalItems = products.reduce((s, p) => s + p.stockQuantity, 0);
  const totalValue = products.reduce((s, p) => s + Number(p.sellingPrice) * p.stockQuantity, 0);

  const categoryIcons: Record<string, string> = {
    RINGS: 'ring_volume', CHAINS: 'link', PENDANTS: 'vital_signs', BANGLES: 'watch',
    EARRINGS: 'earbuds', MANGALSUTRA: 'favorite', COINS: 'currency_rupee', NOSEPIN: 'pin',
    BRACELETS: 'watch', WATCHES: 'timer', TOERINGS: 'pedal_bike', NECKLACES: 'scroll',
    CUFFLINKS: 'checkroom', ANKLETS: 'footprint',
  };

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300">
      <TopBar title="Inventory" />

      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-6">

        {/* Summary Bar */}
        <div className="glass-panel-gold rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">inventory_2</span>
            </div>
            <div>
              <p className="font-headline-md text-base font-bold text-on-surface">{products.length} Products</p>
              <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest">{totalItems} units in stock</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-headline-md text-sm font-bold gold-text">₹{totalValue.toLocaleString('en-IN')}</p>
            <p className="font-label-sm text-[9px] text-outline uppercase tracking-widest">inventory value</p>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                type="text"
                placeholder="Search by name or barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 input-underline bg-transparent text-sm"
              />
            </div>
          </div>
          <button className="gold-gradient-btn px-6 py-3.5 rounded-full text-on-primary font-label-sm text-[11px] uppercase tracking-[0.15em] flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">add</span>
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-outline text-sm font-label-sm uppercase tracking-widest">Loading collection...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-panel rounded-xl py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-outline block mb-3">inventory_2</span>
            <p className="font-headline-md text-lg text-outline">No products found</p>
            <p className="font-label-sm text-[11px] text-outline mt-1">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <div key={p.id} className="glass-panel rounded-xl p-5 flex items-start gap-4 transition-all hover:bg-white/30 dark:hover:bg-surface-container/40 hover:border-primary-container/30 dark:hover:border-primary/20 group tilt-card">
                {getImage(p) ? (
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-outline-variant/20 group-hover:border-primary-container/40 transition-all">
                    <img
                      src={getImage(p)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-primary-container/10 dark:bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-container/20 dark:group-hover:bg-primary/20 transition-all">
                    <span className="material-symbols-outlined text-primary text-xl">{categoryIcons[p.category] || 'diamond'}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-headline-md text-base font-bold text-on-surface truncate">{p.name}</h3>
                    <span className={`font-label-sm text-[9px] px-2 py-0.5 rounded-full border uppercase tracking-widest flex-shrink-0 ${metalColors[p.metalType] || 'bg-surface-container text-outline'}`}>
                      {p.metalType}
                    </span>
                  </div>
                  <p className="font-label-sm text-[9px] text-outline uppercase tracking-widest mt-1">{p.barcode} · {p.category} · {Number(p.grossWeight).toFixed(1)}g</p>
                  {p.description && (
                    <p className="text-xs text-outline mt-1.5 line-clamp-1">{p.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/10">
                    <div>
                      <p className="font-headline-md text-base font-bold gold-text">₹{Number(p.sellingPrice).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`font-label-sm text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest ${
                        p.stockQuantity <= 5
                          ? 'bg-error/10 text-error dark:bg-error/20'
                          : p.stockQuantity <= 10
                            ? 'bg-primary-fixed-dim/20 text-primary-fixed-dim dark:bg-primary-fixed-dim/10'
                            : 'bg-primary/5 text-primary dark:bg-primary/10'
                      }`}>
                        {p.stockQuantity} in stock
                      </div>
                      <button className="p-1.5 rounded-full hover:bg-surface-container transition-colors text-outline opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-sm">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
