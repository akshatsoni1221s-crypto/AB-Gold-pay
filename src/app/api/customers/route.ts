import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, paginatedResponse } from '@/lib/api-middleware';
import { customerSchema } from '@/lib/utils/validators';
import { errorResponse } from '@/lib/api-middleware';

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

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where: where as any,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    }),
    prisma.customer.count({ where: where as any }),
  ]);

  return paginatedResponse(customers, total, page, limit);
});

export const POST = withAuth(async (request, { user }) => {
  const body = await request.json();
  const parsed = customerSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Invalid input');
  }

  const existing = await prisma.customer.findUnique({ where: { phone: parsed.data.phone } });
  if (existing) {
    return errorResponse('Customer with this phone already exists');
  }

  const customer = await prisma.customer.create({ data: { ...parsed.data, organizationId: user.organizationId } as any });
  return successResponse(customer, 201);
});
