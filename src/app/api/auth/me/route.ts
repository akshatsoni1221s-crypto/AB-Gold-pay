import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (_request, { user }) => {
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      organizationId: true,
      email: true,
      phone: true,
      name: true,
      role: true,
      avatar: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      employeeId: true,
      organization: {
        select: { id: true, name: true, slug: true, logo: true, gstin: true },
      },
    },
  });

  return successResponse(userData);
});
