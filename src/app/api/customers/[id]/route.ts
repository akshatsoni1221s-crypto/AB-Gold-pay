import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse } from '@/lib/api-middleware';
import { logActivity } from '@/lib/utils/logger';

export const GET = withAuth(async (_request, { params, user }) => {
  const customer = await prisma.customer.findUnique({
    where: { id: params.id, organizationId: user.organizationId },
    include: {
      invoices: {
        orderBy: { invoiceDate: 'desc' },
        take: 20,
        include: { items: true },
      },
      customerLedger: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });

  if (!customer) return errorResponse('Customer not found', 404);
  return successResponse(customer);
});

export const PUT = withAuth(async (request, { params, user }) => {
  const existing = await prisma.customer.findUnique({ where: { id: params.id, organizationId: user.organizationId } });
  if (!existing) return errorResponse('Customer not found', 404);

  const body = await request.json();
  const customer = await prisma.customer.update({
    where: { id: params.id, organizationId: user.organizationId },
    data: body,
  });

  await logActivity(user.id, 'UPDATE', 'CUSTOMER', customer.id, JSON.stringify({ updates: Object.keys(body) }));
  return successResponse(customer);
});
