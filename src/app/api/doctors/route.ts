import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const department = searchParams.get('department') || '';

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (department) {
      where.department = department;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { regNumber: { contains: search } },
        { department: { contains: search } },
        { designation: { contains: search } },
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only Super Admin can create doctors' }, { status: 403 });
    }

    const body = await req.json();
    const { name, regNumber, department, designation, email, phone, status } = body;

    if (!name || !regNumber || !department || !designation) {
      return NextResponse.json(
        { error: 'Name, Registration Number, Department, and Designation are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.doctor.findUnique({
      where: { regNumber: regNumber.trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Doctor with Registration Number '${regNumber}' already exists.` },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.create({
      data: {
        name: name.trim(),
        regNumber: regNumber.trim(),
        department: department.trim(),
        designation: designation.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        status: status || 'ACTIVE',
      },
    });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'DOCTOR_CREATED',
      entity: 'Doctor',
      entityId: doctor.id,
      details: `Added new doctor ${doctor.name} (Reg No: ${doctor.regNumber})`,
      ipAddress: ip,
    });

    return NextResponse.json({ doctor, message: 'Doctor created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
