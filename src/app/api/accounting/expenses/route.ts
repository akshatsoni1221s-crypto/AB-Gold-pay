import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse, paginatedResponse } from '@/lib/api-middleware';
import { expenseSchema } from '@/lib/utils/validators';
import { logActivity } from '@/lib/utils/logger';

export const GET = withAuth(async (request: NextRequest, { user }) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const category = searchParams.get('category');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const where: Record<string, unknown> = { organizationId: user.organizationId };
  if (category) where.category = category;
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to + 'T23:59:59.999Z');
  }

  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where: where as any,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: 'desc' },
    }),
    prisma.expense.count({ where: where as any }),
  ]);

  return paginatedResponse(expenses, total, page, limit);
});

export const POST = withAuth(async (request, { user }) => {
  const body = await request.json();
  const parsed = expenseSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Invalid input');
  }

  const expense = await prisma.expense.create({
    data: {
      ...parsed.data,
      date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
      userId: user.id,
      organizationId: user.organizationId,
    } as any,
  });

  await logActivity(user.id, 'CREATE', 'EXPENSE', expense.id, JSON.stringify({ category: expense.category, amount: expense.amount }));
  return successResponse(expense, 201);
});
