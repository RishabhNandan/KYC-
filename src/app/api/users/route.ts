import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Super Admin access required' }, { status: 403 });
    }

    const { name, email, password, role, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, Email, and Password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'CO_ADMIN',
        phone: phone?.trim() || null,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        createdAt: true,
      },
    });

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'USER_CREATED',
      entity: 'User',
      entityId: newUser.id,
      details: `Created new ${newUser.role} user: ${newUser.name} (${newUser.email})`,
      ipAddress: ip,
    });

    return NextResponse.json({ user: newUser, message: 'User account created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
