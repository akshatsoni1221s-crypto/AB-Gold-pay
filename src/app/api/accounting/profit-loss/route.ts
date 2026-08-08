import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || new Date(new Date().getFullYear(), 0, 1).toISOString();
  const to = searchParams.get('to') || new Date().toISOString();

  const fromDate = new Date(from);
  const toDate = new Date(to + 'T23:59:59.999Z');

  const [incomeInvoices, purchaseInvoices, expensesList, totalSalesPrev] = await Promise.all([
    prisma.invoice.aggregate({
      where: { organizationId: user.organizationId, invoiceDate: { gte: fromDate, lte: toDate }, invoiceType: { notIn: ['PURCHASE', 'RETURN'] }, paymentStatus: { not: 'CANCELLED' } },
      _sum: { grandTotal: true },
    }),
    prisma.invoice.aggregate({
      where: { organizationId: user.organizationId, invoiceDate: { gte: fromDate, lte: toDate }, invoiceType: 'PURCHASE', paymentStatus: { not: 'CANCELLED' } },
      _sum: { grandTotal: true },
    }),
    prisma.expense.groupBy({
      by: ['category'],
      where: { organizationId: user.organizationId, date: { gte: fromDate, lte: toDate } },
      _sum: { amount: true },
    }),
    prisma.invoice.aggregate({
      where: { organizationId: user.organizationId, invoiceDate: { gte: new Date(fromDate.getTime() - (toDate.getTime() - fromDate.getTime())), lte: fromDate }, invoiceType: { notIn: ['PURCHASE', 'RETURN'] }, paymentStatus: { not: 'CANCELLED' } },
      _sum: { grandTotal: true },
    }),
  ]);

  const totalIncome = Number(incomeInvoices._sum.grandTotal || 0);
  const totalPurchases = Number(purchaseInvoices._sum.grandTotal || 0);
  const totalExpenses = expensesList.reduce((s, e) => s + Number(e._sum.amount), 0);
  const netProfit = totalIncome - totalPurchases - totalExpenses;
  const previousIncome = Number(totalSalesPrev._sum.grandTotal || 0);
  const growthPercent = previousIncome > 0 ? ((totalIncome - previousIncome) / previousIncome) * 100 : 0;

  return successResponse({
    period: { from, to },
    totalIncome,
    totalPurchases,
    totalExpenses,
    grossProfit: totalIncome - totalPurchases,
    netProfit,
    expenseBreakdown: expensesList.map((e) => ({ category: e.category, amount: Number(e._sum.amount) })),
    profitMargin: totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0,
    growthPercent,
  });
});
