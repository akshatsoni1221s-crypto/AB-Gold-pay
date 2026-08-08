import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || new Date(new Date().getFullYear(), 0, 1).toISOString();
  const to = searchParams.get('to') || new Date().toISOString();

  const fromDate = new Date(from);
  const toDate = new Date(to + 'T23:59:59.999Z');

  const [income, purchases, expenses] = await Promise.all([
    prisma.invoice.aggregate({
      where: { organizationId: user.organizationId, invoiceDate: { gte: fromDate, lte: toDate }, invoiceType: { notIn: ['PURCHASE', 'RETURN'] }, paymentStatus: { not: 'CANCELLED' } },
      _sum: { grandTotal: true },
    }),
    prisma.invoice.aggregate({
      where: { organizationId: user.organizationId, invoiceDate: { gte: fromDate, lte: toDate }, invoiceType: 'PURCHASE', paymentStatus: { not: 'CANCELLED' } },
      _sum: { grandTotal: true },
    }),
    prisma.expense.aggregate({
      where: { organizationId: user.organizationId, date: { gte: fromDate, lte: toDate } },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = Number(income._sum.grandTotal || 0);
  const totalPurchases = Number(purchases._sum.grandTotal || 0);
  const totalExpenses = Number(expenses._sum.amount || 0);
  const grossProfit = totalIncome - totalPurchases;
  const netProfit = grossProfit - totalExpenses;

  return successResponse({
    period: { from, to },
    totalIncome,
    totalPurchases,
    totalExpenses,
    grossProfit,
    netProfit,
    profitMargin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) + '%' : '0%',
  });
});
