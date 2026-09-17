import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'shanti-neuro-clinic-super-secret-key-2026';
const TOKEN_NAME = 'shanti_auth_token';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'CO_ADMIN';
  status: 'ACTIVE' | 'INACTIVE';
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    // Optional: Double check in DB if active
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    if (!dbUser || dbUser.status !== 'ACTIVE') return null;

    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      role: dbUser.role as 'SUPER_ADMIN' | 'CO_ADMIN',
      status: dbUser.status as 'ACTIVE' | 'INACTIVE',
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}
