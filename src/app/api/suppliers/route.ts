import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse, paginatedResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('search') || '';

  const where: Record<string, unknown> = { isActive: true, organizationId: user.organizationId };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
      { gstNumber: { contains: search } },
    ];
  }

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where: where as any,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.supplier.count({ where: where as any }),
  ]);

  return paginatedResponse(suppliers, total, page, limit);
});

export const POST = withAuth(async (request, { user }) => {
  const body = await request.json();
  const existing = await prisma.supplier.findUnique({ where: { phone: body.phone } });
  if (existing) {
    return errorResponse('Supplier with this phone already exists');
  }

  const supplier = await prisma.supplier.create({ data: { ...body, organizationId: user.organizationId } });
  return successResponse(supplier, 201);
});
