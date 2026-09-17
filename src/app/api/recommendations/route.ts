import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const doctorId = searchParams.get('doctorId') || '';
    const date = searchParams.get('date') || '';

    const where: any = {};

    if (doctorId) {
      where.doctorId = doctorId;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    if (search) {
      where.OR = [
        { recordId: { contains: search } },
        { diagnosis: { contains: search } },
        { recommendation: { contains: search } },
        { patient: { name: { contains: search } } },
        { patient: { patientId: { contains: search } } },
        { doctor: { name: { contains: search } } },
      ];
    }

    const recommendations = await prisma.recommendation.findMany({
      where,
      include: {
        doctor: true,
        patient: true,
        createdBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      doctorId,
      patientId,
      newPatient,
      date,
      diagnosis,
      recommendation,
      followUp,
      additionalInstructions,
      remarks,
      authorizedPerson,
      signatureData,
    } = body;

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor selection is required' }, { status: 400 });
    }

    if (!diagnosis || !recommendation) {
      return NextResponse.json(
        { error: 'Diagnosis/Clinical Notes and Recommendation text are required' },
        { status: 400 }
      );
    }

    // Resolve or create Patient
    let targetPatientId = patientId;

    if (!targetPatientId && newPatient) {
      const { name, age, gender, phone, address } = newPatient;
      if (!name || age === undefined || !gender) {
        return NextResponse.json({ error: 'Patient Name, Age, and Gender are required for new patient' }, { status: 400 });
      }
      const count = await prisma.patient.count();
      const pId = `PAT-2026-${String(count + 101).padStart(5, '0')}`;

      const createdPat = await prisma.patient.create({
        data: {
          patientId: pId,
          name: name.trim(),
          age: parseInt(String(age), 10),
          gender,
          phone: phone?.trim() || null,
          address: address?.trim() || null,
        },
      });
      targetPatientId = createdPat.id;
    }

    if (!targetPatientId) {
      return NextResponse.json({ error: 'Patient selection or details are required' }, { status: 400 });
    }

    // Auto-generate Record ID: REC-2026-XXXXXX
    const recCount = await prisma.recommendation.count();
    const formattedRecId = `REC-2026-${String(recCount + 1).padStart(6, '0')}`;

    const record = await prisma.recommendation.create({
      data: {
        recordId: formattedRecId,
        doctorId,
        patientId: targetPatientId,
        createdById: user.id,
        date: date ? new Date(date) : new Date(),
        diagnosis: diagnosis.trim(),
        recommendation: recommendation.trim(),
        followUp: followUp?.trim() || null,
        additionalInstructions: additionalInstructions?.trim() || null,
        remarks: remarks?.trim() || null,
        authorizedPerson: authorizedPerson?.trim() || user.name,
        signatureData: signatureData || null,
        status: 'FINALIZED',
        pdfGenerated: true,
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
      action: 'RECOMMENDATION_CREATED',
      entity: 'Recommendation',
      entityId: record.id,
      details: `Created recommendation record ${record.recordId} for Patient ${record.patient.name}`,
      ipAddress: ip,
    });

    return NextResponse.json({ recommendation: record, message: 'Recommendation saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating recommendation:', error);
    return NextResponse.json({ error: 'Failed to create recommendation record' }, { status: 500 });
  }
}
