'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Truck, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/navbar';
import { formatCurrency } from '@/lib/utils/format';
import toast from 'react-hot-toast';

interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  gstNumber?: string;
  totalPurchases: number;
  outstanding: number;
  createdAt: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      const res = await fetch(`/api/suppliers?${params}`);
      const data = await res.json();
      if (data.success) { setSuppliers(data.data); setTotal(data.total); }
    } catch { toast.error('Failed to load suppliers'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  return (
    <div>
      <Navbar title="Suppliers" subtitle={`${total} suppliers`} />
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input icon={<Search className="h-4 w-4" />} placeholder="Search suppliers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <Button><Plus className="h-4 w-4 mr-2" /> Add Supplier</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? [...Array(6)].map((_, i) => <div key={i} className="h-36 rounded-xl bg-muted animate-pulse" />)
          : suppliers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No suppliers found</p>
            </div>
          ) : suppliers.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="rounded-xl border bg-card p-5 card-hover cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center">
                  <span className="text-lg font-bold text-orange-600">{s.name.charAt(0)}</span>
                </div>
                {s.gstNumber && <Badge variant="outline" className="text-xs">GST</Badge>}
              </div>
              <h3 className="font-semibold">{s.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {s.phone}</p>
                {s.city && <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {s.city}</p>}
              </div>
              <div className="mt-4 pt-3 border-t flex justify-between text-sm">
                <div><p className="text-muted-foreground">Purchases</p><p className="font-semibold">{formatCurrency(s.totalPurchases)}</p></div>
                <div className="text-right"><p className="text-muted-foreground">Due</p><p className={`font-semibold ${s.outstanding > 0 ? 'text-destructive' : 'text-green-600'}`}>{formatCurrency(s.outstanding)}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
