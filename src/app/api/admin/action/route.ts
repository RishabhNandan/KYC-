import { NextResponse } from 'next/server';
import { INITIAL_AUDIT_LOGS } from '@/lib/mockData';
import { AuditLog } from '@/lib/types';

let globalAuditLogsStore: AuditLog[] = [...INITIAL_AUDIT_LOGS];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, targetKycId, targetUserName, adminEmail, notes, newStatus } = body;

    if (!action || !targetKycId) {
      return NextResponse.json({ success: false, error: 'Missing action parameters' }, { status: 400 });
    }

    // Create Audit Log Record
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminEmail: adminEmail || 'admin@kyc.com',
      action: action.toUpperCase(),
      targetKycId,
      targetUserName: targetUserName || 'KYC User',
      details: notes || `Admin action performed: ${action} to ${newStatus || 'UPDATED'}`,
      ipAddress: '192.168.1.100',
      timestamp: new Date().toISOString()
    };

    globalAuditLogsStore.unshift(newLog);

    return NextResponse.json({
      success: true,
      message: `KYC Application ${targetKycId} updated to ${newStatus || action}`,
      auditLog: newLog
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
