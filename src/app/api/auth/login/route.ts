import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { recordAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Invalid credentials or account deactivated' }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as 'SUPER_ADMIN' | 'CO_ADMIN',
      status: user.status as 'ACTIVE' | 'INACTIVE',
    };

    const token = generateToken(tokenPayload);
    await setAuthCookie(token);

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'LOGIN',
      entity: 'Auth',
      details: `User ${user.email} logged in successfully`,
      ipAddress: ip,
    });

    return NextResponse.json({
      user: tokenPayload,
      message: 'Logged in successfully',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
