const isProd = process.env.NODE_ENV === 'production';

const logger = {
  debug: (...args: unknown[]) => { if (!isProd) console.debug('[DEBUG]', ...args); },
  info: (...args: unknown[]) => console.info('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
};

export async function logActivity(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  details?: string,
  ipAddress?: string,
  organizationId?: string
) {
  if (!organizationId) return;
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.auditLog.create({
      data: { userId, action, entity, entityId, metadata: details, ipAddress, organizationId },
    });
  } catch (error) {
    logger.error('Failed to log activity:', error);
  }
}

export async function logSystem(level: string, message: string, details?: string, source?: string) {
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.systemLog.create({
      data: { level, message, details, source },
    });
  } catch (error) {
    logger.error('Failed to log system event:', error);
  }
}

export default logger;
