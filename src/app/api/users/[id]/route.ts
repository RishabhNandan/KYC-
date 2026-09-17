import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const { name, role, status, phone, password } = await req.json();

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: any = {
      name: name !== undefined ? name.trim() : existing.name,
      role: role !== undefined ? role : existing.role,
      status: status !== undefined ? status : existing.status,
      phone: phone !== undefined ? phone.trim() : existing.phone,
    };

    if (password && password.trim().length > 0) {
      updateData.password = await hashPassword(password.trim());
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        updatedAt: true,
      },
    });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_UPDATED',
      entity: 'User',
      entityId: updatedUser.id,
      details: `Updated user ${updatedUser.name} (${updatedUser.email}) - Status: ${updatedUser.status}, Role: ${updatedUser.role}`,
      ipAddress: ip,
    });

    return NextResponse.json({ user: updatedUser, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
