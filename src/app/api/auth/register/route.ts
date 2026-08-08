import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { registerSchema } from '@/lib/utils/validators';
import { withErrorHandler, successResponse, errorResponse } from '@/lib/api-middleware';

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Invalid input');
  }

  const { email, phone, password, name } = parsed.data;

  let existing;
  try {
    existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
  } catch {
    return errorResponse('Database not available. PostgreSQL must be running to create accounts.', 503);
  }

  if (existing) {
    return errorResponse('User with this email or phone already exists');
  }

  const hashedPassword = await hashPassword(password);

  let newUser;
  try {
    const slug = 'shop-' + Date.now().toString(36);
    const org = await prisma.organization.create({
      data: { name: name + "'s Shop", slug },
    });
    newUser = await prisma.user.create({
      data: {
        organizationId: org.id,
        email,
        phone,
        password: hashedPassword,
        name,
        role: 'STAFF',
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  } catch {
    return errorResponse('Database not available. PostgreSQL must be running to create accounts.', 503);
  }

  return successResponse({ message: 'Account created successfully. You can now log in.', user: newUser }, 201);
});
