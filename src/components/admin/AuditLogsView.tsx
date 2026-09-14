'use client';

import React from 'react';
import { ShieldCheck, Clock, User, FileText, Lock } from 'lucide-react';
import { AuditLog } from '@/lib/types';

interface AuditLogsProps {
  auditLogs: AuditLog[];
}

export default function AuditLogsView({ auditLogs }: AuditLogsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">System Security Audit Trail</h2>
            <p className="text-xs text-slate-400">Immutable log of administrative reviews, document access, and unmasking actions.</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
              <th className="py-3 px-4 font-semibold">Timestamp</th>
              <th className="py-3 px-4 font-semibold">Admin User</th>
              <th className="py-3 px-4 font-semibold">Action Performed</th>
              <th className="py-3 px-4 font-semibold">Target Application</th>
              <th className="py-3 px-4 font-semibold">Details / Audit Reason</th>
              <th className="py-3 px-4 font-semibold">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-4 font-semibold text-blue-300">{log.adminEmail}</td>
                <td className="py-3 px-4">
                  <span className="bg-slate-800 text-cyan-300 px-2.5 py-1 rounded-full font-mono text-[11px] border border-slate-700">
                    {log.action}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-200">{log.targetKycId}</td>
                <td className="py-3 px-4 max-w-xs truncate">{log.details}</td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
