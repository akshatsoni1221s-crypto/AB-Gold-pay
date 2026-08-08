import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse, paginatedResponse } from '@/lib/api-middleware';
import { logActivity } from '@/lib/utils/logger';
import { hashPassword } from '@/lib/auth';

export const GET = withAuth(async (_request, { user }) => {

  const employees = await prisma.user.findMany({
    where: { organizationId: user.organizationId },
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      role: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      employeeId: true,
    },
    orderBy: { name: 'asc' },
  });

  return successResponse(employees);
});

export const POST = withAuth(async (request, { user }) => {
  if (!['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
    return errorResponse('Insufficient permissions', 403);
  }

  const body = await request.json();
  const hashedPassword = await hashPassword(body.password);

  const employee = await prisma.user.create({
    data: {
      email: body.email,
      phone: body.phone,
      password: hashedPassword,
      name: body.name,
      role: body.role,
      employeeId: body.employeeId,
      organizationId: user.organizationId,
    },
    select: {
      id: true, email: true, phone: true, name: true, role: true, employeeId: true, createdAt: true,
    },
  });

  await logActivity(user.id, 'CREATE', 'EMPLOYEE', employee.id, JSON.stringify({ name: employee.name }));
  return successResponse(employee, 201);
});
