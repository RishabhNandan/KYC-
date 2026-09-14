import { NextResponse } from 'next/server';
import { INITIAL_AUDIT_LOGS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    auditLogs: INITIAL_AUDIT_LOGS
  });
}
