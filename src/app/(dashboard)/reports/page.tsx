'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, FileText, Download, TrendingUp, Receipt,
  Users, Package, FileSpreadsheet, FilePieChart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/layout/navbar';
import toast from 'react-hot-toast';

const reportTypes = [
  {
    icon: TrendingUp, title: 'Sales Report', desc: 'Daily, weekly, monthly, yearly sales',
    color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/50', endpoint: 'sales',
  },
  {
    icon: Receipt, title: 'GST Report', desc: 'CGST, SGST, IGST summary',
    color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/50', endpoint: 'gst',
  },
  {
    icon: Package, title: 'Inventory Report', desc: 'Stock valuation & movement',
    color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/50', endpoint: 'inventory',
  },
  {
    icon: Users, title: 'Customer Report', desc: 'Customer purchase history & ledger',
    color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/50', endpoint: 'customers',
  },
  {
    icon: FileText, title: 'Profit & Loss', desc: 'Income, expenses, net profit',
    color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/50', endpoint: 'profit-loss',
  },
  {
    icon: FileSpreadsheet, title: 'Stock Valuation', desc: 'Current stock value by category',
    color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/50', endpoint: 'stock-valuation',
  },
];

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

  const downloadReport = async (endpoint: string, format: string) => {
    try {
      toast.loading('Generating report...');
      const res = await fetch(`/api/reports/${endpoint}?from=${fromDate}&to=${toDate}&format=${format}`);
      if (!res.ok) throw new Error('Failed to generate');

      if (format === 'csv') {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${endpoint}-report.csv`; a.click();
        URL.revokeObjectURL(url);
        toast.dismiss();
        toast.success('Report downloaded');
      } else {
        const data = await res.json();
        if (data.success) {
          toast.dismiss();
          toast.success('Report generated');
          console.log(data.data);
        }
      }
    } catch {
      toast.dismiss();
      toast.error('Failed to generate report');
    }
  };

  return (
    <div>
      <Navbar title="Reports" subtitle="Generate and download business reports" />
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm">From:</label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">To:</label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report, i) => (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${report.bg}`}>
                      <report.icon className={`h-6 w-6 ${report.color}`} />
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{report.desc}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => downloadReport(report.endpoint, 'json')}>
                      <FileText className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadReport(report.endpoint, 'csv')}>
                      <Download className="h-4 w-4 mr-1" /> CSV
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadReport(report.endpoint, 'pdf')}>
                      <FilePieChart className="h-4 w-4 mr-1" /> PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
