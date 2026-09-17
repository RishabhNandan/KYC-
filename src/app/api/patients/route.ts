import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { patientId: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const patients = await prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ patients });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, age, gender, phone, address } = body;

    if (!name || age === undefined || !gender) {
      return NextResponse.json({ error: 'Patient Name, Age, and Gender are required' }, { status: 400 });
    }

    // Auto generate Patient ID: PAT-2026-XXXXX
    const count = await prisma.patient.count();
    const formattedNum = String(count + 101).padStart(5, '0');
    const patientId = `PAT-2026-${formattedNum}`;

    const patient = await prisma.patient.create({
      data: {
        patientId,
        name: name.trim(),
        age: parseInt(String(age), 10),
        gender,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
      },
    });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'PATIENT_CREATED',
      entity: 'Patient',
      entityId: patient.id,
      details: `Registered new patient ${patient.name} (${patient.patientId})`,
      ipAddress: ip,
    });

    return NextResponse.json({ patient, message: 'Patient registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
