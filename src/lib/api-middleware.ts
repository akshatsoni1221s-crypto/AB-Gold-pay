import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest, JWTUser } from '@/lib/auth';
import { logActivity as logActivityUtil } from '@/lib/utils/logger';

type Handler = (
  request: NextRequest,
  context: { params: Record<string, string>; user: JWTUser }
) => Promise<NextResponse>;

interface MiddlewareOptions {
  requiredRoles?: string[];
  rateLimit?: boolean;
  auditAction?: string;
  auditEntity?: string;
}

export function withAuth(handler: Handler, options: MiddlewareOptions = {}) {
  return async (request: NextRequest, { params }: { params: Record<string, string> }) => {
    try {
      const user = await getAuthUserFromRequest(request);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      if (options.requiredRoles && options.requiredRoles.length > 0) {
        if (!options.requiredRoles.includes(user.role)) {
          return NextResponse.json({ success: false, error: 'Forbidden: insufficient permissions' }, { status: 403 });
        }
      }

      if (options.rateLimit) {
        await checkRateLimit(request);
      }

      const response = await handler(request, { params, user });

      if (options.auditAction && options.auditEntity) {
        await logActivityUtil(
          user.id,
          options.auditAction,
          options.auditEntity,
          params.id,
          undefined,
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
          user.organizationId
        );
      }

      return response;
    } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export function withErrorHandler(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      return await handler(request);
    } catch (error) {
      const msg = error instanceof Error ? error.message.toLowerCase() : '';
      console.error('API Error:', msg || error);
      if (msg.includes('connect') || msg.includes('refused') || msg.includes('econnrefused') || msg.includes('database')) {
        return NextResponse.json(
          { success: false, error: 'Database not available. Please ensure PostgreSQL is running.' },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

async function checkRateLimit(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100');
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000');

  try {
    const { redis } = await import('@/lib/redis');
    if (redis) {
      const key = `ratelimit:${clientIp}`;
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.pExpire(key, windowMs);
      }
      if (current > maxRequests) {
        throw new Error('Rate limit exceeded');
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Rate limit exceeded') {
      throw error;
    }
  }
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
  return NextResponse.json({
    success: true,
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
