'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/stitch/top-bar';
import { AbMonogram } from '@/components/stitch/ab-monogram';

interface DashData {
  totalProducts: number;
  totalCustomers: number;
  totalInvoices: number;
  totalRevenue: number;
  todayRevenue: number;
  lowStockProducts: { id: string; name: string; stockQuantity: number; minStockLevel: number }[];
  recentInvoices: { id: string; invoiceNo: string; grandTotal: number; paymentStatus: string; createdAt: string }[];
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalPurchases: number;
  city: string;
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<boolean>(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const duration = 1200;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value.toLocaleString('en-IN') + suffix);
        clearInterval(timer);
      } else {
        setDisplay(Math.round(current).toLocaleString('en-IN') + suffix);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, suffix]);

  return <span>{display}</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => { if (d.success) setUser(d.data); });

    fetch('/api/dashboard/summary')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d.data as unknown as DashData);
      });

    fetch('/api/customers?limit=8')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCustomers(d.data); });
  }, []);

  const revenue = data?.totalRevenue || 0;
  const today = data?.todayRevenue || 0;

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const statIcons: Record<string, string> = {
    Revenue: 'currency_rupee',
    Invoices: 'receipt_long',
    Products: 'ab_monogram',
    Customers: 'groups',
  };

  const colors = ['from-yellow-500/20 to-amber-500/5', 'from-blue-500/20 to-indigo-500/5', 'from-emerald-500/20 to-green-500/5', 'from-rose-500/20 to-pink-500/5'];

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300">
      <TopBar userName={user?.name || 'Admin'} />

      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-12">

        {/* Hero Metric */}
        <section className="text-center fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20 dark:border-primary/20 mb-4">
            <span className="material-symbols-outlined text-primary text-sm">schedule</span>
            <span className="font-label-sm text-[10px] text-primary uppercase tracking-widest">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <p className="font-label-sm text-label-sm text-outline uppercase tracking-widest mb-2">Today&apos;s Sales</p>
          <h2 className="font-display-lg-mobile text-display-lg-mobile gold-text mb-1">
            ₹{today ? (today / 1000).toFixed(1) : '---'}k
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {data ? `${data.totalProducts} products · ${data.totalCustomers} customers · ${data.totalInvoices} invoices` : 'Loading...'}
          </p>
        </section>

        {/* Gold Divider */}
        <div className="gold-divider" />

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Revenue', value: data ? revenue : 0, suffix: 'L', isCurrency: true },
            { label: 'Invoices', value: data ? data.totalInvoices : 0, suffix: '' },
            { label: 'Products', value: data ? data.totalProducts : 0, suffix: '' },
            { label: 'Customers', value: data ? data.totalCustomers : 0, suffix: '' },
          ].map((stat, idx) => (
            <div key={stat.label} className="relative glass-panel-gold rounded-xl p-5 text-center group overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${colors[idx]} opacity-50 dark:opacity-20`} />
              <div className="relative z-10">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/5 dark:bg-primary/10 flex items-center justify-center group-hover:bg-primary/10 dark:group-hover:bg-primary/20 transition-all">
                    {statIcons[stat.label] === 'ab_monogram' ? (
                      <AbMonogram size={18} className="text-primary" />
                    ) : (
                      <span className="material-symbols-outlined text-primary text-lg">{statIcons[stat.label]}</span>
                    )}
                  </div>
                </div>
                <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest">{stat.label}</p>
                <p className="font-headline-md text-headline-md text-on-surface mt-1 animate-count-up">
                  {data ? (
                    stat.isCurrency ? (
                      <>₹<AnimatedNumber value={Math.round(stat.value / 100000)} suffix={stat.suffix} /></>
                    ) : (
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    )
                  ) : '---'}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Top Customers */}
        {customers.length > 0 && (
          <section className="fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h3 className="font-headline-md text-xl font-bold text-on-surface">Best Customers</h3>
              </div>
              <span className="font-label-sm text-[10px] text-outline uppercase tracking-widest">by purchase volume</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customers.slice(0, 6).map((c, i) => (
                <div key={c.id} className="glass-panel rounded-xl p-5 flex items-center gap-4 transition-all hover:bg-white/30 dark:hover:bg-surface-container/40 hover:border-primary-container/30 dark:hover:border-primary/20 group tilt-card">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-primary-container/15 dark:bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <span className="font-headline-md text-sm font-bold text-primary">{initials(c.name)}</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary shadow-sm flex items-center justify-center">
                      <span className="text-[8px] text-on-primary font-bold">{i + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline-md text-base font-bold text-on-surface truncate">{c.name}</p>
                    <p className="font-label-sm text-[10px] text-outline uppercase tracking-widest mt-0.5">
                      {c.city} {c.phone ? `· ${c.phone}` : ''}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-headline-md text-sm font-bold gold-text">₹{Number(c.totalPurchases).toLocaleString('en-IN')}</p>
                    <p className="font-label-sm text-[9px] text-outline uppercase tracking-widest">lifetime</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gold Divider */}
        <div className="gold-divider" />

        {/* Low Stock + Invoices Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          {data && data.lowStockProducts?.length > 0 && (
            <section className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-error rounded-full" />
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">Low Stock Alert</h3>
                </div>
                <span className="material-symbols-outlined text-error">warning</span>
              </div>
              <div className="space-y-3">
                {data.lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex justify-between items-center py-2 border-b border-outline-variant/10 last:border-0">
                    <div className="flex items-center gap-3">
                      <AbMonogram size={14} className="text-outline" />
                      <span className="font-body-md text-sm text-on-surface">{p.name}</span>
                    </div>
                    <span className="font-label-sm text-[11px] text-error font-semibold">{p.stockQuantity} left</span>
                  </div>
                ))}
              </div>
              {data.lowStockProducts.length > 4 && (
                <button onClick={() => router.push('/inventory')} className="mt-4 font-label-sm text-[11px] text-primary uppercase tracking-widest hover:underline">
                  +{data.lowStockProducts.length - 4} more items
                </button>
              )}
            </section>
          )}

          {/* Recent Invoices */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h3 className="font-headline-md text-lg font-bold text-on-surface">Recent Invoices</h3>
            </div>
            {data && data.recentInvoices?.length > 0 ? (
              <div className="space-y-3">
                {data.recentInvoices.slice(0, 5).map((inv, i) => (
                  <div key={inv.id} className="glass-panel rounded-lg p-4 flex justify-between items-center transition-all hover:bg-white/30 dark:hover:bg-surface-container/40 tilt-card" style={{ animationDelay: `${i * 80}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${inv.paymentStatus === 'PAID' ? 'bg-primary' : inv.paymentStatus === 'PARTIAL' ? 'bg-primary-fixed-dim' : 'bg-error'}`} />
                      <div>
                        <p className="font-body-md text-sm text-on-surface font-medium">{inv.invoiceNo}</p>
                        <p className="font-label-sm text-[9px] text-outline uppercase tracking-widest">{new Date(inv.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline-md text-sm font-bold text-on-surface">₹{Number(inv.grandTotal).toLocaleString('en-IN')}</p>
                      <span className={`font-label-sm text-[9px] uppercase tracking-widest ${inv.paymentStatus === 'PAID' ? 'text-primary' : inv.paymentStatus === 'PARTIAL' ? 'text-primary-fixed-dim' : 'text-error'}`}>
                        {inv.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-panel rounded-lg p-8 text-center">
                <span className="material-symbols-outlined text-3xl text-outline block mb-2">receipt_long</span>
                <p className="text-outline text-sm">No recent invoices.</p>
              </div>
            )}
          </section>
        </div>

      </main>
    </div>
  );
}
