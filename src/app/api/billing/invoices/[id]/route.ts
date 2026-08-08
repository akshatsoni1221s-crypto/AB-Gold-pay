import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (_request, { params, user }) => {
  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id, organizationId: user.organizationId },
    include: {
      items: true,
      payments: { orderBy: { paymentDate: 'desc' } },
      customer: { select: { id: true, name: true, phone: true, address: true, gstNumber: true } },
    },
  });

  if (!invoice) return errorResponse('Invoice not found', 404);
  return successResponse(invoice);
});

export const DELETE = withAuth(async (_request, { params, user }) => {
  if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    return errorResponse('Insufficient permissions', 403);
  }

  const invoice = await prisma.invoice.findUnique({
    where: { id: params.id, organizationId: user.organizationId },
    include: { items: true },
  });

  if (!invoice) return errorResponse('Invoice not found', 404);

  // Restore stock
  for (const item of invoice.items) {
    if (item.productId) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { increment: item.quantity } },
      });
    }
  }

  await prisma.invoice.update({
    where: { id: params.id, organizationId: user.organizationId },
    data: { paymentStatus: 'CANCELLED' },
  });

  return successResponse({ message: 'Invoice cancelled' });
});
