import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse } from '@/lib/api-middleware';
import { paymentSchema } from '@/lib/utils/validators';
import { logActivity } from '@/lib/utils/logger';
import { Prisma } from '@prisma/client';

export const POST = withAuth(async (request, { params, user }) => {
  const invoice = await prisma.invoice.findUnique({ where: { id: params.id, organizationId: user.organizationId } });
  if (!invoice) return errorResponse('Invoice not found', 404);

  if (invoice.paymentStatus === 'PAID') {
    return errorResponse('Invoice is already fully paid');
  }

  const body = await request.json();
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Invalid input');
  }

  const { amount, method, reference, notes } = parsed.data;

  if (amount > Number(invoice.balanceAmount)) {
    return errorResponse('Payment amount exceeds balance');
  }

  const payment = await prisma.payment.create({
    data: {
      invoiceId: params.id,
      amount: new Prisma.Decimal(amount),
      method: method as any,
      reference,
      notes,
      userId: user.id,
      organizationId: user.organizationId,
    },
  });

  const newPaidAmount = Number(invoice.paidAmount) + amount;
  const newBalanceAmount = Number(invoice.grandTotal) - newPaidAmount;
  const newStatus = newBalanceAmount <= 0 ? 'PAID' : 'PARTIAL';

  await prisma.invoice.update({
    where: { id: params.id, organizationId: user.organizationId },
    data: {
      paidAmount: new Prisma.Decimal(newPaidAmount),
      balanceAmount: new Prisma.Decimal(newBalanceAmount),
      paymentStatus: newStatus as any,
    },
  });

  if (invoice.customerId) {
    await prisma.customer.update({
      where: { id: invoice.customerId },
      data: { outstanding: { decrement: amount } },
    });
    await prisma.customerLedger.create({
      data: {
        customerId: invoice.customerId,
        type: 'PAYMENT',
        amount: new Prisma.Decimal(-amount),
        balance: new Prisma.Decimal(newBalanceAmount),
        reference: invoice.invoiceNo,
        description: `Payment received via ${method}`,
        organizationId: user.organizationId,
      },
    });
  }

  await logActivity(user.id, 'CREATE', 'PAYMENT', payment.id, JSON.stringify({ invoiceNo: invoice.invoiceNo, amount }), undefined, user.organizationId);
  return successResponse(payment);
});
