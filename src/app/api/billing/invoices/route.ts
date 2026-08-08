import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse, paginatedResponse } from '@/lib/api-middleware';
import { logActivity } from '@/lib/utils/logger';
import { generateInvoiceNo } from '@/lib/utils/format';
import { cacheInvalidatePattern } from '@/lib/redis';
import { Prisma } from '@prisma/client';

export const GET = withAuth(async (request, { user }) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const customerId = searchParams.get('customerId');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const search = searchParams.get('search') || '';

  const where: Record<string, unknown> = { organizationId: user.organizationId };

  if (type) where.invoiceType = type;
  if (status) where.paymentStatus = status;
  if (customerId) where.customerId = customerId;
  if (from || to) {
    where.invoiceDate = {};
    if (from) where.invoiceDate.gte = new Date(from);
    if (to) where.invoiceDate.lte = new Date(to + 'T23:59:59.999Z');
  }
  if (search) {
    where.OR = [
      { invoiceNo: { contains: search } },
      { customerName: { contains: search } },
      { customerPhone: { contains: search } },
    ];
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where: where as any,
      include: {
        items: true,
        customer: { select: { id: true, name: true } },
        payments: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { invoiceDate: 'desc' },
    }),
    prisma.invoice.count({ where: where as any }),
  ]);

  return paginatedResponse(invoices, total, page, limit);
});

export const POST = withAuth(async (request, { user }) => {
  const body = await request.json();
  const { customerId, items, invoiceType = 'GST', paidAmount = 0, paymentMethod, notes, customerName, customerPhone, customerAddress, customerGst, dueDate } = body;

  if (!items || items.length === 0) {
    return errorResponse('At least one item is required');
  }

  const lastInvoice = await prisma.invoice.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { invoiceNo: true },
  });

  const lastCount = lastInvoice ? parseInt(lastInvoice.invoiceNo.split('-').pop() || '0') : 0;
  const invoiceNo = generateInvoiceNo(invoiceType, lastCount);

  let subtotal = 0;
  let taxAmount = 0;
  let totalDiscount = 0;

  const invoiceItems = items.map((item: any) => {
    const itemTotal = item.unitPrice * item.quantity;
    const discount = item.discount || 0;
    const itemTaxRate = item.taxRate || 0;
    const itemTax = (itemTotal - discount) * (itemTaxRate / 100);
    subtotal += itemTotal;
    totalDiscount += discount;
    taxAmount += itemTax;
    return {
      organizationId: user.organizationId,
      productId: item.productId || null,
      itemName: item.itemName,
      hsnCode: item.hsnCode || null,
      quantity: item.quantity,
      unitPrice: new Prisma.Decimal(item.unitPrice),
      grossWeight: item.grossWeight ? new Prisma.Decimal(item.grossWeight) : null,
      netWeight: item.netWeight ? new Prisma.Decimal(item.netWeight) : null,
      purity: item.purity || null,
      makingCharge: item.makingCharge ? new Prisma.Decimal(item.makingCharge) : null,
      wastage: item.wastage ? new Prisma.Decimal(item.wastage) : null,
      discount: new Prisma.Decimal(discount),
      taxRate: new Prisma.Decimal(itemTaxRate),
      taxAmount: new Prisma.Decimal(itemTax),
      total: new Prisma.Decimal(itemTotal - discount + itemTax),
    };
  });

  const grandTotal = subtotal - totalDiscount + taxAmount;
  const balanceAmount = grandTotal - paidAmount;
  const paymentStatus = paidAmount >= grandTotal ? 'PAID' : paidAmount > 0 ? 'PARTIAL' : 'UNPAID';

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNo,
      invoiceType,
      customerId: customerId || null,
      customerName: customerName || null,
      customerPhone: customerPhone || null,
      customerAddress: customerAddress || null,
      customerGst: customerGst || null,
      subtotal: new Prisma.Decimal(subtotal),
      discountAmount: new Prisma.Decimal(totalDiscount),
      taxAmount: new Prisma.Decimal(taxAmount),
      grandTotal: new Prisma.Decimal(grandTotal),
      paidAmount: new Prisma.Decimal(paidAmount),
      balanceAmount: new Prisma.Decimal(balanceAmount),
      paymentStatus: paymentStatus as any,
      paymentMethod: paymentMethod || null,
      notes,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: user.id,
      organizationId: user.organizationId,
      items: { create: invoiceItems },
    },
    include: { items: true },
  });

  if (paidAmount > 0) {
    await prisma.payment.create({
      data: {
        invoiceId: invoice.id,
        amount: new Prisma.Decimal(paidAmount),
        method: paymentMethod || 'CASH',
        userId: user.id,
        organizationId: user.organizationId,
      },
    });
  }

  // Update stock
  for (const item of items) {
    if (item.productId && invoiceType !== 'PURCHASE' && invoiceType !== 'QUOTATION' && invoiceType !== 'ESTIMATE') {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });
      await prisma.stockMovement.create({
        data: {
          productId: item.productId,
          type: 'SOLD',
          quantity: -item.quantity,
          reference: invoiceNo,
          userId: user.id,
        },
      });
    }
  }

  // Update customer outstanding
  if (customerId) {
    await prisma.customer.update({
      where: { id: customerId, organizationId: user.organizationId },
      data: {
        outstanding: { increment: balanceAmount },
        totalPurchases: { increment: grandTotal },
      },
    });
    await prisma.customerLedger.create({
      data: {
        customerId,
        type: 'INVOICE',
        amount: new Prisma.Decimal(grandTotal),
        balance: new Prisma.Decimal(balanceAmount),
        reference: invoiceNo,
        description: `Invoice ${invoiceNo}`,
        organizationId: user.organizationId,
      },
    });
  }

  await logActivity(user.id, 'CREATE', 'INVOICE', invoice.id, JSON.stringify({ invoiceNo }), undefined, user.organizationId);
  await cacheInvalidatePattern('dashboard:*');

  return successResponse(invoice, 201);
});
