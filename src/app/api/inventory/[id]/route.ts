import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse } from '@/lib/api-middleware';
import { productSchema } from '@/lib/utils/validators';
import { logActivity } from '@/lib/utils/logger';
import { cacheInvalidatePattern } from '@/lib/redis';

export const GET = withAuth(async (_request, { params, user }) => {
  const product = await prisma.product.findUnique({
    where: { id: params.id, organizationId: user.organizationId },
    include: {
      supplier: { select: { id: true, name: true } },
      stockMovements: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });

  if (!product) return errorResponse('Product not found', 404);
  return successResponse(product);
});

export const PUT = withAuth(async (request, { params, user }) => {
  if (!['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)) {
    return errorResponse('Insufficient permissions', 403);
  }

  const existing = await prisma.product.findUnique({ where: { id: params.id, organizationId: user.organizationId } });
  if (!existing) return errorResponse('Product not found', 404);

  const body = await request.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Invalid input');
  }

  const product = await prisma.product.update({
    where: { id: params.id, organizationId: user.organizationId },
    data: parsed.data as any,
  });

  await logActivity(user.id, 'UPDATE', 'PRODUCT', product.id, JSON.stringify({ updates: Object.keys(parsed.data) }));
  await cacheInvalidatePattern('inventory:*');

  return successResponse(product);
});

export const DELETE = withAuth(async (_request, { params, user }) => {
  if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    return errorResponse('Insufficient permissions', 403);
  }

  const product = await prisma.product.findUnique({ where: { id: params.id, organizationId: user.organizationId } });
  if (!product) return errorResponse('Product not found', 404);

  await prisma.product.update({
    where: { id: params.id, organizationId: user.organizationId },
    data: { isActive: false },
  });

  await logActivity(user.id, 'DELETE', 'PRODUCT', product.id, JSON.stringify({ name: product.name }));
  await cacheInvalidatePattern('inventory:*');

  return successResponse({ message: 'Product deleted' });
});
