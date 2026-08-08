import { prisma } from '@/lib/prisma';
import { withAuth, successResponse } from '@/lib/api-middleware';

export const PUT = withAuth(async (_request, { params, user }) => {
  await prisma.notification.update({
    where: { id: params.id, organizationId: user.organizationId },
    data: { isRead: true },
  });
  return successResponse({ message: 'Marked as read' });
});
