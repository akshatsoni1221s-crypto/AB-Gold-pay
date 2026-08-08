import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || new Date(new Date().getFullYear(), 0, 1).toISOString();
  const to = searchParams.get('to') || new Date().toISOString();
  const groupBy = searchParams.get('groupBy') || 'daily';
  const format = searchParams.get('format') || 'json';

  const fromDate = new Date(from);
  const toDate = new Date(to + 'T23:59:59.999Z');

  const invoices = await prisma.invoice.findMany({
    where: {
      organizationId: user.organizationId,
      invoiceDate: { gte: fromDate, lte: toDate },
      invoiceType: { notIn: ['PURCHASE', 'RETURN'] },
      paymentStatus: { not: 'CANCELLED' },
    },
    include: { items: true, customer: { select: { name: true } } },
    orderBy: { invoiceDate: 'asc' },
  });

  const totalSales = invoices.reduce((s, i) => s + Number(i.grandTotal), 0);
  const totalItems = invoices.reduce((s, i) => s + i.items.reduce((si, item) => si + item.quantity, 0), 0);
  const totalInvoices = invoices.length;
  const averageInvoiceValue = totalInvoices > 0 ? totalSales / totalInvoices : 0;

  if (format === 'csv') {
    const csv = [
      'Invoice No,Date,Customer,Items,Total,Tax,Payment Status',
      ...invoices.map((i) =>
        `"${i.invoiceNo}","${i.invoiceDate.toISOString().split('T')[0]}","${i.customerName || i.customer?.name || 'Walk-in'}",${i.items.reduce((s, item) => s + item.quantity, 0)},${i.grandTotal},${i.taxAmount},${i.paymentStatus}`
      ),
    ].join('\n');

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=sales-report-${from}-${to}.csv`,
      },
    });
  }

  return successResponse({
    period: { from, to },
    summary: { totalSales, totalItems, totalInvoices, averageInvoiceValue },
    invoices,
  });
});
