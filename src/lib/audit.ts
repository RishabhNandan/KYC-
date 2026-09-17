import { prisma } from './prisma';

interface LogOptions {
  userId?: string | null;
  userName?: string | null;
  userRole?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
}

export async function recordAuditLog(options: LogOptions) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: options.userId ?? null,
        userName: options.userName ?? 'System',
        userRole: options.userRole ?? 'SYSTEM',
        action: options.action,
        entity: options.entity,
        entityId: options.entityId ?? null,
        details: options.details ?? null,
        ipAddress: options.ipAddress ?? '127.0.0.1',
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}
