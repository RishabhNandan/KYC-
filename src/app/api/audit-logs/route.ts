import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const action = searchParams.get('action') || '';
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const where: any = {};
    if (action) {
      where.action = action;
    }
    if (search) {
      where.OR = [
        { userName: { contains: search } },
        { action: { contains: search } },
        { details: { contains: search } },
        { entity: { contains: search } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
