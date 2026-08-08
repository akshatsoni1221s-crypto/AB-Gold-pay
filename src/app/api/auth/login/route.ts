import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken } from '@/lib/auth';
import { loginSchema } from '@/lib/utils/validators';
import { withErrorHandler, errorResponse, successResponse } from '@/lib/api-middleware';
import { logActivity } from '@/lib/utils/logger';

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(parsed.error.errors[0]?.message || 'Invalid input');
  }

  const { email, password } = parsed.data;
  const isEmail = email.includes('@');

  let user;
  try {
    user = await prisma.user.findFirst({
      where: isEmail ? { email } : { phone: email },
    });
  } catch {
    return errorResponse('Database not available. PostgreSQL must be running to sign in.', 503);
  }

  if (!user) {
    return errorResponse('Invalid credentials', 401);
  }

  if (!user.isActive) {
    return errorResponse('Account is deactivated', 403);
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return errorResponse('Invalid credentials', 401);
  }

  const token = await createToken({
    id: user.id,
    organizationId: user.organizationId,
    email: user.email,
    phone: user.phone,
    name: user.name,
    role: user.role,
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  await logActivity(user.id, 'LOGIN', 'USER', user.id, 'User logged in', undefined, user.organizationId);

  const response = successResponse({
    token,
    user: {
      id: user.id,
      organizationId: user.organizationId,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
  });

  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  return response;
});
