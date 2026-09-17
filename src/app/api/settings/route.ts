import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    let settings = await prisma.hospitalSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.hospitalSettings.create({
        data: {
          id: 'default',
          hospitalName: 'SHANTI NEURO CLINIC',
          tagline: 'Advanced Neurological Care & Rehabilitation Center',
          address: '102 Neuro Care Tower, Health Avenue, Medical District, City - 400001',
          phone: '+91 98765 43210 / +91 022 2847 9900',
          email: 'contact@shantineuroclinic.com',
          website: 'www.shantineuroclinic.com',
          licenseNo: 'HOSP-NC-2026-8899',
          disclaimerText: "This official recommendation document is generated based solely on authorized medical personnel's manually entered clinical observations and instructions at Shanti Neuro Clinic.",
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch hospital settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { hospitalName, tagline, address, phone, email, website, licenseNo, logoUrl, disclaimerText } = body;

    const updated = await prisma.hospitalSettings.upsert({
      where: { id: 'default' },
      update: {
        hospitalName: hospitalName?.trim(),
        tagline: tagline?.trim(),
        address: address?.trim(),
        phone: phone?.trim(),
        email: email?.trim(),
        website: website?.trim(),
        licenseNo: licenseNo?.trim(),
        logoUrl: logoUrl?.trim() || null,
        disclaimerText: disclaimerText?.trim(),
      },
      create: {
        id: 'default',
        hospitalName: hospitalName?.trim() || 'SHANTI NEURO CLINIC',
        tagline: tagline?.trim(),
        address: address?.trim() || '',
        phone: phone?.trim() || '',
        email: email?.trim() || '',
        website: website?.trim() || '',
        licenseNo: licenseNo?.trim() || '',
        logoUrl: logoUrl?.trim() || null,
        disclaimerText: disclaimerText?.trim(),
      },
    });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'SETTINGS_UPDATED',
      entity: 'HospitalSettings',
      entityId: 'default',
      details: 'Updated hospital branding and letterhead configuration',
      ipAddress: ip,
    });

    return NextResponse.json({ settings: updated, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
