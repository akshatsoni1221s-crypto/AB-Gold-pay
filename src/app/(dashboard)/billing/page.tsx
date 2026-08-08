'use client';

import { useState, useEffect, useCallback } from 'react';
import { TopBar } from '@/components/stitch/top-bar';
import { BarcodeScanner } from '@/components/stitch/barcode-scanner';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  barcode: string;
  sku: string;
  category: string;
  metalType: string;
  sellingPrice: string;
  stockQuantity: number;
  grossWeight: string;
  images: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface CartItem extends Product {
  qty: number;
}

const TAX_RATE = 3;

export default function BillingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [applyTax, setApplyTax] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [search, setSearch] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [invoice, setInvoice] = useState<any>(null);

  const loadProducts = useCallback(() => {
    fetch('/api/inventory?limit=200')
      .then((r) => r.json())
      .then((d) => { if (d.success) setProducts(d.data); })
      .catch(() => toast.error('Failed to load products'));
  }, []);

  useEffect(() => {
    loadProducts();
    fetch('/api/customers?limit=200')
      .then((r) => r.json())
      .then((d) => { if (d.success) setCustomers(d.data); })
      .catch(() => toast.error('Failed to load customers'));
  }, [loadProducts]);

  const getImage = (p: Product): string => {
    try {
      const parsed = JSON.parse(p.images || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch { /* ignore */ }
    return '';
  };

  const addToCart = useCallback((p: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id);
      if (existing) {
        if (existing.qty >= p.stockQuantity) {
          toast.error('Insufficient stock');
          return prev;
        }
        return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...p, qty: 1 }];
    });
  }, []);

  const handleBarcode = useCallback((code: string) => {
    const p = products.find((x) => x.barcode === code || x.sku === code);
    if (p) {
      addToCart(p);
      toast.success(`${p.name} added`);
    } else {
      toast.error(`No product found for ${code}`);
    }
  }, [products, addToCart]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const subtotalVal = cart.reduce((s, i) => s + Number(i.sellingPrice) * i.qty, 0);
  const taxVal = applyTax ? Math.round(subtotalVal * (TAX_RATE / 100) * 100) / 100 : 0;
  const grandTotal = subtotalVal + taxVal;

  const handleCreateInvoice = async () => {
    if (cart.length === 0) { toast.error('Cart is empty'); return; }
    setPaying(true);
    try {
      const items = cart.map((c) => ({
        productId: c.id,
        itemName: c.name,
        quantity: c.qty,
        unitPrice: Number(c.sellingPrice),
        taxRate: applyTax ? TAX_RATE : 0,
        grossWeight: Number(c.grossWeight),
        netWeight: Number(c.grossWeight),
        purity: c.metalType,
      }));
      const paid = paidAmount ? Number(paidAmount) : 0;
      const res = await fetch('/api/billing/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceType: applyTax ? 'GST' : 'NORMAL',
          customerId: customerId || null,
          items,
          paidAmount: paid,
          paymentMethod: paid > 0 ? paymentMethod : 'CASH',
        }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { error: 'Unexpected response' }; }
      if (data.success) {
        setInvoice(data.data);
        setCart([]);
        setPaidAmount('');
        setCustomerId('');
        loadProducts();
      } else {
        toast.error(data.error || 'Failed to create invoice');
      }
    } catch {
      toast.error('Connection error');
    } finally {
      setPaying(false);
    }
  };

  const printInvoice = () => {
    if (!invoice) return;
    const it = invoice;
    const html = `<!DOCTYPE html><html><head><title>${it.invoiceNo || 'Invoice'}</title>
<meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#fff;color:#111;font-family:'Montserrat',sans-serif;width:80mm;margin:auto;padding:10px 0}
.head{text-align:center}
.h1{font-family:'Playfair Display',serif;font-size:20px;letter-spacing:4px;font-weight:700}
.g{color:#b8860b;letter-spacing:3px;font-size:10px;font-weight:600}
.addr{font-size:9px;color:#666;margin-top:2px}
.divider{border-bottom:2px solid #b8860b;margin:8px 0}
.lbl{font-weight:700;text-align:center;font-size:12px;letter-spacing:2px;margin:6px 0;text-transform:uppercase}
.row{display:flex;justify-content:space-between;font-size:11px;padding:2px 0}
table{width:100%;border-collapse:collapse;font-size:10px;margin-top:4px}
th{text-align:left;font-size:9px;text-transform:uppercase;border-bottom:1px solid #999;padding:3px}
td{padding:3px;border-bottom:1px dotted #ccc}
.tal{text-align:right}
.t-row{display:flex;justify-content:space-between;font-size:11px;padding:2px 0}
.tall{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;border-top:2px solid #b8860b;margin-top:6px;padding-top:6px;display:flex;justify-content:space-between}
.gold{color:#b8860b}
.foot{text-align:center;margin-top:10px;font-size:8px;color:#888;border-top:1px dashed #ccc;padding-top:6px}
.pay{text-align:center;margin:8px 0;font-size:10px;font-weight:700;letter-spacing:3px;border:2px solid #b8860b;padding:4px 12px;display:inline-block;width:100%}
</style></head><body>
<div class="head">
  <div class="h1">AURELIAN</div>
  <div class="g">AB GOLDPAY FINE JEWELLERY</div>
  <div class="addr">123, Jewelry Market, Mumbai - 400001</div>
</div>
<div class="divider"></div>
<div class="lbl">${it.invoiceType === 'GST' ? 'TAX INVOICE' : 'SALE INVOICE'}</div>
<div class="row"><span>Invoice No</span><b>${it.invoiceNo || ''}</b></div>
<div class="row"><span>Date</span><b>${new Date(it.invoiceDate || Date.now()).toLocaleDateString('en-IN')}</b></div>
<div class="row"><span>Customer</span><b>${it.customerName || 'Walk-in'}</b></div>
${it.customerPhone ? `<div class="row"><span>Phone</span><b>${it.customerPhone}</b></div>` : ''}
<table><thead><tr><th>Item</th><th class="tal">Qty</th><th class="tal">Rate</th><th class="tal">Amt</th></tr></thead><tbody>
${(it.items || []).map((x: any) => `<tr><td>${x.itemName}</td><td class="tal">${x.quantity}</td><td class="tal">${Number(x.unitPrice).toLocaleString('en-IN')}</td><td class="tal">${Number(x.total).toLocaleString('en-IN')}</td></tr>`).join('')}
</tbody></table>
<div style="margin-top:6px">
  <div class="t-row"><span>Subtotal</span><span>₹ ${Number(it.subtotal || 0).toLocaleString('en-IN')}</span></div>
  ${Number(it.taxAmount || 0) > 0 ? `<div class="t-row"><span>GST (${TAX_RATE}%)</span><span>₹ ${Number(it.taxAmount).toLocaleString('en-IN')}</span></div>` : ''}
</div>
<div class="tall"><span class="gold">GRAND TOTAL</span><span class="gold">₹ ${Number(it.grandTotal || 0).toLocaleString('en-IN')}</span></div>
<div class="t-row" style="margin-top:4px"><span>Paid</span><span>₹ ${Number(it.paidAmount || 0).toLocaleString('en-IN')}</span></div>
${Number(it.balanceAmount || 0) > 0 ? `<div class="t-row"><span>Balance Due</span><b>₹ ${Number(it.balanceAmount).toLocaleString('en-IN')}</b></div>` : ''}
<div class="pay">${Number(it.balanceAmount || 0) > 0 ? 'PART PAYMENT' : 'PAID IN FULL'}</div>
<div class="foot">BIS Hallmark &bull; 100% Pure Gold &bull; GST: ${it.invoiceType === 'GST' ? 'Included' : 'N/A'}<br/>www.abgoldpay.com &bull; +91-9876543210<br/>Thank you for shopping with us</div>
<script>window.onload=function(){window.print();}</script>
</body></html>`;
    const w = window.open('', '_blank', 'width=420,height=800');
    if (!w) { toast.error('Allow popups to print'); return; }
    w.document.write(html);
    w.document.close();
  };

  return (
    <div className="min-h-screen pb-24 transition-colors duration-300">
      <TopBar title="Billing & POS" />

      {scannerOpen && (
        <BarcodeScanner
          onDetected={(code) => { setScannerOpen(false); handleBarcode(code); }}
          onClose={() => setScannerOpen(false)}
        />
      )}

      {invoice && (
        <div className="fixed inset-0 z-[90] bg-black/70 flex items-center justify-center p-6">
          <div className="glass-panel max-w-sm w-full rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-primary">check_circle</span>
              </div>
              <p className="font-headline-md text-lg font-bold text-on-surface">Invoice Ready</p>
              <p className="text-outline text-sm mt-1">Invoice {invoice.invoiceNo}</p>
              <p className="gold-text font-bold text-xl mt-2">₹{Number(invoice.grandTotal).toLocaleString('en-IN')}</p>
            </div>
            <button
              onClick={printInvoice}
              className="gold-gradient-btn w-full py-4 rounded-full text-on-primary font-label-sm text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">print</span> Print Invoice
            </button>
            <button
              onClick={() => setInvoice(null)}
              className="w-full py-3 rounded-full border border-outline-variant/40 text-outline font-label-sm text-[11px] uppercase tracking-widest mt-2"
            >
              New Bill
            </button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 pt-8 space-y-6">
        <div className="glass-panel-gold rounded-xl p-1 flex items-center gap-1">
          <button
            onClick={() => setShowCart(false)}
            className={`flex-1 py-2.5 rounded-lg font-label-sm text-[10px] uppercase tracking-widest transition-all ${!showCart ? 'bg-primary text-on-primary' : 'text-outline'}`}
          >
            <span className="material-symbols-outlined align-middle text-sm mr-1">storefront</span> Products
          </button>
          <button
            onClick={() => setShowCart(true)}
            className={`flex-1 py-2.5 rounded-lg font-label-sm text-[10px] uppercase tracking-widest transition-all ${showCart ? 'bg-primary text-on-primary' : 'text-outline'}`}
          >
            <span className="material-symbols-outlined align-middle text-sm mr-1">receipt_long</span> Cart ({cart.length})
          </button>
        </div>

        {!showCart ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && barcodeInput.trim()) {
                      handleBarcode(barcodeInput.trim());
                      setBarcodeInput('');
                    }
                  }}
                  placeholder="Scan or type barcode + Enter"
                  className="w-full pl-12 pr-4 py-3.5 input-underline bg-transparent text-sm"
                />
              </div>
              <button
                onClick={() => setScannerOpen(true)}
                className="gold-gradient-btn px-5 py-3.5 rounded-full text-on-primary font-label-sm text-[11px] uppercase tracking-widest flex items-center gap-2 flex-shrink-0"
              >
                <span className="material-symbols-outlined text-sm">qr_code_scanner</span> Scan
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="glass-panel rounded-xl p-3 text-left group hover:border-primary-container/30 transition-all"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-container/40 mb-2">
                    {getImage(p) ? (
                      <img src={getImage(p)} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline">diamond</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-headline-md font-semibold text-on-surface truncate">{p.name}</p>
                  <p className="text-[10px] text-outline truncate">{p.barcode}</p>
                  <p className="text-xs font-bold gold-text mt-1">₹{Number(p.sellingPrice).toLocaleString('en-IN')}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase ${p.stockQuantity <= 5 ? 'bg-error/10 text-error' : 'bg-primary/5 text-primary'}`}>
                      {p.stockQuantity} left
                    </span>
                    <span className="material-symbols-outlined text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full glass-panel rounded-xl py-16 text-center">
                  <p className="text-outline font-headline-md">No products found</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="glass-panel rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-md text-lg font-bold text-on-surface">Cart ({cart.length})</h3>
              <button onClick={() => setCart([])} className="text-[10px] uppercase tracking-widest text-error font-label-sm">Clear</button>
            </div>

            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <span className="material-symbols-outlined text-5xl text-outline block mb-3">shopping_cart</span>
                <p className="text-outline text-sm">Scan or tap products to add</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3 border-b border-outline-variant/10">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {getImage(item) ? (
                        <img src={getImage(item)} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline text-sm">diamond</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-headline-md text-sm font-semibold text-on-surface truncate">{item.name}</p>
                      <p className="font-label-sm text-[10px] text-outline">₹{Number(item.sellingPrice).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCart((prev) => prev.map((i) => i.id === item.id ? { ...i, qty: i.qty - 1 } : i).filter((i) => i.qty > 0))}
                        className="w-7 h-7 rounded-full bg-surface-container hover:bg-primary/10 transition-colors flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-6 text-center text-sm font-semibold font-headline-md">{item.qty}</span>
                      <button
                        onClick={() => setCart((prev) => prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}
                        className="w-7 h-7 rounded-full bg-primary text-on-primary hover:opacity-80 transition-opacity flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full py-3 input-underline bg-transparent text-sm"
              >
                <option value="">Walk-in Customer</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setApplyTax(true)}
                className={`flex-1 px-4 py-3 rounded-xl text-[10px] uppercase tracking-widest border transition-all ${applyTax ? 'bg-primary text-on-primary border-primary font-bold' : 'text-outline border-outline-variant/40'}`}
              >
                With Tax (GST {TAX_RATE}%)
              </button>
              <button
                onClick={() => setApplyTax(false)}
                className={`flex-1 px-4 py-3 rounded-xl text-[10px] uppercase tracking-widest border transition-all ${!applyTax ? 'bg-primary text-on-primary border-primary font-bold' : 'text-outline border-outline-variant/40'}`}
              >
                Without Tax
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full py-3 input-underline bg-transparent text-sm"
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>
              <div className="flex-1">
                <input
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  type="number"
                  placeholder="Paid amount (0 = full)"
                  className="w-full py-3 input-underline bg-transparent text-sm"
                />
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-outline-variant/10">
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Subtotal</span><span>₹{subtotalVal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>GST ({TAX_RATE}%)</span><span>{applyTax ? `₹${taxVal.toLocaleString('en-IN')}` : '₹0'}</span>
              </div>
              <div className="flex justify-between font-headline-md text-xl font-bold gold-text pt-2">
                <span>Grand Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleCreateInvoice}
              disabled={paying || cart.length === 0}
              className="gold-gradient-btn w-full py-4 rounded-full text-on-primary font-headline-md text-[13px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">print</span>
              {paying ? 'Creating...' : 'Create & Print Invoice'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
