import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only Super Admin can update doctors' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { name, regNumber, department, designation, email, phone, status } = body;

    const existing = await prisma.doctor.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    const updated = await prisma.doctor.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : existing.name,
        regNumber: regNumber !== undefined ? regNumber.trim() : existing.regNumber,
        department: department !== undefined ? department.trim() : existing.department,
        designation: designation !== undefined ? designation.trim() : existing.designation,
        email: email !== undefined ? email.trim() : existing.email,
        phone: phone !== undefined ? phone.trim() : existing.phone,
        status: status !== undefined ? status : existing.status,
      },
    });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: status !== undefined && status !== existing.status ? 'DOCTOR_STATUS_CHANGED' : 'DOCTOR_UPDATED',
      entity: 'Doctor',
      entityId: updated.id,
      details: `Updated doctor ${updated.name} (Reg No: ${updated.regNumber}, Status: ${updated.status})`,
      ipAddress: ip,
    });

    return NextResponse.json({ doctor: updated, message: 'Doctor updated successfully' });
  } catch (error) {
    console.error('Error updating doctor:', error);
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 });
  }
}
