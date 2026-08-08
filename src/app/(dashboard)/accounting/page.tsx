'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Plus, Receipt, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Navbar } from '@/components/layout/navbar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import toast from 'react-hot-toast';

const expenseCategories = [
  { value: 'RENT', label: 'Rent' },
  { value: 'SALARY', label: 'Salary' },
  { value: 'ELECTRICITY', label: 'Electricity' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OTHER', label: 'Other' },
];

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
}

interface CashBook {
  date: string;
  totalSales: number;
  totalExpenses: number;
  totalCollections: number;
  closingBalance: number;
  invoices: any[];
  expenses: Expense[];
}

export default function AccountingPage() {
  const [cashBook, setCashBook] = useState<CashBook | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expCat, setExpCat] = useState('OTHER');
  const [expAmt, setExpAmt] = useState('');
  const [expDesc, setExpDesc] = useState('');

  const fetchData = async () => {
    try {
      const [cashRes, expRes] = await Promise.all([
        fetch(`/api/accounting/cashbook?date=${date}`),
        fetch(`/api/accounting/expenses?from=${date}&to=${date}`),
      ]);
      const cashData = await cashRes.json();
      const expData = await expRes.json();
      if (cashData.success) setCashBook(cashData.data);
      if (expData.success) setExpenses(expData.data);
    } catch { toast.error('Failed to load accounting data'); }
  };

  useEffect(() => { fetchData(); }, [date]);

  const addExpense = async () => {
    if (!expAmt || !expDesc) { toast.error('Fill all fields'); return; }
    const res = await fetch('/api/accounting/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: expCat, amount: parseFloat(expAmt), description: expDesc, date }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success('Expense added');
      setShowExpenseForm(false);
      setExpAmt(''); setExpDesc('');
      fetchData();
    } else { toast.error(data.error); }
  };

  return (
    <div>
      <Navbar title="Accounting" subtitle="Daily cash book & expenses" />
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-48" />
          <span className="text-sm text-muted-foreground">Select date to view cash book</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(cashBook?.totalSales)}</p>
                </div>
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/50"><TrendingUp className="h-6 w-6 text-green-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(cashBook?.totalExpenses)}</p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50"><TrendingDown className="h-6 w-6 text-red-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Collections</p>
                  <p className="text-2xl font-bold">{formatCurrency(cashBook?.totalCollections)}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50"><ArrowUpRight className="h-6 w-6 text-blue-600" /></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Closing Balance</p>
                  <p className={`text-2xl font-bold ${(cashBook?.closingBalance ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(cashBook?.closingBalance)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50"><Wallet className="h-6 w-6 text-purple-600" /></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Expenses</CardTitle>
              <Button size="sm" onClick={() => setShowExpenseForm(!showExpenseForm)}>
                <Plus className="h-4 w-4 mr-1" /> Add Expense
              </Button>
            </CardHeader>
            <CardContent>
              {showExpenseForm && (
                <div className="mb-4 p-4 rounded-lg bg-muted/50 space-y-3">
                  <Select options={expenseCategories} value={expCat} onChange={(e) => setExpCat(e.target.value)} />
                  <Input type="number" placeholder="Amount" value={expAmt} onChange={(e) => setExpAmt(e.target.value)} />
                  <Input placeholder="Description" value={expDesc} onChange={(e) => setExpDesc(e.target.value)} />
                  <Button onClick={addExpense} className="w-full">Save Expense</Button>
                </div>
              )}
              {expenses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No expenses for this date</p>
              ) : (
                <div className="space-y-2">
                  {expenses.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <Badge variant="secondary">{exp.category}</Badge>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                      <p className="font-semibold text-destructive">-{formatCurrency(exp.amount)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Today's Invoices</CardTitle></CardHeader>
            <CardContent>
              {cashBook?.invoices?.length ? (
                <div className="space-y-2">
                  {cashBook.invoices.map((inv: any) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="text-sm font-medium">{inv.invoiceNo}</p>
                        <p className="text-xs text-muted-foreground">{inv.customerName || 'Walk-in'}</p>
                      </div>
                      <p className="font-semibold">{formatCurrency(inv.grandTotal)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">No invoices for this date</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
