import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || new Date(new Date().getFullYear(), 0, 1).toISOString();
  const to = searchParams.get('to') || new Date().toISOString();

  const fromDate = new Date(from);
  const toDate = new Date(to + 'T23:59:59.999Z');

  const invoices = await prisma.invoice.findMany({
    where: {
      organizationId: user.organizationId,
      invoiceDate: { gte: fromDate, lte: toDate },
      invoiceType: 'GST',
      paymentStatus: { not: 'CANCELLED' },
    },
    include: { items: true },
    orderBy: { invoiceDate: 'asc' },
  });

  const summary = invoices.reduce(
    (acc, inv) => ({
      totalTaxable: acc.totalTaxable + Number(inv.subtotal),
      totalCGST: acc.totalCGST + Number(inv.cgst),
      totalSGST: acc.totalSGST + Number(inv.sgst),
      totalIGST: acc.totalIGST + Number(inv.igst),
      totalTax: acc.totalTax + Number(inv.taxAmount),
      totalInvoiceValue: acc.totalInvoiceValue + Number(inv.grandTotal),
      count: acc.count + 1,
    }),
    { totalTaxable: 0, totalCGST: 0, totalSGST: 0, totalIGST: 0, totalTax: 0, totalInvoiceValue: 0, count: 0 }
  );

  return successResponse({ period: { from, to }, summary, invoices });
});
