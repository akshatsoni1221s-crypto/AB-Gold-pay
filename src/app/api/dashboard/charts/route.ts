import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';
import { cacheGet, cacheSet } from '@/lib/redis';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'daily';

  const cacheKey = `dashboard:charts:${period}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return successResponse(cached);

  const data = await getChartData(period, 12, user.organizationId);
  await cacheSet(cacheKey, data, 120);
  return successResponse(data);
});

async function getChartData(period: string, points: number, organizationId: string) {
  const now = new Date();
  const data: Array<{ date: string; sales: number; profit: number; count: number }> = [];

  for (let i = points - 1; i >= 0; i--) {
    let start: Date;
    let end: Date;
    let label: string;

    switch (period) {
      case 'yearly':
        start = new Date(now.getFullYear() - i, 0, 1);
        end = new Date(now.getFullYear() - i, 11, 31, 23, 59, 59);
        label = `${start.getFullYear()}`;
        break;
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
        label = start.toLocaleString('en-US', { month: 'short', year: '2-digit' });
        break;
      case 'weekly':
        start = new Date(now.getTime() - i * 7 * 86400000);
        start.setDate(start.getDate() - start.getDay());
        end = new Date(start.getTime() + 6 * 86400000);
        end.setHours(23, 59, 59, 999);
        label = `${start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
        break;
      default: // daily
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        end = new Date(start.getTime() + 86400000);
        label = start.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
    }

    const [invoices, expenses] = await Promise.all([
      prisma.invoice.aggregate({
        where: { invoiceDate: { gte: start, lte: end }, paymentStatus: { not: 'CANCELLED' }, organizationId },
        _sum: { grandTotal: true },
        _count: true,
      }),
      prisma.expense.aggregate({
        where: { date: { gte: start, lte: end }, organizationId },
        _sum: { amount: true },
      }),
    ]);

    const sales = Number(invoices._sum.grandTotal || 0);
    const expenseTotal = Number(expenses._sum.amount || 0);

    data.push({
      date: label,
      sales,
      profit: sales - expenseTotal,
      count: invoices._count,
    });
  }

  return data;
}
