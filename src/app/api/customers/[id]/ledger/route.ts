import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (request: NextRequest, { params, user }) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 50;

  const where = { customerId: params.id, organizationId: user.organizationId };

  const [entries, total] = await Promise.all([
    prisma.customerLedger.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.customerLedger.count({ where }),
  ]);

  return successResponse({ data: entries, total, page, limit, totalPages: Math.ceil(total / limit) });
});
