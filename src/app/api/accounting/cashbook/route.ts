import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const date = new Date(dateStr);
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(start.getTime() + 86400000);

  const [invoices, expenses, payments] = await Promise.all([
    prisma.invoice.findMany({
      where: { organizationId: user.organizationId, invoiceDate: { gte: start, lte: end } },
      select: { id: true, invoiceNo: true, grandTotal: true, paidAmount: true, paymentStatus: true, paymentMethod: true, customerName: true, invoiceType: true },
      orderBy: { invoiceDate: 'asc' },
    }),
    prisma.expense.findMany({
      where: { organizationId: user.organizationId, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    }),
    prisma.payment.findMany({
      where: { organizationId: user.organizationId, paymentDate: { gte: start, lte: end } },
      include: { invoice: { select: { invoiceNo: true, customerName: true } } },
      orderBy: { paymentDate: 'asc' },
    }),
  ]);

  const totalSales = invoices.filter(i => i.invoiceType !== 'PURCHASE').reduce((s, i) => s + Number(i.grandTotal), 0);
  const totalPurchases = invoices.filter(i => i.invoiceType === 'PURCHASE').reduce((s, i) => s + Number(i.grandTotal), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalCollections = payments.reduce((s, p) => s + Number(p.amount), 0);
  const closingBalance = totalCollections - totalExpenses;

  return successResponse({
    date: dateStr,
    openingBalance: 0,
    totalSales,
    totalPurchases,
    totalExpenses,
    totalCollections,
    closingBalance,
    invoices,
    expenses,
    payments,
  });
});
