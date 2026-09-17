import { NextRequest, NextResponse } from 'next/server';
import { removeAuthCookie, getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (user) {
      const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
      await recordAuditLog({
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        action: 'LOGOUT',
        entity: 'Auth',
        details: `User ${user.email} logged out`,
        ipAddress: ip,
      });
    }

    await removeAuthCookie();
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
