import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, paginatedResponse } from '@/lib/api-middleware';

export const GET = withAuth(async (_request, { user }) => {
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { organizationId: user.organizationId, OR: [{ userId: user.id }, { userId: null }] },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.notification.count({
      where: { organizationId: user.organizationId, OR: [{ userId: user.id }, { userId: null }], isRead: false },
    }),
  ]);

  return successResponse({ notifications, unreadCount });
});

export const PUT = withAuth(async (_request, { user }) => {
  await prisma.notification.updateMany({
    where: { organizationId: user.organizationId, OR: [{ userId: user.id }, { userId: null }], isRead: false },
    data: { isRead: true },
  });

  return successResponse({ message: 'All notifications marked as read' });
});
