import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const recommendation = await prisma.recommendation.findFirst({
      where: {
        OR: [{ id }, { recordId: id }],
      },
      include: {
        doctor: true,
        patient: true,
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    if (!recommendation) {
      return NextResponse.json({ error: 'Recommendation record not found' }, { status: 404 });
    }

    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error('Error fetching recommendation details:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendation record' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.recommendation.findUnique({
      where: { id },
      include: { patient: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Recommendation record not found' }, { status: 404 });
    }

    const updated = await prisma.recommendation.update({
      where: { id },
      data: {
        doctorId: body.doctorId || existing.doctorId,
        date: body.date ? new Date(body.date) : existing.date,
        diagnosis: body.diagnosis !== undefined ? body.diagnosis.trim() : existing.diagnosis,
        recommendation: body.recommendation !== undefined ? body.recommendation.trim() : existing.recommendation,
        followUp: body.followUp !== undefined ? body.followUp.trim() : existing.followUp,
        additionalInstructions:
          body.additionalInstructions !== undefined
            ? body.additionalInstructions.trim()
            : existing.additionalInstructions,
        remarks: body.remarks !== undefined ? body.remarks.trim() : existing.remarks,
        authorizedPerson:
          body.authorizedPerson !== undefined ? body.authorizedPerson.trim() : existing.authorizedPerson,
        signatureData: body.signatureData !== undefined ? body.signatureData : existing.signatureData,
      },
      include: {
        doctor: true,
        patient: true,
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'RECOMMENDATION_EDITED',
      entity: 'Recommendation',
      entityId: updated.id,
      details: `Updated recommendation record ${updated.recordId} for Patient ${updated.patient.name}`,
      ipAddress: ip,
    });

    return NextResponse.json({ recommendation: updated, message: 'Recommendation updated successfully' });
  } catch (error) {
    console.error('Error updating recommendation:', error);
    return NextResponse.json({ error: 'Failed to update recommendation' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Only Super Admin can delete recommendation records' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existing = await prisma.recommendation.findUnique({
      where: { id },
      include: { patient: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Recommendation record not found' }, { status: 404 });
    }

    await prisma.recommendation.delete({ where: { id } });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'RECOMMENDATION_DELETED',
      entity: 'Recommendation',
      entityId: id,
      details: `Deleted recommendation record ${existing.recordId} (Patient: ${existing.patient.name})`,
      ipAddress: ip,
    });

    return NextResponse.json({ message: 'Recommendation record deleted successfully' });
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    return NextResponse.json({ error: 'Failed to delete recommendation' }, { status: 500 });
  }
}
