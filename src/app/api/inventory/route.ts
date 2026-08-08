import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse, paginatedResponse } from '@/lib/api-middleware';
import { productSchema } from '@/lib/utils/validators';
import { logActivity } from '@/lib/utils/logger';
import { cacheInvalidatePattern } from '@/lib/redis';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category');
  const metalType = searchParams.get('metalType');
  const goldPurity = searchParams.get('goldPurity');
  const isActive = searchParams.get('isActive') !== 'false';

  const where: Record<string, unknown> = { isActive, organizationId: user.organizationId };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { barcode: { contains: search } },
      { sku: { contains: search } },
      { productCode: { contains: search } },
    ];
  }
  if (category) where.category = category;
  if (metalType) where.metalType = metalType;
  if (goldPurity) where.goldPurity = goldPurity;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: where as any,
      include: { supplier: { select: { id: true, name: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where: where as any }),
  ]);

  return paginatedResponse(products, total, page, limit);
});

export const POST = withAuth(async (request, { user }) => {
  if (!['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role)) {
    return errorResponse('Insufficient permissions', 403);
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Invalid input');
  }

  const existing = await prisma.product.findFirst({
    where: { OR: [{ barcode: parsed.data.barcode }, { sku: parsed.data.sku }] },
  });

  if (existing) {
    return errorResponse('Product with this barcode or SKU already exists');
  }

  const product = await prisma.product.create({ data: { ...parsed.data, organizationId: user.organizationId } as any });

  await prisma.stockMovement.create({
    data: {
      productId: product.id,
      type: 'IN',
      quantity: parsed.data.stockQuantity,
      notes: 'Initial stock entry',
      userId: user.id,
    },
  });

  await logActivity(user.id, 'CREATE', 'PRODUCT', product.id, JSON.stringify({ name: product.name }));
  await cacheInvalidatePattern('inventory:*');

  return successResponse(product, 201);
});
