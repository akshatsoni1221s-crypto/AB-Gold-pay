import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth, successResponse, errorResponse } from '@/lib/api-middleware';
import { settingsSchema } from '@/lib/utils/validators';
import { cacheInvalidatePattern } from '@/lib/redis';

export const GET = withAuth(async (_request, { user }) => {
  const settings = await prisma.setting.findMany({ where: { organizationId: user.organizationId } });
  const map: Record<string, string> = {};
  settings.forEach((s) => { map[s.key] = s.value; });
  return successResponse(map);
});

export const PUT = withAuth(async (request, { user }) => {
  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return errorResponse(parsed.error.errors[0]?.message);

  const { key, value, type } = parsed.data;

  await prisma.setting.upsert({
    where: { organizationId_key: { organizationId: user.organizationId, key } },
    update: { value, type },
    create: { key, value, type, organizationId: user.organizationId },
  });

  await cacheInvalidatePattern('settings:*');
  return successResponse({ key, value });
});
